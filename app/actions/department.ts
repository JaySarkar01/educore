"use server"

import { connectToDatabase } from "@/lib/db"
import { DepartmentModel } from "@/lib/models/Department"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { authorizePermission } from "@/lib/auth"

const DeptSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  headOfDepartment: z.string().optional()
})

export async function getDepartments() {
  const auth = await authorizePermission("teacher.view")
  if (!auth.allowed || !auth.context.schoolId) return []
  
  await connectToDatabase()
  const depts = await DepartmentModel.find({ schoolId: auth.context.schoolId }).sort({ name: 1 }).lean()
  return depts.map((d: any) => ({
    ...JSON.parse(JSON.stringify(d)),
    _id: d._id.toString()
  }))
}

export async function addDepartment(formData: FormData) {
  const auth = await authorizePermission("teacher.edit")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  const name = formData.get("name")?.toString() || ""
  const description = formData.get("description")?.toString() || ""
  const headOfDepartment = formData.get("headOfDepartment")?.toString() || ""

  const validated = DeptSchema.safeParse({ name, description, headOfDepartment })
  if (!validated.success) return { error: "Invalid data", fieldErrors: validated.error.flatten().fieldErrors }

  await connectToDatabase()

  const existing = await DepartmentModel.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") }, schoolId: auth.context.schoolId })
  if (existing) return { error: `Department '${name}' already exists` }

  await DepartmentModel.create({
    schoolId: auth.context.schoolId,
    name,
    description,
    headOfDepartment
  })

  revalidatePath('/dashboard/teachers/departments')
  revalidatePath('/dashboard/teachers/add')
  return { success: true }
}

export async function deleteDepartment(id: string) {
  const auth = await authorizePermission("teacher.edit")
  if (!auth.allowed || !auth.context.schoolId) return
  
  await connectToDatabase()
  await DepartmentModel.findOneAndDelete({ _id: id, schoolId: auth.context.schoolId })
  revalidatePath('/dashboard/teachers/departments')
  revalidatePath('/dashboard/teachers/add')
}
