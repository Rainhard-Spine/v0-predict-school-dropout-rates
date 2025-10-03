import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    console.log("[v0] Model comparison API called")

    const mockData = {
      best_model: "Random Forest",
      results: {
        "Logistic Regression": {
          accuracy: 0.847,
          auc_roc: 0.881,
          confusion_matrix: [
            [145, 23],
            [18, 114],
          ],
          classification_report: {
            Graduate: { precision: 0.89, recall: 0.86, "f1-score": 0.88 },
            Dropout: { precision: 0.83, recall: 0.86, "f1-score": 0.85 },
          },
        },
        "Random Forest": {
          accuracy: 0.913,
          auc_roc: 0.947,
          confusion_matrix: [
            [158, 10],
            [16, 116],
          ],
          classification_report: {
            Graduate: { precision: 0.91, recall: 0.94, "f1-score": 0.92 },
            Dropout: { precision: 0.92, recall: 0.88, "f1-score": 0.9 },
          },
          feature_importance: {
            attendance_rate: 0.245,
            gpa_semester1: 0.198,
            gpa_semester2: 0.187,
            absences: 0.142,
            behavioral_issues: 0.089,
            study_hours_weekly: 0.067,
            previous_failures: 0.045,
            extracurricular: 0.027,
          },
        },
        SVM: {
          accuracy: 0.873,
          auc_roc: 0.912,
          confusion_matrix: [
            [151, 17],
            [21, 111],
          ],
          classification_report: {
            Graduate: { precision: 0.88, recall: 0.9, "f1-score": 0.89 },
            Dropout: { precision: 0.87, recall: 0.84, "f1-score": 0.85 },
          },
        },
        XGBoost: {
          accuracy: 0.907,
          auc_roc: 0.941,
          confusion_matrix: [
            [156, 12],
            [16, 116],
          ],
          classification_report: {
            Graduate: { precision: 0.91, recall: 0.93, "f1-score": 0.92 },
            Dropout: { precision: 0.91, recall: 0.88, "f1-score": 0.89 },
          },
          feature_importance: {
            attendance_rate: 0.238,
            gpa_semester1: 0.205,
            gpa_semester2: 0.192,
            absences: 0.135,
            behavioral_issues: 0.095,
            study_hours_weekly: 0.071,
            previous_failures: 0.042,
            extracurricular: 0.022,
          },
        },
      },
      trained: false,
    }

    console.log("[v0] Returning model comparison data")
    return NextResponse.json(mockData)
  } catch (error) {
    console.error("[v0] Model comparison API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        error: "Failed to load model comparison",
        details: errorMessage,
        // Return minimal mock data as fallback
        best_model: "Random Forest",
        results: {},
        trained: false,
      },
      { status: 200 }, // Return 200 to prevent JSON parse errors
    )
  }
}
