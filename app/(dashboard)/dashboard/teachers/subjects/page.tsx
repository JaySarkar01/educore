import { getTeachers } from "@/app/actions/teacher"
import { AssignSubjectsRow } from "@/components/dashboard/assign-subjects-form"
import { BookOpen } from "lucide-react"

export default async function AssignSubjectsPage() {
  const teachers = await getTeachers()

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-fg tracking-tight">Assign Subjects</h1>
        <p className="text-muted-fg mt-1 text-lg">Define the academic load and specializations for your faculty.</p>
      </div>

      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden mt-6">
        <div className="p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20">
          <h3 className="font-bold text-fg flex items-center gap-2"><BookOpen className="w-4 h-4 text-brand-500"/> Master Teacher Subject Allocation</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-fg uppercase bg-surface-50 dark:bg-surface-900/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold w-1/4">Faculty Member</th>
                <th className="px-6 py-4 font-semibold w-1/4">Department</th>
                <th className="px-6 py-4 font-semibold w-1/2">Allocated Subjects (Comma Separated)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-muted-fg">
                    No faculty records found.
                  </td>
                </tr>
              ) : teachers.map((t: any) => (
                <tr key={t._id} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-fg">{t.name}</p>
                    <p className="text-xs text-muted-fg mt-0.5">{t.employeeId}</p>
                  </td>
                  <td className="px-6 py-4 text-fg font-medium">{t.department || 'N/A'}</td>
                  <td className="px-6 py-4">
                     <AssignSubjectsRow teacherId={t._id} initialSubjects={t.subjects || []} />
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
