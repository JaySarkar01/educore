"use server"

import { connectToDatabase } from "@/lib/db"
import { AcademicClassModel } from "@/lib/models/AcademicClass"
import { SubjectModel } from "@/lib/models/Subject"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { revalidatePath } from "next/cache"

async function getSession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  return await decrypt(cookie)
}

// ---- CLASSES ----
export async function getClasses() {
  const session = await getSession()
  if (!session || !session.schoolId) return []
  await connectToDatabase()
  const classes = await AcademicClassModel.find({ schoolId: session.schoolId }).sort({ className: 1 }).lean()
  return JSON.parse(JSON.stringify(classes))
}

export async function addClass(formData: FormData) {
  const session = await getSession()
  if (!session || !session.schoolId) return { error: "Not authorized" }
  await connectToDatabase()

  const className = formData.get("className")?.toString().trim()
  const sectionsInput = formData.get("sections")?.toString() || ""
  
  if (!className) return { error: "Class name is required" }

  const sections = sectionsInput.split(',').map(s => s.trim()).filter(Boolean)

  try {
    await AcademicClassModel.create({
      schoolId: session.schoolId,
      className,
      sections
    })
    revalidatePath('/dashboard/classes/manage')
    return { success: true }
  } catch (err: any) {
    if (err.code === 11000) return { error: "Class mapping already exists" }
    return { error: "Failed to create class" }
  }
}

export async function deleteClass(id: string) {
  const session = await getSession()
  if (!session || !session.schoolId) return;
  await connectToDatabase()
  await AcademicClassModel.findOneAndDelete({ _id: id, schoolId: session.schoolId })
  revalidatePath('/dashboard/classes/manage')
}

// ---- SUBJECTS ----
export async function getSubjects() {
  const session = await getSession()
  if (!session || !session.schoolId) return []
  await connectToDatabase()
  const subjects = await SubjectModel.find({ schoolId: session.schoolId }).sort({ subjectName: 1 }).lean()
  return JSON.parse(JSON.stringify(subjects))
}

export async function addSubject(formData: FormData) {
  const session = await getSession()
  if (!session || !session.schoolId) return { error: "Not authorized" }
  await connectToDatabase()

  const subjectName = formData.get("subjectName")?.toString().trim()
  const subjectCode = formData.get("subjectCode")?.toString().trim()
  const type = formData.get("type")?.toString() || "Theory"

  if (!subjectName || !subjectCode) return { error: "Missing required fields" }

  try {
    await SubjectModel.create({
      schoolId: session.schoolId,
      subjectName,
      subjectCode,
      type
    })
    revalidatePath('/dashboard/classes/subjects')
    return { success: true }
  } catch (err: any) {
    if (err.code === 11000) return { error: "Subject Code already exists" }
    return { error: "Failed to create subject" }
  }
}

export async function deleteSubject(id: string) {
  const session = await getSession()
  if (!session || !session.schoolId) return;
  await connectToDatabase()
  await SubjectModel.findOneAndDelete({ _id: id, schoolId: session.schoolId })
  revalidatePath('/dashboard/classes/subjects')
}
