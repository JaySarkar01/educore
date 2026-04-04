import mongoose, { Schema, Document } from "mongoose";

export interface IExamResult extends Document {
  schoolId: string;
  studentId: string;
  subjectId: string;
  examName: string; // e.g., "Midterm", "Final"
  marksObtained: number;
  maxMarks: number;
  date: string; // YYYY-MM-DD
  remarks?: string;
}

const ExamResultSchema = new Schema({
  schoolId: { type: String, required: true, index: true },
  studentId: { type: String, required: true, index: true },
  subjectId: { type: String, required: true },
  examName: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  maxMarks: { type: Number, required: true },
  date: { type: String, required: true },
  remarks: { type: String, default: "" }
}, { timestamps: true });

export const ExamResultModel = mongoose.models.ExamResult || mongoose.model<IExamResult>("ExamResult", ExamResultSchema);
