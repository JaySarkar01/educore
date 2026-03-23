"use client"

import { CalendarDays, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"

export function AttendanceCalendar({ 
  monthlyRecords, className, section, date 
}: { 
  monthlyRecords: any[], className: string, section: string, date: string 
}) {
  const targetDate = new Date(date)
  const month = targetDate.getMonth()
  const year = targetDate.getFullYear()
  
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  
  const monthName = targetDate.toLocaleString('default', { month: 'long' })
  
  // Aggregate stats across the month
  let totalPresent = 0
  let totalAbsent = 0
  let totalLate = 0
  let totalLeave = 0
  
  monthlyRecords.forEach(day => {
    day.records.forEach((r: any) => {
      if (r.status === 'Present') totalPresent++
      else if (r.status === 'Absent') totalAbsent++
      else if (r.status === 'Late') totalLate++
      else if (r.status === 'Leave') totalLeave++
    })
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Total Present</p>
          <p className="text-2xl font-bold text-fg mt-1">{totalPresent}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-100 dark:border-red-500/20">
          <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Total Absent</p>
          <p className="text-2xl font-bold text-fg mt-1">{totalAbsent}</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-100 dark:border-amber-500/20">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Total Late</p>
          <p className="text-2xl font-bold text-fg mt-1">{totalLate}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-500/10 p-4 rounded-xl border border-purple-100 dark:border-purple-500/20">
          <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Total Leave</p>
          <p className="text-2xl font-bold text-fg mt-1">{totalLeave}</p>
        </div>
      </div>

      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border/40 flex items-center justify-between bg-surface-100/30 dark:bg-surface-900/10">
          <h3 className="text-xl font-bold text-fg">{monthName} {year}</h3>
          <p className="text-sm font-medium text-muted-fg">Class {className} {section && `• Sec ${section}`}</p>
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-border/40">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-surface-50 dark:bg-surface-950 p-4 text-center text-xs font-bold text-muted-fg uppercase tracking-widest">{day}</div>
          ))}
          
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-surface-100/20 dark:bg-surface-900/10 h-32" />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1
            const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`
            const monthStr = (month + 1) < 10 ? `0${month+1}` : `${month+1}`
            const dateKey = `${year}-${monthStr}-${dayStr}`
            
            const dayData = monthlyRecords.find(d => d.date === dateKey)
            
            return (
              <div key={dayNum} className={`bg-surface-50 dark:bg-surface-950 h-32 p-3 border-r border-b border-border/20 transition-colors hover:bg-surface-100/50 dark:hover:bg-surface-900/50 relative group`}>
                <span className={`text-sm font-bold ${dayData ? 'text-brand-600 dark:text-brand-400' : 'text-muted-fg opacity-40'}`}>{dayNum}</span>
                
                {dayData && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">
                      <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                      {dayData.records.filter((r: any) => r.status === 'Present').length} P
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded-sm">
                      <div className="w-1 h-1 rounded-full bg-red-500"></div>
                      {dayData.records.filter((r: any) => r.status === 'Absent').length} A
                    </div>
                    {dayData.records.some((r: any) => r.status === 'Leave') && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-1.5 py-0.5 rounded-sm">
                        <div className="w-1 h-1 rounded-full bg-purple-500"></div>
                        {dayData.records.filter((r: any) => r.status === 'Leave').length} L
                      </div>
                    )}
                  </div>
                )}
                
                {!dayData && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-muted-fg/40 uppercase tracking-tighter">No Record</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
