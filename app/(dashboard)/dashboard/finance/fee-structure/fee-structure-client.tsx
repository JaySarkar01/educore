"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings, Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import { createFeeStructure, deleteFeeStructure } from "@/app/actions/fees"
import { useRouter } from "next/navigation"

export default function FeeStructureClient({ initialStructures, classes }: { initialStructures: any[], classes: string[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  async function handleAdd(formData: FormData) {
    setError("")
    startTransition(async () => {
      const res = await createFeeStructure(formData)
      if (res?.error) {
        setError(res.error)
      } else {
        const form = document.getElementById("fee-structure-form") as HTMLFormElement
        if (form) form.reset()
        router.refresh()
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this fee component?")) return
    startTransition(async () => {
      await deleteFeeStructure(id)
      router.refresh()
    })
  }

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
              <form id="fee-structure-form" action={handleAdd} className="space-y-4">
                {error && <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">{error}</div>}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Component Name</label>
                  <input name="name" required type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="e.g. Tuition Fee" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Class</label>
                  <select name="targetClass" required className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm">
                    <option value="ALL">All Classes</option>
                    {classes.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (₹)</label>
                  <input name="amount" required type="number" step="0.01" min="0" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="5000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Frequency</label>
                  <select name="frequency" required className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm">
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Once">One-time</option>
                  </select>
                </div>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Component
                </Button>
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
                    {initialStructures.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-muted-fg">No fee components found.</td>
                      </tr>
                    ) : (
                      initialStructures.map((fs) => (
                        <tr key={fs._id} className="hover:bg-surface-100/50 dark:hover:bg-surface-900/50">
                          <td className="px-4 py-3 font-medium text-fg">{fs.name}</td>
                          <td className="px-4 py-3 text-muted-fg">{fs.targetClass === 'ALL' ? 'All Classes' : fs.targetClass}</td>
                          <td className="px-4 py-3 text-muted-fg">{fs.frequency}</td>
                          <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">₹{fs.amount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(fs._id)}
                              disabled={isPending}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
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