"use server"

import { connectToDatabase } from "@/lib/db"
import { ExpenseModel } from "@/lib/models/Expense"
import { VendorModel } from "@/lib/models/Vendor"
import { revalidatePath } from "next/cache"
import { authorizePermission } from "@/lib/auth"
import { logAudit } from "@/lib/audit"

export async function getExpenses(startDate?: string, endDate?: string) {
  const auth = await authorizePermission("expenses.manage")
  if (!auth.allowed || !auth.context.schoolId) return []
  
  await connectToDatabase()

  let query: any = { schoolId: auth.context.schoolId }
  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) }
  }

  const expenses = await ExpenseModel.find(query).sort({ date: -1 }).lean()
  return JSON.parse(JSON.stringify(expenses))
}

export async function getExpenseSummary() {
  const auth = await authorizePermission("expenses.manage")
  if (!auth.allowed || !auth.context.schoolId) return null
  
  await connectToDatabase()
  
  const currentMonth = new Date()
  currentMonth.setDate(1)
  currentMonth.setHours(0, 0, 0, 0)

  const summary = await ExpenseModel.aggregate([
    { $match: { schoolId: auth.context.schoolId, date: { $gte: currentMonth } } },
    {
      $group: {
        _id: null,
        totalMonthly: { $sum: "$amount" }
      }
    }
  ])

  const total = summary[0]?._id === null ? summary[0].totalMonthly : 0

  return { totalMonthly: total }
}

