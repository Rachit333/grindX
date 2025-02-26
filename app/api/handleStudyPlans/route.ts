// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import { StudyPlans } from "@/models/studyPlans";

// connectDB();

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json(); 
//     const newPlan = new StudyPlans(body);
//     await newPlan.save();
    
//     return NextResponse.json({ message: "Study Plan created", data: newPlan }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ message: "Server Error", error: (error as Error).message }, { status: 500 });
//   }
// }

// export async function GET() {
//   return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
// }

// makes the POST request to the database to create the database
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { StudyPlans } from "@/models/studyPlans";

export async function GET() {
  try {
    await connectDB();

    const sampleData = [
      {
        title: "Full-Stack Web Development",
        description: "Learn frontend and backend with MERN stack.",
        email: "jasoriarachit@gmail.com",
        duration: "3 months",
        difficulty: "Intermediate",
        topics: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
        rating: 4.7,
        participants: 120,
        publicity: 1,
        authorizedUsers: ["jasoriarachit@gmail.com"],
      },
      {
        title: "Data Structures & Algorithms",
        description: "Master DSA for coding interviews.",
        email: "abhijeet@gmail.com",
        duration: "2 months",
        difficulty: "Advanced",
        topics: ["Arrays", "Linked Lists", "Graphs", "Dynamic Programming"],
        rating: 4.9,
        participants: 200,
        publicity: 1,
        authorizedUsers: ["abhijeet@gmail.com","jasoriarachit@gmail.com"],
      },
      {
        title: "Machine Learning Basics",
        description: "Introduction to ML concepts and Python libraries.",
        email: "sigmaboi@gmail.com",
        duration: "4 months",
        difficulty: "Beginner",
        topics: ["Python", "NumPy", "Pandas", "Scikit-Learn", "Neural Networks"],
        rating: 4.5,
        participants: 90,
        publicity: 1,
        authorizedUsers: ["sigmaboi@gmail.com","abhijeet@gmail.com"],
      }
    ].map(plan => ({ ...plan, createdOn: new Date() }));

    const existingCount = await StudyPlans.countDocuments();
    if (existingCount === 0) {
      await StudyPlans.insertMany(sampleData);
      return NextResponse.json(
        { message: "Sample data inserted successfully!" },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "Data already exists. No new records inserted." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error inserting data", error: (error as Error).message },
      { status: 500 }
    );
  }
}
