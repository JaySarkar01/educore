import mongoose, { Document, Schema } from "mongoose"

export interface IPermission extends Document {
  key: string
  module: string
  action: string
  description?: string
}

const PermissionSchema = new Schema<IPermission>(
  {
    key: { type: String, required: true, unique: true, index: true },
    module: { type: String, required: true, index: true },
    action: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
)

export const PermissionModel =
  mongoose.models.Permission || mongoose.model<IPermission>("Permission", PermissionSchema)
