"use server"

import { efficientGenerate } from "@/lib/ai"
import { authorizePermission } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import { SubjectModel } from "@/lib/models/Subject"
import { AcademicClassModel } from "@/lib/models/AcademicClass"

export interface HomeworkGeneratorInput {
  topic: string
  classId: string
  subjectId: string
  gradeLevel: string
  assignmentType: "questions" | "quiz" | "worksheet" | "mixed"
  difficulty: "easy" | "medium" | "hard"
  numberOfItems: number
  includeAnswers: boolean
}

export interface GeneratedHomework {
  title: string
  type: string
  items: string[]
  answers?: string[]
  estimatedTime: string
  difficulty: string
}

export interface Subject {
  id: string
  name: string
  code: string
}

export interface AcademicClass {
  id: string
  name: string
  gradeLevel: string
}

// Fetch subjects for dropdown
export async function getTeacherSubjects() {
  const auth = await authorizePermission("subject.manage")
  if (!auth.allowed || !auth.context.schoolId) return []

  await connectToDatabase()
  const subjects = await SubjectModel.find({ schoolId: auth.context.schoolId })
    .sort({ subjectName: 1 })
    .lean()

  return subjects.map((s: any) => ({
    id: s._id.toString(),
    name: s.subjectName,
    code: s.subjectCode || "",
  }))
}

// Fetch classes for dropdown
export async function getTeacherClasses() {
  const auth = await authorizePermission("class.manage")
  if (!auth.allowed || !auth.context.schoolId) return []

  await connectToDatabase()
  const classes = await AcademicClassModel.find({ schoolId: auth.context.schoolId })
    .sort({ className: 1 })
    .lean()

  return classes.map((c: any) => ({
    id: c._id.toString(),
    name: c.className,
    gradeLevel: c.className, // Use className as gradeLevel
  }))
}

export async function generateHomework(input: HomeworkGeneratorInput) {
  const auth = await authorizePermission("assignment.manage")
  if (!auth.allowed) {
    return { error: "Not authorized to generate homework" }
  }

  const {
    topic,
    classId,
    subjectId,
    gradeLevel,
    assignmentType,
    difficulty,
    numberOfItems,
    includeAnswers,
  } = input

  // Fetch subject and class details from database
  await connectToDatabase()
  const subject = await SubjectModel.findById(subjectId).lean()
  const academicClass = await AcademicClassModel.findById(classId).lean()

  if (!subject || !academicClass) {
    return { error: "Subject or class not found" }
  }

  const subjectName = subject.subjectName || ""
  const className = academicClass.className || ""

  // Build the prompt for Gemini
  const difficultyDescriptions = {
    easy: "simple, foundational questions suitable for reviewing basic concepts",
    medium: "intermediate difficulty questions requiring some analysis and application",
    hard: "challenging questions requiring critical thinking, analysis, and deeper understanding",
  }

  const assignmentTypeDescriptions = {
    questions:
      "homework questions for practice and reinforcement",
    quiz: "quiz questions for assessment",
    worksheet: "comprehensive worksheet with varied question types",
    mixed: "a mix of questions, short answer, and practical problems",
  }

  const systemPrompt = "Return ONLY valid JSON. No markdown. No explanation. No text before or after JSON."

  const userPrompt = `Generate ${numberOfItems} homework ${assignmentTypeDescriptions[assignmentType]} for ${subjectName} (Grade ${gradeLevel}).
Topic: ${topic}

RESPOND WITH ONLY THIS JSON:
{"title":"Homework Title","instructions":"Instructions","items":["Q1","Q2","Q3"],"answers":["A1","A2","A3"],"estimatedTime":"30 min","learningObjectives":["Obj1"]}`

  try {
    const result = await efficientGenerate({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
      prompt: userPrompt,
    })

    if (!result.success) {
      return { error: `Failed to generate homework: ${result.error}` }
    }

    // Parse the generated content - improved JSON extraction
    let cleanedText = result.text

    // Remove common AI response patterns that wrap JSON
    cleanedText = cleanedText
      .replace(/^Here's? .*?:\s*/i, "") // "Here's the homework:" 
      .replace(/\*\*(.*?)\*\*/g, "$1") // Bold markdown
      .replace(/```(?:json)?\s*/g, "```") // Normalize code fence markers
      .replace(/^```\s*/gm, "") // Remove opening fence
      .replace(/\s*```$/gm, "") // Remove closing fence
      .trim()

    console.log("=== AI HOMEWORK RESPONSE ===")
    console.log("Cleaned response (first 500 chars):", cleanedText.substring(0, 500))
    console.log("=== END RESPONSE ===")

    let homework: any = null

    try {
      // Method 1: Try parsing cleaned response directly
      try {
        homework = JSON.parse(cleanedText)
        console.log("✓ Method 1: Direct parse")
      } catch (e) {
        // Method 2: Extract from code blocks or braces
        const firstBrace = cleanedText.indexOf("{")
        const lastBrace = cleanedText.lastIndexOf("}")
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          const jsonStr = cleanedText.substring(firstBrace, lastBrace + 1)
          homework = JSON.parse(jsonStr)
          console.log("✓ Method 2: Brace extraction")
        } else {
          throw new Error("No JSON object found in response")
        }
      }
    } catch (parseError) {
      console.error("❌ JSON parsing failed")
      console.error("Error:", (parseError as Error).message)
      console.error("Cleaned response:", cleanedText.substring(0, 300))
      return {
        error: `Could not parse homework. Response: ${cleanedText.substring(0, 200)}...`,
      }
    }

    if (!homework) {
      return { error: "No homework data generated" }
    }

    // Validate required fields
    if (!homework.title || !homework.items || !Array.isArray(homework.items)) {
      console.error("❌ Invalid homework structure:", { title: homework.title, items: homework.items })
      return { error: "Invalid homework format from AI. Missing required fields." }
    }

    return {
      success: true,
      homework: {
        title: homework.title,
        instructions: homework.instructions || "",
        topic,
        subject: subjectName,
        class: className,
        gradeLevel,
        type: assignmentType,
        difficulty,
        items: homework.items,
        answers: homework.answers || undefined,
        estimatedTime: homework.estimatedTime || "Not specified",
        learningObjectives: homework.learningObjectives || [],
        generatedAt: new Date().toISOString(),
      },
    }
  } catch (error: any) {
    console.error("Homework generation error:", error)
    return {
      error: `Generation failed: ${error.message || "Unknown error"}`,
    }
  }
}

export async function regenerateHomework(previousInput: HomeworkGeneratorInput, regenerateAnswers: boolean = false) {
  return generateHomework(previousInput)
}
