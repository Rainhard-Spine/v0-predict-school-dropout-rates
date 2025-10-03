"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, UserCheck, Bell } from "lucide-react"
import { useEffect, useState } from "react"
import { useRealtime } from "@/components/realtime-provider"

interface Activity {
  id: string
  type: "alert" | "prediction" | "intervention" | "update"
  message: string
  timestamp: Date
  severity?: "high" | "medium" | "low"
}

export function RealtimeActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "alert",
      message: "High-risk student detected: Sarah Johnson (STU-2847)",
      timestamp: new Date(Date.now() - 2 * 60000),
      severity: "high",
    },
    {
      id: "2",
      type: "intervention",
      message: "Intervention started for Michael Chen (STU-2846)",
      timestamp: new Date(Date.now() - 5 * 60000),
      severity: "medium",
    },
    {
      id: "3",
      type: "prediction",
      message: "Batch prediction completed: 47 students analyzed",
      timestamp: new Date(Date.now() - 8 * 60000),
    },
  ])

  const { isConnected } = useRealtime()

  useEffect(() => {
    if (!isConnected) return

    // Simulate real-time activity updates
    const interval = setInterval(() => {
      const activityTypes: Activity["type"][] = ["alert", "prediction", "intervention", "update"]
      const messages = [
        "New student risk assessment completed",
        "Attendance data updated for 15 students",
        "Intervention success: Student moved to low-risk category",
        "Model accuracy improved to 94.2%",
        "Weekly report generated for administrators",
        "Parent notification sent for at-risk student",
      ]

      const newActivity: Activity = {
        id: Date.now().toString(),
        type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp: new Date(),
        severity: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
      }

      setActivities((prev) => [newActivity, ...prev].slice(0, 10))
    }, 15000) // New activity every 15 seconds

    return () => clearInterval(interval)
  }, [isConnected])

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "prediction":
        return <TrendingUp className="h-4 w-4 text-primary" />
      case "intervention":
        return <UserCheck className="h-4 w-4 text-primary" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle style={{ fontFamily: "var(--font-space-grotesk)" }}>Real-Time Activity Feed</CardTitle>
            <CardDescription>Live updates from the monitoring system</CardDescription>
          </div>
          <Badge variant="outline" className="animate-pulse">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background hover:bg-muted/50 transition-all animate-in fade-in slide-in-from-top-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mt-0.5">{getIcon(activity.type)}</div>
              <div className="flex-1 space-y-1">
                <p className="text-sm leading-relaxed">{activity.message}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{getTimeAgo(activity.timestamp)}</p>
                  {activity.severity && (
                    <Badge variant={activity.severity === "high" ? "destructive" : "secondary"} className="text-xs">
                      {activity.severity}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
