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
  signatureLabel: string;
  principalSignature: string;
  schoolStamp: string;          // Cloudinary URL of the school stamp/seal image
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
  principalSignature: { type: String, default: "" },
  schoolStamp:        { type: String, default: "" },
}, { timestamps: true });

// In Next.js dev mode, hot-reload re-evaluates modules but mongoose.models persists in
// memory across reloads (because the DB connection is global). We must delete the stale
// cached model so schema additions are always reflected without a server restart.
if (mongoose.models["IDCardTemplate"]) {
  delete (mongoose.models as any)["IDCardTemplate"];
}

export const IDCardTemplateModel = mongoose.model<IIDCardTemplate>("IDCardTemplate", IDCardTemplateSchema);
