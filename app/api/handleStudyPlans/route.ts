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
        categories: [
          {
            id: "c1",
            title: "Frontend Development",
            description: "Learn React and modern UI/UX practices.",
            questions: ["1", "2", "3"],
          },
          {
            id: "c2",
            title: "Backend Development",
            description: "Master Node.js and MongoDB.",
            questions: ["4", "5", "6"],
          },
        ],
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
        authorizedUsers: ["abhijeet@gmail.com", "jasoriarachit@gmail.com"],
        categories: [
          {
            id: "c1",
            title: "Arrays & Strings",
            description: "Fundamental problems on arrays and strings.",
            questions: ["7", "8", "9"],
          },
          {
            id: "c2",
            title: "Graphs & Trees",
            description: "Graph traversal and tree problems.",
            questions: ["10", "11", "12"],
          },
        ],
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
        authorizedUsers: ["sigmaboi@gmail.com", "abhijeet@gmail.com"],
        categories: [
          {
            id: "c1",
            title: "Python Basics",
            description: "Learn Python and essential libraries for ML.",
            questions: ["13", "14", "15"],
          },
          {
            id: "c2",
            title: "Neural Networks",
            description: "Understand the fundamentals of neural networks.",
            questions: ["16", "17", "18"],
          },
        ],
      },
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
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error inserting data", error: error.message },
        { status: 500 }
      );
    }
  
    return NextResponse.json(
      { message: "Error inserting data", error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
