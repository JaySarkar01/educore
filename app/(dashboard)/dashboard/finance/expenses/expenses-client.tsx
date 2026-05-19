"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Receipt, Download, FileText, Loader2, Trash } from "lucide-react"
import { useState, useTransition } from "react"
import { addExpense, deleteExpense } from "@/app/actions/finance"
import { useRouter } from "next/navigation"

export default function ExpensesClient({ expenses, summary, vendors }: { expenses: any[], summary: any, vendors: any[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  async function handleAdd(formData: FormData) {
    setError("")
    startTransition(async () => {
      const res = await addExpense(formData)
      if (res?.error) {
        setError(res.error)
      } else {
        const form = document.getElementById("expense-form") as HTMLFormElement
        if (form) form.reset()
        router.refresh()
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this expense?")) return
    startTransition(async () => {
      await deleteExpense(id)
      router.refresh()
    })
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-fg tracking-tight">Expense Management</h1>
          <p className="text-muted-fg mt-1 text-sm md:text-base">Track and manage school expenditures and vendor payments.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
              <CardTitle className="text-sm font-medium text-muted-fg">This Month's Expenses</CardTitle>
              <Receipt className="w-4 h-4 text-rose-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                ₹{(summary?.totalMonthly || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-fg mt-1">Total recorded this month</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-surface-50 dark:bg-surface-950">
            <CardHeader className="border-b border-border/40">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-500" />
                Quick Add Expense
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form id="expense-form" action={handleAdd} className="space-y-4">
                {error && <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">{error}</div>}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <input name="title" required type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="e.g. Office Supplies" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (₹)</label>
                  <input name="amount" required type="number" step="0.01" min="0" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="1000" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select name="category" required className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm">
                    <option value="Electricity">Electricity</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Stationary">Stationary</option>
                    <option value="Transport">Transport</option>
                    <option value="Internet">Internet</option>
                    <option value="Events">Events</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Software">Software</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vendor</label>
                  <select name="vendorName" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm">
                    <option value="">-- None --</option>
                    {vendors.map((v) => (
                      <option key={v._id} value={v.companyName}>{v.companyName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Method</label>
                  <select name="paymentMethod" required className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm">
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Online">Online</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <input name="date" required type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" />
                </div>
                
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Record Expense
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="border-border/50 bg-surface-50 dark:bg-surface-950 overflow-hidden h-full">
            <CardHeader className="border-b border-border/40">
              <CardTitle className="text-base">Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {expenses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left align-middle min-w-[640px]">
                <thead className="text-xs text-muted-fg uppercase bg-surface-100/80 dark:bg-surface-900/80 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-4 font-semibold">Date</th>
                    <th className="px-4 py-4 font-semibold">Title</th>
                    <th className="px-4 py-4 font-semibold">Category</th>
                    <th className="px-4 py-4 font-semibold">Vendor</th>
                    <th className="px-4 py-4 font-semibold text-right">Amount</th>
                    <th className="px-4 py-4 font-semibold text-center w-12">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {expenses.map((exp: any) => (
                    <tr key={exp._id} className="hover:bg-surface-100/50 dark:hover:bg-surface-900/50 group">
                      <td className="px-4 py-3">{new Date(exp.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-medium text-fg flex items-center gap-2">
                        {exp.attachmentUrl && <FileText className="w-3 h-3 text-brand-500" />} {exp.title}
                      </td>
                      <td className="px-4 py-3 text-muted-fg">{exp.category}</td>
                      <td className="px-4 py-3 text-muted-fg">{exp.vendorName || '-'}</td>
                      <td className="px-4 py-3 text-right font-semibold text-rose-600 dark:text-rose-400">
                        ₹{(exp.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-center">
                         <Button 
                            variant="ghost" 
                            size="icon"
                            disabled={isPending}
                            onClick={() => handleDelete(exp._id)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="p-10 text-center text-muted-fg">No expenses recorded yet.</div>
          )}
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  )
}