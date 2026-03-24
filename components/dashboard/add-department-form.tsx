"use client"

import { useTransition, useRef } from "react"
import { addDepartment } from "@/app/actions/department"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function AddDepartmentForm() {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const handleAction = (formData: FormData) => {
    startTransition(async () => {
      const res = await addDepartment(formData)
      if (res?.error) {
        alert(res.error)
      } else {
        formRef.current?.reset()
      }
    })
  }

  return (
    <form ref={formRef} action={handleAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Department Name *</Label>
        <Input id="name" name="name" placeholder="e.g. Science" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="headOfDepartment">Head of Department</Label>
        <Input id="headOfDepartment" name="headOfDepartment" placeholder="e.g. Dr. Jane Doe" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <textarea 
          id="description" 
          name="description" 
          placeholder="Brief details about this department..." 
          className="flex min-h-[80px] w-full rounded-md border border-input bg-surface-50 dark:bg-surface-950 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50" 
        />
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={isPending} className="w-full shadow-sm shadow-brand-500/20">
          {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</> : "Add Department"}
        </Button>
      </div>
    </form>
  )
}
