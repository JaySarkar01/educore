"use client"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X, Loader2 } from "lucide-react"
import { addClass } from "@/app/actions/academic"

export function AddClassForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleAction = (formData: FormData) => {
    startTransition(async () => {
      const res = await addClass(formData)
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
        <Plus className="w-4 h-4" /> Add New Class
      </Button>
    )
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2 shadow-sm shadow-brand-500/20">
        <Plus className="w-4 h-4" /> Add New Class
      </Button>
      <div className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-5 border-b border-border/40">
            <div>
              <h2 className="text-xl font-bold text-fg">Register Class Tier</h2>
              <p className="text-sm text-muted-fg mt-1">Define an official grade level dimension.</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-fg hover:text-fg" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <form action={handleAction} className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="className">Class Name / Grade *</Label>
              <Input id="className" name="className" required placeholder="e.g. Grade 10, Kindergarten" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sections">Available Sections (Optional)</Label>
              <Input id="sections" name="sections" placeholder="e.g. A, B, C (comma separated)" />
              <p className="text-xs text-muted-fg">Creates structural buckets (e.g. 10A, 10B) to partition students structurally.</p>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/40 mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="shadow-sm shadow-brand-500/20">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Class"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
