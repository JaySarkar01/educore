import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  schoolId: string;
  name: string;
  admissionNo: string;
  className: string;
  section: string;
  rollNumber: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  
  phone: string;
  address: string;
  pincode: string;
  
  parentName: string;
  parentPhone: string;
  motherName: string;
  motherPhone: string;
  emergencyContact: string;

  admissionDate: string;
  medicalNotes: string;
  transportRoute: string;
  hostelRoom: string;
  previousSchool: string;
  photo: string;
  
  status: 'Active' | 'Inactive' | 'Passed' | 'Left';
  
  timeline: { title: string; date: Date; description?: string }[];
}

const StudentSchema: Schema = new Schema({
  schoolId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  admissionNo: { type: String, required: true },
  className: { type: String, required: true },
  section: { type: String, default: "" },
  rollNumber: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  dateOfBirth: { type: String, default: "" },
  
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  pincode: { type: String, default: "" },
  
  parentName: { type: String, required: true },
  parentPhone: { type: String, required: true },
  motherName: { type: String, default: "" },
  motherPhone: { type: String, default: "" },
  emergencyContact: { type: String, default: "" },

  admissionDate: { type: String, required: true },
  medicalNotes: { type: String, default: "" },
  transportRoute: { type: String, default: "" },
  hostelRoom: { type: String, default: "" },
  previousSchool: { type: String, default: "" },
  photo: { type: String, default: "" },

  status: { type: String, enum: ['Active', 'Inactive', 'Passed', 'Left'], default: 'Active' },
  
  timeline: [{
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    description: String,
  }]
}, { timestamps: true });

export const StudentModel = mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);
