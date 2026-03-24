import { getAllInvoices } from "@/app/actions/fees"
import { getStudents } from "@/app/actions/student"
import { GenerateInvoiceForm } from "@/components/dashboard/generate-invoice-form"
import { Wallet, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function FeesPage() {
  const students = await getStudents()
  const studentIds = new Set(students.map((s: any) => s.id))
  const invoices = (await getAllInvoices()).filter((inv: any) => studentIds.has(inv.studentId))
  
  const totalBilled = invoices.reduce((sum: number, inv: any) => sum + inv.amount, 0)
  const totalCollected = invoices.reduce((sum: number, inv: any) => sum + inv.amountPaid, 0)
  const pendingCollection = totalBilled - totalCollected
  const outstandingInvoices = invoices.filter((inv: any) => inv.status !== 'Paid').length

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-fg tracking-tight">Fee Management</h1>
          <p className="text-muted-fg mt-1 text-sm md:text-base">Manage school-wide invoices, payments, and financial health.</p>
        </div>
        <GenerateInvoiceForm students={students} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-fg">Total Billed</CardTitle>
            <Wallet className="w-4 h-4 text-brand-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-fg">₹{totalBilled.toFixed(2)}</div>
            <p className="text-xs text-muted-fg mt-1">Historically invoiced</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-fg">Total Collected</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹{totalCollected.toFixed(2)}</div>
            <p className="text-xs text-muted-fg mt-1">Cash & Online Receipts</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-fg">Pending</CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">₹{pendingCollection.toFixed(2)}</div>
            <p className="text-xs text-muted-fg mt-1">Unpaid balances</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-fg">Outstanding</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-fg">{outstandingInvoices}</div>
            <p className="text-xs text-muted-fg mt-1">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 md:p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20">
          <h3 className="font-bold text-fg">School Ledger (Recent Invoices)</h3>
        </div>
        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[560px]">
              <thead className="text-xs text-muted-fg uppercase bg-surface-50 dark:bg-surface-900/50 border-b">
                <tr>
                  <th className="px-4 md:px-6 py-4 font-semibold hidden sm:table-cell">Date Issued</th>
                  <th className="px-4 md:px-6 py-4 font-semibold">Student Name</th>
                  <th className="px-4 md:px-6 py-4 font-semibold hidden md:table-cell">Particulars</th>
                  <th className="px-4 md:px-6 py-4 font-semibold">Amount</th>
                  <th className="px-4 md:px-6 py-4 font-semibold">Status</th>
                  <th className="px-4 md:px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {invoices.map((inv: any) => (
                  <tr key={inv._id} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/30 transition-colors">
                    <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-fg hidden sm:table-cell">{new Date(inv.createdAt).toISOString().split('T')[0]}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 font-semibold text-brand-600 dark:text-brand-400">
                      <Link href={`/dashboard/students/${inv.studentId}?tab=fees`} className="hover:underline block truncate max-w-[140px] sm:max-w-none">{inv.studentName} ({inv.className})</Link>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-muted-fg hidden md:table-cell">{inv.title}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-fg">₹{inv.amount.toFixed(2)}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <span className={`px-2 py-0.5 rounded-sm text-xs font-semibold border ${
                        inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                        inv.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                        inv.status === 'Partial' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                        'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                      <Link href={`/dashboard/students/${inv.studentId}?tab=fees`} className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 hover:underline whitespace-nowrap">View Portal</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted-fg">No invoices generated yet.</div>
        )}
      </div>

    </div>
  )
}
