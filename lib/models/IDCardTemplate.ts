import mongoose, { Schema, Document } from "mongoose";

export interface IIDCardTemplate extends Document {
  schoolId:    string;
  schoolLogo:  string;   // Cloudinary URL
  bgColor:     string;   // e.g. "#1e40af"
  accentColor: string;   // e.g. "#3b82f6"
  orientation: "portrait" | "landscape";
  showTransportRoute: boolean;
  showBloodGroup:     boolean;
  showMotherName:     boolean;
  showAddress:        boolean;
  validityMonths:     number;   // how many months validity from generation
  footerInstructions: string;
  signatureLabel:     string;
}

const IDCardTemplateSchema: Schema = new Schema({
  schoolId:           { type: String, required: true, unique: true },
  schoolLogo:         { type: String, default: "" },
  bgColor:            { type: String, default: "#1e40af" },
  accentColor:        { type: String, default: "#3b82f6" },
  orientation:        { type: String, enum: ["portrait", "landscape"], default: "portrait" },
  showTransportRoute: { type: Boolean, default: true },
  showBloodGroup:     { type: Boolean, default: true },
  showMotherName:     { type: Boolean, default: true },
  showAddress:        { type: Boolean, default: true },
  validityMonths:     { type: Number, default: 12 },
  footerInstructions: { type: String, default: "If found, please return to the school. Thank you." },
  signatureLabel:     { type: String, default: "Principal" },
}, { timestamps: true });

export const IDCardTemplateModel = mongoose.models.IDCardTemplate || mongoose.model<IIDCardTemplate>("IDCardTemplate", IDCardTemplateSchema);
