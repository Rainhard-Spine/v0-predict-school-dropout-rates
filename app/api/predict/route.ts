import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// Fallback rule-based prediction
function predictDropoutRisk(data: {
  attendance: number
  gpa: number
  behavioralIssues: string
  familyIncome: string
  parentalEducation: string
  age?: number
  absences?: number
  studyHours?: number
  extracurricular?: number
}) {
  let riskScore = 0

  // Attendance factor (0-40 points)
  if (data.attendance < 70) riskScore += 40
  else if (data.attendance < 85) riskScore += 25
  else if (data.attendance < 95) riskScore += 10

  // GPA factor (0-30 points)
  if (data.gpa < 2.0) riskScore += 30
  else if (data.gpa < 2.5) riskScore += 20
  else if (data.gpa < 3.0) riskScore += 10

  // Behavioral issues (0-15 points)
  const behavioralMap: Record<string, number> = {
    severe: 15,
    moderate: 10,
    minor: 5,
    none: 0,
  }
  riskScore += behavioralMap[data.behavioralIssues] || 0

  // Family income (0-10 points)
  if (data.familyIncome === "low") riskScore += 10
  else if (data.familyIncome === "medium") riskScore += 5

  // Parental education (0-5 points)
  if (data.parentalEducation === "none") riskScore += 5
  else if (data.parentalEducation === "highschool") riskScore += 3

  // Convert to probability (0-1)
  const probability = Math.min(riskScore / 100, 0.95)

  // Determine risk level
  let risk: string
  if (probability >= 0.7) risk = "High"
  else if (probability >= 0.4) risk = "Medium"
  else risk = "Low"

  // Generate recommendations based on risk factors
  const recommendations: string[] = []

  if (data.attendance < 85) {
    recommendations.push("Implement attendance monitoring and family outreach program")
  }
  if (data.gpa < 2.5) {
    recommendations.push("Provide academic tutoring and mentorship support")
  }
  if (data.behavioralIssues !== "none") {
    recommendations.push("Refer to counseling services and behavioral intervention program")
  }
  if (data.familyIncome === "low") {
    recommendations.push("Connect family with financial aid and community resources")
  }
  if (data.parentalEducation === "none" || data.parentalEducation === "highschool") {
    recommendations.push("Engage parents through family literacy and involvement programs")
  }

  if (recommendations.length === 0) {
    recommendations.push("Continue monitoring student progress")
    recommendations.push("Maintain regular communication with family")
  }

  return { risk, probability, recommendations }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Predict API called")
    const data = await request.json()

    // Validate input
    if (
      typeof data.attendance !== "number" ||
      typeof data.gpa !== "number" ||
      !data.behavioralIssues ||
      !data.familyIncome ||
      !data.parentalEducation
    ) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 })
    }

    console.log("[v0] Using rule-based prediction")
    const result = {
      ...predictDropoutRisk(data),
      model: "Rule-based",
    }

    console.log("[v0] Prediction result:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Prediction API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        error: "Failed to process prediction",
        details: errorMessage,
        // Return safe fallback
        risk: "Medium",
        probability: 0.5,
        recommendations: ["Unable to generate prediction. Please try again."],
        model: "Error",
      },
      { status: 200 }, // Return 200 to prevent JSON parse errors
    )
  }
}
