import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/userModel";
import admin from "@/lib/firebaseAdmin";

const getRandomAvatarUrl = () => {
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

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 403 }
      );
    }

    const { uid, email, name } = decodedToken;
    await connectDB();
    let user = await User.findOne({ uid });

    if (!user) {
      const avatarUrl = getRandomAvatarUrl();

      user = new User({
        uid,
        email,
        name: name || (email ? email.split("@")[0] : "UnknownUser"),
        profilePicture: avatarUrl,
        createdAt: new Date(),
      });

      await user.save();
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Error in protectedRoute API:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
