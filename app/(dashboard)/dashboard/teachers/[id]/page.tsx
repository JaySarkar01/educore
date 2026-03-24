import { getTeacherById } from "@/app/actions/teacher"
import { getIndividualStaffAttendanceStats } from "@/app/actions/staff-attendance"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, LayoutGrid, Activity, Phone, GraduationCap, Briefcase, CalendarDays, BookOpen } from "lucide-react"

export default async function TeacherProfilePage(
  props: { params: Promise<{ id: string }>, searchParams?: Promise<{ tab?: string }> }
) {
  const params = await props.params
  const sp = await props.searchParams
  const tab = sp?.tab || "overview"
  
  const teacher = await getTeacherById(params.id)
  if (!teacher) return notFound()
  
  const attStats = await getIndividualStaffAttendanceStats(params.id)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'subjects', label: 'Assigned Subjects', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: CalendarDays },
    { id: 'timeline', label: 'Activity Log', icon: Activity },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Link href="/dashboard/teachers/manage" className="inline-flex items-center text-sm font-medium text-muted-fg hover:text-fg transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Teachers
      </Link>

      {/* Profile Header Card */}
      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
        {teacher.photo ? (
          <img
            src={teacher.photo}
            alt={teacher.name}
            className="w-24 h-24 rounded-full object-cover flex-shrink-0 border-4 border-surface-100 dark:border-surface-900 shadow-md"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center justify-center text-3xl font-bold flex-shrink-0 border-4 border-surface-100 dark:border-surface-900">
            {teacher.name.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-fg tracking-tight">{teacher.name}</h1>
              <p className="text-blue-600 dark:text-blue-400 font-medium">Department: {teacher.department || 'N/A'}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold border w-fit ${
              teacher.status === 'Active' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                : 'bg-surface-200 text-muted-fg dark:bg-surface-800 border-border'
            }`}>
              {teacher.status}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-xs text-muted-fg uppercase tracking-wider font-semibold">Emp ID</p>
              <p className="font-medium text-fg">{teacher.employeeId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-fg uppercase tracking-wider font-semibold">Degree</p>
              <p className="font-medium text-fg">{teacher.qualification}</p>
            </div>
            <div>
              <p className="text-xs text-muted-fg uppercase tracking-wider font-semibold">Experience</p>
              <p className="font-medium text-fg">{teacher.experience} Years</p>
            </div>
            <div>
              <p className="text-xs text-muted-fg uppercase tracking-wider font-semibold">Phone</p>
              <p className="font-medium text-fg">{teacher.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-border/40 scrollbar-hide">
        {tabs.map((t) => {
          const Icon = t.icon
          const isActive = tab === t.id
          return (
            <Link 
              key={t.id} 
              href={`/dashboard/teachers/${teacher._id}?tab=${t.id}`}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                isActive 
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-500/5' 
                  : 'border-transparent text-muted-fg hover:text-fg hover:border-border'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </Link>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-right-2 duration-300">
            {/* Personal Details */}
            <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20">
                <h3 className="font-bold text-fg flex items-center gap-2"><User className="w-4 h-4 text-brand-500"/> Personal details</h3>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <div><p className="text-sm text-muted-fg mb-1">Gender</p><p className="text-sm font-medium text-fg">{teacher.gender}</p></div>
                <div><p className="text-sm text-muted-fg mb-1">Date of Birth</p><p className="text-sm font-medium text-fg">{teacher.dateOfBirth || '-'}</p></div>
                <div><p className="text-sm text-muted-fg mb-1">Email</p><p className="text-sm font-medium text-fg">{teacher.email || '-'}</p></div>
                <div className="md:col-span-2"><p className="text-sm text-muted-fg mb-1">Full Address</p><p className="text-sm font-medium text-fg">{teacher.address || '-'}</p></div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20">
                <h3 className="font-bold text-fg flex items-center gap-2"><Briefcase className="w-4 h-4 text-brand-500"/> Employment Specifics</h3>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                <div><p className="text-sm text-muted-fg mb-1">Date Joined</p><p className="text-sm font-medium text-fg">{teacher.joiningDate}</p></div>
                <div><p className="text-sm text-muted-fg mb-1">Base Salary</p><p className="text-sm font-medium text-fg">${teacher.baseSalary.toLocaleString()}</p></div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-fg mb-2">Subject Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects && teacher.subjects.length > 0 ? teacher.subjects.map((sub: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-surface-100 dark:bg-surface-900 border border-border/50 rounded-full text-xs font-semibold">{sub}</span>
                    )) : <span className="text-sm text-muted-fg">No subjects strictly mapped.</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'timeline' && (
          <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm animate-in slide-in-from-right-2 duration-300">
            <h3 className="font-bold text-fg mb-6">Activity Timeline</h3>
            <div className="relative border-l border-border/60 ml-3 space-y-8">
              {teacher.timeline && teacher.timeline.map((act: any, i: number) => (
                <div key={i} className="pl-6 relative">
                  <div className="absolute w-3 h-3 bg-brand-500 rounded-full -left-[6.5px] top-1.5 border-2 border-surface-50 dark:border-surface-950"></div>
                  <h4 className="font-semibold text-fg text-sm">{act.title}</h4>
                  <p className="text-xs text-muted-fg mb-1">{new Date(act.date).toLocaleString()}</p>
                  {act.description && <p className="text-sm text-fg mt-2">{act.description}</p>}
                </div>
              ))}
              {(!teacher.timeline || teacher.timeline.length === 0) && (
                <p className="pl-6 text-muted-fg text-sm">No recorded activities.</p>
              )}
            </div>
          </div>
        )}

        {tab === 'attendance' && (
          <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-muted-fg mb-1">Total Tracked Days</p>
                <p className="text-3xl font-bold text-fg">{attStats?.totalDays || 0}</p>
              </div>
              <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-muted-fg mb-1">Days Present</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{attStats?.presentDays || 0}</p>
              </div>
              <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-muted-fg mb-1">Attendance Rate</p>
                <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{attStats?.percentage || 0}%</p>
              </div>
            </div>

            <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden mt-6">
              <div className="p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20">
                <h3 className="font-bold text-fg flex items-center gap-2"><CalendarDays className="w-4 h-4 text-brand-500"/> Detailed Attendance Log</h3>
              </div>
              {attStats?.history && attStats.history.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-fg uppercase bg-surface-50 dark:bg-surface-900/50 border-b">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold">Status Marking</th>
                        <th className="px-6 py-4 font-semibold">Admin Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {attStats.history.map((h: any, i: number) => (
                        <tr key={i} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-fg">{h.date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-sm text-xs font-semibold border ${
                              h.status === 'Present' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                              h.status === 'Absent' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' :
                              h.status === 'Late' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                              h.status === 'On Leave' ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20' :
                              'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                            }`}>
                              {h.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-fg">{h.remarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-muted-fg">No staff attendance records have been tracked for this faculty member.</div>
              )}
            </div>
          </div>
        )}

        {tab === 'subjects' && (
          <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 border-dashed rounded-xl p-16 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-surface-200 dark:bg-surface-800 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-muted-fg opacity-50" />
            </div>
            <h3 className="text-lg font-bold text-fg capitalize">Assignments Mapping</h3>
            <p className="text-muted-fg max-w-md mt-2">Subjects are formally assigned in the overarching 'Assign Subjects' bulk management console.</p>
          </div>
        )}
      </div>

    </div>
  )
}
