// "use client";

// import { useSearchParams } from "next/navigation";
// import { useEffect } from "react";

// export default function StudyPlan() {
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");

//   useEffect(() => {
//     if (id) {
//       alert(id);
//     }
//   }, [id]);

//   return <div>Query ID: {id}</div>;
// }

// import Link from "next/link"
// import { MoreHorizontal, Search, Plus, ChevronRight } from "lucide-react"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"

// export default function NotesApp() {
//   return (
//     <div className="flex h-screen bg-background">
//       {/* Middle Section - Notes List */}
//       <div className="w-80 border-r">
//         <div className="p-4 border-b">
//           <h1 className="text-xl font-semibold">My Notes</h1>
//         </div>
//         <div className="p-4">
//           <div className="relative mb-4">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input placeholder="Search notes..." className="pl-8" />
//           </div>
//           <Button variant="secondary" className="w-full gap-2">
//             <Plus className="h-4 w-4" />
//             Add new note
//           </Button>
//         </div>
//         <div className="divide-y">
//           {/* Note Items */}
//           <div className="p-4 hover:bg-muted/50 cursor-pointer transition-colors duration-200 focus-within:ring-2 focus-within:ring-primary focus-within:outline-none">
//             <div className="text-sm text-muted-foreground">20 APR</div>
//             <h3 className="font-medium">Exploration Ideas</h3>
//             <p className="text-sm text-muted-foreground line-clamp-2">
//               Blandit pharetra tellus metus fermentum pellentesque augue sit...
//             </p>
//             <div className="flex gap-2 mt-2">
//               <span className="text-xs bg-muted px-2 py-1 rounded">Design</span>
//               <span className="text-xs bg-muted px-2 py-1 rounded">Productivity</span>
//             </div>
//           </div>
//           {/* Add more note items here */}
//         </div>
//       </div>

//       {/* Right Section - Note Content */}
//       <div className="flex-1">
//         <div className="p-4 border-b flex items-center justify-between">
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <Link href="#" className="hover:text-foreground">
//               My Notes
//             </Link>
//             <ChevronRight className="h-4 w-4" />
//             <span>System Database Week 4</span>
//           </div>
//           <Button variant="ghost" size="icon">
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </div>

//         <div className="p-6">
//           <h1 className="text-3xl font-bold mb-6">Database Systems Week 4</h1>

//           <div className="space-y-4 mb-6">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Avatar className="h-6 w-6">
//                   <AvatarImage src="/placeholder.svg" />
//                   <AvatarFallback>FL</AvatarFallback>
//                 </Avatar>
//                 <span className="text-sm">Floyd Lawton</span>
//               </div>
//               <span className="text-sm text-muted-foreground">19 April 2021, 20:39 PM</span>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               <span className="text-sm bg-muted px-2 py-1 rounded">College</span>
//               <span className="text-sm bg-muted px-2 py-1 rounded">Lecture</span>
//               <span className="text-sm bg-muted px-2 py-1 rounded">Daily</span>
//               <span className="text-sm bg-muted px-2 py-1 rounded">Productivity</span>
//               <span className="text-sm bg-muted px-2 py-1 rounded">Database</span>
//               <Button variant="outline" size="sm" className="h-7">
//                 <Plus className="h-3 w-3" />
//                 Add new tag
//               </Button>
//             </div>
//           </div>

//           <div className="prose prose-sm max-w-none">
//             <h2>Normalization</h2>
//             <p>
//               Normalization is the process of ordering basic data structures to ensure that the basic data created is of
//               good quality. Used to minimize data redundancy and data inconsistencies. Normalization stage starts from
//               the lightest stage (1NF) to the strictest (5NF). Usually only up to the 3NF or BCNF level as they are
//               sufficient to produce good quality tables.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Clock, Users, Star, BookOpen, ArrowLeft, ChevronRight } from "lucide-react"

