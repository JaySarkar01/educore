"use server"

import { connectToDatabase } from "@/lib/db"
import { StudentModel } from "@/lib/models/Student"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const StudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  admissionNo: z.string().optional(),
  className: z.string().min(1, "Class is required"),
  section: z.string().min(1, "Section is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phone: z.string().regex(/^\d{10}$/, "Invalid phone number (exactly 10 digits)"),
  address: z.string().min(5, "Address must be descriptive"),
  pincode: z.string().regex(/^\d{5,6}$/, "Invalid pincode"),
  parentName: z.string().min(2, "Parent name is required"),
  parentPhone: z.string().regex(/^\d{10}$/, "Invalid Parent phone number (exactly 10 digits)"),
})

async function getSession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  return await decrypt(cookie)
}

export async function getStudents(querySearch?: string, classFilter?: string) {
  const session = await getSession()
  if (!session || !session.schoolId) return []
  
  await connectToDatabase()
  
  const query: any = { schoolId: session.schoolId }
  if (querySearch) {
    // Search by name or admission number broadly
    query.$or = [
      { name: { $regex: querySearch, $options: 'i' } },
      { admissionNo: { $regex: querySearch, $options: 'i' } },
      { parentPhone: { $regex: querySearch, $options: 'i' } }
    ]
  }
  if (classFilter) {
    query.className = classFilter
  }

  const students = await StudentModel.find(query).sort({ _id: -1 }).lean()
  return students.map((s: any) => ({
    ...JSON.parse(JSON.stringify(s)),
    id: s._id.toString()
  }))
}

export async function getStudentById(id: string) {
  if (!id || id === 'undefined' || id.length !== 24) return null
  
  const session = await getSession()
  if (!session || !session.schoolId) return null
  
  await connectToDatabase()
  try {
    const student = await StudentModel.findOne({ _id: id, schoolId: session.schoolId }).lean()
    if (!student) return null
    return {
      ...JSON.parse(JSON.stringify(student)),
      id: student._id.toString()
    }
  } catch (e) {
    return null
  }
}

export async function addStudent(formData: FormData) {
  const session = await getSession()
  if (!session || !session.schoolId) return { error: "Not authorized" }

  const rawData = {
    name: formData.get("name")?.toString(),
    admissionNo: formData.get("admissionNo")?.toString(),
    className: formData.get("className")?.toString()?.replace(/^Class\s+/i, ""),
    section: formData.get("section")?.toString(),
    gender: formData.get("gender")?.toString(),
    dateOfBirth: formData.get("dateOfBirth")?.toString(),
    phone: formData.get("phone")?.toString(),
    address: formData.get("address")?.toString(),
    pincode: formData.get("pincode")?.toString(),
    parentName: formData.get("parentName")?.toString(),
    parentPhone: formData.get("parentPhone")?.toString(),
  }

  const validated = StudentSchema.safeParse(rawData)
  if (!validated.success) {
    return { 
      error: "Validation Failed", 
      fieldErrors: validated.error.flatten().fieldErrors 
    }
  }

  await connectToDatabase()
  
  const { className } = validated.data
  
  // Auto-assign roll number
  const classStudents = await StudentModel.find({ schoolId: session.schoolId, className }).lean()
  let maxRoll = 0
  for (const stu of classStudents) {
    const r = parseInt(stu.rollNumber, 10)
    if (!isNaN(r) && r > maxRoll) {
      maxRoll = r
    }
  }
  const assignedRoll = (maxRoll + 1).toString()

  const getString = (key: string) => formData.get(key)?.toString() || ""

  const newStudent = {
    schoolId: session.schoolId,
    ...validated.data,
    admissionNo: validated.data.admissionNo || `ADM${Date.now().toString().slice(-6)}`,
    rollNumber: assignedRoll,
    motherName: getString("motherName"),
    motherPhone: getString("motherPhone"),
    emergencyContact: getString("emergencyContact"),
    admissionDate: getString("admissionDate") || new Date().toISOString().split('T')[0],
    medicalNotes: getString("medicalNotes"),
    transportRoute: getString("transportRoute"),
    hostelRoom: getString("hostelRoom"),
    previousSchool: getString("previousSchool"),
    status: getString("status") || "Active",
    timeline: [
      {
        title: "Admission Created",
        description: `Student successfully onboarded to ${className}.`,
        date: new Date()
      }
    ]
  }

  await StudentModel.create(newStudent)
  revalidatePath('/dashboard/students')
  return { success: true }
}

export async function deleteStudent(id: string, formData?: FormData) {
  const session = await getSession()
  if (!session || !session.schoolId) return;
  
  await connectToDatabase()
  await StudentModel.findByIdAndDelete(id)
  revalidatePath('/dashboard/students')
}

export async function addTimelineEvent(studentId: string, title: string, description: string) {
  const session = await getSession()
  if (!session || !session.schoolId) return;
  
  await connectToDatabase()
  await StudentModel.findOneAndUpdate(
    { _id: studentId, schoolId: session.schoolId },
    { $push: { timeline: { title, description, date: new Date() } } }
  )
  revalidatePath(`/dashboard/students/${studentId}`)
}
