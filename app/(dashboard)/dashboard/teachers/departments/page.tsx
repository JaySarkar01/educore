import { getDepartments, deleteDepartment } from "@/app/actions/department"
import { Building2, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddDepartmentForm } from "@/components/dashboard/add-department-form"

export default async function DepartmentsPage() {
  const departments = await getDepartments()

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-fg tracking-tight">Manage Departments</h1>
        <p className="text-muted-fg mt-1 text-sm md:text-base">Configure academic and administrative departments across the institution.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-1 border-r-0 lg:border-r border-border/40 lg:pr-8">
          <Card className="shadow-sm border-border/50 lg:sticky lg:top-8 bg-surface-50 dark:bg-surface-950">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-500" /> New Department
              </CardTitle>
              <CardDescription>Add a new faculty grouping</CardDescription>
            </CardHeader>
            <CardContent>
              <AddDepartmentForm />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 md:p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-fg">Active Departments ({departments.length})</h3>
            </div>
            
            {departments.length === 0 ? (
              <div className="p-12 text-center text-muted-fg flex flex-col items-center">
                <Building2 className="w-12 h-12 text-muted-fg/30 mb-4" />
                <p>No departments configured yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[500px]">
                  <thead className="text-xs text-muted-fg uppercase bg-surface-50/50 dark:bg-surface-900/50 border-b border-border/40">
                    <tr>
                      <th className="px-4 md:px-6 py-4 font-semibold">Department</th>
                      <th className="px-4 md:px-6 py-4 font-semibold hidden sm:table-cell">Head / Lead</th>
                      <th className="px-4 md:px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {departments.map((d: any) => (
                      <tr key={d._id} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/30 transition-colors">
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="font-semibold text-fg text-base">{d.name}</div>
                          {d.description && <div className="text-xs text-muted-fg mt-0.5 line-clamp-1">{d.description}</div>}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-fg hidden sm:table-cell">
                          {d.headOfDepartment || <span className="text-muted-fg/50 italic">Unassigned</span>}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                          <form action={deleteDepartment.bind(null, d._id)}>
                            <Button type="submit" variant="ghost" size="icon" className="text-muted-fg hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 h-8 w-8">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
