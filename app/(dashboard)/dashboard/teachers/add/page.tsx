"use client"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Save } from "lucide-react"
import { addTeacher } from "@/app/actions/teacher"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AddTeacherPage() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleAction = (formData: FormData) => {
    startTransition(async () => {
      const res = await addTeacher(formData)
      if (res?.success) {
        router.push("/dashboard/teachers/manage")
      }
    })
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Link href="/dashboard/teachers/manage" className="inline-flex items-center text-sm font-medium text-muted-fg hover:text-fg transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Manage Teachers
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-fg tracking-tight">Register New Teacher</h1>
        <p className="text-muted-fg mt-1 text-lg">Onboard a new faculty member into the system.</p>
      </div>

      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-lg overflow-hidden mt-6">
        <form action={handleAction} className="p-8 space-y-8">
          
          {/* Professional Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider border-b border-border/30 pb-2">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" name="employeeId" placeholder="Auto-generated if empty" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input id="department" name="department" required placeholder="e.g. Science" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input id="joiningDate" name="joiningDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subjects">Subjects Handled</Label>
                <Input id="subjects" name="subjects" placeholder="e.g. Physics, Math (comma separated)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseSalary">Base Salary ($)</Label>
                <Input id="baseSalary" name="baseSalary" type="number" placeholder="50000" />
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider border-b border-border/30 pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" required placeholder="Jane Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select id="gender" name="gender" className="flex h-10 w-full rounded-md border border-border bg-surface-50 dark:bg-surface-950 px-3 py-1 text-sm shadow-sm">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" placeholder="+1..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="jane@school.edu" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input id="address" name="address" placeholder="123 Faculty Row..." />
            </div>
          </div>

          {/* Academic Profile */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider border-b border-border/30 pb-2">Academic Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="qualification">Highest Qualification *</Label>
                <Input id="qualification" name="qualification" required placeholder="e.g. M.Sc. Physics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" name="experience" type="number" min="0" placeholder="5" />
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-end gap-4 border-t border-border/40 mt-10">
            <Link href="/dashboard/teachers/manage">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isPending} className="lg:w-48 shadow-lg shadow-brand-500/20">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isPending ? "Onboarding..." : "Register Teacher"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
