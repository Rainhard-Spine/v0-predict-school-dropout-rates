"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface RealtimeContextType {
  isConnected: boolean
  lastUpdate: Date | null
  connectionQuality: "excellent" | "good" | "poor" | "disconnected"
}

const RealtimeContext = createContext<RealtimeContextType>({
  isConnected: false,
  lastUpdate: null,
  connectionQuality: "disconnected",
})

export function useRealtime() {
  return useContext(RealtimeContext)
}

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [connectionQuality, setConnectionQuality] = useState<"excellent" | "good" | "poor" | "disconnected">(
    "disconnected",
  )
  const { toast } = useToast()

  useEffect(() => {
    // Simulate WebSocket connection with heartbeat
    const ws: WebSocket | null = null
    let reconnectAttempts = 0
    let heartbeatInterval: NodeJS.Timeout
    let latencyCheckInterval: NodeJS.Timeout
    const maxReconnectAttempts = 5

    const connect = () => {
      try {
        // In production, replace with actual WebSocket URL
        // ws = new WebSocket('wss://your-server.com/realtime')

        // Simulate connection for demo
        console.log("[v0] Establishing real-time connection...")

        setTimeout(() => {
          setIsConnected(true)
          setConnectionQuality("excellent")
          setLastUpdate(new Date())
          reconnectAttempts = 0

          toast({
            title: "Connected",
            description: "Real-time monitoring is active",
          })

          // Heartbeat to maintain connection
          heartbeatInterval = setInterval(() => {
            setLastUpdate(new Date())
            console.log("[v0] Heartbeat sent")
          }, 5000)

          // Monitor connection quality
          latencyCheckInterval = setInterval(() => {
            const latency = Math.random() * 200 // Simulate latency
            if (latency < 50) setConnectionQuality("excellent")
            else if (latency < 100) setConnectionQuality("good")
            else setConnectionQuality("poor")
          }, 10000)
        }, 1000)

        // ws.onopen = () => { ... }
        // ws.onmessage = (event) => { ... }
        // ws.onerror = () => { ... }
        // ws.onclose = () => { ... }
      } catch (error) {
        console.error("[v0] Connection error:", error)
        handleDisconnect()
      }
    }

    const handleDisconnect = () => {
      setIsConnected(false)
      setConnectionQuality("disconnected")
      clearInterval(heartbeatInterval)
      clearInterval(latencyCheckInterval)

      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
        console.log(`[v0] Reconnecting in ${delay}ms (attempt ${reconnectAttempts})`)

        toast({
          title: "Connection Lost",
          description: `Reconnecting... (attempt ${reconnectAttempts}/${maxReconnectAttempts})`,
          variant: "destructive",
        })

        setTimeout(connect, delay)
      } else {
        toast({
          title: "Connection Failed",
          description: "Unable to establish real-time connection. Please refresh the page.",
          variant: "destructive",
        })
      }
    }

    connect()

    return () => {
      if (ws) ws.close()
      clearInterval(heartbeatInterval)
      clearInterval(latencyCheckInterval)
    }
  }, [toast])

  return (
    <RealtimeContext.Provider value={{ isConnected, lastUpdate, connectionQuality }}>
      {children}
    </RealtimeContext.Provider>
  )
}
