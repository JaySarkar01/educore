import { getSubjects, deleteSubject } from "@/app/actions/academic"
import { AddSubjectForm } from "@/components/dashboard/add-subject-form"
import { Button } from "@/components/ui/button"
import { Trash2, BookOpen } from "lucide-react"

export default async function ManageSubjectsPage() {
  const subjects = await getSubjects()

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-fg tracking-tight">Curriculum Subjects</h1>
          <p className="text-muted-fg mt-1 text-lg">Define core educational courses pushed across faculties and classrooms.</p>
        </div>
        <AddSubjectForm />
      </div>

      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20">
          <h3 className="font-bold text-fg flex items-center gap-2"><BookOpen className="w-4 h-4 text-brand-500"/> Core Subject Database</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-fg uppercase bg-surface-50 dark:bg-surface-900/50 border-b border-border/40">
              <tr>
                <th className="px-6 py-4 font-semibold w-1/3">Subject Name</th>
                <th className="px-6 py-4 font-semibold w-1/4">Course Code</th>
                <th className="px-6 py-4 font-semibold w-1/4">Execution Type</th>
                <th className="px-6 py-4 font-semibold text-right w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-fg">
                    No curriculum subjects instantiated.
                  </td>
                </tr>
              ) : subjects.map((s: any) => (
                <tr key={s._id} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/30 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-fg text-base">{s.subjectName}</td>
                  <td className="px-6 py-4">
                     <span className="font-mono text-xs bg-brand-500/10 text-brand-700 dark:text-brand-300 px-2 py-1 rounded border border-brand-500/20">{s.subjectCode}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                      s.type === 'Theory' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
                      s.type === 'Practical' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400'
                    }`}>
                      {s.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <form action={deleteSubject.bind(null, s._id)}>
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
