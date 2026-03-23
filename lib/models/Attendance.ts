import mongoose, { Schema, Document } from "mongoose";

export interface IAttendanceRecord {
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half-Day' | 'Leave';
  remarks?: string;
}

export interface IAttendance extends Document {
  schoolId: string;
  className: string;
  section: string;
  date: string; // YYYY-MM-DD
  records: IAttendanceRecord[];
}

const AttendanceSchema = new Schema({
  schoolId: { type: String, required: true, index: true },
  className: { type: String, required: true },
  section: { type: String, default: "" },
  date: { type: String, required: true },
  records: [{
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half-Day', 'Leave'], required: true },
    remarks: String
  }]
}, { timestamps: true });

// Compound index to ensure only one attendance record per class/section per day
AttendanceSchema.index({ schoolId: 1, className: 1, section: 1, date: 1 }, { unique: true });

export const AttendanceModel = mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", AttendanceSchema);
