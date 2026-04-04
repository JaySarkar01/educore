import mongoose, { Schema, Document } from "mongoose";

export interface IHomework extends Document {
  schoolId: string;
  studentId: string;
  subjectId: string;
  title: string;
  status: 'Completed' | 'Late' | 'Missing';
  dateAssigned: string; // YYYY-MM-DD
  dateDue: string; // YYYY-MM-DD
  remarks?: string;
}

const HomeworkSchema = new Schema({
  schoolId: { type: String, required: true, index: true },
  studentId: { type: String, required: true, index: true },
  subjectId: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['Completed', 'Late', 'Missing'], default: 'Completed' },
  dateAssigned: { type: String, required: true },
  dateDue: { type: String, required: true },
  remarks: { type: String, default: "" }
}, { timestamps: true });

export const HomeworkModel = mongoose.models.Homework || mongoose.model<IHomework>("Homework", HomeworkSchema);
