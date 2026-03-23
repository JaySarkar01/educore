"use server"

import { connectToDatabase } from "@/lib/db"
import { SchoolModel } from "@/lib/models/School"
import { revalidatePath } from "next/cache"
import { createSession, deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"

export async function registerSchool(formData: FormData) {
  await connectToDatabase()
  
  const emailStr = formData.get("adminEmail")?.toString() || ""
  const passwordStr = formData.get("password")?.toString() || ""

  const existingSchool = await SchoolModel.findOne({ adminEmail: emailStr })
  if (existingSchool) {
    return { error: "An account with this administrator email already exists." }
  }

  const newSchool = {
    schoolName: formData.get("schoolName")?.toString() || "",
    schoolEmail: formData.get("schoolEmail")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
    address: formData.get("address")?.toString() || "",
    city: formData.get("city")?.toString() || "",
    state: formData.get("state")?.toString() || "",
    country: formData.get("country")?.toString() || "",
    adminName: formData.get("adminName")?.toString() || "",
    adminEmail: emailStr,
    password: passwordStr,
    message: formData.get("message")?.toString() || "",
    status: "Pending",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }
  
  await SchoolModel.create(newSchool)
  revalidatePath('/admin')
  
  return { success: true }
}

export async function approveSchool(id: string, formData?: FormData) {
  await connectToDatabase()
  await SchoolModel.findByIdAndUpdate(id, { status: "Approved" })
  revalidatePath('/admin')
}

export async function rejectSchool(id: string, formData?: FormData) {
  await connectToDatabase()
  await SchoolModel.findByIdAndUpdate(id, { status: "Rejected" })
  revalidatePath('/admin')
}

export async function getSchools() {
  await connectToDatabase()
  const schools = await SchoolModel.find().sort({ _id: -1 }).lean()
  return schools.map((s: any) => ({
    id: s._id.toString(),
    schoolName: s.schoolName,
    schoolEmail: s.schoolEmail,
    phone: s.phone,
    address: s.address,
    city: s.city,
    state: s.state,
    country: s.country,
    adminName: s.adminName,
    adminEmail: s.adminEmail,
    message: s.message,
    status: s.status,
    date: s.date,
  }))
}

export async function authenticate(email: string, pass: string) {
  if (email === "superadmin@educore.com" && pass === "admin") {
    await createSession("ADMIN")
    return { role: "ADMIN" }
  }
  await connectToDatabase()
  const school = await SchoolModel.findOne({ adminEmail: email, password: pass })
  if (school) {
    if (school.status === "Pending") return { error: "Your account is still pending approval." }
    if (school.status === "Rejected") return { error: "Your account registration was rejected." }
    
    await createSession("SCHOOL", school._id.toString())
    return { role: "SCHOOL", schoolId: school._id.toString(), schoolName: school.schoolName }
  }
  return { error: "Invalid credentials." }
}

export async function logout() {
  await deleteSession()
  redirect('/')
}

export async function getSchoolProfile() {
  const { cookies } = await import('next/headers')
  const { decrypt } = await import('@/lib/session')
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = await decrypt(cookie)

  if (!session || !session.schoolId) return null

  await connectToDatabase()
  const school = await SchoolModel.findById(session.schoolId).lean()
  if (!school) return null

  return {
    schoolName: school.schoolName,
    adminName: school.adminName,
    role: session.role
  }
}
