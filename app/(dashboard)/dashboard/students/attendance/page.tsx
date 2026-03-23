import { getClassAttendance, getMonthlyClassAttendance } from "@/app/actions/attendance"
import { getClasses } from "@/app/actions/academic"
import { AttendanceMarker } from "@/components/dashboard/attendance-marker"
import { AttendanceCalendar } from "@/components/dashboard/attendance-calendar"
import { AttendanceFilterForm } from "@/components/dashboard/attendance-filter-form"
import { CalendarDays, Filter, LayoutGrid, Calendar as CalendarIcon } from "lucide-react"
import Link from "next/link"

export default async function AttendancePage(
  props: { searchParams: Promise<{ class?: string, section?: string, date?: string, mode?: string }> }
) {
  const sp = await props.searchParams
  const date = sp?.date || new Date().toISOString().split('T')[0]
  const className = sp?.class || ""
  const section = sp?.section || ""
  const mode = sp?.mode || "daily"

  const classes = await getClasses()
  
  let attendanceData = null
  let monthlyData = null

  if (className) {
    if (mode === 'daily') {
      attendanceData = await getClassAttendance(className, section, date)
    } else {
      const d = new Date(date)
      monthlyData = await getMonthlyClassAttendance(className, section, d.getMonth() + 1, d.getFullYear())
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-fg tracking-tight">Daily Attendance Tracking</h1>
        <p className="text-muted-fg mt-1 text-lg">Mark and manage bulk student attendance rosters.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex bg-surface-100 dark:bg-surface-900 p-1 rounded-lg border border-border/50">
          <Link 
            href={`/dashboard/students/attendance?mode=daily&class=${className}&section=${section}&date=${date}`}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'daily' ? 'bg-white dark:bg-surface-800 shadow-sm text-brand-600 dark:text-brand-400' : 'text-muted-fg hover:text-fg'}`}
          >
            <LayoutGrid className="w-4 h-4" /> Daily Marking
          </Link>
          <Link 
            href={`/dashboard/students/attendance?mode=monthly&class=${className}&section=${section}&date=${date}`}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'monthly' ? 'bg-white dark:bg-surface-800 shadow-sm text-brand-600 dark:text-brand-400' : 'text-muted-fg hover:text-fg'}`}
          >
            <CalendarIcon className="w-4 h-4" /> Monthly View
          </Link>
        </div>
      </div>

      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm">
        <AttendanceFilterForm 
          classes={classes}
          initialClass={className}
          initialSection={section}
          initialDate={date}
          mode={mode}
        />
      </div>

      {className && (mode === 'daily' ? attendanceData : monthlyData) ? (
        <div className="animate-in slide-in-from-bottom-4 duration-300">
          {mode === 'daily' ? (
            <AttendanceMarker 
              initialRecords={attendanceData?.records || []} 
              className={className} 
              section={section} 
              date={date} 
            />
          ) : (
            <AttendanceCalendar 
              monthlyRecords={monthlyData || []} 
              className={className} 
              section={section} 
              date={date} 
            />
          )}
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
