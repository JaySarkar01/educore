import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, CheckCircle2, XCircle } from "lucide-react"
import { getSchools, approveSchool, rejectSchool, getAdminStats } from "@/app/actions/school"

export default async function AdminDashboard() {
  const schools = await getSchools()
  const stats = await getAdminStats()

  return (
    <div className="flex-1 p-8 pt-24 bg-surface-50 dark:bg-surface-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-fg">Super Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2 text-sm text-muted-fg font-medium">Total registered schools</CardHeader>
            <CardContent className="text-3xl font-bold text-fg">{stats?.totalSchools || schools.length}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 text-sm text-muted-fg font-medium">Pending Approvals</CardHeader>
            <CardContent className="text-3xl font-bold text-amber-500">{stats?.pendingSchools || schools.filter(s => s.status === "Pending").length}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 text-sm text-muted-fg font-medium">Active Students</CardHeader>
            <CardContent className="text-3xl font-bold text-brand-600">{stats?.totalStudents || 0}</CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
            <CardDescription>Review and manage new school onboardings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-fg uppercase bg-surface-100 dark:bg-surface-900 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-3">School</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-fg">No registrations yet.</td>
                    </tr>
                  ) : schools.map((school) => (
                    <tr key={school.id} className="border-b border-border/50 last:border-0 hover:bg-surface-100/50 dark:hover:bg-surface-900/50">
                      <td className="px-6 py-4 font-medium text-fg flex items-center gap-3">
                        <Building className="w-5 h-5 text-muted-fg" />
                        <div>
                          <div className="font-semibold">{school.schoolName}</div>
                          <div className="text-xs text-muted-fg font-normal">{school.adminEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-fg">{school.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          school.status === "Approved" ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300" :
                          school.status === "Rejected" ? "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300" :
                          "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                        }`}>
                          {school.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {school.status === "Pending" && (
                          <div className="flex gap-2 items-center">
                            <form action={approveSchool.bind(null, school.id)}>
                              <Button type="submit" size="sm" variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 h-8">
                                Approve
                              </Button>
                            </form>
                            <form action={rejectSchool.bind(null, school.id)}>
                              <Button type="submit" size="sm" variant="ghost" className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 px-2">
                                Reject
                              </Button>
                            </form>
                          </div>
                        )}
                        {school.status === "Approved" && (
                          <span className="text-muted-fg italic text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active
                          </span>
                        )}
                        {school.status === "Rejected" && (
                          <span className="text-muted-fg italic text-xs flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-red-500" /> Declined
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
