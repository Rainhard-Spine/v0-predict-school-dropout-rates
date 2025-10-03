"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2, TrendingUp } from "lucide-react"

interface ModelResult {
  accuracy: number
  auc_roc: number
  confusion_matrix: number[][]
  classification_report: any
  feature_importance?: Record<string, number>
}

interface ComparisonData {
  best_model: string
  results: Record<string, ModelResult>
  trained: boolean
}

export function ModelComparison() {
  const [data, setData] = useState<ComparisonData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/model-comparison")
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Failed to load model comparison:", error)
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
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle style={{ fontFamily: "var(--font-space-grotesk)" }}>Model Comparison</CardTitle>
            <CardDescription>Performance metrics across all trained models</CardDescription>
          </div>
          {!data.trained && (
            <Badge variant="outline" className="text-amber-600 border-amber-600">
              Demo Data
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(data.results).map(([modelName, result]) => {
            const isBest = modelName === data.best_model

            return (
              <div
                key={modelName}
                className={`p-4 rounded-lg border ${
                  isBest ? "border-primary bg-primary/5" : "border-border bg-background"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{modelName}</h3>
                    {isBest && (
                      <Badge className="bg-primary text-primary-foreground">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Best Model
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>AUC: {result.auc_roc.toFixed(3)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className="text-2xl font-bold">{(result.accuracy * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Precision</p>
                    <p className="text-2xl font-bold">
                      {(result.classification_report.Dropout.precision * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recall</p>
                    <p className="text-2xl font-bold">
                      {(result.classification_report.Dropout.recall * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">F1-Score</p>
                    <p className="text-2xl font-bold">
                      {(result.classification_report.Dropout["f1-score"] * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {result.confusion_matrix && (
                  <div className="mt-4 p-3 bg-muted/50 rounded">
                    <p className="text-xs font-semibold mb-2 text-muted-foreground">Confusion Matrix</p>
                    <div className="grid grid-cols-2 gap-2 text-center text-sm">
                      <div className="p-2 bg-background rounded">
                        <p className="font-mono font-bold">{result.confusion_matrix[0][0]}</p>
                        <p className="text-xs text-muted-foreground">True Negative</p>
                      </div>
                      <div className="p-2 bg-background rounded">
                        <p className="font-mono font-bold">{result.confusion_matrix[0][1]}</p>
                        <p className="text-xs text-muted-foreground">False Positive</p>
                      </div>
                      <div className="p-2 bg-background rounded">
                        <p className="font-mono font-bold">{result.confusion_matrix[1][0]}</p>
                        <p className="text-xs text-muted-foreground">False Negative</p>
                      </div>
                      <div className="p-2 bg-background rounded">
                        <p className="font-mono font-bold">{result.confusion_matrix[1][1]}</p>
                        <p className="text-xs text-muted-foreground">True Positive</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
