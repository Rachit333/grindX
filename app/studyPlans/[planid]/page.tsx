"use client"

import type React from "react"

import { useState, useReducer, useEffect, useMemo, useCallback, memo } from "react"
import {
  BookOpen,
  CheckCircle,
  Circle,
  BookmarkPlus,
  BookmarkCheck,
  ArrowRight,
  Info,
  Search,
  Calendar,
  Trophy,
  Clock,
  BarChart2,
  Star,
  Users,
  Zap,
  Award,
  Target,
  Flame,
  TrendingUp,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { auth } from "@/lib/firebase"

export interface Question {
  id: string
  title: string
  completed: boolean
  estimatedTime: string
  difficulty: "Easy" | "Medium" | "Hard"
  lastSolved?: string
  description?: string
  tags?: string[]
  popularity?: number
}

export interface Category {
  id: string
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  questions: Question[]
}

export interface QuestionBank {
  id: string
  title: string
  description: string
  difficulty: string
  duration: string
  participants: number
  rating: number
  author: string
  authorAvatar?: string
  topics: string[]
  categories: Category[]
  createdAt?: string
  updatedAt?: string
}

export interface ApiStudyPlan {
  uid: string
  title: string
  description: string
  duration: string
  difficulty: string
  topics: string[]
  rating: number
  participants: number
  email: string
  publicity: number
  authorizedUsers: string[]
  createdOn: string
  categories: {
    id: string
    title: string
    description: string
    questions: string[]
  }[]
}

type QuestionBankState = {
  bank: QuestionBank
  bookmarks: string[]
  lastSolved: Record<string, string>
  filter: {
    search: string
    difficulty: "All" | "Easy" | "Medium" | "Hard"
    status: "All" | "Completed" | "Incomplete"
  }
  streak: number
  achievements: string[]
  metadata: Record<string, any>;
}

type QuestionBankAction =
  | { type: "LOAD_METADATA"; metadata: Record<string, any> }
  | { type: "TOGGLE_COMPLETION"; categoryId: string; questionId: string }
  | { type: "TOGGLE_BOOKMARK"; questionId: string }
  | { type: "RECORD_SOLVE_SESSION"; questionId: string }
  | { type: "SET_FILTER"; filter: Partial<QuestionBankState["filter"]> }
  | { type: "LOAD_STATE"; state: Partial<QuestionBankState> }
  | { type: "LOAD_API_DATA"; apiData: ApiStudyPlan }
  | { type: "INCREMENT_STREAK" }
  | { type: "UNLOCK_ACHIEVEMENT"; achievement: string }

const questionBankReducer = (state: QuestionBankState, action: QuestionBankAction): QuestionBankState => {
  
  switch (action.type) {
    case "TOGGLE_COMPLETION": {
      const newBank: QuestionBank = JSON.parse(JSON.stringify(state.bank)) 
      const categoryIndex = newBank.categories.findIndex((c) => c.id === action.categoryId)
      const questionIndex = newBank.categories[categoryIndex].questions.findIndex((q) => q.id === action.questionId)

      const wasCompleted = newBank.categories[categoryIndex].questions[questionIndex].completed
      newBank.categories[categoryIndex].questions[questionIndex].completed = !wasCompleted

      // check if we should unlock achievements
      const newAchievements = [...state.achievements]
      if (!wasCompleted) {
        const allQuestions = newBank.categories.flatMap((c) => c.questions)
        const completedCount = allQuestions.filter((q) => q.completed).length

        // completing first question
        if (completedCount === 1 && !newAchievements.includes("first_solve")) {
          newAchievements.push("first_solve")
        }

        // completing 5 questions
        if (completedCount === 5 && !newAchievements.includes("five_solves")) {
          newAchievements.push("five_solves")
        }

        // completing all questions in a category
        const allCompletedInCategory = newBank.categories[categoryIndex].questions.every((q) => q.completed)
        if (allCompletedInCategory && !newAchievements.includes(`category_${action.categoryId}`)) {
          newAchievements.push(`category_${action.categoryId}`)
        }
      }

      return {
        ...state,
        bank: newBank,
        achievements: newAchievements,
      }
    }

    case "TOGGLE_BOOKMARK": {
      return {
        ...state,
        bookmarks: state.bookmarks.includes(action.questionId)
          ? state.bookmarks.filter((id) => id !== action.questionId)
          : [...state.bookmarks, action.questionId],
      }
    }

    case "LOAD_METADATA": {
      return {
        ...state,
        metadata: action.metadata, 
      };
    }
    

    case "RECORD_SOLVE_SESSION": {
      const today = new Date().toISOString()
      return {
        ...state,
        lastSolved: {
          ...state.lastSolved,
          [action.questionId]: today,
        },
      }
    }

    case "SET_FILTER": {
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.filter,
        },
      }
    }

    case "LOAD_STATE": {
      return {
        ...state,
        ...action.state,
      }
    }

    case "LOAD_API_DATA": {
      const apiData = action.apiData

      const transformedCategories = apiData.categories.map((apiCategory) => {
        const questions: Question[] = apiCategory.questions.map((qId) => {
          const meta = state.metadata && state.metadata[qId] ? state.metadata[qId] : {}; 
      
          return {
            id: qId,
            title: meta.Title || `Question ${qId}`, 
            completed: false,
            estimatedTime: "30 min", 
            difficulty: meta.Difficulty || "Medium",
            description: meta.Description || "Description will be available soon...",
            tags: meta.Tags ? meta.Tags.split(", ") : [],
            popularity: 100 + Math.floor(Math.random() * 1000),
          };
        });
      
        return {
          id: apiCategory.id,
          title: apiCategory.title,
          description: apiCategory.description,
          questions,
        };
      });

      const newBank: QuestionBank = {
        id: apiData.uid,
        title: apiData.title,
        description: apiData.description,
        difficulty: apiData.difficulty,
        duration: apiData.duration,
        participants: apiData.participants,
        rating: apiData.rating,
        author: apiData.email,
        topics: apiData.topics,
        categories: transformedCategories,
        createdAt: apiData.createdOn,
      }

      return {
        ...state,
        bank: newBank,
      }
    }

    case "INCREMENT_STREAK": {
      return {
        ...state,
        streak: state.streak + 1,
      }
    }

    case "UNLOCK_ACHIEVEMENT": {
      if (state.achievements.includes(action.achievement)) {
        return state
      }
      return {
        ...state,
        achievements: [...state.achievements, action.achievement],
      }
    }

    default:
      return state
  }
}

