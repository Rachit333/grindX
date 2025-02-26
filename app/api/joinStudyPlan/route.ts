import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import { StudyPlans } from "@/models/studyPlans";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const studyPlanUid = searchParams.get("StudyPlanID");
    if (!studyPlanUid) {
      return NextResponse.json(
        { message: "Missing Study Plan UID" },
        { status: 400 }
      );
    }

    const studyPlan = await StudyPlans.findOne({ uid: studyPlanUid });
    if (!studyPlan) {
      return NextResponse.json(
        { message: "Study Plan Not Found" },
        { status: 404 }
      );
    }

    switch (studyPlan.publicity) {
      case 0:
        return NextResponse.json(
          { message: "Private Study Plans Cannot Be Joined" },
          { status: 403 }
        );

      case 1:
        if (!studyPlan.authorizedUsers.includes(userEmail)) {
          studyPlan.authorizedUsers.push(userEmail);
          studyPlan.participants += 1;
          await studyPlan.save();
          return NextResponse.json({ message: "Successfully joined the study plan" }, { status: 200 });
        }
        break;

      case 2:
        if (!studyPlan.authorizedUsers.includes(userEmail)) {
          return NextResponse.json(
            { message: "Restricted Study Plan: You Need to Be Authorized" },
            { status: 403 }
          );
        }
        break;

      case 3:
        break;

      default:
        return NextResponse.json(
          { message: "Invalid Publicity Value" },
          { status: 400 }
        );
    }

    if (studyPlan.authorizedUsers.includes(userEmail)) {
      return NextResponse.json(
        { message: "You are already a participant" },
        { status: 200 }
      );
    }

    studyPlan.authorizedUsers.push(userEmail);
    studyPlan.participants += 1;
    await studyPlan.save();

    return NextResponse.json(
      { message: "Successfully joined the study plan" },
      { status: 200 }
    );
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Server Error", error: errMessage },
      { status: 500 }
    );
  }   
}
