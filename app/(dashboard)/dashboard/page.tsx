import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Users, GraduationCap, DollarSign, Calendar } from "lucide-react"

export default function SchoolDashboard() {
  return (
    <div className="flex-1 p-8 pt-24 bg-surface-50 dark:bg-surface-950 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fg">School Dashboard</h1>
            <p className="text-muted-fg mt-1">Welcome back, Greenwood High School Admin.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-brand-500/20 bg-gradient-to-br from-surface-100 to-brand-50 dark:from-surface-900 dark:to-brand-950/30">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="text-sm font-medium text-muted-fg">Total Students</div>
              <GraduationCap className="w-5 h-5 text-brand-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-fg">1,248</div>
              <div className="text-xs text-brand-600 dark:text-brand-400 mt-1">+12% from last month</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="text-sm font-medium text-muted-fg">Total Teachers</div>
              <Users className="w-5 h-5 text-muted-fg" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-fg">84</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="text-sm font-medium text-muted-fg">Monthly Revenue</div>
              <DollarSign className="w-5 h-5 text-muted-fg" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-fg">$124,500</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">+4% from last month</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="text-sm font-medium text-muted-fg">Upcoming Events</div>
              <Calendar className="w-5 h-5 text-muted-fg" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-fg">3</div>
              <div className="text-xs text-muted-fg mt-1">Mid-term exams next week</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <h3 className="font-semibold text-lg text-fg">Recent Activity</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "New student enrolled in Grade 10-A",
                  "Fee payment of $500 received from John Doe",
                  "Teacher Sarah Smith marked attendance for Class 8-B",
                  "Mid-term examination schedule published"
                ].map((act, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm bg-surface-100/50 dark:bg-surface-900/50 p-3 rounded-md border border-border/50">
                    <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div>
                    <span className="text-fg">{act}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-lg text-fg">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full text-left p-3 rounded-md border border-border/50 text-sm hover:bg-surface-100 dark:hover:bg-surface-900 transition-colors text-fg font-medium">Add New Student</button>
              <button className="w-full text-left p-3 rounded-md border border-border/50 text-sm hover:bg-surface-100 dark:hover:bg-surface-900 transition-colors text-fg font-medium">Mark Staff Attendance</button>
              <button className="w-full text-left p-3 rounded-md border border-border/50 text-sm hover:bg-surface-100 dark:hover:bg-surface-900 transition-colors text-fg font-medium">Generate Fee Invoice</button>
              <button className="w-full text-left p-3 rounded-md border border-border/50 text-sm hover:bg-surface-100 dark:hover:bg-surface-900 transition-colors text-fg font-medium">Send Announcement</button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