const QuestionItem = memo(
  ({
    question,
    categoryId,
    onToggleCompletion,
    onToggleBookmark,
    isBookmarked,
    lastSolved,
  }: {
    question: Question
    categoryId: string
    onToggleCompletion: () => void
    onToggleBookmark: () => void
    isBookmarked: boolean
    lastSolved?: string
  }) => {
    const difficultyColors = {
      Easy: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      Medium: "text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      Hard: "text-rose-700 bg-rose-50 dark:bg-rose-950 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    }

    const difficultyIcons = {
      Easy: <Target className="h-3 w-3" />,
      Medium: <Zap className="h-3 w-3" />,
      Hard: <Flame className="h-3 w-3" />,
    }

    const formattedLastSolved = lastSolved
      ? new Date(lastSolved).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      : null

    return (
      <motion.li
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex items-start gap-3 py-3 group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 px-3 rounded-md transition-all duration-200",
          question.completed && "bg-zinc-50/80 dark:bg-zinc-800/30",
        )}
      >
        <button
          onClick={onToggleCompletion}
          className="mt-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-full transition-transform hover:scale-110"
          aria-label={question.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {question.completed ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <Circle className="h-5 w-5 text-zinc-400 group-hover:text-primary/70 transition-colors" />
          )}
        </button>

        <div className="flex-1">
          <div className="flex justify-between">
            <span className={cn("font-medium", question.completed && "line-through text-zinc-500 dark:text-zinc-400")}>
              {question.title}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              <button
                onClick={onToggleBookmark}
                className="p-1 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <BookmarkPlus className="h-3.5 w-3.5 text-zinc-400 hover:text-primary transition-colors" />
                )}
              </button>
            </div>
          </div>

          {question.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{question.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Badge
              variant="outline"
              className={cn(
                "px-1.5 py-0 text-xs font-normal gap-1 flex items-center border",
                difficultyColors[question.difficulty],
              )}
            >
              {difficultyIcons[question.difficulty]}
              {question.difficulty}
            </Badge>

            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {question.estimatedTime}
            </span>

            {formattedLastSolved && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Last: {formattedLastSolved}
              </span>
            )}

            {question.popularity && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {question.popularity}+ solved
              </span>
            )}

            {question.tags && question.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap mt-1">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 px-1.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.li>
    )
  },
)
QuestionItem.displayName = "QuestionItem"

