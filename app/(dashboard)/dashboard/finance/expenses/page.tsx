import { getExpenses, getExpenseSummary } from "@/app/actions/finance"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Receipt, Download, FileText } from "lucide-react"

export default async function ExpensesPage() {
  const expenses = await getExpenses()
  const summary = await getExpenseSummary()

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
                ₹{(summary?.totalMonthly || 0).toFixed(2)}
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
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <input type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="e.g. Office Supplies" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (₹)</label>
                  <input type="number" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="1000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm">
                    <option value="Supplies">Supplies</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <input type="date" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" />
                </div>
                <Button type="button" className="w-full">Record Expense</Button>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {expenses.map((exp: any) => (
                    <tr key={exp._id} className="hover:bg-surface-100/50 dark:hover:bg-surface-900/50">
                      <td className="px-4 py-3">{new Date(exp.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-medium text-fg flex items-center gap-2">
                        {exp.attachmentUrl && <FileText className="w-3 h-3 text-brand-500" />} {exp.title}
                      </td>
                      <td className="px-4 py-3 text-muted-fg">{exp.category}</td>
                      <td className="px-4 py-3 text-muted-fg">{exp.vendorName || '-'}</td>
                      <td className="px-4 py-3 text-right font-semibold text-rose-600 dark:text-rose-400">
                        ₹{(exp.amount || 0).toFixed(2)}
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
