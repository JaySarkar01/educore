import mongoose, { Document, Schema, Types } from "mongoose"

export interface IUser extends Document {
  schoolId?: string
  fullName: string
  email: string
  password: string
  roleId: Types.ObjectId
  roleCode: string
  isActive: boolean
  linkedTeacherId?: string
  linkedStudentId?: string
  mustChangePassword: boolean
  resetPasswordTokenHash?: string
  resetPasswordTokenExpiresAt?: Date | null
  passwordChangedAt?: Date | null
}

const UserSchema = new Schema<IUser>(
  {
    schoolId: { type: String, index: true, default: null },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true, index: true },
    roleCode: { type: String, required: true, index: true },
    isActive: { type: Boolean, default: true },
    linkedTeacherId: { type: String, default: "" },
    linkedStudentId: { type: String, default: "" },
    mustChangePassword: { type: Boolean, default: false },
    resetPasswordTokenHash: { type: String, default: "" },
    resetPasswordTokenExpiresAt: { type: Date, default: null },
    passwordChangedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

export const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
