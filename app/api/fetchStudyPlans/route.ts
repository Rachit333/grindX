import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { StudyPlans } from "@/models/studyPlans";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized: Missing or Invalid Token" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { message: "Unauthorized: Invalid Token", error: errMessage },
        { status: 401 }
      );
    }    

    const userEmail = decodedToken?.email;
    if (!userEmail) {
      return NextResponse.json(
        { message: "Unauthorized: No Email Associated with Token" },
        { status: 401 }
      );
    }

    const studyPlans = await StudyPlans.find({
      $or: [
        { publicity: 3 },
        { publicity: 2, authorizedUsers: { $in: [userEmail] } },
        { publicity: 1, authorizedUsers: { $in: [userEmail] } },
        { publicity: 0, email: userEmail },
      ],
    });

    return NextResponse.json({ status: "success", data: studyPlans }, { status: 200 });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Server Error", error: errMessage },
      { status: 500 }
    );
  }
  
}
