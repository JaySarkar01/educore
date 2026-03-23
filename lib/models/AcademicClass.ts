import mongoose, { Schema, Document } from "mongoose";

export interface IAcademicClass extends Document {
  schoolId: string;
  className: string; // e.g. "10th", "Grade 1"
  sections: string[]; // e.g. ["A", "B", "C"]
  classTeacherId?: string; // Mongoose mapping pointing to Faculty schema
}

const AcademicClassSchema = new Schema({
  schoolId: { type: String, required: true, index: true },
  className: { type: String, required: true },
  sections: { type: [String], default: [] },
  classTeacherId: { type: String }
}, { timestamps: true });

AcademicClassSchema.index({ schoolId: 1, className: 1 }, { unique: true });

export const AcademicClassModel = mongoose.models.AcademicClass || mongoose.model<IAcademicClass>("AcademicClass", AcademicClassSchema);
