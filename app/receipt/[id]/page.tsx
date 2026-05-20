import { connectToDatabase } from "@/lib/db"
import { FeeInvoiceModel } from "@/lib/models/Fee"
import { SchoolModel } from "@/lib/models/School"
import { StudentModel } from "@/lib/models/Student"
import { getAuthContext } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import ReceiptClient from "./receipt-client"
import { School, Building, Phone, Mail, MapPin } from "lucide-react"

export default async function ReceiptPage({ params }: { params: { id: string } }) {
  const auth = await getAuthContext()
  if (!auth?.isAuthenticated) {
    redirect('/login')
  }

  await connectToDatabase()
  
  const invoice = await FeeInvoiceModel.findOne({ _id: params.id, schoolId: auth.schoolId || auth.context?.schoolId }).lean()
  if (!invoice) return notFound()

  // Security check: if student, can only view their own invoice
  if (auth.roleName === "STUDENT" && auth.linkedStudentId) {
    if (invoice.studentId.toString() !== auth.linkedStudentId.toString()) {
      return notFound()
    }
  }

  const school = await SchoolModel.findById(invoice.schoolId).lean()
  const student = await StudentModel.findById(invoice.studentId).lean()

  if (!school) return notFound()

  // Convert ObjectIds to strings
  const invoiceData = JSON.parse(JSON.stringify(invoice))
  const schoolData = JSON.parse(JSON.stringify(school))
  const studentData = JSON.parse(JSON.stringify(student))

  return (
    <div className="min-h-screen bg-surface-100/50 print:bg-white flex items-center justify-center p-4 print:p-0 font-sans">
      <div className="w-full max-w-3xl bg-white shadow-xl print:shadow-none rounded-lg overflow-hidden border border-border/50 print:border-none print:w-full">
        {/* Receipt Controls - hidden on print */}
        <ReceiptClient />

        {/* Printable Area */}
        <div id="printable-receipt" className="p-8 sm:p-12 text-fg">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-brand-100 pb-8 mb-8">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 border border-brand-100">
                <Building className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-fg tracking-tight">{schoolData.schoolName}</h1>
                <p className="text-sm text-muted-fg mt-1 max-w-sm flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {schoolData.address || "City Campus"}, {schoolData.city}, {schoolData.state}</p>
                <div className="text-sm text-muted-fg flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {schoolData.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {schoolData.schoolEmail}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black text-brand-600/20 uppercase tracking-widest">Receipt</h2>
              <p className="text-sm font-semibold text-fg mt-1">Invoice #{invoiceData._id.toString().slice(-6).toUpperCase()}</p>
              <p className="text-xs text-muted-fg mt-1">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-fg uppercase tracking-wider">Billed To</p>
              <p className="text-base font-bold text-fg">{invoiceData.studentName}</p>
              <p className="text-sm text-muted-fg">Class: {invoiceData.className} {studentData?.section ? `- ${studentData.section}` : ""}</p>
              <p className="text-sm text-muted-fg">Roll No: {studentData?.rollNumber || "N/A"}</p>
              <p className="text-sm text-muted-fg">Father's Name: {studentData?.parentName || "N/A"}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs font-semibold text-muted-fg uppercase tracking-wider">Payment Details</p>
              <p className="text-sm text-fg">Status: <strong className={invoiceData.status === 'Paid' ? 'text-emerald-600' : invoiceData.status === 'Pending' ? 'text-red-500' : 'text-amber-500'}>{invoiceData.status.toUpperCase()}</strong></p>
              <p className="text-sm text-fg">Due Date: <strong>{new Date(invoiceData.dueDate).toLocaleDateString()}</strong></p>
              <p className="text-sm text-fg">Total Billed: <strong>₹{invoiceData.amount.toFixed(2)}</strong></p>
              <p className="text-sm text-fg">Total Paid: <strong>₹{invoiceData.amountPaid.toFixed(2)}</strong></p>
            </div>
          </div>

          {/* Invoice Particulars */}
          <div className="mb-8 rounded-lg overflow-hidden border border-border/50">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-50 text-xs uppercase text-muted-fg">
                <tr>
                  <th className="px-4 py-3 font-semibold">Description / Particulars</th>
                  <th className="px-4 py-3 font-semibold text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <tr>
                  <td className="px-4 py-4 font-medium text-fg">{invoiceData.title}</td>
                  <td className="px-4 py-4 text-right font-medium text-fg">{invoiceData.amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payments Track */}
          {invoiceData.payments && invoiceData.payments.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-semibold text-muted-fg uppercase tracking-wider mb-2">Payment History Table</p>
              <div className="rounded-lg overflow-hidden border border-border/50">
                <table className="w-full text-sm text-left">
                  <thead className="bg-surface-50 text-xs uppercase text-muted-fg">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Date</th>
                      <th className="px-4 py-2 font-semibold">Method</th>
                      <th className="px-4 py-2 font-semibold">Txn ID / Receipt</th>
                      <th className="px-4 py-2 font-semibold text-right">Amount Paid (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {invoiceData.payments.map((p: any, i: number) => (
                      <tr key={i}>
                        <td className="px-4 py-2 text-fg">{new Date(p.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-fg">{p.method}</td>
                        <td className="px-4 py-2 text-muted-fg">{p.transactionId || "-"} <br/> <span className="text-[10px] text-muted-fg">{p.receiptNumber}</span></td>
                        <td className="px-4 py-2 text-right font-medium text-emerald-600">+{p.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer Summary */}
          <div className="flex justify-end pt-4 mb-16">
            <div className="w-64 space-y-2 border-t-2 border-border/60 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-fg">Subtotal:</span>
                <span className="font-semibold text-fg">₹{invoiceData.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-fg">Total Paid:</span>
                <span className="font-semibold text-emerald-600">- ₹{invoiceData.amountPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base border-t border-border/40 pt-2 mt-2">
                <span className="font-bold text-fg">Balance Due:</span>
                <span className={`font-black tracking-tight ${invoiceData.amount - invoiceData.amountPaid > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  ₹{Math.max(invoiceData.amount - invoiceData.amountPaid, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-muted-fg border-t border-border/30 pt-6">
            <p>This is a computer generated receipt. Signatures are not required.</p>
            <p className="mt-1">For any discrepancies, please contact the administration at {schoolData.phone}.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
