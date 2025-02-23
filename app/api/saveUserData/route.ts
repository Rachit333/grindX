// import { NextResponse } from "next/server";
// import { headers } from "next/headers";
// import connectDB from "@/lib/mongodb";
// import { User } from "@/models/userModel";
// import admin from "@/lib/firebaseAdmin";

// const getRandomAvatarUrl = () => {
//   const getRandom = (max = 10) => Math.floor(Math.random() * max) + 1;
//   const params = new URLSearchParams({
//     face: getRandom().toString(),
//     nose: getRandom().toString(),
//     mouth: getRandom().toString(),
//     eyes: getRandom().toString(),
//     eyebrows: getRandom().toString(),
//     glasses: getRandom().toString(),
//     hair: getRandom().toString(),
//     accessories: getRandom().toString(),
//     details: getRandom().toString(),
//     beard: getRandom().toString(),
//     halloween: "0",
//     christmas: "0",
//   });

//   return `https://notion-avatars.netlify.app/api/avatar/?${params.toString()}`;
// };

// /**
//  * Helper function to verify Firebase token.
//  */
// const verifyFirebaseToken = async (req: Request) => {
//   try {
//     const requestHeaders = await headers(); 
//     const authHeader = requestHeaders.get("authorization");

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       console.error("Authorization header missing or invalid:", authHeader);
//       return { success: false, status: 401, message: "Unauthorized: Missing or invalid token" };
//     }

//     const token = authHeader.split("Bearer ")[1];
//     const decodedToken = await admin.auth().verifyIdToken(token);

//     if (!decodedToken) {
//       return { success: false, status: 403, message: "Invalid token" };
//     }

//     return { success: true, decodedToken };
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     return { success: false, status: 500, message: "Token verification failed" };
//   }
// };

// /**
//  * GET: Fetch user data.
//  */
// export async function GET(req: Request) {
//   try {
//     const authCheck = await verifyFirebaseToken(req);
//     if (!authCheck.success) {
//       return NextResponse.json({ success: false, message: authCheck.message }, { status: authCheck.status });
//     }

//     const { uid, email, name } = authCheck.decodedToken;
//     await connectDB();

//     let user = await User.findOne({ uid });

//     if (!user) {
//       user = new User({
//         uid,
//         email,
//         name: name || email.split("@")[0],
//         profilePicture: getRandomAvatarUrl(),
//         createdAt: new Date(),
//       });
//     } else if (!user.profilePicture) {
//       // updating the profile if missing
//       user.profilePicture = getRandomAvatarUrl();
//     }

//     await user.save();

//     return NextResponse.json({ success: true, user });
//   } catch (error: any) {
//     console.error("Error in GET user API:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// /**
//  * POST: Create or update user data.
//  */
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     console.log("Received Body:", body);

//     const { email, name, leetcode, codeforces, codechef, atcoder, hackerrank, spoj, geeksforgeeks, other } = body;

//     if (!email) {
//       return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
//     }

//     const authCheck = await verifyFirebaseToken(req); //verify token
//     if (!authCheck.success) {
//       return NextResponse.json({ success: false, message: authCheck.message }, { status: authCheck.status });
//     }

//     await connectDB();
//     let user = await User.findOne({ uid: authCheck.decodedToken.uid }); 

//     const codingHandles = {
//       leetcode: leetcode || "",
//       codeforces: codeforces || "",
//       codechef: codechef || "",
//       atcoder: atcoder || "",
//       hackerrank: hackerrank || "",
//       spoj: spoj || "",
//       geeksforgeeks: geeksforgeeks || "", 
//       other: other || "",
//     };

//     if (!user) {
//       user = new User({
//         uid: authCheck.decodedToken.uid,
//         email,
//         name: name || email.split("@")[0],
//         profilePicture: getRandomAvatarUrl(),
//         codingHandles,
//         createdAt: new Date(),
//       });
//     } else {
//       user.name = name || user.name;
//       Object.assign(user.codingHandles, codingHandles);
//     }

//     await user.save();
//     return NextResponse.json({ success: true, user });
//   } catch (error: any) {
//     console.error("Error in POST user API:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/userModel";
import admin from "@/lib/firebaseAdmin";

// Function to generate a random avatar URL
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

/**
 * Verifies Firebase token and returns the decoded token.
 */
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

/**
 * GET: Fetch user data.
 */
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

/**
 * POST: Create or update user data.
 */
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

    // Prepare coding handles object
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

    // Efficiently update or create a user using `findOneAndUpdate`
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
