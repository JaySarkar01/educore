import { getStudents, deleteStudent } from "@/app/actions/student"
import { getClasses } from "@/app/actions/academic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserMinus, Search, Plus } from "lucide-react"
import { StudentsFilterBar } from "@/components/dashboard/students-filter-bar"
import Link from "next/link"

export default async function ManageStudentsPage({ searchParams }: { searchParams: Promise<{ q?: string; class?: string }> }) {
  const sp = await searchParams;
  const q = sp?.q || "";
  const className = sp?.class || "";
  
  const students = await getStudents(q, className)
  const classes = await getClasses()

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-fg tracking-tight">Manage Students</h1>
          <p className="text-muted-fg mt-1 text-lg">Manage enrollments, classes, and student records.</p>
        </div>
        
        <Link href="/dashboard/students/add">
          <Button className="gap-2 shadow-sm shadow-brand-500/20">
            <Plus className="w-4 h-4" /> Add New Student
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg shadow-brand-500/5 overflow-hidden border-border/50">
        <CardHeader className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-border/40 pb-4 gap-4 bg-surface-50/50 dark:bg-surface-900/20">
          <CardTitle className="text-xl font-semibold">Enrolled Students ({students.length})</CardTitle>
          <StudentsFilterBar initialQuery={q} initialClass={className} classes={classes} />
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left align-middle whitespace-nowrap">
              <thead className="text-xs text-muted-fg uppercase bg-surface-100/80 dark:bg-surface-900/80 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">Student Info</th>
                  <th className="px-6 py-4 font-semibold">Academic</th>
                  <th className="px-6 py-4 font-semibold">Parent Info</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-muted-fg">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center">
                          <Search className="w-8 h-8 text-muted-fg opacity-40" />
                        </div>
                        <p className="text-base">No students found.</p>
                      </div>
                    </td>
                  </tr>
                ) : students.map((s: any) => (
                  <tr key={s.id} className="hover:bg-surface-100/50 dark:hover:bg-surface-900/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-fg text-base">{s.name}</div>
                      <div className="text-xs text-muted-fg mt-1">Ph: {s.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-700 dark:text-brand-300 text-base">
                        {s.className} {s.section ? `• Sec ${s.section}` : ''}
                      </div>
                      <div className="text-xs font-mono text-muted-fg mt-1">Adm: {s.admissionNo} | Roll: {s.rollNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-fg">{s.parentName}</div>
                      <div className="text-xs text-muted-fg mt-1">{s.parentPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        s.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                          : 'bg-surface-200 text-muted-fg dark:bg-surface-800 border-border'
                      }`}>
                        {s.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/students/${s.id}`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs font-medium">Profile</Button>
                        </Link>
                        <form action={deleteStudent.bind(null, s.id)}>
                          <Button type="submit" variant="ghost" size="icon" className="text-muted-fg hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 h-8 w-8">
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
