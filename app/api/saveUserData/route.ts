import { NextResponse } from "next/server";
import { headers } from "next/headers";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/userModel";
import admin from "@/lib/firebaseAdmin";

const getRandomAvatarUrl = (): string => {
  const getRandom = (max = 10) => Math.floor(Math.random() * max) + 1;
  const params = new URLSearchParams({
    face: getRandom().toString(),
    nose: getRandom().toString(),
    mouth: getRandom().toString(),
    eyes: getRandom().toString(),
    eyebrows: getRandom().toString(),
    glasses: getRandom().toString(),
    hair: getRandom().toString(),
    accessories: getRandom().toString(),
    details: getRandom().toString(),
    beard: getRandom().toString(),
    halloween: "0",
    christmas: "0",
  });

  return `https://notion-avatars.netlify.app/api/avatar/?${params.toString()}`;
};

const verifyFirebaseToken = async (req: Request) => {
  try {
    const requestHeaders = await headers(); 
    const authHeader = requestHeaders.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Authorization header missing or invalid");
      return null;
    }

    const token = authHeader.split("Bearer ")[1];
    return await admin.auth().verifyIdToken(token);
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

export async function GET(req: Request) {
  try {
    const decodedToken = await verifyFirebaseToken(req);
    if (!decodedToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { uid, email, name } = decodedToken;
    await connectDB();

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        email,
        name: name,
        profilePicture: getRandomAvatarUrl(),
        createdAt: new Date(),
      });
    } else if (!user.profilePicture) {
      user.profilePicture = getRandomAvatarUrl();
    }

    await user.save();
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Error in GET user API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, leetcode, codeforces, codechef, atcoder, hackerrank, spoj, geeksforgeeks, other } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const decodedToken = await verifyFirebaseToken(req);
    if (!decodedToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const codingHandles = {
      leetcode: leetcode || "",
      codeforces: codeforces || "",
      codechef: codechef || "",
      atcoder: atcoder || "",
      hackerrank: hackerrank || "",
      spoj: spoj || "",
      geeksforgeeks: geeksforgeeks || "",
      other: other || "",
    };

    const user = await User.findOneAndUpdate(
      { uid: decodedToken.uid },
      {
        $set: {
          email,
          name: name || email.split("@")[0],
          codingHandles,
        },
        $setOnInsert: {
          profilePicture: getRandomAvatarUrl(),
          createdAt: new Date(),
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Error in POST user API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
