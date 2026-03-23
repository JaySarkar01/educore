import mongoose, { Schema, Document } from "mongoose";

export interface ISchool extends Document {
  schoolName: string;
  schoolEmail: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  adminName: string;
  adminEmail: string;
  password: string;
  message: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

const SchoolSchema: Schema = new Schema({
  schoolName: { type: String, required: true },
  schoolEmail: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^\d{10}$/.test(v),
      message: "Phone number must be exactly 10 digits.",
    },
  },
  address: { type: String, default: "" },
  city: { type: String, required: true },
  state: { type: String, default: "" },
  zip: {
    type: String,
    default: "",
    validate: {
      validator: (v: string) => v === "" || /^\d{6}$/.test(v),
      message: "ZIP code must be exactly 6 digits.",
    },
  },
  adminName: { type: String, required: true },
  adminEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  message: { type: String, default: "" },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  date: { type: String, required: true }
});

export const SchoolModel = mongoose.models.School || mongoose.model<ISchool>("School", SchoolSchema);
