import { getStudents } from "@/app/actions/student"
import { Users, CheckCircle, UserMinus, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function StudentsDashboard() {
  const students = await getStudents()
  const activeCount = students.filter((s: any) => s.status === 'Active').length
  const inactiveCount = students.filter((s: any) => s.status === 'Inactive').length
  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-fg tracking-tight">Students Dashboard</h1>
          <p className="text-muted-fg mt-1 text-lg">Overview of institutional enrollment metrics.</p>
        </div>
        <Link href="/dashboard/students/add">
          <Button className="gap-2 shadow-sm shadow-brand-500/20">
            <Plus className="w-4 h-4" /> Enroll Student
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-fg">Total Students</CardTitle>
            <Users className="w-4 h-4 text-brand-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fg">{students.length}</div>
            <p className="text-xs text-muted-fg mt-1">Historically enrolled</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-fg">Active Students</CardTitle>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fg">{activeCount}</div>
            <p className="text-xs text-muted-fg mt-1">Currently attending</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-fg">Inactive / Left</CardTitle>
            <UserMinus className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fg">{inactiveCount}</div>
            <p className="text-xs text-muted-fg mt-1">On duration break</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Blank placeholders to look like a massive dashboard */}
         <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-900 border-dashed min-h-[300px] flex items-center justify-center">
            <p className="text-muted-fg font-medium text-sm border px-4 py-2 rounded-full border-border/60">Attendance Chart Module (Pending)</p>
         </Card>
         <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-900 border-dashed min-h-[300px] flex items-center justify-center">
            <p className="text-muted-fg font-medium text-sm border px-4 py-2 rounded-full border-border/60">Recent Fee Activity (Pending)</p>
         </Card>
      </div>
    </div>
  )
}
