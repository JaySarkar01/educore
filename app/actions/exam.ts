"use server"

import { connectToDatabase } from "@/lib/db"
import { ExamResultModel } from "@/lib/models/ExamResult"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { authorizePermission } from "@/lib/auth"

const ExamResultSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  subjectId: z.string().min(1, "Subject is required"),
  examName: z.string().min(2, "Exam name is required"),
  marksObtained: z.coerce.number().min(0, "Marks cannot be negative"),
  maxMarks: z.coerce.number().min(1, "Max marks must be > 0"),
  date: z.string().min(1, "Date is required"),
  remarks: z.string().optional(),
})

export async function getStudentExams(studentId: string) {
  const auth = await authorizePermission("student.view")
  if (!auth.allowed || !auth.context.schoolId) return []

  await connectToDatabase()
  const results = await ExamResultModel.find({ 
    schoolId: auth.context.schoolId, 
    studentId 
  }).sort({ date: -1 }).lean()
  
  return results.map((r: any) => ({
    ...JSON.parse(JSON.stringify(r)),
    id: r._id.toString()
  }))
}

export async function addExamResult(formData: FormData) {
  const auth = await authorizePermission("student.edit")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  const rawData = {
    studentId: formData.get("studentId")?.toString(),
    subjectId: formData.get("subjectId")?.toString(),
    examName: formData.get("examName")?.toString(),
    marksObtained: formData.get("marksObtained"),
    maxMarks: formData.get("maxMarks"),
    date: formData.get("date")?.toString(),
    remarks: formData.get("remarks")?.toString(),
  }

  const validated = ExamResultSchema.safeParse(rawData)
  if (!validated.success) {
    return {
      error: "Validation Failed",
      fieldErrors: validated.error.flatten().fieldErrors
    }
  }

  await connectToDatabase()

  const newResult = {
    schoolId: auth.context.schoolId,
    ...validated.data
  }

  await ExamResultModel.create(newResult)
  revalidatePath(`/dashboard/students/${validated.data.studentId}`)
  return { success: true }
}

export async function deleteExamResult(id: string, studentId: string) {
  const auth = await authorizePermission("student.edit")
  if (!auth.allowed || !auth.context.schoolId) return

  await connectToDatabase()
  await ExamResultModel.findOneAndDelete({ _id: id, schoolId: auth.context.schoolId })
  revalidatePath(`/dashboard/students/${studentId}`)
}
