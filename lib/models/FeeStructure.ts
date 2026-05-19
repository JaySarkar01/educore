import mongoose, { Schema, Document } from "mongoose";

export interface IFeeStructure extends Document {
  schoolId: string;
  name: string; // e.g. "Tuition Fee"
  amount: number;
  frequency: "Monthly" | "Quarterly" | "Half-Yearly" | "Yearly" | "Once";
  targetClass: string; // "ALL" or specific class name like "Class 1"
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeeStructureSchema = new Schema({
  schoolId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  frequency: { 
    type: String, 
    enum: ["Monthly", "Quarterly", "Half-Yearly", "Yearly", "Once"], 
    required: true 
  },
  targetClass: { type: String, required: true, default: "ALL" },
  description: String
}, { timestamps: true });

FeeStructureSchema.index({ schoolId: 1, targetClass: 1 });

export const FeeStructureModel = mongoose.models.FeeStructure || mongoose.model<IFeeStructure>("FeeStructure", FeeStructureSchema);