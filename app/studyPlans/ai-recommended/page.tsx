"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Circle,
  BookmarkPlus,
  BookmarkCheck,
  ArrowRight,
  Search,
  Calendar,
  BarChart2,
  Users,
  Zap,
  Target,
  Flame,
  TrendingUp,
  ExternalLink,
  Code,
  Filter,
  Lightbulb,
  Brain,
  Clock,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionMetadata {
  ID: string;
  Title: string;
  Difficulty: "Easy" | "Medium" | "Hard";
  Tags?: string;
  Description?: string;
  URL?: string;
  Acceptance?: string;
  Frequency?: string;
}

export default function RecommendedQuestions() {
  const [questionNumber, setQuestionNumber] = useState(42);
  const [topN, setTopN] = useState(5);
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<Record<string, QuestionMetadata>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("recommendations");
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<string[]>([]);
  const [relevanceThreshold, setRelevanceThreshold] = useState(70);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "All" | "Easy" | "Medium" | "Hard"
  >("All");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [similarityScores, setSimilarityScores] = useState<
    Record<string, number>
  >({});
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Fetch metadata on component mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch("/questions_metadata.json");
        const data = await response.json();

        const metadataMap = data.reduce(
          (acc: Record<string, QuestionMetadata>, item: any) => {
            acc[item.ID] = item;
            return acc;
          },
          {}
        );

        setMetadata(metadataMap);
      } catch (err) {
        console.error("Error fetching question metadata:", err);
      }
    };

    fetchMetadata();

    // Load bookmarked questions from localStorage
    const savedBookmarks = localStorage.getItem("bookmarkedQuestions");
    if (savedBookmarks) {
      setBookmarkedQuestions(JSON.parse(savedBookmarks));
    }
  }, []);

  // Fetch recommendations
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `https://recommenderleetcodequestions.onrender.com/recommend/${questionNumber}?top_n=${topN}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error("Invalid API response");
      }

      setQuestionIds(data.recommended_questions);

      setSimilarityScores(
        data.recommended_questions.reduce(
          (acc: Record<string, number>, id: string, index: number) => {
            acc[id] = data.similarity_scores[index];
            return acc;
          },
          {}
        )
      );

      const formattedQuestions = data.recommended_questions.map(
        (qId: string) => metadata[qId]?.Title || `Question ${qId}`
      );

      setQuestions(formattedQuestions);
      setIsFilterSheetOpen(false);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when metadata is loaded
  useEffect(() => {
    if (Object.keys(metadata).length > 0) {
      fetchData();
    }
  }, [metadata]); // Removed fetchData from dependencies

  // Save bookmarks to localStorage when they change
  useEffect(() => {
    localStorage.setItem(
      "bookmarkedQuestions",
      JSON.stringify(bookmarkedQuestions)
    );
  }, [bookmarkedQuestions]);

  // Toggle bookmark status
  const toggleBookmark = useCallback((questionId: string) => {
    setBookmarkedQuestions((prev) => {
      if (prev.includes(questionId)) {
        setToastMessage("Question removed from bookmarks");
        setShowToast(true);
        return prev.filter((id) => id !== questionId);
      } else {
        setToastMessage("Question added to bookmarks");
        setShowToast(true);
        return [...prev, questionId];
      }
    });
  }, []);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Filter questions based on difficulty
  const filteredQuestions = useMemo(() => {
    if (selectedDifficulty === "All") return questionIds;

    return questionIds.filter((id) => {
      const question = metadata[id];
      return question && question.Difficulty === selectedDifficulty;
    });
  }, [questionIds, metadata, selectedDifficulty]);

  const getMatchPercentage = useCallback(
    (questionId: string) => {
      if (similarityScores[questionId]) {
        // Convert cosine similarity to percentage (cosine similarity is between 0 and 1)
        return Number((similarityScores[questionId] * 100).toFixed(2));
      }
      // Fallback if no similarity score is available
      return 0;
    },
    [similarityScores]
  );

  // Generate random tags for demo purposes
  const getRandomTags = useCallback(
    (questionId: string) => {
      const question = metadata[questionId];
      if (question && question.Tags) return question.Tags.split(", ");

      const tagOptions = [
        "Array",
        "String",
        "Hash Table",
        "Dynamic Programming",
        "Math",
        "Sorting",
        "Greedy",
        "Depth-First Search",
        "Binary Search",
        "Database",
        "Breadth-First Search",
        "Tree",
        "Matrix",
        "Two Pointers",
        "Bit Manipulation",
      ];

      // Use questionId to generate consistent random tags
      const numTags = (Number.parseInt(questionId) % 3) + 1;
      const seed = Number.parseInt(questionId);
      const selectedTags = [];

      for (let i = 0; i < numTags; i++) {
        const index = (seed + i * 7) % tagOptions.length;
        selectedTags.push(tagOptions[index]);
      }

      return selectedTags;
    },
    [metadata]
  );

  // Get difficulty color
  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "Medium":
        return "text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "Hard":
        return "text-rose-700 bg-rose-50 dark:bg-rose-950 dark:text-rose-400 border-rose-200 dark:border-rose-800";
      default:
        return "text-zinc-700 bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700";
    }
  }, []);

  // Get difficulty icon
  const getDifficultyIcon = useCallback((difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return <Target className="h-3.5 w-3.5" />;
      case "Medium":
        return <Zap className="h-3.5 w-3.5" />;
      case "Hard":
        return <Flame className="h-3.5 w-3.5" />;
      default:
        return <Circle className="h-3.5 w-3.5" />;
    }
  }, []);

  // Stats for the overview tab
  const stats = useMemo(() => {
    return {
      totalQuestions: topN,
      fetchedQuestions: questions.length,
      progress: questions.length > 0 ? 100 : 0,
      bookmarkedCount: bookmarkedQuestions.length,
      difficultyBreakdown: {
        Easy: filteredQuestions.filter(
          (id) => metadata[id]?.Difficulty === "Easy"
        ).length,
        Medium: filteredQuestions.filter(
          (id) => metadata[id]?.Difficulty === "Medium"
        ).length,
        Hard: filteredQuestions.filter(
          (id) => metadata[id]?.Difficulty === "Hard"
        ).length,
      },
    };
  }, [questions, topN, bookmarkedQuestions, filteredQuestions, metadata]);

  // Filter panel component for reuse
  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium mb-3 flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" /> Find Similar Questions
        </h3>
        <div className="grid gap-3">
          <div>
            <label
              htmlFor="question-number"
              className="block text-sm font-medium mb-1.5"
            >
              Question Number
            </label>
            <Input
              id="question-number"
              type="number"
              value={questionNumber}
              onChange={(e) => setQuestionNumber(Number(e.target.value))}
              className="w-full"
              placeholder="Enter question #"
            />
          </div>
          <div>
            <label htmlFor="top-n" className="block text-sm font-medium mb-1.5">
              Number of Recommendations
            </label>
            <Input
              id="top-n"
              type="number"
              value={topN}
              onChange={(e) => setTopN(Number(e.target.value))}
              className="w-full"
              placeholder="1-20"
              min={1}
              max={20}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-medium mb-3 flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" /> Filters
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <div className="flex flex-wrap gap-2">
              {["All", "Easy", "Medium", "Hard"].map((level) => (
                <Button
                  key={level}
                  variant={selectedDifficulty === level ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "rounded-full px-3",
                    level === "Easy" &&
                      selectedDifficulty === level &&
                      "bg-emerald-600 hover:bg-emerald-700",
                    level === "Medium" &&
                      selectedDifficulty === level &&
                      "bg-blue-600 hover:bg-blue-700",
                    level === "Hard" &&
                      selectedDifficulty === level &&
                      "bg-rose-600 hover:bg-rose-700"
                  )}
                  onClick={() => setSelectedDifficulty(level as any)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Minimum Relevance: {relevanceThreshold}%
            </label>
            <Slider
              value={[relevanceThreshold]}
              onValueChange={(value) => setRelevanceThreshold(value[0])}
              min={0}
              max={100}
              step={5}
              className="py-2"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          onClick={fetchData}
          disabled={loading}
          className="w-full rounded-full gap-2"
        >
          {loading ? "Searching..." : "Find Similar Questions"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)]"></div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            {toastMessage.includes("added") ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header section */}
        <header className="relative border-b border-zinc-100 dark:border-zinc-800 backdrop-blur-[2px]">
          <div className="py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl md:text-5xl">
                LeetCode Question Recommender
              </h1>
              <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Get personalized question recommendations based on a specific
                LeetCode problem to enhance your problem-solving skills.
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge className="rounded-full border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                  Algorithms
                </Badge>
                <Badge className="rounded-full border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                  Data Structures
                </Badge>
                <Badge className="rounded-full border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                  Problem Solving
                </Badge>
                <Badge className="rounded-full border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                  Interview Prep
                </Badge>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-4 text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center">
                  <Clock className="mr-1.5 h-4 w-4" />
                  <span className="text-sm">Instant Results</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1.5 h-4 w-4" />
                  <span className="text-sm">AI-Powered</span>
                </div>
                <div className="flex items-center">
                  <Brain className="mr-1.5 h-4 w-4" />
                  <span className="text-sm">Similarity Analysis</span>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Main content */}
        <div className="py-8 md:py-12">
          {/* How to use section */}
          <Card className="border border-zinc-200 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90 mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                How to Use This Tool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                      1
                    </div>
                    <h3 className="font-medium">Enter a Question</h3>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Start by entering a LeetCode question number you've already
                    solved or are interested in.
                  </p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                      2
                    </div>
                    <h3 className="font-medium">Get Recommendations</h3>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Our AI will analyze the question and find similar problems
                    based on patterns and concepts.
                  </p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                      3
                    </div>
                    <h3 className="font-medium">Practice & Improve</h3>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Solve the recommended problems to strengthen your
                    understanding and build related skills.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main content grid */}
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
              <div className="sticky top-4 space-y-6">
                {/* Stats Card */}
                <Card className="border border-zinc-200 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart2 className="h-4 w-4 text-primary" />
                      Stats Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium">Fetch Status</span>
                          <span>
                            {questions.length}/{topN} Questions
                          </span>
                        </div>
                        <Progress value={stats.progress} className="h-2" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Difficulty Breakdown
                      </h4>
                      <div className="grid grid-cols-3 gap-1 text-center">
                        {["Easy", "Medium", "Hard"].map((level) => (
                          <div
                            key={level}
                            className={`rounded-md p-1.5 text-xs font-medium ${
                              level === "Easy"
                                ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                                : level === "Medium"
                                ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                                : "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400"
                            }`}
                          >
                            {
                              stats.difficultyBreakdown[
                                level as "Easy" | "Medium" | "Hard"
                              ]
                            }
                            <div className="text-xs opacity-80">{level}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center justify-between">
                        <span>Bookmarked Questions</span>
                        <span className="font-medium">
                          {stats.bookmarkedCount}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Filter Card */}
                <Card className="border border-zinc-200 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Filter className="h-4 w-4 text-primary" />
                      Search & Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FilterPanel />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden sticky top-4 z-20">
              <Sheet
                open={isFilterSheetOpen}
                onOpenChange={setIsFilterSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full mb-4 gap-2">
                    <Filter className="h-4 w-4" />
                    Search & Filters
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Search & Filters</SheetTitle>
                    <SheetDescription>
                      Find similar questions and apply filters
                    </SheetDescription>
                  </SheetHeader>
                  <div className="overflow-y-auto pr-2 pb-16">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Main content area */}
            <div className="lg:col-span-3">
              {/* Tabs for recommendations and bookmarks */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="mb-6"
              >
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 backdrop-blur-[2px] rounded-full p-1 bg-zinc-100/80 dark:bg-zinc-800/80">
                  <TabsTrigger
                    value="recommendations"
                    className="text-base rounded-full"
                  >
                    Recommendations
                  </TabsTrigger>
                  <TabsTrigger
                    value="bookmarks"
                    className="text-base rounded-full"
                  >
                    Bookmarks{" "}
                    {bookmarkedQuestions.length > 0 &&
                      `(${bookmarkedQuestions.length})`}
                  </TabsTrigger>
                </TabsList>

                {/* Recommendations tab */}
                <TabsContent value="recommendations" className="mt-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                      <h3 className="text-xl font-medium mb-2">
                        Finding Similar Questions
                      </h3>
                      <p className="text-zinc-500 dark:text-zinc-400">
                        Analyzing patterns and algorithms...
                      </p>
                    </div>
                  ) : error ? (
                    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 mb-4">
                        <Search className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-medium mb-2 text-rose-700 dark:text-rose-400">
                        Error Finding Recommendations
                      </h3>
                      <p className="text-rose-600 dark:text-rose-300 mb-4">
                        {error}
                      </p>
                      <Button variant="outline" onClick={fetchData}>
                        Try Again
                      </Button>
                    </div>
                  ) : filteredQuestions.length === 0 ? (
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 mb-4">
                        <Search className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">
                        No Matching Questions
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                        Try adjusting your filters or searching for a different
                        question.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedDifficulty("All")}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-amber-500" />
                          Recommended Questions for #{questionNumber}
                        </h2>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                            >
                              <Filter className="h-3.5 w-3.5" />
                              Sort
                              <ChevronDown className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              Highest Match First
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Lowest Match First
                            </DropdownMenuItem>
                            <DropdownMenuItem>Easy to Hard</DropdownMenuItem>
                            <DropdownMenuItem>Hard to Easy</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                        {filteredQuestions.map((questionId, index) => {
                          const question = metadata[questionId];
                          const isBookmarked =
                            bookmarkedQuestions.includes(questionId);
                          const isHovered = hoveredCard === questionId;
                          const matchPercentage =
                            getMatchPercentage(questionId);

                          // Skip questions with match percentage below threshold
                          if (matchPercentage < relevanceThreshold) return null;

                          return (
                            <motion.div
                              key={questionId}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                              className="group"
                              onMouseEnter={() => setHoveredCard(questionId)}
                              onMouseLeave={() => setHoveredCard(null)}
                            >
                              <Card
                                className={cn(
                                  "h-full overflow-hidden transition-all duration-300 border border-zinc-200 dark:border-zinc-800 hover:shadow-md dark:hover:shadow-zinc-900/30",
                                  isHovered && "transform-gpu scale-[1.01]"
                                )}
                              >
                                <CardHeader className="p-4 pb-0 relative">
                                  <div className="absolute top-3 right-3 flex gap-1">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() =>
                                              toggleBookmark(questionId)
                                            }
                                          >
                                            {isBookmarked ? (
                                              <BookmarkCheck className="h-4 w-4 text-primary" />
                                            ) : (
                                              <BookmarkPlus className="h-4 w-4" />
                                            )}
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>
                                            {isBookmarked
                                              ? "Remove bookmark"
                                              : "Add bookmark"}
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>

                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "px-2 py-0.5 text-xs font-normal gap-1 flex items-center border",
                                        getDifficultyColor(
                                          question?.Difficulty || "Medium"
                                        )
                                      )}
                                    >
                                      {getDifficultyIcon(
                                        question?.Difficulty || "Medium"
                                      )}
                                      {question?.Difficulty || "Medium"}
                                    </Badge>

                                    <Badge
                                      variant="outline"
                                      // className={cn(
                                      //   'px-2 py-0.5 text-xs font-normal gap-1 flex items-center border                                        "px-2 py-0.5 text-xs font-normal gap-1 flex items-center border',
                                      //   Number.parseFloat(matchPercentage) >= 90
                                      //     ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                      //     : Number.parseFloat(
                                      //         matchPercentage
                                      //       ) >= 70
                                      //     ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                      //     : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                                      // )}
                                      className={cn(
                                        "px-2 py-0.5 text-xs font-normal gap-1 flex items-center border",
                                        matchPercentage >= 90
                                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                          : matchPercentage >= 70
                                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                          : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                                      )}
                                    >
                                      <TrendingUp className="h-3 w-3" />
                                      {matchPercentage}% Match
                                    </Badge>
                                  </div>

                                  <CardTitle className="text-lg">
                                    {question?.Title ||
                                      `Question ${questionId}`}
                                  </CardTitle>

                                  <CardDescription className="mt-2 line-clamp-2">
                                    {question?.Description ||
                                      "Solve this algorithmic challenge to improve your problem-solving skills and prepare for technical interviews."}
                                  </CardDescription>
                                </CardHeader>

                                <CardContent className="p-4 pt-2">
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {getRandomTags(questionId).map((tag, i) => (
                                      <Badge
                                        key={i}
                                        variant="secondary"
                                        className="bg-zinc-100 dark:bg-zinc-800 text-xs"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                                      <div className="flex items-center gap-1">
                                        <Code className="h-3.5 w-3.5" />
                                        <span>Problem #{questionId}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Users className="h-3.5 w-3.5" />
                                        <span>
                                          {Math.floor(Math.random() * 90 + 10)}%
                                          Acceptance
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>

                                <CardFooter className="p-4 pt-0">
                                  <Button
                                    className="w-full gap-1 rounded-full group-hover:bg-primary/90 transition-colors"
                                    onClick={() =>
                                      window.open(
                                        `https://leetcode.com/problems/${question?.Title?.toLowerCase()
                                          .replace(/\s+/g, "-")
                                          .replace(/[^\w-]/g, "")}/`,
                                        "_blank"
                                      )
                                    }
                                  >
                                    View Problem
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </Button>
                                </CardFooter>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Bookmarks tab */}
                <TabsContent value="bookmarks" className="mt-6">
                  {bookmarkedQuestions.length === 0 ? (
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 mb-4">
                        <BookmarkCheck className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">
                        No Bookmarked Questions
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                        Bookmark questions you want to revisit later by clicking
                        the bookmark icon on any question card.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("recommendations")}
                      >
                        Browse Recommendations
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          <BookmarkCheck className="h-5 w-5 text-primary" />
                          Your Bookmarked Questions
                        </h2>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setBookmarkedQuestions([]);
                            setToastMessage("All bookmarks cleared");
                            setShowToast(true);
                          }}
                        >
                          Clear All
                        </Button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                        {bookmarkedQuestions.map((questionId, index) => {
                          const question = metadata[questionId];
                          const isHovered = hoveredCard === questionId;

                          return (
                            <motion.div
                              key={questionId}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                              className="group"
                              onMouseEnter={() => setHoveredCard(questionId)}
                              onMouseLeave={() => setHoveredCard(null)}
                            >
                              <Card
                                className={cn(
                                  "h-full overflow-hidden transition-all duration-300 border border-zinc-200 dark:border-zinc-800 hover:shadow-md dark:hover:shadow-zinc-900/30",
                                  isHovered && "transform-gpu scale-[1.01]"
                                )}
                              >
                                <CardHeader className="p-4 pb-0 relative">
                                  <div className="absolute top-3 right-3 flex gap-1">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() =>
                                              toggleBookmark(questionId)
                                            }
                                          >
                                            <BookmarkCheck className="h-4 w-4 text-primary" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Remove bookmark</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>

                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "px-2 py-0.5 text-xs font-normal gap-1 flex items-center border",
                                        getDifficultyColor(
                                          question?.Difficulty || "Medium"
                                        )
                                      )}
                                    >
                                      {getDifficultyIcon(
                                        question?.Difficulty || "Medium"
                                      )}
                                      {question?.Difficulty || "Medium"}
                                    </Badge>
                                  </div>

                                  <CardTitle className="text-lg">
                                    {question?.Title ||
                                      `Question ${questionId}`}
                                  </CardTitle>

                                  <CardDescription className="mt-2 line-clamp-2">
                                    {question?.Description ||
                                      "Solve this algorithmic challenge to improve your problem-solving skills and prepare for technical interviews."}
                                  </CardDescription>
                                </CardHeader>

                                <CardContent className="p-4 pt-2">
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {getRandomTags(questionId).map((tag, i) => (
                                      <Badge
                                        key={i}
                                        variant="secondary"
                                        className="bg-zinc-100 dark:bg-zinc-800 text-xs"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                                      <div className="flex items-center gap-1">
                                        <Code className="h-3.5 w-3.5" />
                                        <span>Problem #{questionId}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>Bookmarked</span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>

                                <CardFooter className="p-4 pt-0">
                                  <Button
                                    className="w-full gap-1 rounded-full group-hover:bg-primary/90 transition-colors"
                                    onClick={() =>
                                      window.open(
                                        `https://leetcode.com/problems/${question?.Title?.toLowerCase()
                                          .replace(/\s+/g, "-")
                                          .replace(/[^\w-]/g, "")}/`,
                                        "_blank"
                                      )
                                    }
                                  >
                                    View Problem
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </Button>
                                </CardFooter>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
