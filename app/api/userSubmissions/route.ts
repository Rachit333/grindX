import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebaseAdmin"; 
import { headers } from "next/headers";

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

interface Submission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

interface ApiResponse {
  count: number;
  submission: Submission[];
}


const verifyFirebaseToken = async (req: NextRequest) => {
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


export async function GET(req: NextRequest) {
  try {
    const decodedToken = await verifyFirebaseToken(req);
    if (!decodedToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ success: false, message: "Username is required" }, { status: 400 });
    }

    const query = `
      query getUserSubmissions($username: String!) {
        recentSubmissionList(username: $username, limit: 20) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
        }
      }`;

    const response = await fetch(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { username } }),
    });

    const data = await response.json();
    if (!data.data || !data.data.recentSubmissionList) {
      throw new Error("Invalid response from LeetCode API");
    }

    const seenTitles = new Set<string>();
    const uniqueSubmissions: Submission[] = [];

    for (const submission of data.data.recentSubmissionList) {
      if (submission.statusDisplay === "Accepted" && !seenTitles.has(submission.title)) {
        seenTitles.add(submission.title);
        uniqueSubmissions.push(submission);
      }
    }

    return NextResponse.json<ApiResponse>({
      count: uniqueSubmissions.length,
      submission: uniqueSubmissions,
    });
  } catch (error: any) {
    console.error("Error in GET user submissions API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
