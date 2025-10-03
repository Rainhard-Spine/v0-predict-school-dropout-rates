"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { StatsOverview } from "@/components/stats-overview"
import { RiskDistribution } from "@/components/risk-distribution"
import { RecentPredictions } from "@/components/recent-predictions"
import { ModelPerformance } from "@/components/model-performance"
import { PredictionForm } from "@/components/prediction-form"
import { RealtimeActivityFeed } from "@/components/realtime-activity-feed"
import { SystemStatus } from "@/components/system-status"
import { RealtimeProvider } from "@/components/realtime-provider"
import { ModelComparison } from "@/components/model-comparison"
import { FeatureImportance } from "@/components/feature-importance"

export default function HomePage() {
  return (
    <RealtimeProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <h1
                className="text-4xl font-bold tracking-tight text-balance"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Student Dropout Prediction Dashboard
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Real-time monitoring and prediction system to identify at-risk students and enable targeted
                interventions
              </p>
            </div>
            <SystemStatus />
          </div>

          <StatsOverview />

          <div className="grid gap-8 lg:grid-cols-2">
            <RiskDistribution />
            <ModelPerformance />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <FeatureImportance />
            <ModelComparison />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <RecentPredictions />
              <RealtimeActivityFeed />
            </div>
            <div>
              <PredictionForm />
            </div>
          </div>
        </main>
      </div>
    </RealtimeProvider>
  )
}
