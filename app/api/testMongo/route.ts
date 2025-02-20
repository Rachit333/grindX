import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/userModel";

export async function GET() {
  try {
    await connectDB(); 
    const users = await User.find(); 
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