const CategoryProgress = memo(({ completed, total }: { completed: number; total: number }) => {
  const percentage = Math.round((completed / total) * 100)

  return (
    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-2">
      <Progress value={percentage} className="h-1.5 flex-1" />
      <span className="font-medium">{percentage}%</span>
    </div>
  )
})
CategoryProgress.displayName = "CategoryProgress"

const AchievementBadge = memo(({ type }: { type: string }) => {
  const achievementData = {
    first_solve: {
      title: "First Solve",
      description: "Completed your first problem",
      icon: <Star className="h-5 w-5 text-amber-500" />,
      color: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
    },
    five_solves: {
      title: "Getting Started",
      description: "Completed 5 problems",
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
      color: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
    },
    category_c1: {
      title: "Array Master",
      description: "Completed all Array & String problems",
      icon: <Award className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    },
    category_c2: {
      title: "Linked List Expert",
      description: "Completed all Linked List problems",
      icon: <Award className="h-5 w-5 text-purple-500" />,
      color: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
    },
    category_c3: {
      title: "Stack & Queue Pro",
      description: "Completed all Stack & Queue problems",
      icon: <Award className="h-5 w-5 text-orange-500" />,
      color: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
    },
    category_c4: {
      title: "Graph Navigator",
      description: "Completed all Graph & Tree problems",
      icon: <Award className="h-5 w-5 text-indigo-500" />,
      color: "bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800",
    },
    category_c5: {
      title: "DP Wizard",
      description: "Completed all Dynamic Programming problems",
      icon: <Award className="h-5 w-5 text-pink-500" />,
      color: "bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800",
    },
  }

  const achievement = achievementData[type as keyof typeof achievementData] || {
    title: "Achievement Unlocked",
    description: "You've unlocked a new achievement",
    icon: <Trophy className="h-5 w-5 text-amber-500" />,
    color: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
  }

  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-lg border", achievement.color)}>
      <div className="flex-shrink-0 p-2 bg-white dark:bg-zinc-800 rounded-full">{achievement.icon}</div>
      <div>
        <h4 className="font-medium text-sm">{achievement.title}</h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{achievement.description}</p>
      </div>
    </div>
  )
})
AchievementBadge.displayName = "AchievementBadge"

//default values
const defaultQuestionBankData: QuestionBank = {
  id: "Loading...",
  title: "Loading Study Plan...",
  description: "Fetching study plan information...",
  difficulty: "Loading...",
  duration: "Unknown",
  participants: 0,
  rating: 0,
  author: "Unknown",
  topics: [],
  categories: [],
}

