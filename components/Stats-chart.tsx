"use client"

import { useLeetCodeStore } from "@/lib/leetcode-store"
import { Line, LineChart, ResponsiveContainer, Tooltip, Pie, PieChart, Cell } from "recharts"

interface StatsChartProps {
  data: any[];
  type?: "line" | "pie";
}

export function StatsChart({ type = "line", data }: StatsChartProps) {
  const leetCodeData = useLeetCodeStore((state) => state.leetCodeData)

  if (!leetCodeData) {
    return <div>No data available</div>
  }

  if (type === "line") {
    const submissionData = Object.entries(leetCodeData.submissionCalendar).map(([timestamp, count]) => ({
      date: new Date(Number.parseInt(timestamp) * 1000).toLocaleDateString(),
      submissions: count,
    }))

    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={submissionData}>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-card p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Submissions</span>
                          <span className="font-bold text-foreground">{payload[0].value}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                          <span className="font-bold text-foreground">{payload[0].payload.date}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line type="monotone" dataKey="submissions" stroke="#ff6b00" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  } else if (type === "pie") {
    const data = [
      { name: "Easy", value: leetCodeData.easySolved },
      { name: "Medium", value: leetCodeData.mediumSolved },
      { name: "Hard", value: leetCodeData.hardSolved },
    ]

    const COLORS = ["#00C49F", "#FFBB28", "#FF8042"]

    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

