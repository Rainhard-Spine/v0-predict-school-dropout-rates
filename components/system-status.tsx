"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Activity } from "lucide-react"
import { useRealtime } from "@/components/realtime-provider"
import { Card, CardContent } from "@/components/ui/card"

export function SystemStatus() {
  const { isConnected, lastUpdate, connectionQuality } = useRealtime()

  const getStatusColor = () => {
    if (!isConnected) return "bg-destructive"
    if (connectionQuality === "excellent") return "bg-primary"
    if (connectionQuality === "good") return "bg-primary/80"
    return "bg-yellow-500"
  }

  const getStatusText = () => {
    if (!isConnected) return "Disconnected"
    if (connectionQuality === "excellent") return "Excellent"
    if (connectionQuality === "good") return "Good"
    return "Poor"
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {isConnected ? <Wifi className="h-5 w-5 text-primary" /> : <WifiOff className="h-5 w-5 text-destructive" />}
            <div className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${getStatusColor()} animate-pulse`} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
                {getStatusText()}
              </Badge>
              {isConnected && <Activity className="h-3 w-3 text-muted-foreground animate-pulse" />}
            </div>
            {lastUpdate && (
              <p className="text-xs text-muted-foreground">Last update: {lastUpdate.toLocaleTimeString()}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