function QuestionBankView() {
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  const searchParams = useSearchParams()
  const id = searchParams.get("id") // params from the URL

  const initialState: QuestionBankState = {
    bank: defaultQuestionBankData,
    bookmarks: [],
    lastSolved: {},
    filter: {
      search: "",
      difficulty: "All",
      status: "All",
    },
    streak: 0,
    achievements: [],
    metadata: {}
  }

  const [state, dispatch] = useReducer(questionBankReducer, initialState)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showAchievementToast, setShowAchievementToast] = useState(false)
  const [latestAchievement, setLatestAchievement] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStudyPlan = async (user: any) => {
      if (!user) {
        setError("User not authenticated.")
        setLoading(false)
        return
      }

      if (!id) {
        setError("No study plan ID provided.")
        setLoading(false)
        return
      }

      try {
        const token = await user.getIdToken()
        const response = await axios.get("/api/fetchStudyPlans", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const studyPlans = response.data.data
        console.log("Fetched Study Plans:", studyPlans)

        const selectedPlan = studyPlans.find((plan: ApiStudyPlan) => plan.uid === id)

        if (!selectedPlan) {
          setError("Study Plan not found.")
        } else {
          console.log("Selected Study Plan:", selectedPlan)

          dispatch({ type: "LOAD_API_DATA", apiData: selectedPlan })

          if (selectedPlan.categories && selectedPlan.categories.length > 0) {
            setExpandedCategory(selectedPlan.categories[0].id)
          }
        }
      } catch (err) {
        console.error("Error fetching study plans:", err)
        setError("Error fetching study plans.")
      } finally {
        setLoading(false)
      }
    }

    const unsubscribe = auth.onAuthStateChanged(fetchStudyPlan)
    return () => unsubscribe()
  }, [id])

  useEffect(() => {
    const savedState = localStorage.getItem(`questionBankState-${id}`)
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        dispatch({ type: "LOAD_STATE", state: parsedState })
      } catch (e) {
        console.error("Failed to parse saved state", e)
      }
    }
  }, [id])

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch("/questions_metadata.json"); 
        const data = await response.json();
        
        const metadataMap = data.reduce((acc: Record<string, any>, item: any) => {
          acc[item.ID] = item;
          return acc;
        }, {});
  
        dispatch({ type: "LOAD_METADATA", metadata: metadataMap }); 
      } catch (error) {
        console.error("Error fetching question metadata:", error);
      }
    };
  
    fetchMetadata();
  }, []);
  
  useEffect(() => {
    if (id) {
      localStorage.setItem(
        `questionBankState-${id}`,
        JSON.stringify({
          bookmarks: state.bookmarks,
          lastSolved: state.lastSolved,
          achievements: state.achievements,
          streak: state.streak,
        }),
      )
    }
  }, [state, id])

  useEffect(() => {
    const prevAchievements = JSON.parse(localStorage.getItem(`questionBankState-${id}`) || "{}")?.achievements || []

    if (state.achievements.length > prevAchievements.length) {
      const newAchievement = state.achievements[state.achievements.length - 1]
      setLatestAchievement(newAchievement)
      setShowAchievementToast(true)

      const timer = setTimeout(() => {
        setShowAchievementToast(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [state.achievements, id])

  const {
    totalQuestions,
    completedQuestions,
    progress,
    nextQuestion,
    filteredCategories,
    completionByDifficulty,
    recentActivity,
    topCategories,
  } = useMemo(() => {
    const allQuestions = state.bank.categories.flatMap((c) => c.questions)
    const completed = allQuestions.filter((q) => q.completed)
    const progressPercent = Math.round((completed.length / allQuestions.length) * 100 || 0)

    let next = null
    for (const category of state.bank.categories) {
      const incompleteQuestion = category.questions.find((q) => !q.completed)
      if (incompleteQuestion) {
        next = {
          categoryId: category.id,
          categoryTitle: category.title,
          question: incompleteQuestion,
        }
        break
      }
    }

    const filtered = state.bank.categories.map((category) => {
      const filteredQuestions = category.questions.filter((question) => {
        const matchesSearch = question.title.toLowerCase().includes(state.filter.search.toLowerCase())
        const matchesDifficulty = state.filter.difficulty === "All" || question.difficulty === state.filter.difficulty
        const matchesStatus =
          state.filter.status === "All" ||
          (state.filter.status === "Completed" && question.completed) ||
          (state.filter.status === "Incomplete" && !question.completed)

        return matchesSearch && matchesDifficulty && matchesStatus
      })

      return {
        ...category,
        questions: filteredQuestions,
        hasFilteredQuestions: filteredQuestions.length > 0,
      }
    })

    const difficultyStats = {
      Easy: { total: 0, completed: 0 },
      Medium: { total: 0, completed: 0 },
      Hard: { total: 0, completed: 0 },
    }

    allQuestions.forEach((question) => {
      difficultyStats[question.difficulty].total++
      if (question.completed) {
        difficultyStats[question.difficulty].completed++
      }
    })

    const recentActivity = Object.entries(state.lastSolved)
      .map(([questionId, timestamp]) => {
        let questionInfo = null
        let categoryTitle = ""

        for (const category of state.bank.categories) {
          const question = category.questions.find((q) => q.id === questionId)
          if (question) {
            questionInfo = question
            categoryTitle = category.title
            break
          }
        }

        if (!questionInfo) return null

        return {
          questionId,
          questionTitle: questionInfo.title,
          categoryTitle,
          timestamp,
          difficulty: questionInfo.difficulty,
        }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b!.timestamp).getTime() - new Date(a!.timestamp).getTime())
      .slice(0, 5)

    const topCategories = state.bank.categories
      .map((category) => {
        const totalInCategory = category.questions.length
        const completedInCategory = category.questions.filter((q) => q.completed).length
        const percentComplete = totalInCategory > 0 ? (completedInCategory / totalInCategory) * 100 : 0

        return {
          id: category.id,
          title: category.title,
          percentComplete,
          completedCount: completedInCategory,
          totalCount: totalInCategory,
        }
      })
      .sort((a, b) => b.percentComplete - a.percentComplete)

    return {
      totalQuestions: allQuestions.length,
      completedQuestions: completed.length,
      progress: progressPercent,
      nextQuestion: next,
      filteredCategories: filtered,
      completionByDifficulty: difficultyStats,
      recentActivity,
      topCategories,
    }
  }, [state.bank, state.filter, state.lastSolved])

  const toggleQuestionCompletion = useCallback((categoryId: string, questionId: string) => {
    dispatch({ type: "TOGGLE_COMPLETION", categoryId, questionId })
    dispatch({ type: "RECORD_SOLVE_SESSION", questionId })
    dispatch({ type: "INCREMENT_STREAK" })
  }, [])

  const toggleBookmark = useCallback((questionId: string) => {
    dispatch({ type: "TOGGLE_BOOKMARK", questionId })
  }, [])

  const handleDifficultyFilter = useCallback((difficulty: QuestionBankState["filter"]["difficulty"]) => {
    dispatch({ type: "SET_FILTER", filter: { difficulty } })
  }, [])

  const handleStatusFilter = useCallback((status: QuestionBankState["filter"]["status"]) => {
    dispatch({ type: "SET_FILTER", filter: { status } })
  }, [])

  const handleSearchFilter = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_FILTER", filter: { search: e.target.value } })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading study plan...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <Search className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Study Plan</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">{error}</p>
          <Button variant="default" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:20px_20px] opacity-30 dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)]"></div>
      </div>
      <AnimatePresence>
        {showAchievementToast && latestAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-primary text-primary-foreground p-4 rounded-lg shadow-lg flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              <div>
                <h4 className="font-medium">Achievement Unlocked!</h4>
                <AchievementBadge type={latestAchievement} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 relative z-10">
        <div className="relative border-b border-zinc-100 dark:border-zinc-800 backdrop-blur-[2px]">
          <div className="pt-20 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                {state.bank.title}
              </h1>
              <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">{state.bank.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {state.bank.topics.map((topic) => (
                  <Badge
                    key={topic}
                    className="rounded-full border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400 mb-4">
                <div className="flex items-center">
                  <Clock className="mr-1.5 h-4 w-4" />
                  <span className="text-sm">{state.bank.duration}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1.5 h-4 w-4" />
                  <span className="text-sm">{state.bank.participants.toLocaleString()} enrolled</span>
                </div>
                <div className="flex items-center">
                  <Star className="mr-1.5 h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">{state.bank.rating.toFixed(1)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 backdrop-blur-[2px] rounded-full p-1 bg-zinc-100/80 dark:bg-zinc-800/80">
              <TabsTrigger value="overview" className="text-base rounded-full">
                Overview
              </TabsTrigger>
              <TabsTrigger value="questions" className="text-base rounded-full">
                Questions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                  {nextQuestion && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Card className="overflow-hidden border border-zinc-200 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90 relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl font-medium flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            Continue Your Progress
                          </CardTitle>
                          <CardDescription>Pick up where you left off</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-zinc-50/80 backdrop-blur-sm p-4 rounded-lg border border-zinc-200/50 dark:bg-zinc-800/80 dark:border-zinc-700/50">
                            <p className="text-sm font-medium text-primary">{nextQuestion.categoryTitle}</p>
                            <p className="font-medium text-lg mt-1">{nextQuestion.question.title}</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                              {nextQuestion.question.description}
                            </p>

                            <div className="flex items-center gap-2 mt-3">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "px-1.5 py-0 text-xs font-normal border",
                                  nextQuestion.question.difficulty === "Easy"
                                    ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                    : nextQuestion.question.difficulty === "Medium"
                                      ? "text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                      : "text-rose-700 bg-rose-50 dark:bg-rose-950 dark:text-rose-400 border-rose-200 dark:border-rose-800",
                                )}
                              >
                                {nextQuestion.question.difficulty}
                              </Badge>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {nextQuestion.question.estimatedTime}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="rounded-full gap-2"
                            onClick={() => {
                              setActiveTab("questions")
                              setExpandedCategory(nextQuestion.categoryId)
                            }}
                          >
                            Continue Solving
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  )}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Card className="border border-zinc-200 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart2 className="h-5 w-5 text-primary" />
                            Your Progress
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">{progress}% Complete</span>
                                <span>
                                  {completedQuestions}/{totalQuestions} Questions
                                </span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Completion by Difficulty</h4>
                            <div className="space-y-1.5">
                              {(["Easy", "Medium", "Hard"] as const).map((difficulty) => {
                                const stats = completionByDifficulty[difficulty]
                                const difficultyProgress =
                                  stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

                                return (
                                  <div key={difficulty} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="font-medium">{difficulty}</span>
                                      <span>
                                        {stats.completed}/{stats.total}
                                      </span>
                                    </div>
                                    <Progress
                                      value={difficultyProgress}
                                      className={cn(
                                        "h-1.5",
                                        difficulty === "Easy"
                                          ? "bg-emerald-100 dark:bg-emerald-950"
                                          : difficulty === "Medium"
                                            ? "bg-blue-100 dark:bg-blue-950"
                                            : "bg-rose-100 dark:bg-rose-950",
                                      )}
                                    />
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Current streak */}
                          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Current Streak</span>
                              <div className="flex items-center gap-1 text-amber-500">
                                <Flame className="h-4 w-4" />
                                <span className="font-bold">{state.streak} days</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <Card className="border border-zinc-200 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Info className="h-5 w-5 text-primary" />
                            Question Bank Info
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Top categories */}
                          <div>
                            <h4 className="text-sm font-medium mb-2">Top Categories</h4>
                            <div className="space-y-2">
                              {topCategories.slice(0, 3).map((category) => (
                                <div key={category.id} className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>{category.title}</span>
                                    <span>{Math.round(category.percentComplete)}%</span>
                                  </div>
                                  <Progress value={category.percentComplete} className="h-1.5" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                  {recentActivity && recentActivity.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <Card className="border border-zinc-200 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Recent Activity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {recentActivity.map((activity: any) => (
                              <div key={activity.questionId} className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    activity.difficulty === "Easy"
                                      ? "bg-emerald-500"
                                      : activity.difficulty === "Medium"
                                        ? "bg-blue-500"
                                        : "bg-rose-500",
                                  )}
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{activity.questionTitle}</p>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{activity.categoryTitle}</p>
                                </div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                  {new Date(activity.timestamp).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <Card className="border border-zinc-200 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-primary" />
                          Your Achievements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {state.achievements.length > 0 ? (
                            state.achievements.map((achievement) => (
                              <AchievementBadge key={achievement} type={achievement} />
                            ))
                          ) : (
                            <div className="text-center py-6 px-4 bg-zinc-50/50 dark:bg-zinc-800/50 rounded-lg">
                              <Trophy className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
                              <p className="text-sm font-medium">No achievements yet</p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                Complete problems to unlock achievements
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Bookmarks section */}
                  {state.bookmarks.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <Card className="border border-zinc-200 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <BookmarkCheck className="h-5 w-5 text-primary" />
                            Your Bookmarks
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {state.bookmarks.map((bookmarkId) => {
                              let foundQuestion: Question | null = null
                              let categoryTitle = ""
                              let categoryId = ""

                              for (const category of state.bank.categories) {
                                const question = category.questions.find((q) => q.id === bookmarkId)
                                if (question) {
                                  foundQuestion = question
                                  categoryTitle = category.title
                                  categoryId = category.id
                                  break
                                }
                              }

                              if (!foundQuestion) return null

                              return (
                                <li
                                  key={bookmarkId}
                                  className="flex items-center justify-between group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-md p-2 transition-colors"
                                >
                                  <button
                                    className="text-left flex-1"
                                    onClick={() => {
                                      setActiveTab("questions")
                                      setExpandedCategory(categoryId)
                                    }}
                                  >
                                    <p className="text-sm font-medium">{foundQuestion.title}</p>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                      <span>{categoryTitle}</span>
                                      <span
                                        className={cn(
                                          "px-1.5 py-0.5 rounded-full text-xs border",
                                          foundQuestion.difficulty === "Easy"
                                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                                            : foundQuestion.difficulty === "Medium"
                                              ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                              : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400 border-rose-200 dark:border-rose-800",
                                        )}
                                      >
                                        {foundQuestion.difficulty}
                                      </span>
                                    </div>
                                  </button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-full"
                                    onClick={() => toggleBookmark(bookmarkId)}
                                  >
                                    <BookmarkCheck className="h-4 w-4" />
                                    <span className="sr-only">Remove bookmark</span>
                                  </Button>
                                </li>
                              )
                            })}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="questions" className="mt-6">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search questions..."
                      value={state.filter.search}
                      onChange={handleSearchFilter}
                      className="pl-9 w-full"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={state.filter.difficulty === "Easy" ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleDifficultyFilter(state.filter.difficulty === "Easy" ? "All" : "Easy")}
                    >
                      <Target className="mr-2 h-4 w-4" /> Easy
                    </Button>
                    <Button
                      variant={state.filter.difficulty === "Medium" ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleDifficultyFilter(state.filter.difficulty === "Medium" ? "All" : "Medium")}
                    >
                      <Zap className="mr-2 h-4 w-4" /> Medium
                    </Button>
                    <Button
                      variant={state.filter.difficulty === "Hard" ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleDifficultyFilter(state.filter.difficulty === "Hard" ? "All" : "Hard")}
                    >
                      <Flame className="mr-2 h-4 w-4" /> Hard
                    </Button>
                    <Button
                      variant={state.filter.status === "Completed" ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleStatusFilter(state.filter.status === "Completed" ? "All" : "Completed")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Completed
                    </Button>
                    <Button
                      variant={state.filter.status === "Incomplete" ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleStatusFilter(state.filter.status === "Incomplete" ? "All" : "Incomplete")}
                    >
                      <Circle className="mr-2 h-4 w-4" /> Incomplete
                    </Button>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Problem Categories
                  </h2>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    value={expandedCategory || undefined}
                    onValueChange={setExpandedCategory}
                  >
                    {filteredCategories.map((category, index) => {
                      if (!category.hasFilteredQuestions) return null

                      const completedInCategory = category.questions.filter((q) => q.completed).length
                      return (
                        <AccordionItem
                          key={category.id}
                          value={category.id}
                          className="border-b border-zinc-100 dark:border-zinc-800"
                        >
                          <AccordionTrigger className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 px-4 py-3 rounded-md data-[state=open]:bg-zinc-50 dark:data-[state=open]:bg-zinc-800/50 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-left w-full">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center min-w-8 h-8 rounded-full bg-primary/10 text-sm font-medium">
                                  {index + 1}
                                </div>
                                <span className="font-medium">{category.title}</span>
                              </div>

                              <div className="ml-10 sm:ml-auto flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                                <span>
                                  {completedInCategory}/{category.questions.length} completed
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 pt-1">
                            {category.description && (
                              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">{category.description}</p>
                            )}
                            <CategoryProgress completed={completedInCategory} total={category.questions.length} />
                            <ul className="space-y-1 mt-3">
                              {category.questions.map((question) => (
                                <QuestionItem
                                  key={question.id}
                                  question={question}
                                  categoryId={category.id}
                                  onToggleCompletion={() => toggleQuestionCompletion(category.id, question.id)}
                                  onToggleBookmark={() => toggleBookmark(question.id)}
                                  isBookmarked={state.bookmarks.includes(question.id)}
                                  lastSolved={state.lastSolved[question.id]}
                                />
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>

                  {filteredCategories.every((category) => !category.hasFilteredQuestions) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white/90 backdrop-blur-sm py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/90"
                    >
                      <div className="mb-6 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
                        <Search className="h-8 w-8 text-zinc-400" />
                      </div>
                      <h3 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        No questions match your filters
                      </h3>
                      <p className="mb-6 text-zinc-600 dark:text-zinc-400">
                        Try adjusting your search or filters to find what you're looking for
                      </p>
                      <Button
                        variant="default"
                        className="rounded-full"
                        onClick={() =>
                          dispatch({
                            type: "SET_FILTER",
                            filter: {
                              search: "",
                              difficulty: "All",
                              status: "All",
                            },
                          })
                        }
                      >
                        Clear filters
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function QuestionSolvingView() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <QuestionBankView />
    </div>
  )
}
