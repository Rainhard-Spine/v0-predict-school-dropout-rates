"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

export function FeatureImportance() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/model-comparison")
      .then((res) => res.json())
      .then((comparison) => {
        // Get feature importance from best model
        const bestModel = comparison.results[comparison.best_model]
        if (bestModel?.feature_importance) {
          const importanceData = Object.entries(bestModel.feature_importance)
            .map(([feature, importance]) => ({
              feature: feature.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
              importance: (importance as number) * 100,
            }))
            .sort((a, b) => b.importance - a.importance)
            .slice(0, 8)

          setData(importanceData)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Failed to load feature importance:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return null
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle style={{ fontFamily: "var(--font-space-grotesk)" }}>Feature Importance</CardTitle>
        <CardDescription>Key factors influencing dropout predictions</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            importance: {
              label: "Importance",
              color: "#15803d",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="feature" type="category" width={150} stroke="#6b7280" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="importance" fill="#15803d" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
