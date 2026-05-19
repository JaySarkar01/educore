import mongoose, { Schema, Document, Model } from "mongoose"

export interface IVendor extends Document {
  schoolId: string
  companyName: string
  contactPerson: string
  phone: string
  email: string
  category: string
  address: string
  createdAt: Date
  updatedAt: Date
}

const VendorSchema = new Schema<IVendor>({
  schoolId: { type: String, required: true },
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  category: { type: String, required: true },
  address: { type: String },
}, { timestamps: true })

VendorSchema.index({ schoolId: 1, companyName: 1 })

export const VendorModel: Model<IVendor> = mongoose.models.Vendor || mongoose.model<IVendor>("Vendor", VendorSchema)