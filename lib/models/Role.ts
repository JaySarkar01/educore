import mongoose, { Document, Schema } from "mongoose"

export interface IRole extends Document {
  name: string
  displayName: string
  permissions: string[]
  isSystem: boolean
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true },
    permissions: { type: [String], default: [] },
    isSystem: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const RoleModel = mongoose.models.Role || mongoose.model<IRole>("Role", RoleSchema)
