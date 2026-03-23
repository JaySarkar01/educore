"use client"
import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Save, AlertCircle } from "lucide-react"
import { addStudent } from "@/app/actions/student"
import { getClasses } from "@/app/actions/academic"
import { CloudinaryUploader } from "@/components/dashboard/cloudinary-uploader"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AddStudentPage() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [classes, setClasses] = useState<any[]>([])
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [isDirty, setIsDirty] = useState(false)
  const [photoUrl, setPhotoUrl] = useState("")

  const [formValues, setFormValues] = useState({
    admissionNo: "",
    className: "",
    section: "None",
    admissionDate: new Date().toISOString().split('T')[0],
    previousSchool: "",
    status: "Active",
    name: "",
    gender: "Male",
    dateOfBirth: "",
    phone: "",
    pincode: "",
    address: "",
    parentName: "",
    parentPhone: "",
    motherName: "",
    motherPhone: "",
    transportRoute: "",
    hostelRoom: "",
    medicalNotes: ""
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
    getClasses().then(setClasses)
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) { e.preventDefault(); e.returnValue = "" }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty])

  const handleAction = (formData: FormData) => {
    setErrors({})
    // Inject the Cloudinary URL into the form
    formData.set("photo", photoUrl)
    startTransition(async () => {
      const res = await addStudent(formData)
      if (res?.success) {
        setIsDirty(false)
        router.push("/dashboard/students/manage")
      } else if (res?.fieldErrors) {
        setErrors(res.fieldErrors)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (res?.error) {
        setErrors({ _form: [res.error] })
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
      <Link href="/dashboard/students/manage" className="inline-flex items-center text-sm font-medium text-muted-fg hover:text-fg transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Manage Students
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-fg tracking-tight">Register New Student</h1>
        <p className="text-muted-fg mt-1 text-lg">Fill out the complete student onboarding application.</p>
      </div>

      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-lg overflow-hidden mt-6">
        <form action={handleAction} className="p-8 space-y-8">

          {(Object.keys(errors).length > 0) && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-700 dark:text-red-300">
                  {errors._form ? errors._form[0] : "Form Submission Warning"}
                </p>
                {!errors._form && (
                  <p className="text-xs text-red-600 dark:text-red-400">Please correct the highlighted fields below to continue.</p>
                )}
              </div>
            </div>
          )}

          {/* ── Profile Photo ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider border-b border-border/30 pb-2">
              Profile Photo <span className="text-muted-fg font-normal normal-case tracking-normal">(Optional • max 2 MB)</span>
            </h3>
            <div className="flex items-center gap-6">
              <CloudinaryUploader
                endpoint="/api/upload/student-photo"
                accept="image/*"
                maxMB={2}
                avatarMode
                value={photoUrl}
                onChange={setPhotoUrl}
                onRemove={() => setPhotoUrl("")}
              />
              <div className="space-y-1">
                <p className="text-sm font-medium text-fg">Upload Student Photo</p>
                <p className="text-xs text-muted-fg">Drag & drop or click the avatar to upload.<br />JPG, PNG or WEBP • Max 2 MB</p>
              </div>
            </div>
          </div>

          {/* ── Academic Info ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider border-b border-border/30 pb-2">Academic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="admissionNo">Admission No</Label>
                <Input id="admissionNo" name="admissionNo" value={formValues.admissionNo} onChange={handleChange} placeholder="Auto-gen if empty" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="className">Class *</Label>
                <select
                  id="className" name="className" required
                  value={formValues.className} onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-border bg-surface-50 dark:bg-surface-950 px-3 py-1 text-sm shadow-sm focus:ring-1 focus:ring-brand-500"
                >
                  <option value="" disabled>Select Class</option>
                  {classes.map((c) => <option key={c._id} value={c.className}>{c.className}</option>)}
                </select>
                <ErrorWarning field="className" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section *</Label>
                <select
                  id="section" name="section" required
                  value={formValues.section} onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-border bg-surface-50 dark:bg-surface-950 px-3 py-1 text-sm shadow-sm focus:ring-1 focus:ring-brand-500"
                  disabled={!formValues.className}
                >
                  {classes.find(c => c.className === formValues.className)?.sections?.map((s: string) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  {(!classes.find(c => c.className === formValues.className)?.sections?.length) && (
                    <option value="None">None Available</option>
                  )}
                </select>
                <ErrorWarning field="section" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input id="admissionDate" name="admissionDate" type="date" value={formValues.admissionDate} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="previousSchool">Previous School</Label>
                <Input id="previousSchool" name="previousSchool" value={formValues.previousSchool} onChange={handleChange} placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" value={formValues.status} onChange={handleChange} className="flex h-10 w-full rounded-md border border-border bg-surface-50 dark:bg-surface-950 px-3 py-1 text-sm shadow-sm">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Personal Info ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider border-b border-border/30 pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" required value={formValues.name} onChange={handleChange} placeholder="John Doe" className={errors.name ? "border-red-500 bg-red-50/30" : ""} />
                <ErrorWarning field="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select id="gender" name="gender" value={formValues.gender} onChange={handleChange} className="flex h-10 w-full rounded-md border border-border bg-surface-50 dark:bg-surface-950 px-3 py-1 text-sm shadow-sm">
                  <option>Male</option><option>Female</option><option>Other</option>
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
                <Label htmlFor="phone">Student Phone</Label>
                <Input id="phone" name="phone" value={formValues.phone} onInput={handlePhoneInput} placeholder="9876543210" maxLength={10} className={errors.phone ? "border-red-500" : ""} />
                <ErrorWarning field="phone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode / Zip</Label>
                <Input id="pincode" name="pincode" value={formValues.pincode} onChange={handleChange} placeholder="10001" className={errors.pincode ? "border-red-500" : ""} />
                <ErrorWarning field="pincode" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input id="address" name="address" value={formValues.address} onChange={handleChange} placeholder="123 Main St..." className={errors.address ? "border-red-500" : ""} />
              <ErrorWarning field="address" />
            </div>
          </div>

          {/* ── Parent Info ───────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider border-b border-border/30 pb-2">Parent / Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="parentName">Father / Guardian Name *</Label>
                <Input id="parentName" name="parentName" required value={formValues.parentName} onChange={handleChange} placeholder="Jane Doe" className={errors.parentName ? "border-red-500" : ""} />
                <ErrorWarning field="parentName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhone">Primary Emergency Phone *</Label>
                <Input id="parentPhone" name="parentPhone" required value={formValues.parentPhone} onInput={handlePhoneInput} placeholder="9876543210" maxLength={10} className={errors.parentPhone ? "border-red-500" : ""} />
                <ErrorWarning field="parentPhone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother Name</Label>
                <Input id="motherName" name="motherName" value={formValues.motherName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherPhone">Mother Phone</Label>
                <Input id="motherPhone" name="motherPhone" value={formValues.motherPhone} onInput={handlePhoneInput} placeholder="9876543210" maxLength={10} />
              </div>
            </div>
          </div>

          {/* ── Facility & Medical ────────────────────────────────────────── */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider border-b border-border/30 pb-2">Facility & Medical</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="transportRoute">Transport Route</Label>
                <Input id="transportRoute" name="transportRoute" value={formValues.transportRoute} onChange={handleChange} placeholder="Bus Route 4" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hostelRoom">Hostel Details (Optional)</Label>
                <Input id="hostelRoom" name="hostelRoom" value={formValues.hostelRoom} onChange={handleChange} placeholder="Block A, Room 102" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="medicalNotes">Medical Notes / Allergies</Label>
                <Input id="medicalNotes" name="medicalNotes" value={formValues.medicalNotes} onChange={handleChange} placeholder="Allergic to peanuts..." />
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-end gap-4 border-t border-border/40 mt-10">
            <Link href="/dashboard/students/manage">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isPending} className="lg:w-48 shadow-lg shadow-brand-500/20">
              {isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enrolling...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Enroll Student</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
