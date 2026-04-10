"use server"

import { connectToDatabase } from "@/lib/db"
import { SchoolModel } from "@/lib/models/School"
import { UserModel } from "@/lib/models/User"
import { RoleModel } from "@/lib/models/Role"
import { revalidatePath } from "next/cache"
import { createSession, deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { ensureRBACSeeded } from "@/lib/rbac-seed"
import { ROLE_PERMISSIONS, normalizeRoleName, ROLE_LABELS } from "@/lib/rbac"
import { authorizePermission, getAuthContext } from "@/lib/auth"

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
  await ensureRBACSeeded()

  const existingSchool = await SchoolModel.findOne({ adminEmail: data.adminEmail })
  if (existingSchool) {
    return { error: "An account with this administrator email already exists." }
  }

  const hashedPassword = await bcrypt.hash(data.password, 12)

  const school = await SchoolModel.create({
    schoolName:  data.schoolName,
    schoolEmail: data.schoolEmail,
    phone:       data.phone,
    address:     data.address,
    city:        data.city,
    state:       data.state,
    zip:         data.zip,
    adminName:   data.adminName,
    adminEmail:  data.adminEmail,
    password:    hashedPassword,
    message:     data.message,
    status:      "Pending",
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  })

  const schoolAdminRole = await RoleModel.findOne({ name: "SCHOOL_ADMIN" }).lean()
  if (schoolAdminRole) {
    await UserModel.updateOne(
      { email: data.adminEmail },
      {
        $set: {
          schoolId: school._id.toString(),
          fullName: data.adminName,
          email: data.adminEmail,
          password: hashedPassword,
          roleId: schoolAdminRole._id,
          roleCode: "SCHOOL_ADMIN",
          isActive: true,
          mustChangePassword: false,
        },
      },
      { upsert: true }
    )
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function approveSchool(id: string, formData?: FormData) {
  const auth = await authorizePermission("school.approve")
  if (!auth.allowed) return

  await connectToDatabase()
  await SchoolModel.findByIdAndUpdate(id, { status: "Approved" })
  revalidatePath('/admin')
}

export async function rejectSchool(id: string, formData?: FormData) {
  const auth = await authorizePermission("school.approve")
  if (!auth.allowed) return

  await connectToDatabase()
  await SchoolModel.findByIdAndUpdate(id, { status: "Rejected" })
  revalidatePath('/admin')
}

export async function getSchools() {
  const auth = await authorizePermission("school.view")
  if (!auth.allowed) return []

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
  await ensureRBACSeeded()

  if (email === "superadmin@educore.com" && pass === "admin") {
    const roleName = "SUPER_ADMIN"
    const permissions = ROLE_PERMISSIONS[roleName]
    await createSession({ role: roleName, permissions, email })
    return { role: roleName, permissions }
  }

  await connectToDatabase()

  const user = await UserModel.findOne({ email }).populate("roleId")
  if (user) {
    if (!user.isActive) return { error: "Your account is inactive." }

    const passwordMatch = await bcrypt.compare(pass, user.password)
    if (!passwordMatch) return { error: "Invalid credentials." }

    const populatedRole = user.roleId as any
    const rawRoleName = populatedRole?.name || user.roleCode
    if (rawRoleName === "PARENT") {
      return { error: "Parent login has been disabled. Please contact school administration." }
    }

    const roleName = normalizeRoleName(populatedRole?.name || user.roleCode)
    const permissions = populatedRole?.permissions?.length
      ? populatedRole.permissions
      : ROLE_PERMISSIONS[roleName]

    await createSession({
      role: roleName,
      schoolId: user.schoolId || undefined,
      userId: user._id.toString(),
      roleId: populatedRole?._id?.toString(),
      permissions,
      email,
      mustChangePassword: !!user.mustChangePassword,
    })

    return {
      role: roleName,
      schoolId: user.schoolId || undefined,
      permissions,
      mustChangePassword: !!user.mustChangePassword,
    }
  }

  const school = await SchoolModel.findOne({ adminEmail: email })
  if (school) {
    const passwordMatch = await bcrypt.compare(pass, school.password)
    if (!passwordMatch) return { error: "Invalid credentials." }

    if (school.status === "Pending")  return { error: "Your account is still pending approval." }
    if (school.status === "Rejected") return { error: "Your account registration was rejected." }

    const roleName = "SCHOOL_ADMIN"
    const permissions = ROLE_PERMISSIONS[roleName]

    const schoolAdminRole = await RoleModel.findOne({ name: roleName }).lean()

    await createSession({
      role: roleName,
      schoolId: school._id.toString(),
      roleId: schoolAdminRole?._id?.toString(),
      permissions,
      email,
    })

    return { role: roleName, schoolId: school._id.toString(), schoolName: school.schoolName, permissions }
  }
  return { error: "Invalid credentials." }
}

export async function logout() {
  await deleteSession()
  redirect('/')
}

export async function getSchoolProfile() {
  const context = await getAuthContext()
  const session = context?.session

  if (!session) return null

  if (!session.schoolId) {
    return {
      schoolName: "EduCore",
      adminName: session.email || "System",
      phone: "0000000000",
      address: "System HQ",
      city: "Cloud",
      role: context?.roleName || "SUPER_ADMIN",
      roleLabel: ROLE_LABELS[context?.roleName || "SUPER_ADMIN"],
      permissions: context?.permissions || [],
    }
  }

  await connectToDatabase()
  const school = await SchoolModel.findById(session.schoolId).lean()
  if (!school) return null

  const role = context?.roleName || normalizeRoleName(session.role)

  // Determine a friendly display name for the current user (prefer fullName from UserModel)
  let displayName = session.email || school.adminName || "User"
  try {
    if (session.userId) {
      const user = await UserModel.findById(session.userId).select("fullName").lean()
      if (user && (user as any).fullName) displayName = (user as any).fullName
    }
  } catch (e) {
    // ignore lookup errors and fallback to existing values
  }

  return {
    schoolName: school.schoolName,
    adminName: displayName,
    phone: school.phone,
    address: school.address,
    city: school.city,
    role,
    roleLabel: ROLE_LABELS[role],
    permissions: context?.permissions || ROLE_PERMISSIONS[role],
  }
}
