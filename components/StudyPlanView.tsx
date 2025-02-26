"use client"

import { useState } from "react"
import { ChevronRight, Clock, Users, Star, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"

const studyPlan = {
  title: "LeetCode Mastery Plan",
  description: "A structured plan to master LeetCode problems from easy to hard.",
  topics: ["Arrays", "Strings", "Graphs", "Dynamic Programming", "Recursion"],
  modules: [
    {
      title: "Regular Expression Matching",
      lessons: ["String", "Dynamic Programming", "Recursion"]
    },
    {
      title: "Letter Combinations of a Phone Number",
      lessons: ["Hash Table", "String", "Backtracking"]
    },
    {
      title: "Swap Nodes in Pairs",
      lessons: ["Linked List", "Recursion"]
    }
  ],
  duration: "8 Weeks",
  difficulty: "Intermediate to Advanced",
  participants: 50000,
  rating: "4.8/5",
  author: "LeetCode Experts"
}

interface CourseViewProps {
  onStartLearning: () => void
}

export function CourseView({ onStartLearning }: CourseViewProps) {
  const [progress] = useState(25) // Example progress value

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
                    <span>25% Complete</span>
                    <span>1/3 Modules</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>

              <Button variant="secondary" className="w-full" onClick={onStartLearning}>
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

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-medium">Instructor</h3>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>LE</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">LeetCode Experts</p>
                  <p className="text-sm text-muted-foreground">{studyPlan.author}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}