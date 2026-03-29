"use server"

import crypto from "crypto"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/lib/db"
import { UserModel } from "@/lib/models/User"
import { getAuthContext } from "@/lib/auth"
import { createSession } from "@/lib/session"
import { normalizeRoleName } from "@/lib/rbac"

function hashToken(token: string) {
  const normalized = (token || "").trim().replace(/\s+/g, "").toLowerCase()
  return crypto.createHash("sha256").update(normalized).digest("hex")
}

function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function toPlainPermissions(input: any): string[] {
  if (!input) return []
  if (!Array.isArray(input)) return []
  return input.map((p: any) => String(p))
}

export async function requestPasswordReset(email: string) {
  await connectToDatabase()

  const normalizedEmail = (email || "").trim().toLowerCase()
  if (!normalizedEmail) return { success: true as const }

  const user = await UserModel.findOne({
    email: { $regex: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i") },
  })
  if (!user) return { success: true as const }

  const rawToken = crypto.randomBytes(24).toString("hex")
  const tokenHash = hashToken(rawToken)
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

  user.resetPasswordTokenHash = tokenHash
  user.resetPasswordTokenExpiresAt = expiresAt
  await user.save()

  return {
    success: true as const,
    resetToken: rawToken,
    expiresAt: expiresAt.toISOString(),
  }
}

export async function resetPasswordWithToken(formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase() || ""
  const token = formData.get("token")?.toString().trim() || ""
  const newPassword = formData.get("newPassword")?.toString() || ""
  const confirmPassword = formData.get("confirmPassword")?.toString() || ""

  if (!email || !token || !newPassword || !confirmPassword) {
    return { error: "All fields are required." }
  }
  if (newPassword.length < 8) return { error: "Password must be at least 8 characters." }
  if (newPassword !== confirmPassword) return { error: "Passwords do not match." }

  await connectToDatabase()

  const tokenHash = hashToken(token)
  const user = await UserModel.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordTokenExpiresAt: { $gt: new Date() },
  }).populate("roleId")

  if (!user) return { error: "Invalid or expired reset token." }

  if ((user.email || "").trim().toLowerCase() !== email) {
    return { error: "Invalid token for this email." }
  }

  user.password = await bcrypt.hash(newPassword, 12)
  user.mustChangePassword = false
  user.resetPasswordTokenHash = ""
  user.resetPasswordTokenExpiresAt = null
  user.passwordChangedAt = new Date()
  await user.save()

  const role = user.roleId as any
  const roleName = normalizeRoleName(role?.name || user.roleCode)

  await createSession({
    role: roleName,
    schoolId: user.schoolId || undefined,
    userId: user._id.toString(),
    roleId: role?._id?.toString(),
    permissions: toPlainPermissions(role?.permissions),
    email: user.email,
    mustChangePassword: false,
  })

  return { success: true }
}

export async function changePasswordAfterFirstLogin(formData: FormData) {
  const context = await getAuthContext()
  if (!context?.session?.userId) return { error: "Not authorized" }

  const currentPassword = formData.get("currentPassword")?.toString() || ""
  const newPassword = formData.get("newPassword")?.toString() || ""
  const confirmPassword = formData.get("confirmPassword")?.toString() || ""

  if (!newPassword || !confirmPassword) return { error: "Password fields are required." }
  if (newPassword.length < 8) return { error: "Password must be at least 8 characters." }
  if (newPassword !== confirmPassword) return { error: "Passwords do not match." }

  await connectToDatabase()

  const user = await UserModel.findById(context.session.userId).populate("roleId")
  if (!user) return { error: "User not found." }

  if (user.mustChangePassword) {
    if (!currentPassword) return { error: "Current password is required." }
    const isCurrentValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentValid) return { error: "Current password is incorrect." }
  }

  user.password = await bcrypt.hash(newPassword, 12)
  user.mustChangePassword = false
  user.passwordChangedAt = new Date()
  await user.save()

  const role = user.roleId as any
  const roleName = normalizeRoleName(role?.name || user.roleCode)

  await createSession({
    role: roleName,
    schoolId: user.schoolId || undefined,
    userId: user._id.toString(),
    roleId: role?._id?.toString(),
    permissions: toPlainPermissions(role?.permissions?.length ? role.permissions : context.permissions),
    email: user.email,
    mustChangePassword: false,
  })

  revalidatePath("/dashboard")
  return { success: true }
}
