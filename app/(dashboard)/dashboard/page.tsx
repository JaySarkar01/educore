import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Users, GraduationCap, IndianRupee, Calendar, Layers } from "lucide-react"
import { getDashboardStats } from "@/app/actions/dashboard"
import Link from "next/link"

export default async function SchoolDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 pt-6 md:pt-8 lg:pt-10 bg-surface-50 dark:bg-surface-950 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-fg tracking-tight">System Telemetry Dashboard</h1>
            <p className="text-muted-fg mt-1 text-sm md:text-base">Cross-linked master view securely streaming active data across all tables.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-brand-500/20 bg-gradient-to-br from-surface-100 to-brand-50 dark:from-surface-900 dark:to-brand-950/30">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="text-sm font-medium text-muted-fg">Total Active Students</div>
              <GraduationCap className="w-5 h-5 text-brand-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-fg">{stats?.studentCount || 0}</div>
              <div className="text-xs text-brand-600 dark:text-brand-400 mt-1">Sourced from Student DB</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="text-sm font-medium text-muted-fg">Active Faculties</div>
              <Users className="w-5 h-5 text-muted-fg" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-fg">{stats?.teacherCount || 0}</div>
              <div className="text-xs text-muted-fg mt-1">Sourced from Teacher DB</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="text-sm font-medium text-muted-fg">Aggregate Revenue</div>
              <IndianRupee className="w-5 h-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-fg">₹{stats?.revenue.toLocaleString() || '0'}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Sourced from secure Invoices DB</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="text-sm font-medium text-muted-fg">Active Configurations</div>
              <Layers className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-fg">{stats?.classCount || 0}</div>
              <div className="text-xs text-muted-fg mt-1">Mapped from Academic Schema</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <h3 className="font-semibold text-lg text-fg">Recent Activity Master Log</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentActivity && stats.recentActivity.length > 0 ? stats.recentActivity.map((act: any, i: number) => (
                  <div key={i} className="flex flex-col gap-1 text-sm bg-surface-100/50 dark:bg-surface-900/50 p-4 rounded-md border border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div>
                      <span className="font-semibold text-fg">{act.title}</span>
                      <span className="text-xs text-muted-fg ml-auto">{new Date(act.date).toLocaleString()}</span>
                    </div>
                    <div className="pl-4 border-l-2 border-border/40 ml-1 mt-1 pb-1">
                      <p className="text-muted-fg">{act.description}</p>
                      <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5 font-medium">{act.author}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-muted-fg py-8">No significant cross-platform actions tracked yet.</div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-lg text-fg">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/students/add" className="block w-full text-left p-3 rounded-md border border-border/50 text-sm hover:bg-surface-100 dark:hover:bg-surface-900 transition-colors text-fg font-medium bg-surface-50 dark:bg-surface-950">Enroll New Student</Link>
              <Link href="/dashboard/classes/manage" className="block w-full text-left p-3 rounded-md border border-border/50 text-sm hover:bg-surface-100 dark:hover:bg-surface-900 transition-colors text-fg font-medium bg-surface-50 dark:bg-surface-950">Build Master Curriculum</Link>
              <Link href="/dashboard/teachers/attendance" className="block w-full text-left p-3 rounded-md border border-border/50 text-sm hover:bg-surface-100 dark:hover:bg-surface-900 transition-colors text-fg font-medium bg-surface-50 dark:bg-surface-950">Mark Master Attendance</Link>
              <Link href="/dashboard/students/fees" className="block w-full text-left p-3 rounded-md border border-border/50 text-sm hover:bg-surface-100 dark:hover:bg-surface-900 transition-colors text-fg font-medium bg-surface-50 dark:bg-surface-950">Track Invoices</Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
