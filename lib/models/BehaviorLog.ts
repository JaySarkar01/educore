import mongoose, { Schema, Document } from "mongoose";

export interface IBehaviorLog extends Document {
  schoolId: string;
  studentId: string;
  type: 'Positive' | 'Negative' | 'Neutral';
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  reportedBy: string; // Teacher or Admin ID/Name
}

const BehaviorLogSchema = new Schema({
  schoolId: { type: String, required: true, index: true },
  studentId: { type: String, required: true, index: true },
  type: { type: String, enum: ['Positive', 'Negative', 'Neutral'], default: 'Neutral' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  reportedBy: { type: String, required: true }
}, { timestamps: true });

export const BehaviorLogModel = mongoose.models.BehaviorLog || mongoose.model<IBehaviorLog>("BehaviorLog", BehaviorLogSchema);
