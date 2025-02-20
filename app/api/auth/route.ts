import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/userModel";

export async function POST(req: Request) {
  const { uid, email, name, photoURL } = await req.json();
  await connectDB();

  let user = await User.findOne({ uid });
  if (!user) {
    user = await User.create({ uid, email, name, photoURL });
  }

  return NextResponse.json(user);
}
