import { getClasses, deleteClass } from "@/app/actions/academic"
import { AddClassForm } from "@/components/dashboard/add-class-form"
import { Button } from "@/components/ui/button"
import { Trash2, Layers } from "lucide-react"

export default async function ManageClassesPage() {
  const classes = await getClasses()

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-fg tracking-tight">Manage Classes</h1>
          <p className="text-muted-fg mt-1 text-lg">Define hierarchical grading structures and student divisions.</p>
        </div>
        <AddClassForm />
      </div>

      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20">
          <h3 className="font-bold text-fg flex items-center gap-2"><Layers className="w-4 h-4 text-brand-500"/> Structural Classes</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-fg uppercase bg-surface-50 dark:bg-surface-900/50 border-b border-border/40">
              <tr>
                <th className="px-6 py-4 font-semibold w-1/3">Class / Grade Name</th>
                <th className="px-6 py-4 font-semibold w-1/3">Active Sections</th>
                <th className="px-6 py-4 font-semibold text-right w-1/3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-muted-fg">
                    No classes registered. Determine your school topology to begin.
                  </td>
                </tr>
              ) : classes.map((c: any) => (
                <tr key={c._id} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-fg text-base">{c.className}</p>
                    <p className="text-xs text-muted-fg mt-0.5">Partition ID: {c._id.substring(c._id.length - 6).toUpperCase()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                       {c.sections && c.sections.length > 0 ? c.sections.map((s: string, i: number) => (
                         <span key={i} className="px-2.5 py-1 bg-surface-200 dark:bg-surface-800 rounded text-xs font-semibold text-fg">{s}</span>
                       )) : <span className="text-muted-fg text-xs">No sub-sections</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <form action={deleteClass.bind(null, c._id)}>
                        <Button type="submit" variant="ghost" size="icon" className="text-muted-fg hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 h-8 w-8">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
