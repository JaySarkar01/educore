import mongoose, { Schema, Document } from "mongoose";

export interface IIDCard extends Document {
  schoolId: string;
  studentId: string;
  idCardNumber: string;       // e.g. "IDC-2024-0001"
  academicYear: string;       // e.g. "2024-25", derived from admission year
  status: "Generated" | "Not Generated" | "Expired";
  generatedAt: Date | null;
  validUntil: string;         // e.g. "31 March 2026"
  templateVersion: number;
}

const IDCardSchema: Schema = new Schema({
  schoolId:        { type: String, required: true, index: true },
  studentId:       { type: String, required: true, index: true },
  idCardNumber:    { type: String, default: "" },
  academicYear:    { type: String, default: "" },
  status:          { type: String, enum: ["Generated", "Not Generated", "Expired"], default: "Not Generated" },
  generatedAt:     { type: Date, default: null },
  validUntil:      { type: String, default: "" },
  templateVersion: { type: Number, default: 1 },
}, { timestamps: true });

IDCardSchema.index({ schoolId: 1, studentId: 1 }, { unique: true });
IDCardSchema.index({ schoolId: 1, idCardNumber: 1 });

export const IDCardModel = mongoose.models.IDCard || mongoose.model<IIDCard>("IDCard", IDCardSchema);
