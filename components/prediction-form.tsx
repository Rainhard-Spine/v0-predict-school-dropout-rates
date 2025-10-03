"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function PredictionForm() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    risk: string
    probability: number
    recommendations: string[]
    model?: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      attendance: Number.parseFloat(formData.get("attendance") as string),
      gpa: Number.parseFloat(formData.get("gpa") as string),
      behavioralIssues: formData.get("behavioralIssues") as string,
      familyIncome: formData.get("familyIncome") as string,
      parentalEducation: formData.get("parentalEducation") as string,
      age: Number.parseInt(formData.get("age") as string),
      gender: formData.get("gender") as string,
      absences: Number.parseInt(formData.get("absences") as string),
      studyHours: Number.parseInt(formData.get("studyHours") as string),
      extracurricular: Number.parseInt(formData.get("extracurricular") as string),
      previousFailures: Number.parseInt(formData.get("previousFailures") as string),
    }

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      setResult(result)
    } catch (error) {
      console.error("[v0] Prediction error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle style={{ fontFamily: "var(--font-space-grotesk)" }}>New Prediction</CardTitle>
        <CardDescription>Enter student data to assess dropout risk</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" min="13" max="20" defaultValue="16" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" defaultValue="male">
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendance">Attendance Rate (%)</Label>
            <Input
              id="attendance"
              name="attendance"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="85.5"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gpa">Current GPA</Label>
            <Input id="gpa" name="gpa" type="number" min="0" max="4" step="0.01" placeholder="3.2" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="absences">Total Absences</Label>
              <Input id="absences" name="absences" type="number" min="0" max="50" defaultValue="5" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="previousFailures">Previous Failures</Label>
              <Input
                id="previousFailures"
                name="previousFailures"
                type="number"
                min="0"
                max="5"
                defaultValue="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="behavioralIssues">Behavioral Issues</Label>
            <Select name="behavioralIssues" required>
              <SelectTrigger id="behavioralIssues">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studyHours">Study Hours/Week</Label>
              <Input id="studyHours" name="studyHours" type="number" min="0" max="60" defaultValue="15" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extracurricular">Extracurricular Activities</Label>
              <Input
                id="extracurricular"
                name="extracurricular"
                type="number"
                min="0"
                max="10"
                defaultValue="2"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyIncome">Family Income Level</Label>
            <Select name="familyIncome" required>
              <SelectTrigger id="familyIncome">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentalEducation">Parental Education</Label>
            <Select name="parentalEducation" required>
              <SelectTrigger id="parentalEducation">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No High School</SelectItem>
                <SelectItem value="highschool">High School</SelectItem>
                <SelectItem value="college">Some College</SelectItem>
                <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                <SelectItem value="graduate">Graduate Degree</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Predict Risk"
            )}
          </Button>
        </form>

        {result && (
          <div className="mt-6 p-4 rounded-lg border border-border bg-background space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Risk Level:</span>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    result.risk === "High"
                      ? "bg-destructive text-destructive-foreground"
                      : result.risk === "Medium"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
                  }`}
                >
                  {result.risk}
                </span>
                {result.model && (
                  <Badge variant="outline" className="text-xs">
                    {result.model}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Probability:</span>
              <span className="text-lg font-bold">{(result.probability * 100).toFixed(1)}%</span>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Recommended Interventions:
              </p>
              <ul className="space-y-1">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
