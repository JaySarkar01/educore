import mongoose, { Schema, Document } from "mongoose";

export interface ITransportRoute extends Document {
  schoolId: string;
  routeName: string;
  monthlyFee: number;
  capacity: number;
  vehicleReg: string;
  driverName: string;
  stops: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransportRouteSchema = new Schema({
  schoolId: { type: String, required: true, index: true },
  routeName: { type: String, required: true },
  monthlyFee: { type: Number, required: true, min: 0 },
  capacity: { type: Number, required: true, min: 0 },
  vehicleReg: { type: String },
  driverName: { type: String },
  stops: { type: String }
}, { timestamps: true });

export const TransportRouteModel = mongoose.models.TransportRoute || mongoose.model<ITransportRoute>("TransportRoute", TransportRouteSchema);
