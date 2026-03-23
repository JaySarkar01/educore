"use server"

import { connectToDatabase } from "@/lib/db"
import { FeeInvoiceModel } from "@/lib/models/Fee"
import { StudentModel } from "@/lib/models/Student"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { revalidatePath } from "next/cache"

async function getSession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  return await decrypt(cookie)
}

export async function generateFeeInvoice(formData: FormData) {
  const session = await getSession()
  if (!session || !session.schoolId) return { error: "Not authorized" }

  await connectToDatabase()
  
  const studentId = formData.get("studentId")?.toString()
  const title = formData.get("title")?.toString() || "General Fee"
  const amount = parseFloat(formData.get("amount")?.toString() || "0")
  const dueDate = formData.get("dueDate")?.toString() || new Date().toISOString().split('T')[0]

  if (!studentId || amount <= 0) return { error: "Invalid data" }

  const student = await StudentModel.findOne({ _id: studentId, schoolId: session.schoolId })
  if (!student) return { error: "Student not found" }

  const invoice = await FeeInvoiceModel.create({
    schoolId: session.schoolId,
    studentId,
    studentName: student.name,
    className: student.className,
    title,
    amount,
    dueDate,
    status: 'Pending',
    amountPaid: 0,
    payments: []
  })

  // Timeline Event
  await StudentModel.findByIdAndUpdate(studentId, {
    $push: {
      timeline: {
        title: "Fee Invoice Generated",
        description: `An invoice of ₹${amount} for '${title}' was issued.`,
        date: new Date()
      }
    }
  })

  revalidatePath('/dashboard/students/fees')
  revalidatePath(`/dashboard/students/${studentId}`)
  return { success: true }
}

export async function recordFeePayment(invoiceId: string, amountToPay: number, method: string, transactionId?: string) {
  const session = await getSession()
  if (!session || !session.schoolId) return { error: "Not authorized" }

  await connectToDatabase()

  const invoice = await FeeInvoiceModel.findOne({ _id: invoiceId, schoolId: session.schoolId })
  if (!invoice) return { error: "Invoice not found" }

  const newPaid = invoice.amountPaid + amountToPay
  let newStatus = 'Partial'
  if (newPaid >= invoice.amount) newStatus = 'Paid'

  const receiptNumber = `RCPT-${Date.now().toString().slice(-6)}`

  invoice.amountPaid = newPaid
  invoice.status = newStatus
  invoice.payments.push({
    amount: amountToPay,
    date: new Date(),
    method,
    transactionId,
    receiptNumber
  })

  await invoice.save()

  // Push to student timeline
  await StudentModel.findByIdAndUpdate(invoice.studentId, {
    $push: {
      timeline: {
        title: "Fee Payment Received",
        description: `Payment of ₹${amountToPay} via ${method} mapped to '${invoice.title}'. (Receipt: ${receiptNumber})`,
        date: new Date()
      }
    }
  })

  revalidatePath('/dashboard/students/fees')
  revalidatePath(`/dashboard/students/${invoice.studentId}`)
  return { success: true }
}

export async function getAllInvoices() {
  const session = await getSession()
  if (!session || !session.schoolId) return []
  await connectToDatabase()
  
  const invoices = await FeeInvoiceModel.find({ schoolId: session.schoolId }).sort({ createdAt: -1 }).lean()
  return JSON.parse(JSON.stringify(invoices))
}

export async function getStudentFeeStats(studentId: string) {
  const session = await getSession()
  if (!session || !session.schoolId) return null
  await connectToDatabase()

  const invoices = await FeeInvoiceModel.find({ studentId, schoolId: session.schoolId }).sort({ createdAt: -1 }).lean()

  let totalBilled = 0
  let totalPaid = 0
  let pendingBalance = 0

  for (const inv of invoices as any) {
    totalBilled += inv.amount
    totalPaid += inv.amountPaid
  }
  pendingBalance = totalBilled - totalPaid

  return JSON.parse(JSON.stringify({
    totalBilled,
    totalPaid,
    pendingBalance,
    invoices
  }))
}
