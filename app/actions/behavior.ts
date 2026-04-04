"use server"

import { connectToDatabase } from "@/lib/db"
import { BehaviorLogModel } from "@/lib/models/BehaviorLog"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { authorizePermission } from "@/lib/auth"

const BehaviorLogSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  type: z.enum(['Positive', 'Negative', 'Neutral']),
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Description is required"),
  date: z.string().min(1, "Date is required"),
})

export async function getStudentBehaviors(studentId: string) {
  const auth = await authorizePermission("student.view")
  if (!auth.allowed || !auth.context.schoolId) return []

  await connectToDatabase()
  const logs = await BehaviorLogModel.find({ 
    schoolId: auth.context.schoolId, 
    studentId 
  }).sort({ date: -1 }).lean()
  
  return logs.map((l: any) => ({
    ...JSON.parse(JSON.stringify(l)),
    id: l._id.toString()
  }))
}

export async function addBehaviorLog(formData: FormData) {
  const auth = await authorizePermission("student.edit")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  const rawData = {
    studentId: formData.get("studentId")?.toString(),
    type: formData.get("type")?.toString(),
    title: formData.get("title")?.toString(),
    description: formData.get("description")?.toString(),
    date: formData.get("date")?.toString(),
  }

  const validated = BehaviorLogSchema.safeParse(rawData)
  if (!validated.success) {
    return {
      error: "Validation Failed",
      fieldErrors: validated.error.flatten().fieldErrors
    }
  }

  await connectToDatabase()

  const newLog = {
    schoolId: auth.context.schoolId,
    reportedBy: "System", // Fixed lint error
    ...validated.data
  }

  await BehaviorLogModel.create(newLog)
  revalidatePath(`/dashboard/students/${validated.data.studentId}`)
  return { success: true }
}

export async function deleteBehaviorLog(id: string, studentId: string) {
  const auth = await authorizePermission("student.edit")
  if (!auth.allowed || !auth.context.schoolId) return

  await connectToDatabase()
  await BehaviorLogModel.findOneAndDelete({ _id: id, schoolId: auth.context.schoolId })
  revalidatePath(`/dashboard/students/${studentId}`)
}
