"use client"

import { useState } from "react"
import { addExamResult, deleteExamResult } from "@/app/actions/exam"
import { FileText, Plus, Trash2, Loader2 } from "lucide-react"

export function ExamTab({ studentId, initialExams, subjects, readOnly }: { studentId: string, initialExams: any[], subjects: any[], readOnly: boolean }) {
  const [exams, setExams] = useState(initialExams || [])
  const [loading, setLoading] = useState(false)

  async function handleAdd(formData: FormData) {
    setLoading(true)
    formData.append("studentId", studentId)
    const result = await addExamResult(formData)
    if (result?.success) {
      // In a real scenario, this would revalidate the page. For local state:
      window.location.reload()
    } else {
      alert("Failed to add exam: " + JSON.stringify(result?.error || result?.fieldErrors))
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this exam record?")) return
    setLoading(true)
    await deleteExamResult(id, studentId)
    window.location.reload()
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
      {!readOnly && (
        <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-fg mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-brand-500" /> Record New Exam</h3>
          <form action={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-fg mb-1">Exam Name</label>
              <input name="examName" required placeholder="e.g. Midterms" className="w-full px-3 py-2 border rounded-lg bg-surface-100 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-fg mb-1">Subject</label>
              <input name="subjectId" required placeholder="Subject ID or Name" className="w-full px-3 py-2 border rounded-lg bg-surface-100 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-fg mb-1">Date</label>
              <input type="date" name="date" required className="w-full px-3 py-2 border rounded-lg bg-surface-100 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-fg mb-1">Marks Obtained</label>
              <input type="number" name="marksObtained" required className="w-full px-3 py-2 border rounded-lg bg-surface-100 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-fg mb-1">Max Marks</label>
              <input type="number" name="maxMarks" required className="w-full px-3 py-2 border rounded-lg bg-surface-100 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
            </div>
            <div className="lg:col-span-1 flex items-end">
              <button disabled={loading} type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 text-sm">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Record"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History */}
      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20">
          <h3 className="font-bold text-fg flex items-center gap-2"><FileText className="w-4 h-4 text-brand-500" /> Exam Records</h3>
        </div>
        {exams.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-fg uppercase bg-surface-50 dark:bg-surface-900/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Exam</th>
                  <th className="px-6 py-4 font-semibold">Subject</th>
                  <th className="px-6 py-4 font-semibold">Score</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {exams.map((e: any) => (
                  <tr key={e.id} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/30 transition-colors">
                    <td className="px-6 py-4">{e.date}</td>
                    <td className="px-6 py-4 font-medium text-fg">{e.examName}</td>
                    <td className="px-6 py-4">{e.subjectId}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-fg">{e.marksObtained}</span> / <span className="text-muted-fg">{e.maxMarks}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!readOnly && (
                        <button onClick={() => handleDelete(e.id)} className="text-red-500 hover:text-red-700 p-1 bg-red-500/10 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted-fg">No exam records found.</div>
        )}
      </div>
    </div>
  )
}
