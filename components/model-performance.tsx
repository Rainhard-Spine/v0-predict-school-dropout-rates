"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"

const data = [
  { month: "Jan", accuracy: 0.82, auc: 0.85 },
  { month: "Feb", accuracy: 0.84, auc: 0.87 },
  { month: "Mar", accuracy: 0.86, auc: 0.89 },
  { month: "Apr", accuracy: 0.88, auc: 0.91 },
  { month: "May", accuracy: 0.89, auc: 0.92 },
  { month: "Jun", accuracy: 0.91, auc: 0.94 },
]

export function ModelPerformance() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle style={{ fontFamily: "var(--font-space-grotesk)" }}>Model Performance</CardTitle>
        <CardDescription>Accuracy and AUC-ROC metrics over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            accuracy: {
              label: "Accuracy",
              color: "#15803d",
            },
            auc: {
              label: "AUC-ROC",
              color: "#84cc16",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis domain={[0.7, 1]} stroke="#6b7280" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#15803d"
                strokeWidth={2}
                dot={{ fill: "#15803d" }}
                name="Accuracy"
              />
              <Line
                type="monotone"
                dataKey="auc"
                stroke="#84cc16"
                strokeWidth={2}
                dot={{ fill: "#84cc16" }}
                name="AUC-ROC"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
