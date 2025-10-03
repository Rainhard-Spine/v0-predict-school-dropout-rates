import { NextResponse } from "next/server"

// Simulated real-time stats with slight variations
export async function GET() {
  try {
    // Simulate database query with slight random variations for real-time feel
    const baseStats = {
      totalStudents: 2847,
      highRisk: 142,
      mediumRisk: 284,
      interventions: 89,
    }

    // Add small random variations to simulate real-time changes
    const stats = {
      totalStudents: baseStats.totalStudents + Math.floor(Math.random() * 5),
      highRisk: baseStats.highRisk + Math.floor(Math.random() * 3) - 1,
      mediumRisk: baseStats.mediumRisk + Math.floor(Math.random() * 5) - 2,
      interventions: baseStats.interventions + Math.floor(Math.random() * 3),
      totalStudentsChange: "+12% from last semester",
      highRiskPercentage: "5% of total students",
      mediumRiskPercentage: "10% of total students",
      interventionSuccessRate: "63% success rate",
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Stats API error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
