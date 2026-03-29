"use server"

import bcrypt from "bcryptjs"
import crypto from "crypto"
import { revalidatePath } from "next/cache"
import { authorizePermission } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import { logAudit } from "@/lib/audit"
import { UserModel } from "@/lib/models/User"
import { RoleModel } from "@/lib/models/Role"
import { TeacherModel } from "@/lib/models/Teacher"
import { StudentModel } from "@/lib/models/Student"
import { ensureRBACSeeded } from "@/lib/rbac-seed"
import { ROLE_LABELS } from "@/lib/rbac"

function hashToken(token: string) {
  const normalized = (token || "").trim().replace(/\s+/g, "").toLowerCase()
  return crypto.createHash("sha256").update(normalized).digest("hex")
}

const MANAGEABLE_ROLES = ["TEACHER", "ACCOUNTANT", "STUDENT"]

export async function getUsersForManagement() {
  const auth = await authorizePermission("user.manage")
  if (!auth.allowed || !auth.context.schoolId) return []

  await connectToDatabase()

  const users = await UserModel.find({ schoolId: auth.context.schoolId })
    .populate("roleId")
    .sort({ createdAt: -1 })
    .lean()

  return users.map((u: any) => ({
    id: u._id.toString(),
    fullName: u.fullName,
    email: u.email,
    roleCode: u.roleCode,
    roleName: u.roleId?.displayName || u.roleCode,
    isActive: u.isActive,
    linkedTeacherId: u.linkedTeacherId || "",
    linkedStudentId: u.linkedStudentId || "",
  }))
}

export async function getRoleOptions() {
  const auth = await authorizePermission("user.manage")
  if (!auth.allowed) return []

  await ensureRBACSeeded()
  await connectToDatabase()

  const roles = await RoleModel.find({ name: { $in: MANAGEABLE_ROLES } })
    .sort({ name: 1 })
    .lean()

  if (!roles.length) {
    return MANAGEABLE_ROLES.map((name) => ({
      id: name,
      name,
      displayName: ROLE_LABELS[name as keyof typeof ROLE_LABELS] || name,
    }))
  }

  return roles.map((r: any) => ({
    id: r._id.toString(),
    name: r.name,
    displayName: r.displayName,
  }))
}

export async function getTeacherOptions() {
  const auth = await authorizePermission("user.manage")
  if (!auth.allowed || !auth.context.schoolId) return []

  await ensureRBACSeeded()
  await connectToDatabase()

  const teachers = await TeacherModel.find({ schoolId: auth.context.schoolId, status: "Active" })
    .select("name employeeId email")
    .sort({ name: 1 })
    .lean()

  return teachers.map((t: any) => ({
    id: t._id.toString(),
    name: t.name,
    employeeId: t.employeeId,
    email: t.email,
  }))
}

export async function getStudentOptions() {
  const auth = await authorizePermission("user.manage")
  if (!auth.allowed || !auth.context.schoolId) return []

  await connectToDatabase()

  const students = await StudentModel.find({ schoolId: auth.context.schoolId, status: "Active" })
    .select("name className section rollNumber parentName")
    .sort({ name: 1 })
    .lean()

  return students.map((s: any) => ({
    id: s._id.toString(),
    name: s.name,
    className: s.className,
    section: s.section,
    rollNumber: s.rollNumber,
    parentName: s.parentName,
  }))
}

