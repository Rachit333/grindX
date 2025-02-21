// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import { User } from "@/models/userModel";

// export async function POST(req: Request) {
//   const { uid, email, name, photoURL } = await req.json();
//   await connectDB();

//   let user = await User.findOne({ uid });
//   if (!user) {
//     user = await User.create({ uid, email, name, photoURL });
//   }

//   return NextResponse.json(user);
// }


import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/userModel";
import admin from "@/lib/firebaseAdmin"; 

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });
    }

    const { uid, email, name, photoURL } = await req.json();

    if (!uid || !email || !name) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    let user = await User.findOne({ uid });
    if (!user) {
      user = await User.create({ uid, email, name, photoURL });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