// export default function StudyPlanDetails() {
//   // This is mock data. In a real application, this would come from props or a data fetching mechanism
//   const studyPlan = {
//     title: "Advanced Machine Learning Techniques",
//     description:
//       "Dive deep into cutting-edge machine learning algorithms and their applications in real-world scenarios.",
//     difficulty: "Advanced",
//     duration: "8 weeks",
//     participants: 1234,
//     rating: 4.8,
//     author: "john.doe@example.com",
//     topics: [
//       "Neural Networks",
//       "Deep Learning",
//       "Computer Vision",
//       "Natural Language Processing",
//       "Reinforcement Learning",
//     ],
//     content: `
//       <h2>Course Outline</h2>
//       <ol>
//         <li>Introduction to Advanced ML Concepts</li>
//         <li>Deep Dive into Neural Network Architectures</li>
//         <li>Convolutional Neural Networks for Computer Vision</li>
//         <li>Recurrent Neural Networks for Sequence Modeling</li>
//         <li>Transformer Models and Attention Mechanisms</li>
//         <li>Generative Adversarial Networks</li>
//         <li>Reinforcement Learning Algorithms</li>
//         <li>Deploying ML Models at Scale</li>
//       </ol>
//       <p>Each week includes lectures, hands-on coding exercises, and a project component to apply your learning.</p>
//     `,
//   }

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty) {
//       case "Beginner":
//         return "bg-emerald-50 text-emerald-700 border-emerald-200"
//       case "Intermediate":
//         return "bg-blue-50 text-blue-700 border-blue-200"
//       case "Advanced":
//         return "bg-rose-50 text-rose-700 border-rose-200"
//       default:
//         return "bg-gray-50 text-gray-700 border-gray-200"
//     }
//   }

//   return (
//     <div className="min-h-screen bg-white dark:bg-zinc-950">
//       <div className="container mx-auto px-4 py-8">
//         <Button
//           variant="ghost"
//           className="mb-6 flex items-center text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Study Plans
//         </Button>

//         <div className="mb-8 flex items-start justify-between">
//           <div>
//             <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">{studyPlan.title}</h1>
//             <p className="mb-4 text-lg text-zinc-600 dark:text-zinc-400">{studyPlan.description}</p>
//           </div>
//           <Badge className={`${getDifficultyColor(studyPlan.difficulty)} border px-2.5 py-0.5 text-sm font-medium`}>
//             {studyPlan.difficulty}
//           </Badge>
//         </div>

//         <div className="mb-8 flex flex-wrap gap-4 text-zinc-600 dark:text-zinc-400">
//           <div className="flex items-center">
//             <Clock className="mr-2 h-5 w-5" />
//             <span>{studyPlan.duration}</span>
//           </div>
//           <div className="flex items-center">
//             <Users className="mr-2 h-5 w-5" />
//             <span>{studyPlan.participants} enrolled</span>
//           </div>
//           <div className="flex items-center">
//             <Star className="mr-2 h-5 w-5 text-amber-500" />
//             <span className="font-medium">{studyPlan.rating.toFixed(1)}</span>
//           </div>
//           <div className="flex items-center">
//             <BookOpen className="mr-2 h-5 w-5" />
//             <span>By {studyPlan.author.split("@")[0]}</span>
//           </div>
//         </div>

//         <div className="mb-8">
//           <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">Topics Covered</h2>
//           <div className="flex flex-wrap gap-2">
//             {studyPlan.topics.map((topic) => (
//               <Badge
//                 key={topic}
//                 variant="outline"
//                 className="rounded-full border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
//               >
//                 {topic}
//               </Badge>
//             ))}
//           </div>
//         </div>

//         <div className="prose prose-zinc max-w-none dark:prose-invert">
//           <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Study Plan Content</h2>
//           <div dangerouslySetInnerHTML={{ __html: studyPlan.content }} />
//         </div>

//         <div className="mt-12 flex justify-between">
//           <Button variant="outline">Back to Study Plans</Button>
//           <Button className="flex items-center">
//             Start Learning
//             <ChevronRight className="ml-2 h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }



// "use client"
// import { useState } from "react";
// import Link from "next/link";
// import { MoreHorizontal, Search, Plus, ChevronRight, Clock, Users, Star, BookOpen, ArrowLeft } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";

// export default function LearningApp() {
//   const [view, setView] = useState("course");

//   const studyPlan = {
//     title: "Advanced Machine Learning Techniques",
//     description:
//       "Dive deep into cutting-edge machine learning algorithms and their applications in real-world scenarios.",
//     difficulty: "Advanced",
//     duration: "8 weeks",
//     participants: 1234,
//     rating: 4.8,
//     author: "john.doe@example.com",
//     topics: [
//       "Neural Networks",
//       "Deep Learning",
//       "Computer Vision",
//       "Natural Language Processing",
//       "Reinforcement Learning",
//     ],
//     content: `
//       <h2>Course Outline</h2>
//       <ol>
//         <li>Introduction to Advanced ML Concepts</li>
//         <li>Deep Dive into Neural Network Architectures</li>
//         <li>Convolutional Neural Networks for Computer Vision</li>
//         <li>Recurrent Neural Networks for Sequence Modeling</li>
//         <li>Transformer Models and Attention Mechanisms</li>
//         <li>Generative Adversarial Networks</li>
//         <li>Reinforcement Learning Algorithms</li>
//         <li>Deploying ML Models at Scale</li>
//       </ol>
//       <p>Each week includes lectures, hands-on coding exercises, and a project component to apply your learning.</p>
//     `,
//   };

//   return (
//     <div className="flex h-screen bg-background">
//       {/* Sidebar - My Notes */}
//       <div className="w-80 border-r">
//         <div className="p-4 border-b">
//           <h1 className="text-xl font-semibold cursor-pointer" onClick={() => setView("course")}>My Notes</h1>
//         </div>
//         <div className="p-4">
//           <div className="relative mb-4">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input placeholder="Search notes..." className="pl-8" />
//           </div>
//           <Button variant="secondary" className="w-full gap-2">
//             <Plus className="h-4 w-4" />
//             Add new note
//           </Button>
//         </div>
//         <div className="divide-y">
//           {/* Note Items */}
//           <div className="p-4 hover:bg-muted/50 cursor-pointer transition-colors duration-200" onClick={() => setView("notes")}>
//             <div className="text-sm text-muted-foreground">20 APR</div>
//             <h3 className="font-medium">Exploration Ideas</h3>
//             <p className="text-sm text-muted-foreground line-clamp-2">
//               Blandit pharetra tellus metus fermentum pellentesque augue sit...
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6">
//         {/* Course Details Always Shown on Top */}
//         <h1 className="text-3xl font-bold mb-6">{studyPlan.title}</h1>
//         <p className="text-lg text-muted-foreground mb-4">{studyPlan.description}</p>
//         <div className="flex flex-wrap gap-2 mb-4">
//           {studyPlan.topics.map((topic) => (
//             <Badge key={topic} variant="outline" className="px-2 py-1 text-sm">{topic}</Badge>
//           ))}
//         </div>
//         <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: studyPlan.content }} />
//         <div className="mt-6 flex justify-end">
//           <Button onClick={() => setView("notes")} className="flex items-center">
//             Start Learning <ChevronRight className="ml-2 h-4 w-4" />
//           </Button>
//         </div>

//         {/* Notes Content Below Course Details */}
//         {view === "notes" && (
//           <div className="mt-12">
//             <div className="p-4 border-b flex items-center justify-between">
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <span className="cursor-pointer" onClick={() => setView("course")}>My Notes</span>
//                 <ChevronRight className="h-4 w-4" />
//                 <span>System Database Week 4</span>
//               </div>
//               <Button variant="ghost" size="icon">
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </div>
//             <h1 className="text-3xl font-bold mb-6">Database Systems Week 4</h1>
//             <p>Normalization is the process of ordering basic data structures...</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// "use client"

// import { useState } from "react"
// import { Sidebar } from "@/components/StudyPlanSideBar"
// import { CourseView } from "@/components/StudyPlanView"

// export interface StudyPlan {
//   title: string
//   description: string
//   difficulty: string
//   duration: string
//   participants: number
//   rating: number
//   author: string
//   topics: string[]
//   modules: {
//     title: string
//     lessons: string[]
//   }[]
// }

// export const studyPlanData: StudyPlan = {
//   title: "Advanced Machine Learning Techniques",
//   description:
//     "Dive deep into cutting-edge machine learning algorithms and their applications in real-world scenarios.",
//   difficulty: "Advanced",
//   duration: "8 weeks",
//   participants: 1234,
//   rating: 4.8,
//   author: "john.doe@example.com",
//   topics: [
//     "Neural Networks",
//     "Deep Learning",
//     "Computer Vision",
//     "Natural Language Processing",
//     "Reinforcement Learning",
//   ],
//   modules: [
//     {
//       title: "Regular Expression Matching",
//       lessons: ["String", "Dynamic Programming", "Recursion"]
//     },
//     {
//       title: "Letter Combinations of a Phone Number",
//       lessons: ["Hash Table", "String", "Backtracking"]
//     },
//     {
//       title: "Swap Nodes in Pairs",
//       lessons: ["Linked List", "Recursion"]
//     }
//   ],
// }

// export default function LearningApp() {
//   const [view, setView] = useState<"course">("course")

//   return (
//     <div className="flex h-screen bg-background overflow-hidden">
//       <Sidebar onViewChange={() => setView("course")} currentView={view} />
//       <div className="flex-1 overflow-auto">
//         <CourseView studyPlan={studyPlanData} />
//       </div>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import { Clock, Users, Star, BookOpen } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"

export interface StudyPlan {
  title: string
  description: string
  difficulty: string
  duration: string
  participants: number
  rating: number
  author: string
  topics: string[]
  modules: {
    title: string
    lessons: string[]
  }[]
}

const studyPlanData: StudyPlan = {
  title: "DSA Mastery Plan",
  description: "A structured plan to master Data Structures & Algorithms systematically.",
  difficulty: "Beginner to Advanced",
  duration: "12 weeks",
  participants: 75000,
  rating: 4.9,
  author: "DSA Experts",
  topics: ["Arrays", "Linked Lists", "Stacks & Queues", "Graphs", "Dynamic Programming"],
  modules: [
    {
      title: "Arrays & Strings",
      lessons: ["Two Sum", "Sliding Window Maximum", "Longest Substring Without Repeating Characters"]
    },
    {
      title: "Linked Lists",
      lessons: ["Reverse a Linked List", "Cycle Detection", "Merge Two Sorted Lists"]
    },
    {
      title: "Stacks & Queues",
      lessons: ["Valid Parentheses", "Min Stack", "LRU Cache"]
    },
    {
      title: "Graphs & Trees",
      lessons: ["Graph Traversals (BFS & DFS)", "Dijkstra’s Algorithm", "Lowest Common Ancestor"]
    },
    {
      title: "Dynamic Programming",
      lessons: ["0/1 Knapsack", "Longest Common Subsequence", "House Robber"]
    }
  ],
}

function CourseView({ studyPlan }: { studyPlan: StudyPlan }) {
  const [progress] = useState(40) // Example progress value

  return (
    <div className="container max-w-5xl py-8 px-4 md:px-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-3">{studyPlan.title}</h1>
            <p className="text-lg text-muted-foreground">{studyPlan.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {studyPlan.topics.map((topic) => (
              <Badge key={topic} variant="outline" className="px-2 py-1 text-sm">
                {topic}
              </Badge>
            ))}
          </div>

          <div className="bg-muted/40 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Course Outline</h2>
            <Accordion type="single" collapsible className="w-full">
              {studyPlan.modules.map((module, index) => (
                <AccordionItem key={index} value={`module-${index}`}>
                  <AccordionTrigger className="hover:bg-muted/60 px-4 rounded-md">
                    <div className="flex items-center gap-2 text-left">
                      <span className="font-medium">Module {index + 1}:</span>
                      <span>{module.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <ul className="space-y-2 py-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <li key={lessonIndex} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                            {lessonIndex + 1}
                          </div>
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Your Progress</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>40% Complete</span>
                    <span>2/5 Modules</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
              <Button variant="secondary" className="w-full">
                Resume Learning
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-medium">Course Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{studyPlan.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>Difficulty: {studyPlan.difficulty}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{studyPlan.participants.toLocaleString()} Participants</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>{studyPlan.rating} Rating</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function LearningApp() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="flex-1 overflow-auto">
        <CourseView studyPlan={studyPlanData} />
      </div>
    </div>
  )
}
