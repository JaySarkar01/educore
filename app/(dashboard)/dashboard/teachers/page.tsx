import { getTeachers } from "@/app/actions/teacher"
import { Users, UserCheck, BookOpen, UserMinus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TeachersDashboardPage() {
  const teachers = await getTeachers()
  const activeCount = teachers.filter((t: any) => t.status === 'Active').length
  const totalSubjects = new Set(teachers.flatMap((t: any) => t.subjects)).size

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-fg tracking-tight">Faculty Dashboard</h1>
        <p className="text-muted-fg mt-1 text-lg">Overview of teacher registrations and department metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-fg">Total Faculty</CardTitle>
            <Users className="w-4 h-4 text-brand-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fg">{teachers.length}</div>
            <p className="text-xs text-muted-fg mt-1">Historically recruited</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-fg">Active Teachers</CardTitle>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fg">{activeCount}</div>
            <p className="text-xs text-muted-fg mt-1">Currently on roster</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-fg">Subjects Covered</CardTitle>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fg">{totalSubjects}</div>
            <p className="text-xs text-muted-fg mt-1">Unique specializations</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-fg">On Leave</CardTitle>
            <UserMinus className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fg">{teachers.filter((t: any) => t.status === 'On Leave').length}</div>
            <p className="text-xs text-muted-fg mt-1">Temporarily away</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-900 border-dashed min-h-[300px] flex items-center justify-center">
            <p className="text-muted-fg font-medium text-sm border px-4 py-2 rounded-full border-border/60">Faculty Attendance Trend (Pending)</p>
         </Card>
         <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-900 border-dashed min-h-[300px] flex items-center justify-center">
            <p className="text-muted-fg font-medium text-sm border px-4 py-2 rounded-full border-border/60">Department Overview (Pending)</p>
         </Card>
      </div>
    </div>
  )
}
