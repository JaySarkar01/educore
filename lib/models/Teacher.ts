import mongoose, { Schema, Document } from "mongoose";

export interface ITeacher extends Document {
  schoolId: string;
  name: string;
  employeeId: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  qualification: string;
  experience: number;
  joiningDate: string;
  department: string;
  subjects: string[];
  baseSalary: number;
  photo: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Resigned';
  timeline: { title: string; date: Date; description?: string }[];
}

const TeacherSchema = new Schema({
  schoolId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  employeeId: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  dateOfBirth: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  address: { type: String, default: "" },
  qualification: { type: String, default: "" },
  experience: { type: Number, default: 0 },
  joiningDate: { type: String, required: true },
  department: { type: String, default: "" },
  subjects: { type: [String], default: [] },
  baseSalary: { type: Number, default: 0 },
  photo: { type: String, default: "" },
  status: { type: String, enum: ['Active', 'Inactive', 'On Leave', 'Resigned'], default: 'Active' },
  timeline: [{
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    description: String,
  }]
}, { timestamps: true });

export const TeacherModel = mongoose.models.Teacher || mongoose.model<ITeacher>("Teacher", TeacherSchema);
