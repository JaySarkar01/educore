"use server"

import { connectToDatabase } from "@/lib/db"
import { HomeworkModel } from "@/lib/models/Homework"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { authorizePermission } from "@/lib/auth"

const HomeworkSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  subjectId: z.string().min(1, "Subject is required"),
  title: z.string().min(2, "Title is required"),
  status: z.enum(['Completed', 'Late', 'Missing']),
  dateAssigned: z.string().min(1, "Assigned date is required"),
  dateDue: z.string().min(1, "Due date is required"),
  remarks: z.string().optional(),
})

export async function getStudentHomework(studentId: string) {
  const auth = await authorizePermission("student.view")
  if (!auth.allowed || !auth.context.schoolId) return []

  await connectToDatabase()
  const homeworks = await HomeworkModel.find({ 
    schoolId: auth.context.schoolId, 
    studentId 
  }).sort({ dateAssigned: -1 }).lean()
  
  return homeworks.map((h: any) => ({
    ...JSON.parse(JSON.stringify(h)),
    id: h._id.toString()
  }))
}

export async function addHomework(formData: FormData) {
  const auth = await authorizePermission("student.edit")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  const rawData = {
    studentId: formData.get("studentId")?.toString(),
    subjectId: formData.get("subjectId")?.toString(),
    title: formData.get("title")?.toString(),
    status: formData.get("status")?.toString(),
    dateAssigned: formData.get("dateAssigned")?.toString(),
    dateDue: formData.get("dateDue")?.toString(),
    remarks: formData.get("remarks")?.toString(),
  }

  const validated = HomeworkSchema.safeParse(rawData)
  if (!validated.success) {
    return {
      error: "Validation Failed",
      fieldErrors: validated.error.flatten().fieldErrors
    }
  }

  await connectToDatabase()

  const newHomework = {
    schoolId: auth.context.schoolId,
    ...validated.data
  }

  await HomeworkModel.create(newHomework)
  revalidatePath(`/dashboard/students/${validated.data.studentId}`)
  return { success: true }
}

export async function deleteHomework(id: string, studentId: string) {
  const auth = await authorizePermission("student.edit")
  if (!auth.allowed || !auth.context.schoolId) return

  await connectToDatabase()
  await HomeworkModel.findOneAndDelete({ _id: id, schoolId: auth.context.schoolId })
  revalidatePath(`/dashboard/students/${studentId}`)
}
