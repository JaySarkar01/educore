"use client"
import { useEffect, useMemo, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Loader2, FilePlus2, Search, CheckCircle2 } from "lucide-react"
import { generateFeeInvoice, getFeeStudentClassOptions, searchStudentsForFeePayment } from "@/app/actions/fees"
import { useRouter } from "next/navigation"

export function GenerateInvoiceForm() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState("")
  const [classFilter, setClassFilter] = useState("ALL")
  const [classOptions, setClassOptions] = useState<string[]>([])
  const [results, setResults] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!isOpen) return

    let mounted = true
    ;(async () => {
      const classes = await getFeeStudentClassOptions()
      if (mounted) setClassOptions(classes)
    })()

    return () => {
      mounted = false
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const q = search.trim()

    if (q.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        const rows = await searchStudentsForFeePayment(q, 30, classFilter)
        setResults(rows)
      })
    }, 250)

    return () => clearTimeout(timer)
  }, [search, classFilter, isOpen])

  const handleAction = (formData: FormData) => {
    setErrorMsg("")
    if (!selectedStudent?.id) {
      setErrorMsg("Please search and select a student first.")
      return
    }

    formData.set("studentId", selectedStudent.id)

    startTransition(async () => {
      const res = await generateFeeInvoice(formData)
      if (res?.error) {
        setErrorMsg(res.error)
      } else {
        setSearch("")
        setResults([])
        setSelectedStudent(null)
        setClassFilter("ALL")
        setIsOpen(false)
        router.refresh()
      }
    })
  }

  const helperText = useMemo(() => {
    if (search.trim().length === 0) return "Search by student name, roll number, admission number, or parent phone."
    if (search.trim().length < 2) return "Type at least 2 characters to search."
    if (!isPending && results.length === 0) return "No matching active student found."
    return ""
  }, [search, results.length, isPending])

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="gap-2 shadow-sm shadow-brand-500/20">
        <FilePlus2 className="w-4 h-4" /> Issue Invoice
      </Button>
    )
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2 shadow-sm shadow-brand-500/20 w-full sm:w-auto">
        <FilePlus2 className="w-4 h-4" /> Issue Invoice
      </Button>
      <div className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 shadow-2xl">
        <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/40">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-fg">Issue Fee Invoice</h2>
              <p className="text-sm text-muted-fg mt-1">Search student fast, verify class, and create invoice professionally.</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-fg hover:text-fg" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <form action={handleAction} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {errorMsg && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
                {errorMsg}
              </div>
            )}

            <input type="hidden" name="studentId" value={selectedStudent?.id || ""} />

            <div className="space-y-3">
              <Label>Student Search & Filter</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-fg" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                    placeholder="Name, roll no, admission no, parent phone"
                  />
                </div>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-border bg-surface-50 dark:bg-surface-950 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500"
                >
                  <option value="ALL">All Classes</option>
                  {classOptions.map((c) => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
              </div>

              {helperText && <p className="text-xs text-muted-fg">{helperText}</p>}

              {results.length > 0 && (
                <div className="rounded-md border border-border/50 max-h-48 overflow-y-auto divide-y divide-border/40">
                  {results.map((s: any) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedStudent(s)
                        setSearch(`${s.name} (${s.rollNumber || "No Roll"})`)
                        setResults([])
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-surface-100 dark:hover:bg-surface-900 transition-colors"
                    >
                      <p className="text-sm font-semibold text-fg">{s.name}</p>
                      <p className="text-xs text-muted-fg">
                        Roll: {s.rollNumber || "-"} · Adm: {s.admissionNo || "-"} · Class {s.className}{s.section ? `-${s.section}` : ""}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {selectedStudent && (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm dark:bg-emerald-500/10 dark:border-emerald-500/20">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Selected Student
                  </p>
                  <p className="text-emerald-800 dark:text-emerald-300 mt-0.5">
                    {selectedStudent.name} · Roll {selectedStudent.rollNumber || "-"} · Class {selectedStudent.className}{selectedStudent.section ? `-${selectedStudent.section}` : ""}
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Invoice Title / Particulars</Label>
              <Input id="title" name="title" required placeholder="e.g. Term 1 Tuition Fee" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Total Amount (₹)</Label>
                <Input id="amount" name="amount" type="number" step="0.01" min="1" required placeholder="500.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" required defaultValue={new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]} />
              </div>
            </div>

            <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-border/40 mt-2">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="shadow-sm shadow-brand-500/20">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Issue Invoice"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
