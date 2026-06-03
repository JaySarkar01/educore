import { redirect } from "next/navigation"
import { connectToDatabase } from "@/lib/db"
import { authorizePermission } from "@/lib/auth"
import { FeeInvoiceModel } from "@/lib/models/Fee"
import { ExpenseModel } from "@/lib/models/Expense"
// Import the interactive reports client component
import ReportsClient from "./reports-client"

export const metadata = {
  title: "Financial Reports",
}

export default async function ReportsPage() {
  const auth = await authorizePermission("finance.report.view")
  if (!auth.allowed || !auth.context.schoolId) {
    redirect("/dashboard")
  }

  await connectToDatabase()

  // Fetch all fee invoices for the school
  const invoices = await FeeInvoiceModel.find({ schoolId: auth.context.schoolId })
    .sort({ createdAt: -1 })
    .lean()

  // Fetch all expenses for the school
  const expenses = await ExpenseModel.find({ schoolId: auth.context.schoolId })
    .sort({ date: -1 })
    .lean()

  return (
    <ReportsClient
      invoices={JSON.parse(JSON.stringify(invoices))}
      expenses={JSON.parse(JSON.stringify(expenses))}
    />
  )
}

