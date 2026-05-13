"use client"
import { useState, useTransition } from "react"
import { assignClassTeacher } from "@/app/actions/academic"
import { Loader2, Check } from "lucide-react"

export function AssignClassTeacherSelect({ classId, initialTeacherId, teachers }: { classId: string, initialTeacherId: string, teachers: any[] }) {
  const [selectedId, setSelectedId] = useState(initialTeacherId || "")
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value
    setSelectedId(newId)
    startTransition(async () => {
      await assignClassTeacher(classId, newId)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <select 
          value={selectedId} 
          onChange={handleChange} 
          disabled={isPending}
          className="w-full text-xs font-medium bg-surface-100 dark:bg-surface-900 border border-border/50 text-fg rounded-md px-3 py-1.5 appearance-none focus:outline-none focus:ring-1 focus:ring-brand-500 pr-8"
        >
          <option value="">Unassigned</option>
          {teachers.map(t => (
            <option key={t.id} value={t.id}>{t.name} ({t.employeeId})</option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          {isPending ? <Loader2 className="w-3 h-3 animate-spin text-brand-500" /> : saved ? <Check className="w-3 h-3 text-emerald-500" /> : <div className="w-2 h-2 border-r border-b border-muted-fg/50 rotate-45 -translate-y-1" />}
        </div>
      </div>
    </div>
  )
}
