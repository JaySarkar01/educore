"use client"

import { useState } from "react"
import { addBehaviorLog, deleteBehaviorLog } from "@/app/actions/behavior"
import { AlertCircle, Plus, Trash2, Loader2 } from "lucide-react"

export function BehaviorTab({ studentId, initialLogs, readOnly }: { studentId: string, initialLogs: any[], readOnly: boolean }) {
  const [logs, setLogs] = useState(initialLogs || [])
  const [loading, setLoading] = useState(false)

  async function handleAdd(formData: FormData) {
    setLoading(true)
    formData.append("studentId", studentId)
    const result = await addBehaviorLog(formData)
    if (result?.success) {
      window.location.reload()
    } else {
      alert("Failed to add: " + JSON.stringify(result?.error || result?.fieldErrors))
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this behavior log?")) return
    setLoading(true)
    await deleteBehaviorLog(id, studentId)
    window.location.reload()
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
      {!readOnly && (
        <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-fg mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-brand-500" /> Log Behavior/Incident</h3>
          <form action={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-fg mb-1">Title</label>
                <input name="title" required placeholder="Incident or Award Title" className="w-full px-3 py-2 border rounded-lg bg-surface-100 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-fg mb-1">Type</label>
                <select name="type" required className="w-full px-3 py-2 border rounded-lg bg-surface-100 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm">
                  <option value="Neutral">Neutral</option>
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-fg mb-1">Date</label>
                <input type="date" name="date" required className="w-full px-3 py-2 border rounded-lg bg-surface-100 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-fg mb-1">Description</label>
              <textarea name="description" required rows={3} placeholder="Detailed description of the behavior or incident..." className="w-full px-3 py-2 border rounded-lg bg-surface-100 dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none"></textarea>
            </div>
            <div className="flex justify-end">
              <button disabled={loading} type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 text-sm">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Record"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20">
          <h3 className="font-bold text-fg flex items-center gap-2"><AlertCircle className="w-4 h-4 text-brand-500" /> Behavior Logs</h3>
        </div>
        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-fg uppercase bg-surface-50 dark:bg-surface-900/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {logs.map((l: any) => (
                  <tr key={l.id} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{l.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        l.type === 'Positive' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20' :
                        l.type === 'Negative' ? 'bg-red-100 text-red-700 dark:bg-red-500/20' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-500/20'
                      }`}>
                        {l.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-fg whitespace-nowrap">{l.title}</td>
                    <td className="px-6 py-4 text-muted-fg max-w-[200px] truncate" title={l.description}>{l.description}</td>
                    <td className="px-6 py-4 text-right">
                      {!readOnly && (
                        <button onClick={() => handleDelete(l.id)} className="text-red-500 hover:text-red-700 p-1 bg-red-500/10 rounded">
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
          <div className="p-12 text-center text-muted-fg">No behavior logs found.</div>
        )}
      </div>
    </div>
  )
}
