import { getStudents } from "@/app/actions/student"
import { Users, CheckCircle, UserMinus, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getAllInvoices } from "@/app/actions/fees"

export default async function StudentsDashboard() {
  const students = await getStudents()
  const invoices = await getAllInvoices()
  const activeCount = students.filter((s: any) => s.status === 'Active').length
  const inactiveCount = students.filter((s: any) => s.status === 'Inactive').length
  
  const studentIds = new Set(students.map((s: any) => s.id))
  const validInvoices = invoices.filter((inv: any) => studentIds.has(inv.studentId))
  const recentInvoices = validInvoices.slice(0, 5)
  
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-fg tracking-tight">Students Dashboard</h1>
          <p className="text-muted-fg mt-1 text-sm md:text-base">Overview of institutional enrollment metrics.</p>
        </div>
        <Link href="/dashboard/students/add">
          <Button className="gap-2 shadow-sm shadow-brand-500/20 w-full sm:w-auto">
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
         <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950 overflow-hidden">
            <CardHeader className="border-b border-border/40 py-4 bg-surface-100/30 dark:bg-surface-900/10">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-fg">
                <Users className="w-4 h-4 text-brand-500" /> Enrollment by Class
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-border/40">
                  {Array.from(new Set(students.map((s: any) => s.className))).sort().map(cls => {
                    const count = students.filter((s: any) => s.className === cls).length
                    return (
                      <div key={cls} className="flex items-center justify-between px-6 py-4">
                        <span className="text-sm font-medium text-fg">Class {cls}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20">
                          {count} Students
                        </span>
                      </div>
                    )
                  })}
                  {students.length === 0 && <div className="p-8 text-center text-muted-fg text-sm italic">No class data available.</div>}
               </div>
            </CardContent>
         </Card>

         <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950 overflow-hidden">
            <CardHeader className="border-b border-border/40 py-4 bg-surface-100/30 dark:bg-surface-900/10">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-fg">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Recent Fee Invoices
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-border/40">
                  {recentInvoices.map((inv: any) => (
                    <Link 
                      key={inv._id} 
                      href={`/dashboard/students/${inv.studentId}?tab=fees`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-surface-100/30 dark:hover:bg-surface-900/30 transition-colors group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-fg group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate transition-colors">{inv.studentName}</p>
                        <p className="text-xs text-muted-fg truncate">{inv.title}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-bold text-fg">₹{inv.amount}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${
                          inv.status === 'Paid' ? 'text-emerald-500' : 
                          inv.status === 'Partial' ? 'text-blue-500' : 'text-amber-500'
                        }`}>{inv.status}</p>
                      </div>
                    </Link>
                  ))}
                  {recentInvoices.length === 0 && <div className="p-8 text-center text-muted-fg text-sm italic">No recent financial activity.</div>}
               </div>
               {recentInvoices.length > 0 && (
                 <div className="p-4 bg-surface-50 dark:bg-surface-900/40 border-t border-border/40 text-center">
                   <Link href="/dashboard/students/fees" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">View All Billing</Link>
                 </div>
               )}
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
