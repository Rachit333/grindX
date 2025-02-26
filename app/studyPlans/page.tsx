"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Clock,
  Users,
  Star,
  BookOpen,
  Sparkles,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import { auth } from "@/lib/firebase";
import Image from "next/image";

interface StudyPlan {
  uid: string;
  title: string;
  description: string;
  author: {
    email: string;
  };
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  topics: string[];
  rating: number;
  participants: number;
}

export default function StudyPlansPage() {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<StudyPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudyPlans = async () => {
      setIsLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          console.warn("User not authenticated");
          setIsLoading(false);
          return;
        }

        const token = await user.getIdToken();

        const { data } = await axios.get("/api/fetchStudyPlans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.status === "success") {
          setStudyPlans(data.data);
          setFilteredPlans(data.data);
        } else {
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("🔥 API Request Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchStudyPlans();
      else setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPlans(query, activeFilter);
  };

  const handleFilterClick = (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
      filterPlans(searchQuery, null);
    } else {
      setActiveFilter(filter);
      filterPlans(searchQuery, filter);
    }
  };

  const filterPlans = (query: string, filter: string | null) => {
    let filtered = studyPlans.filter(
      (plan) =>
        plan.title.toLowerCase().includes(query.toLowerCase()) ||
        plan.description.toLowerCase().includes(query.toLowerCase()) ||
        plan.topics.some((topic) =>
          topic.toLowerCase().includes(query.toLowerCase())
        )
    );

    if (filter) {
      if (
        filter === "Beginner" ||
        filter === "Intermediate" ||
        filter === "Advanced"
      ) {
        filtered = filtered.filter((plan) => plan.difficulty === filter);
      } else if (filter === "Trending") {
        filtered = filtered.sort((a, b) => b.participants - a.participants);
      } else if (filter === "Top Rated") {
        filtered = filtered.sort((a, b) => b.rating - a.rating);
      }
    }

    setFilteredPlans(filtered);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Intermediate":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Advanced":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:20px_20px] opacity-30 dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)]"></div>
      </div>

      <div className="relative border-b border-zinc-100 dark:border-zinc-800 backdrop-blur-[2px]">
        <div className="container mx-auto px-4 pt-20 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              Study Plans
            </h1>
            <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
              Find the perfect study plan to accelerate your learning journey.
              <br />Browse through expert-curated content tailored to your needs.
            </p>
            <div className="relative flex w-full max-w-2xl items-center overflow-hidden rounded-full border border-zinc-200 bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:ring-zinc-700">
              <Search className="ml-4 h-5 w-5 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search by title, description, or topics..."
                className="border-none bg-transparent pl-3 shadow-none focus-visible:ring-0"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Button className="m-1 rounded-full px-5">Search</Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-8">
        <div className="mb-10 flex flex-wrap gap-3">
          <Button
            variant={activeFilter === "Beginner" ? "default" : "outline"}
            className="rounded-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 data-[state=open]:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            onClick={() => handleFilterClick("Beginner")}
          >
            <BookOpen className="mr-2 h-4 w-4" /> Beginner
          </Button>
          <Button
            variant={activeFilter === "Intermediate" ? "default" : "outline"}
            className="rounded-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 data-[state=open]:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            onClick={() => handleFilterClick("Intermediate")}
          >
            <TrendingUp className="mr-2 h-4 w-4" /> Intermediate
          </Button>
          <Button
            variant={activeFilter === "Advanced" ? "default" : "outline"}
            className="rounded-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 data-[state=open]:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            onClick={() => handleFilterClick("Advanced")}
          >
            <Sparkles className="mr-2 h-4 w-4" /> Advanced
          </Button>
          <Button
            variant={activeFilter === "Trending" ? "default" : "outline"}
            className="rounded-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 data-[state=open]:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            onClick={() => handleFilterClick("Trending")}
          >
            <Users className="mr-2 h-4 w-4" /> Trending
          </Button>
          <Button
            variant={activeFilter === "Top Rated" ? "default" : "outline"}
            className="rounded-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 data-[state=open]:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            onClick={() => handleFilterClick("Top Rated")}
          >
            <Star className="mr-2 h-4 w-4" /> Top Rated
          </Button>
        </div>

        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-300"></div>
          </div>
        )}

        {!isLoading && filteredPlans.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white/90 backdrop-blur-sm py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/90"
          >
            <div className="mb-6 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
              <Search className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              No study plans found
            </h3>
            <p className="mb-6 text-zinc-600 dark:text-zinc-400">
              Try adjusting your search or filters to find what you're looking
              for
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter(null);
                setFilteredPlans(studyPlans);
              }}
              className="rounded-full"
            >
              Clear filters
            </Button>
          </motion.div>
        )}

        <AnimatePresence>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPlans.map((plan, index) => (
              <motion.div
                key={plan.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group cursor-pointer"
                onClick={() => router.push(`/studyPlans/planid?id=${plan.uid}`)}
              >
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white/90 backdrop-blur-sm transition-all duration-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/90">
                  {/* Card Content */}
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                        {plan.title}
                      </h3>

                      <Badge
                        className={`${getDifficultyColor(
                          plan.difficulty
                        )} border px-2.5 py-0.5 text-xs font-medium hover:${getDifficultyColor(
                          plan.difficulty
                        )}`}
                      >
                        {plan.difficulty}
                      </Badge>
                    </div>

                    <p className="mb-4 line-clamp-2 text-zinc-600 dark:text-zinc-400">
                      {plan.description}
                    </p>

                    <div className="mb-6 flex flex-wrap gap-2">
                      {plan.topics.slice(0, 3).map((topic) => (
                        <Badge
                          key={topic}
                          variant="outline"
                          className="rounded-full border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          {topic}
                        </Badge>
                      ))}
                      {plan.topics.length > 3 && (
                        <Badge
                          variant="outline"
                          className="rounded-full border-zinc-200 bg-transparent px-2.5 py-0.5 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
                        >
                          +{plan.topics.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="mb-6 flex items-center gap-4 text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center">
                        <Clock className="mr-1.5 h-4 w-4" />
                        <span className="text-sm">{plan.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1.5 h-4 w-4" />
                        <span className="text-sm">
                          {plan.participants} enrolled
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Star className="mr-1.5 h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">
                          {plan.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Author and Action */}
                    <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {plan.author?.email.split("@")[0]}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full p-0 text-zinc-500 hover:bg-transparent hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                      >
                        <span className="text-sm font-medium">View Plan</span>
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
