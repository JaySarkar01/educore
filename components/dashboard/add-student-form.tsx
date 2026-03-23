"use client"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X, Loader2 } from "lucide-react"
import { addStudent } from "@/app/actions/student"

export function AddStudentForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleAction = (formData: FormData) => {
    startTransition(async () => {
      await addStudent(formData)
      setIsOpen(false)
    })
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="gap-2 shadow-sm shadow-brand-500/20">
        <Plus className="w-4 h-4" /> Add Student
      </Button>
    )
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2 shadow-sm shadow-brand-500/20">
        <Plus className="w-4 h-4" /> Add Student
      </Button>
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex justify-center p-4 shadow-2xl overflow-y-auto">
        <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-2xl w-full max-w-4xl h-fit overflow-hidden animate-in fade-in zoom-in-95 duration-200 mt-8 mb-8">
          <div className="flex items-center justify-between p-5 border-b border-border/40 sticky top-0 bg-surface-50/90 dark:bg-surface-950/90 backdrop-blur-md z-10">
            <div>
              <h2 className="text-xl font-bold text-fg">Register New Student</h2>
              <p className="text-sm text-muted-fg mt-1">Fill out the complete student onboarding application.</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-fg hover:text-fg" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <form action={handleAction} className="p-6 space-y-8">
            
            {/* Academic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider border-b border-border/30 pb-2">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="admissionNo">Admission No</Label>
                  <Input id="admissionNo" name="admissionNo" placeholder="Leave empty to auto-generate" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="className">Class *</Label>
                  <Input id="className" name="className" required placeholder="e.g. 10th" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Input id="section" name="section" placeholder="e.g. A" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="admissionDate">Admission Date</Label>
                  <Input id="admissionDate" name="admissionDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previousSchool">Previous School</Label>
                  <Input id="previousSchool" name="previousSchool" placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select id="status" name="status" className="flex h-9 w-full rounded-md border border-border bg-surface-50 dark:bg-surface-950 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider border-b border-border/30 pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" required placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select id="gender" name="gender" className="flex h-9 w-full rounded-md border border-border bg-surface-50 dark:bg-surface-950 px-3 py-1 text-sm shadow-sm">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Student Phone</Label>
                  <Input id="phone" name="phone" placeholder="+1..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode / Zip</Label>
                  <Input id="pincode" name="pincode" placeholder="10001" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input id="address" name="address" placeholder="123 Main St..." />
              </div>
            </div>

            {/* Parent Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider border-b border-border/30 pb-2">Parent / Guardian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Father / Guardian Name *</Label>
                  <Input id="parentName" name="parentName" required placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Primary Emergency Phone *</Label>
                  <Input id="parentPhone" name="parentPhone" required placeholder="+1..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherName">Mother Name</Label>
                  <Input id="motherName" name="motherName" placeholder="" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherPhone">Mother Phone</Label>
                  <Input id="motherPhone" name="motherPhone" placeholder="+1..." />
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider border-b border-border/30 pb-2">Facility & Medical</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="transportRoute">Transport Route</Label>
                  <Input id="transportRoute" name="transportRoute" placeholder="Bus Route 4" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hostelRoom">Hostel Details (Optional)</Label>
                  <Input id="hostelRoom" name="hostelRoom" placeholder="Block A, Room 102" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="medicalNotes">Medical Notes / Allergies</Label>
                  <Input id="medicalNotes" name="medicalNotes" placeholder="Allergic to peanuts..." />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/40 mt-8">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enrolling Data...
                  </>
                ) : (
                  "Enroll Student into Database"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
