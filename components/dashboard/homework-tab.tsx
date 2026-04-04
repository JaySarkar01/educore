"use client"

import { useState } from "react"
import { addHomework, deleteHomework } from "@/app/actions/homework"
import { BookOpen, Plus, Trash2, Loader2 } from "lucide-react"

export function HomeworkTab({ studentId, initialHomework, readOnly }: { studentId: string, initialHomework: any[], readOnly: boolean }) {
  const [homework, setHomework] = useState(initialHomework || [])
  const [loading, setLoading] = useState(false)

  async function handleAdd(formData: FormData) {
    setLoading(true)
    formData.append("studentId", studentId)
    const result = await addHomework(formData)
    if (result?.success) {
      window.location.reload()
    } else {
      alert("Failed to add: " + JSON.stringify(result?.error || result?.fieldErrors))
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this homework record?")) return
    setLoading(true)
    await deleteHomework(id, studentId)
    window.location.reload()
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
      {!readOnly && (
        <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-fg mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-brand-500" /> Log Homework</h3>
          <form action={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-fg mb-1">Title</label>
              <input name="title" required placeholder="Homework Title" className="w-full px-3 py-2 border rounded-lg bg-surface-100 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-fg mb-1">Subject</label>
              <input name="subjectId" required placeholder="Subject" className="w-full px-3 py-2 border rounded-lg bg-surface-100 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-fg mb-1">Status</label>
              <select name="status" required className="w-full px-3 py-2 border rounded-lg bg-surface-100 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm">
                <option value="Completed">Completed</option>
                <option value="Late">Late</option>
                <option value="Missing">Missing</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-fg mb-1">Assigned Date</label>
              <input type="date" name="dateAssigned" required className="w-full px-3 py-2 border rounded-lg bg-surface-100 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-fg mb-1">Due Date</label>
              <input type="date" name="dateDue" required className="w-full px-3 py-2 border rounded-lg bg-surface-100 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
            </div>
            <div className="lg:col-span-1 flex items-end">
              <button disabled={loading} type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 text-sm">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20">
          <h3 className="font-bold text-fg flex items-center gap-2"><BookOpen className="w-4 h-4 text-brand-500" /> Homework History</h3>
        </div>
        {homework.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-fg uppercase bg-surface-50 dark:bg-surface-900/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Subject</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Due</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {homework.map((h: any) => (
                  <tr key={h.id} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-fg">{h.title}</td>
                    <td className="px-6 py-4">{h.subjectId}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        h.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20' :
                        h.status === 'Missing' ? 'bg-red-100 text-red-700 dark:bg-red-500/20' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-500/20'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{h.dateDue}</td>
                    <td className="px-6 py-4 text-right">
                      {!readOnly && (
                        <button onClick={() => handleDelete(h.id)} className="text-red-500 hover:text-red-700 p-1 bg-red-500/10 rounded">
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
          <div className="p-12 text-center text-muted-fg">No homework records found.</div>
        )}
      </div>
    </div>
  )
}
