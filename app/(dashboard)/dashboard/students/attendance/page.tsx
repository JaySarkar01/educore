import { getClassAttendance } from "@/app/actions/attendance"
import { AttendanceMarker } from "@/components/dashboard/attendance-marker"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CalendarDays, Filter } from "lucide-react"

export default async function AttendancePage(
  props: { searchParams: Promise<{ class?: string, section?: string, date?: string }> }
) {
  const sp = await props.searchParams
  const date = sp?.date || new Date().toISOString().split('T')[0]
  const className = sp?.class || ""
  const section = sp?.section || ""

  let attendanceData = null
  if (className) {
    attendanceData = await getClassAttendance(className, section, date)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-fg tracking-tight">Daily Attendance Tracking</h1>
        <p className="text-muted-fg mt-1 text-lg">Mark and manage bulk student attendance rosters.</p>
      </div>

      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm">
        <form className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Date</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-2.5 w-4 h-4 text-muted-fg" />
              <Input name="date" type="date" defaultValue={date} className="pl-9 h-10" required />
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Class</label>
            <Input name="class" defaultValue={className} className="h-10" placeholder="e.g. 10th" required />
          </div>
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Section (Optional)</label>
            <Input name="section" defaultValue={section} className="h-10" placeholder="e.g. A" />
          </div>
          <Button type="submit" className="h-10 px-8 bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20"><Filter className="w-4 h-4 mr-2"/> Fetch Roster</Button>
        </form>
      </div>

      {className && attendanceData ? (
        <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm animate-in slide-in-from-bottom-4 duration-300">
          <AttendanceMarker 
            initialRecords={attendanceData.records || []} 
            className={className} 
            section={section} 
            date={date} 
          />
        </div>
      ) : (
        <div className="bg-surface-50/50 dark:bg-surface-900/50 border border-border/40 border-dashed rounded-xl p-16 flex flex-col items-center justify-center text-center">
          <CalendarDays className="w-12 h-12 text-muted-fg/40 mb-4" />
          <h3 className="text-lg font-semibold text-fg">Select Class & Date</h3>
          <p className="text-muted-fg max-w-sm mt-2">Enter the class parameters above to fetch the daily roster and mark attendance.</p>
        </div>
      )}
    </div>
  )
}
