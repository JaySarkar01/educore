"use server"

import { getStudentById } from "./student"
import { getStudentAttendanceStats } from "./attendance"
import { getStudentExams } from "./exam"
import { getStudentHomework } from "./homework"
import { getStudentBehaviors } from "./behavior"
import { efficientGenerate } from "@/lib/ai"
import { authorizePermission } from "@/lib/auth"

export async function generateStudentAnalysis(studentId: string) {
  const auth = await authorizePermission("student.view")
  if (!auth.allowed) return { error: "Not authorized" }

  const student = await getStudentById(studentId)
  if (!student) return { error: "Student not found" }

  const attStats = await getStudentAttendanceStats(studentId)
  const exams = await getStudentExams(studentId)
  const homework = await getStudentHomework(studentId)
  const behaviors = await getStudentBehaviors(studentId)

  const prompt = `
You are an expert AI educational assistant. Analyze the following student data and provide actionable true/false insights.
Return the output STRICTLY as a JSON object with the following exact structure. Do not use markdown wrappers, just return the raw JSON:
{
  "summary": "A 2-3 sentence high-level executive summary of the student's performance.",
  "academic": {
    "trend": "Positive, Negative, or Stable",
    "details": "Detailed analysis of exam scores and subject performance.",
    "topStrength": "E.g., Mathematics",
    "weakness": "E.g., Science (or None)"
  },
  "homework": {
    "consistency": "Excellent, Good, Average, or Poor",
    "details": "Remarks on homework tracking."
  },
  "behavior": {
    "status": "Excellent, Good, Needs Improvement",
    "details": "Insights based on behavioral logs."
  },
  "attendanceImpact": "Detailed analysis on how the attendance rate is affecting their academic performance.",
  "recommendations": [
    "Actionable tip 1",
    "Actionable tip 2",
    "Actionable tip 3"
  ]
}

--- DATA ---
**Student Info:**
Name: ${student.name}
Class: ${student.className} ${student.section}
Status: ${student.status}

**Attendance:** 
Total Days: ${attStats?.totalDays || 0}
Present: ${attStats?.presentDays || 0}
Attendance Rate: ${attStats?.percentage || 0}%
Recent Records: ${JSON.stringify(attStats?.history?.slice(0, 5) || [])}

**Exam Results:** 
${exams.map((e: any) => `- ${e.examName} (${e.subjectId}): ${e.marksObtained}/${e.maxMarks} on ${e.date}`).join('\n') || 'No exams recorded.'}

**Homework Logs:**
${homework.map((h: any) => `- ${h.title} (${h.subjectId}): ${h.status} on ${h.dateDue}`).join('\n') || 'No homework recorded.'}

**Behavior/Incident Logs:**
${behaviors.map((b: any) => `- [${b.type}] ${b.title} on ${b.date}: ${b.description}`).join('\n') || 'No behavior logs recorded.'}
`

  const response = await efficientGenerate({
    prompt,
    systemInstruction: "You are a JSON-only API. You must output raw JSON strictly conforming to the requested schema. Do not generate markdown code blocks. Do not add any text before or after the JSON.",
    model: "gemini-2.5-flash"
  })

  if (!response.success) {
    return { error: response.error }
  }

  try {
    let rawText = response.text || "{}"
    // Use regex to extract everything from the first '{' to the last '}'
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      rawText = jsonMatch[0]
    }
    const parsed = JSON.parse(rawText)
    return { success: true, data: parsed }
  } catch (e: any) {
    console.error("AI JSON Parse Error:", response.text)
    return { error: "Failed to parse AI response into structured data." }
  }
}
