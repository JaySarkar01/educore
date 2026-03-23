"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CalendarDays, Filter } from "lucide-react"

export function AttendanceFilterForm({ 
  classes, 
  initialClass, 
  initialSection, 
  initialDate,
  mode
}: { 
  classes: any[], 
  initialClass: string, 
  initialSection: string, 
  initialDate: string,
  mode: string
}) {
  const router = useRouter()
  const [selectedClass, setSelectedClass] = useState(initialClass)
  const [selectedSection, setSelectedSection] = useState(initialSection)
  const [selectedDate, setSelectedDate] = useState(initialDate)

  // Find sections for the currently selected class
  const classObj = classes.find(c => c.className === selectedClass)
  const sections = classObj?.sections || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (selectedClass) params.set('class', selectedClass)
    if (selectedSection) params.set('section', selectedSection)
    if (selectedDate) params.set('date', selectedDate)
    if (mode) params.set('mode', mode)
    
    router.push(`/dashboard/students/attendance?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
      <div className="space-y-2">
        <label className="text-sm font-medium">Class Selection</label>
        <select 
          name="class" 
          value={selectedClass} 
          onChange={(e) => {
            setSelectedClass(e.target.value)
            setSelectedSection("All") // Reset section when class changes
          }}
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-brand-500" 
          required
        >
          <option value="">Select Class</option>
          {classes.map((c: any) => (
            <option key={c.id} value={c.className}>{c.className}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Section</label>
        <select 
          name="section" 
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-brand-500"
          disabled={!selectedClass}
        >
          <option value="All">All Sections</option>
          {sections.map((s: string) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Target Date</label>
        <div className="relative">
          <CalendarDays className="absolute left-3 top-2.5 w-4 h-4 text-muted-fg" />
          <Input 
            name="date" 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-9 h-10" 
            required 
          />
        </div>
      </div>

      <Button type="submit" className="h-10 bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20">
        <Filter className="w-4 h-4 mr-2"/> Load Roster
      </Button>
    </form>
  )
}
