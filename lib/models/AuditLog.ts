import mongoose, { Document, Schema } from "mongoose"

export interface IAuditLog extends Document {
  schoolId?: string
  actorUserId?: string
  actorRole: string
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, unknown>
  status: "SUCCESS" | "FAILED"
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    schoolId: { type: String, index: true, default: null },
    actorUserId: { type: String, default: "" },
    actorRole: { type: String, required: true, index: true },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true, index: true },
    resourceId: { type: String, default: "" },
    details: { type: Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ["SUCCESS", "FAILED"], default: "SUCCESS" },
  },
  { timestamps: true }
)

export const AuditLogModel =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema)
