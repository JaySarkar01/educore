import { connectToDatabase } from "@/lib/db"
import { AuditLogModel } from "@/lib/models/AuditLog"
import { AuthContext } from "@/lib/auth"

type AuditInput = {
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, unknown>
  status?: "SUCCESS" | "FAILED"
}

export async function logAudit(context: AuthContext, input: AuditInput) {
  await connectToDatabase()

  await AuditLogModel.create({
    schoolId: context.schoolId,
    actorUserId: context.userId,
    actorRole: context.roleName,
    action: input.action,
    resource: input.resource,
    resourceId: input.resourceId,
    details: input.details || {},
    status: input.status || "SUCCESS",
  })
}
