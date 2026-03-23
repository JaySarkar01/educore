"use client"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X, Loader2, FilePlus2 } from "lucide-react"
import { generateFeeInvoice } from "@/app/actions/fees"

export function GenerateInvoiceForm({ students }: { students: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleAction = (formData: FormData) => {
    startTransition(async () => {
      const res = await generateFeeInvoice(formData)
      if (res?.error) {
        alert(res.error)
      } else {
        setIsOpen(false)
      }
    })
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="gap-2 shadow-sm shadow-brand-500/20">
        <FilePlus2 className="w-4 h-4" /> Issue Invoice
      </Button>
    )
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2 shadow-sm shadow-brand-500/20">
        <FilePlus2 className="w-4 h-4" /> Issue Invoice
      </Button>
      <div className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 shadow-2xl">
        <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-5 border-b border-border/40">
            <div>
              <h2 className="text-xl font-bold text-fg">Issue Fee Invoice</h2>
              <p className="text-sm text-muted-fg mt-1">Assign a new fee obligation to a student.</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-fg hover:text-fg" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <form action={handleAction} className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="studentId">Select Student</Label>
              <select id="studentId" name="studentId" required className="flex h-10 w-full rounded-md border border-border bg-surface-50 dark:bg-surface-950 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500">
                <option value="">-- Choose Student --</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>{s.name} (Roll: {s.rollNumber}, Class {s.className})</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Invoice Title / Particulars</Label>
              <Input id="title" name="title" required placeholder="e.g. Term 1 Tuition Fee" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Total Amount ($)</Label>
                <Input id="amount" name="amount" type="number" step="0.01" min="1" required placeholder="500.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" required defaultValue={new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]} />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/40 mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="lg:w-32 shadow-sm shadow-brand-500/20">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Issue Invoice"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
