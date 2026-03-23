"use server"

import { connectToDatabase } from "@/lib/db"
import { SchoolModel } from "@/lib/models/School"
import { revalidatePath } from "next/cache"
import { createSession, deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"

// ── Helpers ──────────────────────────────────────────────────────────────────

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateRegistration(data: Record<string, string>) {
  if (!data.schoolName.trim())
    return "School name is required."
  if (!data.schoolEmail.trim() || !isValidEmail(data.schoolEmail))
    return "A valid school email is required."
  if (!/^\d{10}$/.test(data.phone))
    return "Phone number must be exactly 10 digits (numbers only)."
  if (!data.city.trim())
    return "City is required."
  if (data.zip && !/^\d{6}$/.test(data.zip))
    return "ZIP code must be exactly 6 digits."
  if (!data.adminName.trim())
    return "Administrator full name is required."
  if (!data.adminEmail.trim() || !isValidEmail(data.adminEmail))
    return "A valid administrator email is required."
  if (data.password.length < 8)
    return "Password must be at least 8 characters."
  if (data.password !== data.confirmPassword)
    return "Passwords do not match."
  return null
}

// ── Actions ───────────────────────────────────────────────────────────────────

export async function registerSchool(formData: FormData) {
  const data = {
    schoolName:      formData.get("schoolName")?.toString()      ?? "",
    schoolEmail:     formData.get("schoolEmail")?.toString()     ?? "",
    phone:           formData.get("phone")?.toString()           ?? "",
    address:         formData.get("address")?.toString()         ?? "",
    city:            formData.get("city")?.toString()            ?? "",
    state:           formData.get("state")?.toString()           ?? "",
    zip:             formData.get("zip")?.toString()             ?? "",
    adminName:       formData.get("adminName")?.toString()       ?? "",
    adminEmail:      formData.get("adminEmail")?.toString()      ?? "",
    password:        formData.get("password")?.toString()        ?? "",
    confirmPassword: formData.get("confirmPassword")?.toString() ?? "",
    message:         formData.get("message")?.toString()         ?? "",
  }

  const validationError = validateRegistration(data)
  if (validationError) return { error: validationError }

  await connectToDatabase()

  const existingSchool = await SchoolModel.findOne({ adminEmail: data.adminEmail })
  if (existingSchool) {
    return { error: "An account with this administrator email already exists." }
  }

  await SchoolModel.create({
    schoolName:  data.schoolName,
    schoolEmail: data.schoolEmail,
    phone:       data.phone,
    address:     data.address,
    city:        data.city,
    state:       data.state,
    zip:         data.zip,
    adminName:   data.adminName,
    adminEmail:  data.adminEmail,
    password:    data.password,
    message:     data.message,
    status:      "Pending",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  })

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
    zip: s.zip,
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
    if (school.status === "Pending")  return { error: "Your account is still pending approval." }
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
