"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useLeetCodeStore } from "@/lib/leetcode-store";
import { MetricsCard } from "@/components/Metrics-card";
import { StatsChart } from "@/components/Stats-chart";
import { ProblemTable } from "@/components/Problem-table";
import {
  BarChart3,
  Code,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  BookOpen,
  Zap,
  Trophy,
} from "lucide-react";

import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

interface UserData {
  name: string;
  codingHandles: {
    leetcode: string;
  };
}

async function getAuthToken() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        reject(new Error("User not authenticated"));
      } else {
        const token = await user.getIdToken();
        resolve(token);
      }
      unsubscribe();
    });
  });
}

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const setLeetCodeData = useLeetCodeStore((state) => state.setLeetCodeData);
  const setSubmissions = useLeetCodeStore((state) => state.setSubmissions);
  const leetCodeData = useLeetCodeStore((state) => state.leetCodeData);
  const submissions = useLeetCodeStore((state) => state.submissions);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getAuthToken();
      const { data } = await axios.get("/api/saveUserData", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
        await fetchLeetCodeStats(data.user.codingHandles.leetcode);
      } else {
        setError("Failed to fetch user data. Please try again.");
      }
    } catch (err) {
      setError(
        "An error occurred while fetching user data. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchLeetCodeStats = async (leetcodeUsername: string) => {
    if (!leetcodeUsername) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAuthToken(); 
  
      const [statsResponse, submissionsResponse] = await Promise.all([
        axios.get(`/api/leetcodeStats?username=${leetcodeUsername}`, {
          headers: { Authorization: `Bearer ${token}` }, //adding token to header for auth check in the api
        }),
        axios.get(`/api/userSubmissions?username=${leetcodeUsername}`, {
          headers: { Authorization: `Bearer ${token}` }, //adding token to header for auth check in the api
        }),
      ]);
  
      if (
        statsResponse.data.status === "success" &&
        submissionsResponse.data.count > 0
      ) {
        setLeetCodeData(statsResponse.data);
        setSubmissions(submissionsResponse.data);
      } else {
        setError(
          "Failed to fetch stats. Please check your username and try again."
        );
      }
    } catch (err) {
      setError(
        "An error occurred while fetching stats. Please try again later."
      );
    }
    setLoading(false);
  };
  

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-64 border-r border-border/10 bg-card/50 backdrop-blur-sm">
          <div className="flex h-16 items-center gap-2 px-6">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary">GrindX</span>
          </div>
          <nav className="flex flex-col space-y-1 p-4">
            <Button
              variant="ghost"
              className="justify-start gap-2 text-foreground hover:text-primary hover:bg-primary/10"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-2 text-foreground hover:text-primary hover:bg-primary/10"
            >
              <BarChart3 className="h-4 w-4" />
              Statistics
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-2 text-foreground hover:text-primary hover:bg-primary/10"
            >
              <BookOpen className="h-4 w-4" />
              Problem Set
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-2 text-foreground hover:text-primary hover:bg-primary/10"
            >
              <Home className="h-4 w-4" />
              Study Plans
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-2 text-foreground hover:text-primary hover:bg-primary/10"
            >
              <Code className="h-4 w-4" />
              Coding Platforms
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-2 text-foreground hover:text-primary hover:bg-primary/10"
            >
              <LifeBuoy className="h-4 w-4" />
              Support
            </Button>
            <Link href="/settings">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-foreground hover:text-primary hover:bg-primary/10"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 space-y-8">
            <div>
              <h1 className="text-3xl font-bold mt-12">Coding Progress</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Keep pushing your limits,{" "}
                {userData?.name?.split(" ")[0] ?? "Coder"}!
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <MetricsCard
                title="Total Problems Solved"
                icon={<Code className="h-4 w-4" />}
                value={leetCodeData?.totalSolved.toString() ?? "N/A"}
                total={leetCodeData?.totalQuestions.toString()}
              />

              <MetricsCard
                title="Acceptance Rate"
                icon={<BarChart3 className="h-4 w-4" />}
                value={
                  leetCodeData
                    ? `${leetCodeData.acceptanceRate.toFixed(2)}%`
                    : "N/A"
                }
              />

              <MetricsCard
                title="LeetCode Ranking"
                icon={<Trophy className="h-4 w-4" />}
                value={leetCodeData?.ranking.toLocaleString() ?? "N/A"}
              />
            </div>
            <div className="grid gap-6 lg:grid-cols-2 mt-6">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold">Coding Activity</h2>
                  <StatsChart
                    type="line"
                    data={
                      leetCodeData?.submissionCalendar
                        ? Object.entries(leetCodeData.submissionCalendar).map(
                            ([timestamp, count]) => ({
                              date: new Date(
                                Number.parseInt(timestamp) * 1000
                              ).toLocaleDateString(),
                              submissions: count,
                            })
                          )
                        : []
                    }
                  />
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold">
                    Problem Difficulty Breakdown
                  </h2>
                  <StatsChart
                    type="pie"
                    data={
                      leetCodeData
                        ? [
                            { name: "Easy", value: leetCodeData.easySolved },
                            {
                              name: "Medium",
                              value: leetCodeData.mediumSolved,
                            },
                            { name: "Hard", value: leetCodeData.hardSolved },
                          ]
                        : [
                            { name: "Easy", value: 0 },
                            { name: "Medium", value: 0 },
                            { name: "Hard", value: 0 },
                          ]
                    }
                  />
                </CardContent>
              </Card>
            </div>
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold">Recent Problems</h2>
                <ProblemTable submissions={submissions ?? []} />
              </CardContent>
            </Card>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </main>
      </div>
    </div>
  );
}
