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