"use client"
import { useState, useTransition } from "react"
import { saveClassAttendance } from "@/app/actions/attendance"
import { Button } from "@/components/ui/button"
import { Loader2, Save, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

export function AttendanceMarker({ 
  initialRecords, className, section, date 
}: { 
  initialRecords: any[], className: string, section: string, date: string 
}) {
  const [records, setRecords] = useState(initialRecords)
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (index: number, status: string) => {
    const next = [...records]
    next[index].status = status
    setRecords(next)
  }
  
  const handleRemarksChange = (index: number, remarks: string) => {
    const next = [...records]
    next[index].remarks = remarks
    setRecords(next)
  }

  const handleSave = () => {
    startTransition(async () => {
      await saveClassAttendance(className, section, date, records)
      alert("Attendance Saved Successfully!")
    })
  }
  
  const markAll = (status: string) => {
    setRecords(records.map(r => ({ ...r, status })))
  }

  if (records.length === 0) {
    return (
      <div className="p-8 text-center text-muted-fg bg-surface-50 dark:bg-surface-900 border border-dashed rounded-xl">
        No students found in Class {className} {section ? `Section ${section}` : ''}.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="font-semibold text-fg">Attendance Roster</h3>
          <p className="text-sm text-muted-fg mt-1">Total {records.length} students</p>
        </div>
        <div className="flex items-center gap-2">
           <Button type="button" variant="outline" size="sm" onClick={() => markAll('Present')} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"><CheckCircle2 className="w-4 h-4 mr-2"/> All Present</Button>
           <Button type="button" variant="outline" size="sm" onClick={() => markAll('Absent')} className="text-red-600 hover:text-red-700 hover:bg-red-50"><XCircle className="w-4 h-4 mr-2"/> All Absent</Button>
        </div>
      </div>
      <div className="bg-surface-50 dark:bg-surface-950 border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-fg uppercase bg-surface-100/50 dark:bg-surface-900/50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold">Roll No</th>
              <th className="px-6 py-4 font-semibold">Student Name</th>
              <th className="px-6 py-4 font-semibold">Status Marking</th>
              <th className="px-6 py-4 font-semibold w-1/4">Remarks (Optional)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {records.map((r, i) => (
              <tr key={r.studentId} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/30 transition-colors">
                <td className="px-6 py-3 font-medium">{r.rollNumber}</td>
                <td className="px-6 py-3 font-semibold text-fg">{r.studentName}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-1.5 p-1 bg-surface-100 dark:bg-surface-900 rounded-md w-fit">
                    <button onClick={() => handleStatusChange(i, 'Present')} className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${r.status === 'Present' ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted-fg hover:text-fg hover:bg-surface-200'}`}>Present</button>
                    <button onClick={() => handleStatusChange(i, 'Absent')} className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${r.status === 'Absent' ? 'bg-red-500 text-white shadow-sm' : 'text-muted-fg hover:text-fg hover:bg-surface-200'}`}>Absent</button>
                    <button onClick={() => handleStatusChange(i, 'Late')} className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${r.status === 'Late' ? 'bg-amber-500 text-white shadow-sm' : 'text-muted-fg hover:text-fg hover:bg-surface-200'}`}>Late</button>
                    <button onClick={() => handleStatusChange(i, 'Half-Day')} className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${r.status === 'Half-Day' ? 'bg-blue-500 text-white shadow-sm' : 'text-muted-fg hover:text-fg hover:bg-surface-200'}`}>Half</button>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <Input value={r.remarks || ''} onChange={(e) => handleRemarksChange(i, e.target.value)} placeholder="Note..." className="h-8 text-xs bg-transparent" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isPending} className="lg:w-48 shadow-lg shadow-brand-500/20">
          {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Roster...</> : <><Save className="w-4 h-4 mr-2" /> Save Attendance</>}
        </Button>
      </div>
    </div>
  )
}
