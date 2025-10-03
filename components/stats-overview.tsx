"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, AlertTriangle, TrendingDown, CheckCircle } from "lucide-react"
import useSWR from "swr"
import { Skeleton } from "@/components/ui/skeleton"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function StatsOverview() {
  const {
    data: stats,
    error,
    isLoading,
  } = useSWR("/api/stats", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card border-destructive/50">
            <CardContent className="p-6">
              <p className="text-sm text-destructive">Failed to load stats</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-6">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statItems = [
    {
      label: "Total Students",
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      change: stats.totalStudentsChange,
      positive: true,
    },
    {
      label: "High Risk",
      value: stats.highRisk.toString(),
      icon: AlertTriangle,
      change: stats.highRiskPercentage,
      positive: false,
    },
    {
      label: "Medium Risk",
      value: stats.mediumRisk.toString(),
      icon: TrendingDown,
      change: stats.mediumRiskPercentage,
      positive: false,
    },
    {
      label: "Interventions Active",
      value: stats.interventions.toString(),
      icon: CheckCircle,
      change: stats.interventionSuccessRate,
      positive: true,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    stat.positive ? "bg-primary/10" : "bg-destructive/10"
                  }`}
                >
                  <Icon className={`h-6 w-6 ${stat.positive ? "text-primary" : "text-destructive"}`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
