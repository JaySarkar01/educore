"use client"
import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Save, AlertCircle } from "lucide-react"
import { addTeacher } from "@/app/actions/teacher"
import { getSubjects } from "@/app/actions/academic"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AddTeacherPage() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [subjects, setSubjects] = useState<any[]>([])
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [isDirty, setIsDirty] = useState(false)
  const [formValues, setFormValues] = useState({
    employeeId: "",
    department: "",
    joiningDate: new Date().toISOString().split('T')[0],
    baseSalary: "",
    name: "",
    gender: "Female",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    qualification: "",
    experience: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormValues(prev => ({ ...prev, [name]: value }))
    setIsDirty(true)
  }

  const handlePhoneInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    target.value = target.value.replace(/\D/g, '').slice(0, 10)
    setFormValues(prev => ({ ...prev, [target.name]: target.value }))
    setIsDirty(true)
  }

  useEffect(() => {
    getSubjects().then(setSubjects)
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty])

  const handleAction = (formData: FormData) => {
    setErrors({})
    const checked = formData.getAll('subjects_checkbox')
    if (checked.length > 0) {
      formData.set('subjects', checked.join(', '))
    }

    startTransition(async () => {
      const res = await addTeacher(formData)
      if (res?.success) {
        setIsDirty(false) // Clear dirty state before redirect
        router.push("/dashboard/teachers/manage")
      } else if (res?.fieldErrors) {
        setErrors(res.fieldErrors)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  const ErrorWarning = ({ field }: { field: string }) => {
    if (!errors[field]) return null
    return (
      <p className="text-[10px] font-bold text-red-600 dark:text-red-400 mt-1 uppercase tracking-widest flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {errors[field][0]}
      </p>
    )
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
        <form 
          action={handleAction} 
          className="p-8 space-y-8"
        >
          
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="text-sm font-bold text-red-700 dark:text-red-300">Form Submission Warning</p>
                <p className="text-xs text-red-600 dark:text-red-400">Please correct the highlighted fields below to continue.</p>
              </div>
            </div>
          )}

          {/* Professional Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider border-b border-border/30 pb-2">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" name="employeeId" value={formValues.employeeId} onChange={handleChange} placeholder="Auto-generated if empty" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input id="department" name="department" required value={formValues.department} onChange={handleChange} placeholder="e.g. Science" className={errors.department ? "border-red-500" : ""} />
                <ErrorWarning field="department" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input id="joiningDate" name="joiningDate" type="date" value={formValues.joiningDate} onChange={handleChange} className={errors.joiningDate ? "border-red-500" : ""} />
                <ErrorWarning field="joiningDate" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Subjects Handled</Label>
                <div className="flex flex-wrap gap-3 p-3 bg-surface-100 dark:bg-surface-900 rounded-md border border-border/50 max-h-32 overflow-y-auto">
                   {subjects.length === 0 ? <span className="text-xs text-muted-fg mt-1">No subjects structurally registered globally yet.</span> : subjects.map(sub => (
                     <label key={sub._id} className="flex items-center gap-2 text-sm font-medium text-fg cursor-pointer hover:text-brand-600 transition-colors">
                        <input type="checkbox" name="subjects_checkbox" value={sub.subjectName} onChange={() => setIsDirty(true)} className="accent-brand-500 rounded-sm w-4 h-4 cursor-pointer border-border" />
                        {sub.subjectName}
                     </label>
                   ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseSalary">Base Salary (₹)</Label>
                <Input id="baseSalary" name="baseSalary" type="number" value={formValues.baseSalary} onChange={handleChange} placeholder="50000" />
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider border-b border-border/30 pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" required value={formValues.name} onChange={handleChange} placeholder="Jane Smith" className={errors.name ? "border-red-500" : ""} />
                <ErrorWarning field="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select id="gender" name="gender" value={formValues.gender} onChange={handleChange} className="flex h-10 w-full rounded-md border border-border bg-surface-50 dark:bg-surface-950 px-3 py-1 text-sm shadow-sm">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formValues.dateOfBirth} onChange={handleChange} className={errors.dateOfBirth ? "border-red-500" : ""} />
                <ErrorWarning field="dateOfBirth" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={formValues.phone} onInput={handlePhoneInput} placeholder="9876543210" maxLength={10} className={errors.phone ? "border-red-500" : ""} />
                <ErrorWarning field="phone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={formValues.email} onChange={handleChange} placeholder="jane@school.edu" className={errors.email ? "border-red-500" : ""} />
                <ErrorWarning field="email" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input id="address" name="address" value={formValues.address} onChange={handleChange} placeholder="123 Faculty Row..." />
            </div>
          </div>

          {/* Academic Profile */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider border-b border-border/30 pb-2">Academic Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="qualification">Highest Qualification *</Label>
                <Input id="qualification" name="qualification" required value={formValues.qualification} onChange={handleChange} placeholder="e.g. M.Sc. Physics" className={errors.qualification ? "border-red-500" : ""} />
                <ErrorWarning field="qualification" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" name="experience" type="number" min="0" value={formValues.experience} onChange={handleChange} placeholder="5" className={errors.experience ? "border-red-500" : ""} />
                <ErrorWarning field="experience" />
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
