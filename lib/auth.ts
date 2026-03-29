import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { RoleModel } from "@/lib/models/Role"
import { UserModel } from "@/lib/models/User"
import { hasPermission, normalizeRoleName, ROLE_PERMISSIONS, RoleName } from "@/lib/rbac"
import { decrypt, SessionPayload } from "@/lib/session"

export type AuthContext = {
  session: SessionPayload
  roleName: RoleName
  permissions: string[]
  schoolId?: string
  userId?: string
  linkedTeacherId?: string
  linkedStudentId?: string
}

type PermissionAuthorized = {
  allowed: true
  context: AuthContext
}

type PermissionDenied = {
  allowed: false
  code: 401 | 403
  error: string
}

type ApiAuthorized = {
  allowed: true
  context: AuthContext
}

type ApiDenied = {
  allowed: false
  response: NextResponse
}

async function resolveContextFromSession(session: SessionPayload | null): Promise<AuthContext | null> {
  if (!session) return null

  let roleName = normalizeRoleName(session.role)
  let permissions = session.permissions?.length
    ? session.permissions
    : [...ROLE_PERMISSIONS[roleName]]

  let linkedTeacherId = ""
  let linkedStudentId = ""

  if (session.roleId || session.userId) {
    await connectToDatabase()
    const role = session.roleId ? await RoleModel.findById(session.roleId).lean() : null
    if (role) {
      roleName = normalizeRoleName((role as any).name)
      permissions = (role as any).permissions || permissions
    }

    if (session.userId) {
      const user = await UserModel.findById(session.userId)
        .select("linkedTeacherId linkedStudentId schoolId")
        .lean()

      if (user) {
        linkedTeacherId = (user as any).linkedTeacherId || ""
        linkedStudentId = (user as any).linkedStudentId || ""
      }
    }
  }

  return {
    session,
    roleName,
    permissions,
    schoolId: session.schoolId,
    userId: session.userId,
    linkedTeacherId,
    linkedStudentId,
  }
}

export async function getAuthContext() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  const session = await decrypt(token)
  return resolveContextFromSession(session)
}

export async function getAuthContextFromToken(token?: string) {
  const session = await decrypt(token)
  return resolveContextFromSession(session)
}

export async function authorizePermission(permission: string): Promise<PermissionAuthorized | PermissionDenied> {
  const context = await getAuthContext()
  if (!context) {
    return { allowed: false, code: 401, error: "Unauthorized" }
  }

  if (!hasPermission(context.permissions, permission)) {
    return { allowed: false, code: 403, error: "Forbidden" }
  }

  return { allowed: true, context }
}

export async function authorizeApiRequest(req: NextRequest, permission: string): Promise<ApiAuthorized | ApiDenied> {
  const token = req.cookies.get("session")?.value
  const context = await getAuthContextFromToken(token)

  if (!context) {
    return {
      allowed: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  if (!hasPermission(context.permissions, permission)) {
    return {
      allowed: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }

  return { allowed: true, context }
}