export async function createStaffUser(formData: FormData) {
  const auth = await authorizePermission("user.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  const fullName = formData.get("fullName")?.toString().trim() || ""
  const email = formData.get("email")?.toString().trim().toLowerCase() || ""
  const password = formData.get("password")?.toString() || ""
  const roleCode = formData.get("roleCode")?.toString() || ""
  const linkedTeacherId = formData.get("linkedTeacherId")?.toString() || ""

  if (!fullName || !email || !password) return { error: "Name, email and password are required." }
  if (password.length < 8) return { error: "Password must be at least 8 characters." }
  if (!["TEACHER", "ACCOUNTANT"].includes(roleCode)) {
    return { error: "Invalid staff role." }
  }

  await connectToDatabase()

  const role = await RoleModel.findOne({ name: roleCode }).lean()
  if (!role) return { error: "Role configuration missing." }

  const existingByEmail = await UserModel.findOne({ email })
  if (existingByEmail) return { error: "A user with this email already exists." }

  if (roleCode === "TEACHER") {
    if (!linkedTeacherId) return { error: "Please link a teacher profile for teacher login." }

    const teacher = await TeacherModel.findOne({ _id: linkedTeacherId, schoolId: auth.context.schoolId }).lean()
    if (!teacher) return { error: "Selected teacher not found." }

    const existingTeacherUser = await UserModel.findOne({
      schoolId: auth.context.schoolId,
      linkedTeacherId,
      roleCode: "TEACHER",
    })
    if (existingTeacherUser) return { error: "This teacher already has a login account." }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await UserModel.create({
    schoolId: auth.context.schoolId,
    fullName,
    email,
    password: hashedPassword,
    roleId: (role as any)._id,
    roleCode,
    isActive: true,
    mustChangePassword: true,
    linkedTeacherId: roleCode === "TEACHER" ? linkedTeacherId : "",
    linkedStudentId: "",
  })

  await logAudit(auth.context, {
    action: "user.manage",
    resource: "User",
    details: { op: "createStaffUser", roleCode, email, linkedTeacherId },
  })

  revalidatePath("/dashboard/users")
  return { success: true }
}

export async function generateUserResetToken(userId: string) {
  const auth = await authorizePermission("user.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  await connectToDatabase()

  const user = await UserModel.findOne({ _id: userId, schoolId: auth.context.schoolId })
  if (!user) return { error: "User not found" }

  const rawToken = crypto.randomBytes(24).toString("hex")
  const tokenHash = hashToken(rawToken)
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

  user.resetPasswordTokenHash = tokenHash
  user.resetPasswordTokenExpiresAt = expiresAt
  await user.save()

  await logAudit(auth.context, {
    action: "user.manage",
    resource: "User",
    resourceId: userId,
    details: { op: "generateResetToken" },
  })

  return {
    success: true,
    resetToken: rawToken,
    expiresAt: expiresAt.toISOString(),
  }
}

export async function createParentStudentUser(formData: FormData) {
  const auth = await authorizePermission("user.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  const fullName = formData.get("fullName")?.toString().trim() || ""
  const email = formData.get("email")?.toString().trim().toLowerCase() || ""
  const password = formData.get("password")?.toString() || ""
  const roleCode = formData.get("roleCode")?.toString() || ""
  const linkedStudentId = formData.get("linkedStudentId")?.toString() || ""

  if (!fullName || !email || !password || !linkedStudentId) return { error: "All fields are required." }
  if (password.length < 8) return { error: "Password must be at least 8 characters." }
  if (roleCode !== "STUDENT") return { error: "Invalid role." }

  await ensureRBACSeeded()
  await connectToDatabase()

  const role = await RoleModel.findOne({ name: roleCode }).lean()
  if (!role) return { error: "Role configuration missing." }

  const student = await StudentModel.findOne({ _id: linkedStudentId, schoolId: auth.context.schoolId }).lean()
  if (!student) return { error: "Student not found." }

  const existingByEmail = await UserModel.findOne({ email })
  if (existingByEmail) return { error: "A user with this email already exists." }

  const hashedPassword = await bcrypt.hash(password, 12)

  await UserModel.create({
    schoolId: auth.context.schoolId,
    fullName,
    email,
    password: hashedPassword,
    roleId: (role as any)._id,
    roleCode,
    isActive: true,
    mustChangePassword: true,
    linkedTeacherId: "",
    linkedStudentId,
  })

  await logAudit(auth.context, {
    action: "user.manage",
    resource: "User",
    details: { op: "createParentStudentUser", roleCode, email, linkedStudentId },
  })

  revalidatePath("/dashboard/users")
  return { success: true }
}

export async function updateUserStatus(userId: string, active: boolean) {
  const auth = await authorizePermission("user.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  await connectToDatabase()

  await UserModel.findOneAndUpdate(
    { _id: userId, schoolId: auth.context.schoolId },
    { isActive: active }
  )

  await logAudit(auth.context, {
    action: "user.manage",
    resource: "User",
    resourceId: userId,
    details: { op: "updateStatus", active },
  })

  revalidatePath("/dashboard/users")
  return { success: true }
}
