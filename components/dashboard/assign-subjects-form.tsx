"use client"
import { useState, useTransition } from "react"
import { assignSubjects } from "@/app/actions/teacher"
import { getSubjects } from "@/app/actions/academic"
import { Button } from "@/components/ui/button"
import { Loader2, Check } from "lucide-react"
import { useEffect } from "react"

export function AssignSubjectsRow({ teacherId, initialSubjects }: { teacherId: string, initialSubjects: string | string[] }) {
  const [globalSubjects, setGlobalSubjects] = useState<any[]>([])
  const initialString = typeof initialSubjects === 'string' ? initialSubjects : (initialSubjects || []).join(', ')
  const [selectedFields, setSelectedFields] = useState<string[]>(
    initialString.split(',').map(s => s.trim()).filter(Boolean)
  )
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getSubjects().then(setGlobalSubjects)
  }, [])

  const toggleSubject = (sub: string) => {
    if (selectedFields.includes(sub)) {
      setSelectedFields(selectedFields.filter(s => s !== sub))
    } else {
      setSelectedFields([...selectedFields, sub])
    }
    setSaved(false)
  }

  const handleSave = () => {
    startTransition(async () => {
      await assignSubjects(teacherId, selectedFields.join(', '))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 max-w-md">
         {globalSubjects.length === 0 ? <span className="text-xs text-muted-fg mt-1">No Master Subjects Found in DB</span> : globalSubjects.map(sub => (
           <button
             key={sub._id}
             onClick={() => toggleSubject(sub.subjectName)}
             className={`px-2 py-1 text-xs font-semibold rounded-md border transition-colors ${
               selectedFields.includes(sub.subjectName) 
                 ? 'bg-brand-500/10 border-brand-500/30 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300' 
                 : 'bg-surface-100 dark:bg-surface-900 border-border/40 text-muted-fg hover:bg-surface-200 dark:hover:bg-surface-800'
             }`}
           >
             {sub.subjectName}
           </button>
         ))}
      </div>
      <div className="flex justify-end pt-1">
        <Button 
          onClick={handleSave} 
          disabled={isPending || selectedFields.join(', ') === initialString} 
          size="sm" 
          variant="secondary"
          className="h-8 text-xs shadow-sm shadow-brand-500/10 border border-border/50"
        >
          {isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : saved ? <Check className="w-3 h-3 mr-1 text-emerald-500"/> : null}
          {saved ? "Saved Data" : "Update Assignments"}
        </Button>
      </div>
    </div>
  )
}
