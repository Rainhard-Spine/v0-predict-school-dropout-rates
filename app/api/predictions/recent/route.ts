import { NextResponse } from "next/server"

// Simulated real-time predictions data
export async function GET() {
  try {
    // In production, this would query your database with real-time data
    const predictions = [
      {
        id: "STU-2847",
        name: "Sarah Johnson",
        grade: "10th Grade",
        risk: "High",
        probability: 0.87,
        factors: ["Low Attendance", "Declining Grades", "Family Issues"],
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "STU-2846",
        name: "Michael Chen",
        grade: "11th Grade",
        risk: "Medium",
        probability: 0.62,
        factors: ["Behavioral Issues", "Low Engagement"],
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "STU-2845",
        name: "Emily Rodriguez",
        grade: "9th Grade",
        risk: "High",
        probability: 0.79,
        factors: ["Low Attendance", "Economic Hardship"],
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "STU-2844",
        name: "James Wilson",
        grade: "12th Grade",
        risk: "Medium",
        probability: 0.58,
        factors: ["Declining Grades", "Low Engagement"],
        lastUpdated: new Date().toISOString(),
      },
    ]

    // Simulate slight variations in probability for real-time feel
    const updatedPredictions = predictions.map((p) => ({
      ...p,
      probability: Math.min(0.99, Math.max(0.01, p.probability + (Math.random() - 0.5) * 0.02)),
    }))

    return NextResponse.json(updatedPredictions)
  } catch (error) {
    console.error("[v0] Recent predictions API error:", error)
    return NextResponse.json({ error: "Failed to fetch predictions" }, { status: 500 })
  }
}
