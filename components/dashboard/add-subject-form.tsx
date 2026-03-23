"use client"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X, Loader2 } from "lucide-react"
import { addSubject } from "@/app/actions/academic"

export function AddSubjectForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleAction = (formData: FormData) => {
    startTransition(async () => {
      const res = await addSubject(formData)
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
        <Plus className="w-4 h-4" /> Add Subject
      </Button>
    )
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2 shadow-sm shadow-brand-500/20">
        <Plus className="w-4 h-4" /> Add Subject
      </Button>
      <div className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-5 border-b border-border/40">
            <div>
              <h2 className="text-xl font-bold text-fg">Register Subject</h2>
              <p className="text-sm text-muted-fg mt-1">Append core subjects to the overarching platform curriculum.</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-fg hover:text-fg" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <form action={handleAction} className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="subjectName">Subject Full Name *</Label>
              <Input id="subjectName" name="subjectName" required placeholder="e.g. Advanced Mathematics" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subjectCode">Subject Code *</Label>
                <Input id="subjectCode" name="subjectCode" required placeholder="MTH-101" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Component Type</Label>
                <select id="type" name="type" className="flex h-10 w-full rounded-md border border-border bg-surface-50 dark:bg-surface-950 px-3 py-1 text-sm shadow-sm">
                  <option value="Theory">Theory Only</option>
                  <option value="Practical">Practical / Lab</option>
                  <option value="Both">Theory + Practical</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/40 mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="shadow-sm shadow-brand-500/20">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Subject"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
