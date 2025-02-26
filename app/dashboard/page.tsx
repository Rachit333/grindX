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
  <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 relative">
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:20px_20px] opacity-30 dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)]"></div>
    </div>
    <div className="flex">
      <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-zinc-200 dark:border-zinc-800">
          <Zap className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
          <span className="font-bold text-zinc-900 dark:text-zinc-50">GrindX</span>
        </div>
        <nav className="flex flex-col space-y-1 p-4">
          <Button
            variant="ghost"
            className="justify-start gap-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800"
          >
            <BarChart3 className="h-4 w-4" />
            Statistics
          </Button>
          <Link href="/studyPlans" className="w-full">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-800"
            >
              <Home className="h-4 w-4" />
              Study Plans
            </Button>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8 lg:px-8 space-y-8">
          <div className="pt-12">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Coding Progress</h1>
            <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
              Keep pushing your limits, {userData?.name?.split(" ")[0] ?? "Coder"}!
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="overflow-hidden rounded-xl border border-zinc-200 bg-white/90 backdrop-blur-sm transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900/90"
                  >
                    <CardContent className="flex h-[120px] items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-300" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <MetricsCard
                  title="Total Problems Solved"
                  icon={<Code className="h-4 w-4" />}
                  value={leetCodeData?.totalSolved.toString() ?? "N/A"}
                  total={leetCodeData?.totalQuestions.toString()}
                />
                <MetricsCard
                  title="Acceptance Rate"
                  icon={<BarChart3 className="h-4 w-4" />}
                  value={leetCodeData ? `${leetCodeData.acceptanceRate.toFixed(2)}%` : "N/A"}
                />
                <MetricsCard
                  title="LeetCode Ranking"
                  icon={<Trophy className="h-4 w-4" />}
                  value={leetCodeData?.ranking.toLocaleString() ?? "N/A"}
                />
              </>
            )}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden rounded-xl border border-zinc-200 bg-white/90 backdrop-blur-sm transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900/90">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Coding Activity</h2>
                {loading ? (
                  <div className="flex h-[300px] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-300" />
                  </div>
                ) : (
                  <StatsChart
                    type="line"
                    data={
                      leetCodeData?.submissionCalendar
                        ? Object.entries(leetCodeData.submissionCalendar).map(([timestamp, count]) => ({
                            date: new Date(Number.parseInt(timestamp) * 1000).toLocaleDateString(),
                            submissions: count,
                          }))
                        : []
                    }
                  />
                )}
              </CardContent>
            </Card>
            <Card className="overflow-hidden rounded-xl border border-zinc-200 bg-white/90 backdrop-blur-sm transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900/90">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Problem Difficulty Breakdown
                </h2>
                {loading ? (
                  <div className="flex h-[300px] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-300" />
                  </div>
                ) : (
                  <StatsChart
                    type="pie"
                    data={
                      leetCodeData
                        ? [
                            { name: "Easy", value: leetCodeData.easySolved },
                            { name: "Medium", value: leetCodeData.mediumSolved },
                            { name: "Hard", value: leetCodeData.hardSolved },
                          ]
                        : [
                            { name: "Easy", value: 0 },
                            { name: "Medium", value: 0 },
                            { name: "Hard", value: 0 },
                          ]
                    }
                  />
                )}
              </CardContent>
            </Card>
          </div>
          <Card className="overflow-hidden rounded-xl border border-zinc-200 bg-white/90 backdrop-blur-sm transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900/90">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Recent Problems</h2>
              {loading ? (
                <div className="flex h-[200px] items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-300" />
                </div>
              ) : (
                <ProblemTable submissions={submissions ?? []} />
              )}
            </CardContent>
          </Card>
          {error && <p className="text-rose-500 dark:text-rose-400 mt-4">{error}</p>}
        </div>
      </main>
    </div>
  </div>
)
}

