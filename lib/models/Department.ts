import mongoose from "mongoose"

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  headOfDepartment: { type: String, default: "" },
  schoolId: { type: String, required: true }
}, { timestamps: true })

export const DepartmentModel = mongoose.models.Department || mongoose.model("Department", DepartmentSchema)
