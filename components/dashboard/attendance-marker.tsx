"use client"

import { useState, useTransition, useEffect, useRef, useCallback } from "react"
import { saveClassAttendance } from "@/app/actions/attendance"
import { Button } from "@/components/ui/button"
import { Loader2, Save, CheckCircle2, XCircle, Clock, AlertCircle, Keyboard, Zap, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function AttendanceMarker({ 
  initialRecords, className, section, date 
}: { 
  initialRecords: any[], className: string, section: string, date: string 
}) {
  const [records, setRecords] = useState(initialRecords)
  const [isPending, startTransition] = useTransition()
  const [activeIndex, setActiveIndex] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)

  // Statistics
  const stats = {
    total: records.length,
    present: records.filter(r => r.status === 'Present').length,
    absent: records.filter(r => r.status === 'Absent').length,
    leave: records.filter(r => r.status === 'Leave').length,
    percentage: records.length ? Math.round((records.filter(r => ['Present', 'Late', 'Half-Day'].includes(r.status)).length / records.length) * 100) : 0
  }

  const performSave = useCallback(async (currentRecords: any[]) => {
    setIsDirty(false)
    await saveClassAttendance(className, section, date, currentRecords)
    setLastSaved(new Date())
  }, [className, section, date])

  const handleStatusChange = (index: number, status: string) => {
    const next = [...records]
    next[index].status = status
    setRecords(next)
    setIsDirty(true)
    
    // Auto-save logic
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => performSave(next), 2000)
    
    // Auto-advance to next student
    if (index < records.length - 1) {
      setActiveIndex(index + 1)
    }
  }
  
  const handleRemarksChange = (index: number, remarks: string) => {
    const next = [...records]
    next[index].remarks = remarks
    setRecords(next)
    setIsDirty(true)
  }

  const markAll = (status: string) => {
    const next = records.map(r => ({ ...r, status }))
    setRecords(next)
    setIsDirty(true)
    performSave(next)
  }

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(prev => Math.min(prev + 1, records.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === '1') {
        handleStatusChange(activeIndex, 'Present')
      } else if (e.key === '2') {
        handleStatusChange(activeIndex, 'Absent')
      } else if (e.key === '3') {
        handleStatusChange(activeIndex, 'Leave')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, records])

  if (records.length === 0) {
    return (
      <div className="p-12 text-center text-muted-fg bg-surface-50 dark:bg-surface-900 border border-dashed rounded-2xl flex flex-col items-center">
        <Info className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-medium">No students found in Class {className} {section ? `Section ${section}` : ''}.</p>
        <p className="text-sm mt-1">Please ensure students are enrolled in this class first.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Precision Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-surface-50 dark:bg-surface-900 border border-border/50 p-3 rounded-lg flex flex-col items-center justify-center shadow-sm">
          <span className="text-[10px] uppercase font-bold text-muted-fg tracking-widest">Total</span>
          <span className="text-xl font-bold text-fg">{stats.total}</span>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-3 rounded-lg flex flex-col items-center justify-center shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-widest">Present</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.present}</span>
        </div>
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-3 rounded-lg flex flex-col items-center justify-center shadow-sm">
          <span className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400 tracking-widest">Absent</span>
          <span className="text-xl font-bold text-red-600 dark:text-red-400">{stats.absent}</span>
        </div>
        <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 p-3 rounded-lg flex flex-col items-center justify-center shadow-sm">
          <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 tracking-widest">Leave</span>
          <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{stats.leave}</span>
        </div>
        <div className="col-span-2 lg:col-span-1 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 p-3 rounded-lg flex flex-col items-center justify-center shadow-sm">
          <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 tracking-widest">Ratio</span>
          <span className="text-xl font-bold text-brand-600 dark:text-brand-400">{stats.percentage}%</span>
        </div>
      </div>

      {/* Bulk Actions & Keyboard Legend */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 border-y border-border/40">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => markAll('Present')} className="text-emerald-600 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-emerald-500/10">All Present</Button>
          <Button variant="outline" size="sm" onClick={() => markAll('Absent')} className="text-red-600 border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10">All Absent</Button>
          <Button variant="outline" size="sm" onClick={() => markAll('Leave')} className="text-purple-600 border-purple-200 dark:border-purple-500/20 hover:bg-purple-50 dark:hover:bg-purple-500/10">All Leave</Button>
        </div>
        <div className="hidden lg:flex items-center gap-4 text-[10px] font-bold text-muted-fg uppercase tracking-widest">
          <div className="flex items-center gap-2"><kbd className="bg-surface-200 dark:bg-surface-800 px-1.5 py-0.5 rounded border border-border/50">1</kbd> Present</div>
          <div className="flex items-center gap-2"><kbd className="bg-surface-200 dark:bg-surface-800 px-1.5 py-0.5 rounded border border-border/50">2</kbd> Absent</div>
          <div className="flex items-center gap-2"><kbd className="bg-surface-200 dark:bg-surface-800 px-1.5 py-0.5 rounded border border-border/50">3</kbd> Leave</div>
          <div className="flex items-center gap-2 text-brand-600"><Keyboard className="w-3 h-3" /> Navigation Active</div>
        </div>
      </div>

      {/* Roster List / Table */}
      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-2xl overflow-hidden shadow-md">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-surface-100/50 dark:bg-surface-900/50 border-b border-border/40 text-[10px] font-bold text-muted-fg uppercase tracking-widest">
          <div className="col-span-1">Roll No</div>
          <div className="col-span-4">Student Name</div>
          <div className="col-span-4">Status Marking</div>
          <div className="col-span-3 text-right">Remarks</div>
        </div>
        
        <div className="max-h-[600px] overflow-y-auto divide-y divide-border/40">
          {records.map((r, i) => (
            <div 
              key={r.studentId} 
              className={cn(
                "grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 transition-all duration-200",
                activeIndex === i ? "bg-brand-50/50 dark:bg-brand-500/5 ring-1 ring-inset ring-brand-500/20 z-10" : "hover:bg-surface-100/30 dark:hover:bg-surface-900/30",
                r.status === 'Absent' && "border-l-4 border-l-red-500",
                r.status === 'Leave' && "border-l-4 border-l-purple-500",
                r.status === 'Present' && "border-l-4 border-l-emerald-500"
              )}
              onClick={() => setActiveIndex(i)}
            >
              <div className="col-span-1 flex items-center">
                <span className="font-mono text-xs font-bold bg-surface-200 dark:bg-surface-800 px-2 py-0.5 rounded text-muted-fg">{r.rollNumber}</span>
              </div>
              <div className="col-span-4 flex items-center">
                <div>
                  <p className="font-bold text-fg">{r.studentName}</p>
                  <p className="text-[10px] text-muted-fg uppercase font-medium tracking-tighter sm:hidden">Student Registration ID: {r.studentId.slice(-6)}</p>
                </div>
              </div>
              <div className="col-span-4 flex items-center">
                <div className="grid grid-cols-3 gap-1 w-full sm:w-auto p-1 bg-surface-100 dark:bg-surface-900 rounded-lg">
                  <button 
                    onClick={() => handleStatusChange(i, 'Present')} 
                    className={cn(
                      "px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                      r.status === 'Present' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40" : "text-muted-fg hover:text-fg hover:bg-surface-200 dark:hover:bg-surface-800"
                    )}
                  >P</button>
                  <button 
                    onClick={() => handleStatusChange(i, 'Absent')} 
                    className={cn(
                      "px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                      r.status === 'Absent' ? "bg-red-500 text-white shadow-lg shadow-red-500/40" : "text-muted-fg hover:text-fg hover:bg-surface-200 dark:hover:bg-surface-800"
                    )}
                  >A</button>
                  <button 
                    onClick={() => handleStatusChange(i, 'Leave')} 
                    className={cn(
                      "px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                      r.status === 'Leave' ? "bg-purple-500 text-white shadow-lg shadow-purple-500/40" : "text-muted-fg hover:text-fg hover:bg-surface-200 dark:hover:bg-surface-800"
                    )}
                  >L</button>
                </div>
              </div>
              <div className="col-span-3 flex items-center justify-end">
                <Input 
                  value={r.remarks || ''} 
                  onChange={(e) => handleRemarksChange(i, e.target.value)} 
                  placeholder="Note student behaviour or reason..." 
                  className="h-9 text-xs bg-transparent border-dashed border-border/60 focus:border-brand-500" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Status Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isDirty ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-fg">
              {isDirty ? "Syncing to Cloud..." : "Records Synced"}
            </span>
          </div>
          {lastSaved && (
            <span className="text-[10px] text-muted-fg/60 font-bold uppercase tracking-widest">
              Last Saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        <Button 
          onClick={() => performSave(records)} 
          disabled={isPending} 
          className="w-full sm:w-auto px-10 h-12 bg-fg text-bg hover:opacity-90 transition-all font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-fg/10"
        >
          {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-bg" /> : <Zap className="w-4 h-4 mr-2 text-brand-500" />}
          Force Cloud Save
        </Button>
      </div>
    </div>
  )
}

