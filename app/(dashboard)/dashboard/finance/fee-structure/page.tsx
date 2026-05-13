import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"

export default function FeeStructurePage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-fg tracking-tight">Fee Structure</h1>
          <p className="text-muted-fg mt-1 text-sm md:text-base">Define and manage academic fee structures and components.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="border-border/50 bg-surface-50 dark:bg-surface-950">
            <CardHeader className="border-b border-border/40">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-500" />
                Add Fee Component
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Component Name</label>
                  <input type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="e.g. Tuition Fee" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Class</label>
                  <select className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm">
                    <option value="">All Classes</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (₹)</label>
                  <input type="number" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="5000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Frequency</label>
                  <select className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm">
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Once">One-time</option>
                  </select>
                </div>
                <Button type="button" className="w-full">Save Component</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-surface-50 dark:bg-surface-950 overflow-hidden">
            <CardHeader className="border-b border-border/40">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="w-4 h-4 text-brand-500" />
                Active Fee Structures
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left align-middle">
                  <thead className="text-xs text-muted-fg uppercase bg-surface-100/80 dark:bg-surface-900/80 border-b border-border/50">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Component</th>
                      <th className="px-4 py-3 font-semibold">Class</th>
                      <th className="px-4 py-3 font-semibold">Frequency</th>
                      <th className="px-4 py-3 font-semibold">Amount</th>
                      <th className="px-4 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr className="hover:bg-surface-100/50 dark:hover:bg-surface-900/50">
                      <td className="px-4 py-3 font-medium text-fg">Tuition Fee</td>
                      <td className="px-4 py-3 text-muted-fg">All Classes</td>
                      <td className="px-4 py-3 text-muted-fg">Monthly</td>
                      <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">₹3,000</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Delete</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-bg-surface-100/50 dark:hover:bg-surface-900/50">
                      <td className="px-4 py-3 font-medium text-fg">Library Fee</td>
                      <td className="px-4 py-3 text-muted-fg">All Classes</td>
                      <td className="px-4 py-3 text-muted-fg">Yearly</td>
                      <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">₹1,500</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Delete</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-100/50 dark:hover:bg-surface-900/50">
                      <td className="px-4 py-3 font-medium text-fg">Computer Lab</td>
                      <td className="px-4 py-3 text-muted-fg">Class 9, Class 10</td>
                      <td className="px-4 py-3 text-muted-fg">Yearly</td>
                      <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">₹2,000</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Delete</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
