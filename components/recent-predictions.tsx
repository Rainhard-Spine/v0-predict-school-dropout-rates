"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import useSWR from "swr"
import { Skeleton } from "@/components/ui/skeleton"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function RecentPredictions() {
  const {
    data: predictions,
    error,
    isLoading,
  } = useSWR("/api/predictions/recent", fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle style={{ fontFamily: "var(--font-space-grotesk)" }}>Recent Risk Assessments</CardTitle>
        <CardDescription>Students identified as at-risk in the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10">
            <p className="text-sm text-destructive">Failed to load predictions. Retrying...</p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border border-border">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-3" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        )}

        {predictions && (
          <div className="space-y-4">
            {predictions.map((student: any) => (
              <div
                key={student.id}
                className="flex items-start justify-between p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.id} • {student.grade}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={student.risk === "High" ? "destructive" : "secondary"}
                      className={
                        student.risk === "High"
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }
                    >
                      {student.risk} Risk
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {(student.probability * 100).toFixed(0)}% probability
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {student.factors.map((factor: string) => (
                      <span key={factor} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
