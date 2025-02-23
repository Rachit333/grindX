import { Card } from "@/components/ui/card"
import type React from "react"

interface MetricsCardProps {
  title: string
  icon: React.ReactNode
  value: string
  total?: string
  subtext?: string
}

export function MetricsCard({ title, icon, value, total, subtext }: MetricsCardProps) {
  return (
    <Card className="p-6 bg-card backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-bold">
        {value}
        {total && <span className="text-lg font-normal text-muted-foreground"> / {total}</span>}
      </p>
      {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
    </Card>
  )
}

