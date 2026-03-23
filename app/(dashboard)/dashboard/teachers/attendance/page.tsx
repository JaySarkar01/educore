import { getStaffAttendance } from "@/app/actions/staff-attendance"
import { StaffAttendanceMarker } from "@/components/dashboard/staff-attendance-marker"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CalendarDays, Filter } from "lucide-react"

export default async function TeacherAttendancePage(
  props: { searchParams: Promise<{ date?: string }> }
) {
  const sp = await props.searchParams
  const date = sp?.date || new Date().toISOString().split('T')[0]

  const attendanceData = await getStaffAttendance(date)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-fg tracking-tight">Faculty Attendance</h1>
        <p className="text-muted-fg mt-1 text-lg">Mark daily check-ins for all active and deployed staff members.</p>
      </div>

      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-end gap-4">
        <form className="flex-1 max-w-sm space-y-2 relative">
          <label className="text-sm font-medium">Select Date Map</label>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <CalendarDays className="absolute left-3 top-2.5 w-4 h-4 text-muted-fg" />
              <Input name="date" type="date" defaultValue={date} className="pl-9 h-10 w-full" required />
            </div>
            <Button type="submit" className="h-10 bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20"><Filter className="w-4 h-4 mr-2"/> Query</Button>
          </div>
        </form>
      </div>

      {attendanceData ? (
        <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm animate-in slide-in-from-bottom-4 duration-300">
          <StaffAttendanceMarker 
            initialRecords={attendanceData.records || []} 
            date={date} 
          />
        </div>
      ) : (
        <div className="p-12 text-center text-muted-fg">Unable to load attendance module.</div>
      )}
    </div>
  )
}
