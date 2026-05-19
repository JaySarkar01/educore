"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecordPaymentForm } from "@/components/dashboard/record-payment-form"
import { getOutstandingInvoicesForStudent, searchStudentsForFeePayment, getFeeStudentClassOptions, getStudentsByClass, generateBulkFeeInvoices } from "@/app/actions/fees"
import { Search, UserRound, FileText, AlertCircle, Printer, Download, MessageCircle } from "lucide-react"

type FeeSummary = {
  totalBilled: number
  totalCollected: number
  pendingCollection: number
  outstandingInvoices: number
}

export function AccountantFeeWorkbench({
  summary,
  recentInvoices,
  feeStructures = [],
}: {
  summary: FeeSummary
  recentInvoices: any[]
  feeStructures?: any[]
}) {
  const [query, setQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  const [results, setResults] = useState<any[]>([])
  const [classOptions, setClassOptions] = useState<string[]>([])
  const [selectedClass, setSelectedClass] = useState("")
  const [classStudents, setClassStudents] = useState<any[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const [bulkTitle, setBulkTitle] = useState("Monthly Fee")
  const [bulkAmount, setBulkAmount] = useState<string>("")
  const [bulkDueDate, setBulkDueDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [selectedFeeStructure, setSelectedFeeStructure] = useState<string>("")
  const [isBulkPending, startBulk] = useTransition()
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [studentInvoices, setStudentInvoices] = useState<any[]>([])
  const [searchInfo, setSearchInfo] = useState("")

  const reloadSelectedStudentInvoices = (studentId?: string) => {
    const id = studentId || selectedStudent?.id
    if (!id) return

    startTransition(async () => {
      const invoices = await getOutstandingInvoicesForStudent(id)
      setStudentInvoices(invoices)
    })
  }

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setSearchInfo(q.length === 0 ? "" : "Type at least 2 characters")
      return
    }

    const handle = setTimeout(() => {
      startTransition(async () => {
        const rows = await searchStudentsForFeePayment(q, 20)
        setResults(rows)
        setSearchInfo(rows.length ? "" : "No matching student found")
      })
    }, 250)

    return () => clearTimeout(handle)
  }, [query])

  useEffect(() => {
    startTransition(async () => {
      const opts = await getFeeStudentClassOptions()
      setClassOptions(opts || [])
    })
  }, [])

  useEffect(() => {
    if (!selectedClass) {
      setClassStudents([])
      setSelectedIds(new Set())
      setSelectAll(false)
      return
    }

    startTransition(async () => {
      const rows = await getStudentsByClass(selectedClass)
      setClassStudents(rows || [])
      setSelectedIds(new Set())
      setSelectAll(false)
    })
  }, [selectedClass])

  const selectStudent = (student: any) => {
    setSelectedStudent(student)
    setResults([])
    setQuery(student.name)
    reloadSelectedStudentInvoices(student.id)
  }

  const toggleSelectId = (id: string) => {
    const s = new Set(Array.from(selectedIds))
    if (s.has(id)) s.delete(id)
    else s.add(id)
    setSelectedIds(s)
    setSelectAll(s.size === classStudents.length && classStudents.length > 0)
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set())
      setSelectAll(false)
    } else {
      const all = new Set(classStudents.map(s => s.id))
      setSelectedIds(all)
      setSelectAll(true)
    }
  }

  const handleFeeStructureSelect = (fsId: string) => {
    setSelectedFeeStructure(fsId)
    const fs = feeStructures.find(f => f._id === fsId)
    if (fs) {
      setBulkTitle(fs.name)
      setBulkAmount(fs.amount.toString())
      if (fs.targetClass && fs.targetClass !== "All") {
        setSelectedClass(fs.targetClass)
      }
    } else {
      setBulkTitle("Monthly Fee")
      setBulkAmount("")
    }
  }

  const submitBulk = async () => {
    if (!selectedClass) return
    if (!bulkAmount || parseFloat(bulkAmount) <= 0) return

    startBulk(async () => {
      const fd = new FormData()
      fd.set('className', selectedClass)
      fd.set('title', bulkTitle)
      fd.set('amount', bulkAmount)
      fd.set('dueDate', bulkDueDate)
      // pass selected ids if any
      if (selectedIds.size > 0) {
        fd.set('selectedStudentIds', JSON.stringify(Array.from(selectedIds)))
      }

      const res: any = await generateBulkFeeInvoices(fd)
      if (res && res.success) {
        // reload recent invoices and class students outstanding status
        setSelectedIds(new Set())
        setSelectAll(false)
        setBulkAmount("")
        // best-effort: refresh selected student invoices if a student is selected
        reloadSelectedStudentInvoices()
      }
    })
  }

  const kpis = useMemo(
    () => [
      { label: "Total Billed", value: `₹${summary?.totalBilled?.toFixed(2) || "0.00"}` },
      { label: "Collected", value: `₹${summary?.totalCollected?.toFixed(2) || "0.00"}` },
      { label: "Pending", value: `₹${summary?.pendingCollection?.toFixed(2) || "0.00"}` },
      { label: "Outstanding Invoices", value: `${summary?.outstandingInvoices || 0}` },
    ],
    [summary]
  )

  return (
    <div className="space-y-6 md:space-y-8">
      <Card className="border-border/50 bg-surface-50 dark:bg-surface-950">
        <CardHeader>
          <CardTitle className="text-lg">Accountant Fee Collection Desk</CardTitle>
          <p className="text-sm text-muted-fg">
            Fast fee posting workflow: search student, verify dues, post payment with receipt controls.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-fg" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              placeholder="Search by student name, admission no, roll no or parent phone"
            />
          </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex gap-2">
                <select value={selectedFeeStructure} onChange={(e) => handleFeeStructureSelect(e.target.value)} className="w-1/2 h-9 rounded-md border border-border px-3 bg-surface-50 text-sm">
                  <option value="">Custom Fee / Structure</option>
                  {feeStructures.map(fs => <option key={fs._id} value={fs._id}>{fs.name} (₹{fs.amount})</option>)}
                </select>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-1/2 h-9 rounded-md border border-border px-3 bg-surface-50 text-sm">
                  <option value="">Select Class</option>
                  {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Input value={bulkTitle} onChange={(e) => setBulkTitle(e.target.value)} placeholder="Title" className="h-9 w-1/3" />
                <Input value={bulkAmount} onChange={(e) => setBulkAmount(e.target.value)} placeholder="₹ Amount" className="h-9 w-1/4" />
                <Input value={bulkDueDate} onChange={(e) => setBulkDueDate(e.target.value)} type="date" className="h-9 w-1/4" />
                <Button onClick={submitBulk} className="h-9 w-auto" disabled={isBulkPending || !selectedClass || !bulkAmount}>Generate</Button>
              </div>
            </div>

            {selectedClass && (
              <div className="mt-3 rounded-lg border border-border/50 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-surface-100/50 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                    <div className="text-sm font-medium">{selectedClass} · Students ({classStudents.length})</div>
                  </div>
                  <div className="text-xs text-muted-fg">Select students to include</div>
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-border/40">
                  {classStudents.map((s: any) => (
                    <div key={s.id} className="px-3 py-2 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{s.name}</div>
                        <div className="text-xs text-muted-fg">Adm: {s.admissionNo || '-'} · Roll: {s.rollNumber || '-'}{s.section ? ` · Sec ${s.section}` : ''}</div>
                      </div>
                      <div>
                        <input type="checkbox" checked={selectedIds.has(s.id)} onChange={() => toggleSelectId(s.id)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {results.length > 0 && (
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <div className="max-h-72 overflow-y-auto divide-y divide-border/40">
                {results.map((s: any) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectStudent(s)}
                    className="w-full text-left px-4 py-3 hover:bg-surface-100 dark:hover:bg-surface-900 transition-colors"
                  >
                    <p className="font-semibold text-fg text-sm">{s.name}</p>
                    <p className="text-xs text-muted-fg">
                      Adm: {s.admissionNo || "-"} · Roll: {s.rollNumber || "-"} · Class {s.className}
                      {s.section ? `-${s.section}` : ""}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchInfo && <p className="text-xs text-muted-fg">{searchInfo}</p>}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-fg">{kpi.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-fg">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 bg-surface-50 dark:bg-surface-950">
        <CardHeader>
          <CardTitle className="text-base">Selected Student Dues</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedStudent ? (
            <div className="text-sm text-muted-fg flex items-center gap-2">
              <UserRound className="w-4 h-4" /> Select a student from search to post payment.
            </div>
          ) : isPending ? (
            <div className="text-sm text-muted-fg">Loading outstanding invoices...</div>
          ) : studentInvoices.length === 0 ? (
            <div className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <FileText className="w-4 h-4" /> No pending dues for {selectedStudent.name}.
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-fg">
                {selectedStudent.name} · Roll {selectedStudent.rollNumber || "-"} · Class {selectedStudent.className}
                {selectedStudent.section ? `-${selectedStudent.section}` : ""}
              </p>
              <div className="space-y-2">
                {studentInvoices.map((inv: any) => {
                  const pending = Math.max((inv.amount || 0) - (inv.amountPaid || 0), 0)
                  return (
                      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between border border-border/40 rounded-lg p-3 group">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-fg truncate">{inv.title}</p>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                              {inv.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-fg mt-1">Due: {inv.dueDate} · Invoice: ₹{inv.amount.toFixed(2)} · Pending: ₹{pending.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-1.5 md:justify-end opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          {inv.status !== 'Pending' && (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-fg hover:text-brand-500 hover:bg-brand-50" title="Print Receipt">
                                <Printer className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-fg hover:text-brand-500 hover:bg-brand-50" title="Download PDF">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-fg hover:text-emerald-500 hover:bg-emerald-50" title="Email/WhatsApp">
                                <MessageCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <div className="pl-1">
                            {inv.status !== "Paid" && (
                              <RecordPaymentForm
                                invoiceId={inv._id}
                                pendingAmount={pending}
                                invoiceTitle={inv.title}
                                onSuccess={() => reloadSelectedStudentInvoices()}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-surface-50 dark:bg-surface-950 overflow-hidden">
        <CardHeader className="border-b border-border/40">
          <CardTitle className="text-base">Recent Fee Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentInvoices.length === 0 ? (
            <div className="p-6 text-sm text-muted-fg">No recent fee activity.</div>
          ) : (
            <div className="divide-y divide-border/40">
              {recentInvoices.map((inv: any) => (
                <div key={inv._id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-fg truncate">{inv.studentName}</p>
                    <p className="text-xs text-muted-fg truncate">{inv.title} · {inv.className}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-fg">₹{inv.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-fg">{inv.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-muted-fg flex items-center gap-2">
        <AlertCircle className="w-3.5 h-3.5" />
        Large-school optimized workflow: debounced server-side search + indexed fields + outstanding-only invoice fetch.
      </div>
    </div>
  )
}
