"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LeetCodeStats {
  totalSolved: number
  totalQuestions: number
  easySolved: number
  totalEasy: number
  mediumSolved: number
  totalMedium: number
  hardSolved: number
  totalHard: number
  acceptanceRate: number
  ranking: number
}

export function LeetCodeStats() {
  const [username, setUsername] = useState("")
  const [stats, setStats] = useState<LeetCodeStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
      const data = await response.json()
      if (data.status === "success") {
        setStats(data)
      } else {
        setError("Failed to fetch LeetCode stats. Please check the username and try again.")
      }
    } catch (err) {
      setError("An error occurred while fetching the stats. Please try again later.")
    }
    setLoading(false)
  }

  return (
    <Card className="bg-black text-white">
      <CardHeader>
        <CardTitle>LeetCode Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input placeholder="Enter LeetCode username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Button onClick={fetchStats} disabled={loading}>
            {loading ? "Loading..." : "Fetch Stats"}
          </Button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {stats && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Total Solved:</p>
              <p>
                {stats.totalSolved} / {stats.totalQuestions}
              </p>
            </div>
            <div>
              <p className="font-semibold">Easy:</p>
              <p>
                {stats.easySolved} / {stats.totalEasy}
              </p>
            </div>
            <div>
              <p className="font-semibold">Medium:</p>
              <p>
                {stats.mediumSolved} / {stats.totalMedium}
              </p>
            </div>
            <div>
              <p className="font-semibold">Hard:</p>
              <p>
                {stats.hardSolved} / {stats.totalHard}
              </p>
            </div>
            <div>
              <p className="font-semibold">Acceptance Rate:</p>
              <p>{stats.acceptanceRate.toFixed(2)}%</p>
            </div>
            <div>
              <p className="font-semibold">Ranking:</p>
              <p>{stats.ranking.toLocaleString()}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

