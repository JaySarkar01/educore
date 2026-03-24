import { getTeachers, deleteTeacher } from "@/app/actions/teacher"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { UserMinus, Plus } from "lucide-react"
import Link from "next/link"

export default async function ManageTeachersPage({ searchParams }: { searchParams: Promise<{ q?: string; dept?: string }> }) {
  const sp = await searchParams
  const q = sp?.q || ""
  const dept = sp?.dept || ""
  
  const teachers = await getTeachers(q, dept)

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-fg tracking-tight">Manage Teachers</h1>
          <p className="text-muted-fg mt-1 text-sm md:text-base">Manage faculty employment details and subject assignments.</p>
        </div>
        
        <Link href="/dashboard/teachers/add">
          <Button className="gap-2 shadow-sm shadow-brand-500/20 w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Add New Teacher
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg shadow-brand-500/5 overflow-hidden border-border/50">
        <div className="p-4 border-b border-border/40 bg-surface-50 dark:bg-surface-900/50 flex flex-wrap gap-3">
          <form className="flex flex-wrap gap-2 w-full">
            <input name="q" defaultValue={q} placeholder="Search by name, ID, email..." className="flex h-9 flex-1 min-w-[160px] rounded-md border border-input bg-surface-50 dark:bg-surface-950 px-3 py-1 text-sm shadow-sm" />
            <input name="dept" defaultValue={dept} placeholder="Department" className="flex h-9 w-full sm:w-32 rounded-md border border-input bg-surface-50 dark:bg-surface-950 px-3 py-1 text-sm shadow-sm" />
            <Button type="submit" variant="secondary" className="h-9">Filter</Button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[640px]">
            <thead className="text-xs text-muted-fg uppercase bg-surface-100/50 dark:bg-surface-900/50 border-b border-border/50">
              <tr>
                <th className="px-4 md:px-6 py-4 font-semibold">Teacher Name</th>
                <th className="px-4 md:px-6 py-4 font-semibold hidden sm:table-cell">Emp ID</th>
                <th className="px-4 md:px-6 py-4 font-semibold hidden md:table-cell">Department</th>
                <th className="px-4 md:px-6 py-4 font-semibold hidden lg:table-cell">Contact</th>
                <th className="px-4 md:px-6 py-4 font-semibold">Status</th>
                <th className="px-4 md:px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-fg">
                    No teachers found matching your criteria.
                  </td>
                </tr>
              ) : teachers.map((t: any) => (
                <tr key={t._id} className="hover:bg-surface-100/50 dark:hover:bg-surface-900/50 transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-3">
                      {t.photo ? (
                        <img src={t.photo} alt={t.name} className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-border/50 object-cover flex-shrink-0 shadow-sm" />
                      ) : (
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0 shadow-sm">
                          {t.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-fg text-sm md:text-base">{t.name}</div>
                        <div className="text-xs text-muted-fg mt-0.5">{t.qualification} • {t.experience} Yrs Exp</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-fg hidden sm:table-cell">{t.employeeId}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-fg hidden md:table-cell">{t.department || 'General'}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 hidden lg:table-cell">
                    <div className="text-sm font-medium text-fg">{t.phone}</div>
                    <div className="text-xs text-muted-fg mt-0.5">{t.email}</div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <span className={`px-2.5 py-1 rounded-sm text-xs font-semibold ${
                      t.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      t.status === 'Resigned' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                      'bg-surface-200 text-muted-fg dark:bg-surface-800'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                      <Link href={`/dashboard/teachers/${t._id}`}>
                        <Button variant="outline" size="sm" className="h-8 text-xs font-medium">Profile</Button>
                      </Link>
                      <form action={deleteTeacher.bind(null, t._id)}>
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
      </Card>
    </div>
  )
}
