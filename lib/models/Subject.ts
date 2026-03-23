import mongoose, { Schema, Document } from "mongoose";

export interface ISubject extends Document {
  schoolId: string;
  subjectName: string;
  subjectCode: string;
  type: 'Theory' | 'Practical' | 'Both';
}

const SubjectSchema = new Schema({
  schoolId: { type: String, required: true, index: true },
  subjectName: { type: String, required: true },
  subjectCode: { type: String, required: true },
  type: { type: String, enum: ['Theory', 'Practical', 'Both'], default: 'Theory' }
}, { timestamps: true });

SubjectSchema.index({ schoolId: 1, subjectCode: 1 }, { unique: true });

export const SubjectModel = mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);
