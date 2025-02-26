"use client"

import { useState } from "react"
import { Search, ChevronDown, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

const previousLeetCodeProblems = [
    {
      id: "leetcode-1",
      date: "20 APR",
      title: "Binary Search",
      preview: "Solved classic binary search problem with iterative and recursive approaches.",
    },
    {
      id: "leetcode-2",
      date: "18 APR",
      title: "Two Sum",
      preview: "Implemented brute-force and hash map solutions for optimal performance.",
    },
    {
      id: "leetcode-3",
      date: "15 APR",
      title: "Merge Intervals",
      preview: "Solved using sorting and greedy approach to merge overlapping intervals.",
    },
    {
      id: "leetcode-4",
      date: "10 APR",
      title: "LRU Cache",
      preview: "Implemented LRU Cache using HashMap and Doubly Linked List for O(1) operations.",
    },
    {
      id: "leetcode-5",
      date: "5 APR",
      title: "Maximum Subarray",
      preview: "Applied Kadane’s algorithm to find the largest sum contiguous subarray.",
    },
  ];
  
interface SidebarProps {
  onViewChange: (view: "course" | "notes", noteId?: string) => void
  currentView: "course" | "notes"
  activeNoteId: string | null
}

// Update the sidebar component to use coding exercises
export function Sidebar({ onViewChange, currentView, activeNoteId }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter coding exercises based on search query
  const filteredExercises = previousLeetCodeProblems.filter(
    (exercise) =>
      exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.preview.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div
      className={cn(
        "border-r bg-background transition-all duration-300 flex flex-col",
        isCollapsed ? "w-0 md:w-16 overflow-hidden" : "w-80",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h1
          className={cn(
            "text-xl font-semibold cursor-pointer transition-opacity",
            isCollapsed ? "opacity-0 md:hidden" : "opacity-100",
          )}
          onClick={() => onViewChange("course")}
        >
          Coding Progress
        </h1>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="hidden md:flex">
          {isCollapsed ? (
            <ChevronDown className="h-5 w-5 rotate-270" />
          ) : (
            <ChevronDown className="h-5 w-5 -rotate-90" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search past questions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 cursor-pointer transition-colors duration-200",
                    activeNoteId === exercise.id && "bg-muted",
                  )}
                  onClick={() => onViewChange("notes", exercise.id)}
                >
                  <div className="text-sm text-muted-foreground">{exercise.date}</div>
                  <h3 className="font-medium">{exercise.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{exercise.preview}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  )
}

