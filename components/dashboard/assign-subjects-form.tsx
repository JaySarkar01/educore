"use client"
import { useState, useTransition } from "react"
import { assignSubjects } from "@/app/actions/teacher"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Check } from "lucide-react"

export function AssignSubjectsRow({ teacherId, initialSubjects }: { teacherId: string, initialSubjects: string[] }) {
  const [subjects, setSubjects] = useState(initialSubjects.join(', '))
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    startTransition(async () => {
      await assignSubjects(teacherId, subjects)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="flex items-center gap-3">
      <Input 
        value={subjects}
        onChange={(e) => {
          setSubjects(e.target.value)
          setSaved(false)
        }}
        placeholder="e.g. Mathematics, Physics"
        className="flex-1 max-w-sm h-9"
      />
      <Button 
        onClick={handleSave} 
        disabled={isPending || subjects === initialSubjects.join(', ')} 
        size="sm" 
        className="h-9 w-24 shadow-sm shadow-brand-500/20"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><Check className="w-4 h-4 mr-1"/> Saved</> : "Update"}
      </Button>
    </div>
  )
}