export async function addExpense(formData: FormData) {
  const auth = await authorizePermission("expenses.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }
  
  await connectToDatabase()

  const title = formData.get("title")?.toString()
  const category = formData.get("category")?.toString() || "Other"
  const amount = parseFloat(formData.get("amount")?.toString() || "0")
  const date = formData.get("date")?.toString() || new Date().toISOString()
  const vendorName = formData.get("vendorName")?.toString() || ""
  const paymentMethod = formData.get("paymentMethod")?.toString() || "Cash"
  const notes = formData.get("notes")?.toString() || ""
  const attachmentUrl = formData.get("attachmentUrl")?.toString() || ""

  if (!title || amount <= 0) return { error: "Invalid expense data" }

  const expense = await ExpenseModel.create({
    schoolId: auth.context.schoolId,
    title,
    category,
    amount,
    date: new Date(date),
    vendorName,
    paymentMethod,
    notes,
    attachmentUrl
  })

  revalidatePath('/dashboard/finance/expenses')
  await logAudit(auth.context, {
    action: "expenses.manage",
    resource: "Expense",
    resourceId: expense._id.toString(),
    details: { amount, title },
  })

  return { success: true }
}

export async function deleteExpense(id: string) {
  const auth = await authorizePermission("expenses.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }
  if (!id) return { error: "Invalid ID" }

  await connectToDatabase()
  
  await ExpenseModel.findOneAndDelete({ _id: id, schoolId: auth.context.schoolId })
  
  revalidatePath('/dashboard/finance/expenses')
  await logAudit(auth.context, {
    action: "expenses.manage",
    resource: "Expense",
    resourceId: id,
    details: { action: "delete" },
  })
  return { success: true }
}

export async function getVendors() {
  const auth = await authorizePermission("vendor.manage")
  if (!auth.allowed || !auth.context.schoolId) return []
  
  await connectToDatabase()

  const vendors = await VendorModel.find({ schoolId: auth.context.schoolId }).sort({ companyName: 1 }).lean()
  return JSON.parse(JSON.stringify(vendors))
}

export async function addVendor(formData: FormData) {
  const auth = await authorizePermission("vendor.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  await connectToDatabase()

  const companyName = formData.get("companyName")?.toString()
  const contactPerson = formData.get("contactPerson")?.toString()
  const phone = formData.get("phone")?.toString()
  const category = formData.get("category")?.toString() || "Other"
  const email = formData.get("email")?.toString() || ""
  const address = formData.get("address")?.toString() || ""

  if (!companyName || !contactPerson || !phone) return { error: "Missing required fields" }

  const vendor = await VendorModel.create({
    schoolId: auth.context.schoolId,
    companyName,
    contactPerson,
    phone,
    email,
    category,
    address
  })

  revalidatePath('/dashboard/finance/vendors')
  revalidatePath('/dashboard/finance/expenses')
  await logAudit(auth.context, {
    action: "vendor.manage",
    resource: "Vendor",
    resourceId: vendor._id.toString(),
    details: { companyName },
  })

  return { success: true }
}

export async function deleteVendor(id: string) {
  const auth = await authorizePermission("vendor.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  await connectToDatabase()

  await VendorModel.findOneAndDelete({ _id: id, schoolId: auth.context.schoolId })
  
  revalidatePath('/dashboard/finance/vendors')
  revalidatePath('/dashboard/finance/expenses')
  await logAudit(auth.context, {
    action: "vendor.manage",
    resource: "Vendor",
    resourceId: id,
    details: { action: "delete" },
  })

  return { success: true }
}

export async function getTransportRoutes() {
  const auth = await authorizePermission("fees.view")
  if (!auth.allowed || !auth.context.schoolId) return []
  
  await connectToDatabase()
  const { TransportRouteModel } = await import("@/lib/models/TransportRoute")
  const routes = await TransportRouteModel.find({ schoolId: auth.context.schoolId }).sort({ routeName: 1 }).lean()
  return JSON.parse(JSON.stringify(routes))
}

export async function addTransportRoute(formData: FormData) {
  const auth = await authorizePermission("fees.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  await connectToDatabase()
  const { TransportRouteModel } = await import("@/lib/models/TransportRoute")

  const routeName = formData.get("routeName")?.toString()
  const monthlyFee = parseFloat(formData.get("monthlyFee")?.toString() || "0")
  const capacity = parseInt(formData.get("capacity")?.toString() || "0")
  const vehicleReg = formData.get("vehicleReg")?.toString() || ""
  const driverName = formData.get("driverName")?.toString() || ""
  const stops = formData.get("stops")?.toString() || ""

  if (!routeName || monthlyFee <= 0) return { error: "Invalid data" }

  await TransportRouteModel.create({
    schoolId: auth.context.schoolId,
    routeName, monthlyFee, capacity, vehicleReg, driverName, stops
  })

  revalidatePath('/dashboard/finance/transport')
  return { success: true }
}

export async function deleteTransportRoute(id: string) {
  const auth = await authorizePermission("fees.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  await connectToDatabase()
  const { TransportRouteModel } = await import("@/lib/models/TransportRoute")
  await TransportRouteModel.findOneAndDelete({ _id: id, schoolId: auth.context.schoolId })
  revalidatePath('/dashboard/finance/transport')
  return { success: true }
}

export async function getHostelRooms() {
  const auth = await authorizePermission("fees.view")
  if (!auth.allowed || !auth.context.schoolId) return []
  
  await connectToDatabase()
  const { HostelRoomModel } = await import("@/lib/models/HostelRoom")
  const rooms = await HostelRoomModel.find({ schoolId: auth.context.schoolId }).sort({ block: 1, roomType: 1 }).lean()
  return JSON.parse(JSON.stringify(rooms))
}

export async function addHostelRoom(formData: FormData) {
  const auth = await authorizePermission("fees.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  await connectToDatabase()
  const { HostelRoomModel } = await import("@/lib/models/HostelRoom")

  const block = formData.get("block")?.toString()
  const roomType = formData.get("roomType")?.toString()
  const monthlyFee = parseFloat(formData.get("monthlyFee")?.toString() || "0")
  const totalRooms = parseInt(formData.get("totalRooms")?.toString() || "0")

  if (!block || !roomType || monthlyFee <= 0) return { error: "Invalid data" }

  await HostelRoomModel.create({
    schoolId: auth.context.schoolId,
    block, roomType, monthlyFee, totalRooms
  })

  revalidatePath('/dashboard/finance/hostel')
  return { success: true }
}

export async function deleteHostelRoom(id: string) {
  const auth = await authorizePermission("fees.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  await connectToDatabase()
  const { HostelRoomModel } = await import("@/lib/models/HostelRoom")
  await HostelRoomModel.findOneAndDelete({ _id: id, schoolId: auth.context.schoolId })
  revalidatePath('/dashboard/finance/hostel')
  return { success: true }
}
