import mongoose, { Schema, Document } from "mongoose";

export interface IStaffAttendanceRecord {
  employeeId: string;
  name: string;
  department: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half-Day' | 'On Leave';
  remarks?: string;
}

export interface IStaffAttendance extends Document {
  schoolId: string;
  date: string; // YYYY-MM-DD
  records: IStaffAttendanceRecord[];
}

const StaffAttendanceSchema = new Schema({
  schoolId: { type: String, required: true, index: true },
  date: { type: String, required: true },
  records: [{
    employeeId: { type: String, required: true },
    name: { type: String, required: true },
    department: { type: String, default: "" },
    status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half-Day', 'On Leave'], required: true },
    remarks: String
  }]
}, { timestamps: true });

// Compound index for unique staff attendance per day
StaffAttendanceSchema.index({ schoolId: 1, date: 1 }, { unique: true });

export const StaffAttendanceModel = mongoose.models.StaffAttendance || mongoose.model<IStaffAttendance>("StaffAttendance", StaffAttendanceSchema);
