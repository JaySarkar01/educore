import mongoose, { Schema, Document } from "mongoose";

export interface IHostelRoom extends Document {
  schoolId: string;
  block: string;
  roomType: string;
  monthlyFee: number;
  totalRooms: number;
  createdAt: Date;
  updatedAt: Date;
}

const HostelRoomSchema = new Schema({
  schoolId: { type: String, required: true, index: true },
  block: { type: String, required: true },
  roomType: { type: String, required: true },
  monthlyFee: { type: Number, required: true, min: 0 },
  totalRooms: { type: Number, required: true, min: 0 }
}, { timestamps: true });

export const HostelRoomModel = mongoose.models.HostelRoom || mongoose.model<IHostelRoom>("HostelRoom", HostelRoomSchema);
