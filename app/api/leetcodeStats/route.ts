import { headers } from "next/headers";
import admin from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

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

export async function GET(req: NextRequest) {
  try {
    const decodedToken = await verifyFirebaseToken(req);
    if (!decodedToken) {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ status: "error", message: "Username is required" }, { status: 400 });
    }

    const query = {
      query: `
          query getUserProfile($username: String!) {
              allQuestionsCount { difficulty count }
              matchedUser(username: $username) {
                  contributions { points }
                  profile { reputation ranking }
                  submissionCalendar
                  submitStats {
                      acSubmissionNum { difficulty count submissions }
                      totalSubmissionNum { difficulty count submissions }
                  }
              }
          }`,
      variables: { username },
    };

    try {
      const response = await axios.post("https://leetcode.com/graphql", query, {
        headers: {
          "Content-Type": "application/json",
          Referer: `https://leetcode.com/${username}/`,
        },
      });

      const data = response.data.data;
      if (!data.matchedUser) {
        return NextResponse.json({ status: "error", message: "User does not exist" }, { status: 404 });
      }

      const allQuestions = data.allQuestionsCount;
      const matchedUser = data.matchedUser;
      const submitStats = matchedUser.submitStats;

      const totalSolved = submitStats.acSubmissionNum[0].count;
      const totalQuestions = allQuestions[0].count;
      const easySolved = submitStats.acSubmissionNum[1].count;
      const totalEasy = allQuestions[1].count;
      const mediumSolved = submitStats.acSubmissionNum[2].count;
      const totalMedium = allQuestions[2].count;
      const hardSolved = submitStats.acSubmissionNum[3].count;
      const totalHard = allQuestions[3].count;

      const totalAcceptCount = submitStats.acSubmissionNum[0].submissions;
      const totalSubCount = submitStats.totalSubmissionNum[0].submissions;
      const acceptanceRate = totalSubCount ? ((totalAcceptCount / totalSubCount) * 100).toFixed(2) : 0;

      const submissionCalendar = JSON.parse(matchedUser.submissionCalendar || "{}");

      return NextResponse.json({
        status: "success",
        message: "retrieved",
        totalSolved,
        totalQuestions,
        easySolved,
        totalEasy,
        mediumSolved,
        totalMedium,
        hardSolved,
        totalHard,
        acceptanceRate: parseFloat(String(acceptanceRate)),
        ranking: matchedUser.profile.ranking,
        contributionPoints: matchedUser.contributions.points,
        reputation: matchedUser.profile.reputation,
        submissionCalendar,
      });
    } catch (error: any) {
      return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
