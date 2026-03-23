"use client"
import { useState, useTransition } from "react"
import { saveStaffAttendance } from "@/app/actions/staff-attendance"
import { Button } from "@/components/ui/button"
import { Loader2, Save, CheckCircle2, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

export function StaffAttendanceMarker({ 
  initialRecords, date 
}: { 
  initialRecords: any[], date: string 
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
      await saveStaffAttendance(date, records)
      alert("Faculty Attendance Saved Successfully!")
    })
  }

  const markAll = (status: string) => {
    setRecords(records.map(r => ({ ...r, status })))
  }

  if (records.length === 0) {
    return (
      <div className="p-8 text-center text-muted-fg bg-surface-50 dark:bg-surface-900 border border-dashed rounded-xl">
        No active faculty found for this date.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h3 className="font-semibold text-fg">Staff Roster - {new Date(date).toLocaleDateString()}</h3>
          <p className="text-sm text-muted-fg mt-1">Total {records.length} faculty members</p>
        </div>
        <div className="flex items-center gap-2">
           <Button type="button" variant="outline" size="sm" onClick={() => markAll('Present')} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"><CheckCircle2 className="w-4 h-4 mr-2"/> Set All Present</Button>
           <Button type="button" variant="outline" size="sm" onClick={() => markAll('Absent')} className="text-red-600 hover:text-red-700 hover:bg-red-50"><XCircle className="w-4 h-4 mr-2"/> Set All Absent</Button>
        </div>
      </div>
      <div className="bg-surface-50 dark:bg-surface-950 border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-fg uppercase bg-surface-100/50 dark:bg-surface-900/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold w-[20%]">Faculty Member</th>
                <th className="px-6 py-4 font-semibold w-[15%]">Department</th>
                <th className="px-6 py-4 font-semibold w-[40%]">Status Marking</th>
                <th className="px-6 py-4 font-semibold w-[25%]">Remarks (Optional)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {records.map((r, i) => (
                <tr key={r.employeeId} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-fg">{r.name}</td>
                  <td className="px-6 py-4 font-medium text-muted-fg">{r.department}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface-100 dark:bg-surface-900 rounded-md w-fit">
                      <button onClick={() => handleStatusChange(i, 'Present')} className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${r.status === 'Present' ? 'bg-emerald-500 text-white shadow-sm' : 'text-muted-fg hover:text-fg hover:bg-surface-200'}`}>Present</button>
                      <button onClick={() => handleStatusChange(i, 'Absent')} className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${r.status === 'Absent' ? 'bg-red-500 text-white shadow-sm' : 'text-muted-fg hover:text-fg hover:bg-surface-200'}`}>Absent</button>
                      <button onClick={() => handleStatusChange(i, 'Late')} className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${r.status === 'Late' ? 'bg-amber-500 text-white shadow-sm' : 'text-muted-fg hover:text-fg hover:bg-surface-200'}`}>Late</button>
                      <button onClick={() => handleStatusChange(i, 'Half-Day')} className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${r.status === 'Half-Day' ? 'bg-blue-500 text-white shadow-sm' : 'text-muted-fg hover:text-fg hover:bg-surface-200'}`}>Half-Day</button>
                      <button onClick={() => handleStatusChange(i, 'On Leave')} className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${r.status === 'On Leave' ? 'bg-purple-500 text-white shadow-sm' : 'text-muted-fg hover:text-fg hover:bg-surface-200'}`}>On Leave</button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Input value={r.remarks || ''} onChange={(e) => handleRemarksChange(i, e.target.value)} placeholder="Reason..." className="h-8 text-xs bg-transparent" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isPending} className="lg:w-48 shadow-lg shadow-brand-500/20">
          {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Committing...</> : <><Save className="w-4 h-4 mr-2" /> Log Roster</>}
        </Button>
      </div>
    </div>
  )
}
