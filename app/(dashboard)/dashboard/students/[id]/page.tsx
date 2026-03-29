import { getStudentById } from "@/app/actions/student"
import { getStudentAttendanceStats } from "@/app/actions/attendance"
import { getStudentFeeStats } from "@/app/actions/fees"
import { RecordPaymentForm } from "@/components/dashboard/record-payment-form"
import { DocumentsTab } from "@/components/dashboard/documents-tab"
import { getAuthContext } from "@/lib/auth"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, LayoutGrid, CalendarDays, Wallet, FileText, Activity, MapPin, Phone, GraduationCap, CheckCircle } from "lucide-react"

export default async function StudentProfilePage(
  props: { params: Promise<{ id: string }>, searchParams?: Promise<{ tab?: string }> }
) {
  const params = await props.params
  const sp = await props.searchParams
  const tab = sp?.tab || "overview"
  const auth = await getAuthContext()
  const isStudentViewer = auth?.roleName === "STUDENT"
  
  const student = await getStudentById(params.id)
  if (!student) return notFound()
  
  const attStats = await getStudentAttendanceStats(params.id)
  const feeStats = await getStudentFeeStats(params.id)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'attendance', label: 'Attendance', icon: CalendarDays },
    { id: 'fees', label: 'Fees History', icon: Wallet },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'timeline', label: 'Activity Log', icon: Activity },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-500">
      {/* Header Back Link */}
      <Link href="/dashboard/students" className="inline-flex items-center text-sm font-medium text-muted-fg hover:text-fg transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Students
      </Link>

      {/* Profile Header Card */}
      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
        {student.photo ? (
          <img
            src={student.photo}
            alt={student.name}
            className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover flex-shrink-0 border-4 border-surface-100 dark:border-surface-900 shadow-md"
          />
        ) : (
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 flex items-center justify-center text-2xl md:text-3xl font-bold flex-shrink-0 border-4 border-surface-100 dark:border-surface-900">
            {student.name.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-fg tracking-tight">{student.name}</h1>
              <p className="text-brand-600 dark:text-brand-400 font-medium text-sm md:text-base">Class {student.className} {student.section && `• Sec ${student.section}`}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold border w-fit ${
              student.status === 'Active' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                : 'bg-surface-200 text-muted-fg dark:bg-surface-800 border-border'
            }`}>
              {student.status}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div>
              <p className="text-xs text-muted-fg uppercase tracking-wider font-semibold">Adm No</p>
              <p className="font-medium text-fg text-sm">{student.admissionNo}</p>
            </div>
            <div>
              <p className="text-xs text-muted-fg uppercase tracking-wider font-semibold">Roll No</p>
              <p className="font-medium text-fg text-sm">{student.rollNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-fg uppercase tracking-wider font-semibold">DOB</p>
              <p className="font-medium text-fg text-sm">{student.dateOfBirth || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-fg uppercase tracking-wider font-semibold">Gender</p>
              <p className="font-medium text-fg text-sm">{student.gender}</p>
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
              href={`/dashboard/students/${student._id}?tab=${t.id}`}
              className={`flex items-center gap-1.5 px-3 md:px-6 py-3 md:py-4 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap transition-colors ${
                isActive 
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-500/5' 
                  : 'border-transparent text-muted-fg hover:text-fg hover:border-border'
              }`}
            >
              <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" /> {t.label}
            </Link>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-2 duration-300">
            
            {/* Quick Stats Column */}
            <div className="space-y-6">
              <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-fg mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-brand-500"/> Quick Summary</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-border/40">
                    <span className="text-muted-fg">Attendance</span>
                    <span className={`font-semibold ${(attStats?.percentage || 0) < 75 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {attStats?.percentage || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border/40">
                    <span className="text-muted-fg">Unpaid Balance</span>
                    <span className={`font-semibold ${(feeStats?.pendingBalance || 0) > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600'}`}>
                      ₹{feeStats?.pendingBalance?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-fg">Total Invoices</span>
                    <span className="font-semibold text-fg">{feeStats?.invoices?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Info Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Personal & Parent Info */}
              <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20">
                  <h3 className="font-bold text-fg flex items-center gap-2"><User className="w-4 h-4 text-brand-500"/> Personal & Guardian Details</h3>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-sm text-muted-fg mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> Residential Address</p>
                    <p className="text-sm font-medium text-fg">{student.address || 'No address tracked'}</p>
                    {student.pincode && <p className="text-xs text-muted-fg mt-0.5">ZIP: {student.pincode}</p>}
                  </div>
                  <div>
                    <p className="text-sm text-muted-fg mb-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/> Contact Information</p>
                    <p className="text-sm font-medium text-fg">Father: {student.parentName} ({student.parentPhone})</p>
                    {student.motherName && <p className="text-sm font-medium text-fg mt-1">Mother: {student.motherName} ({student.motherPhone})</p>}
                    {student.emergencyContact && <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">Emergency: {student.emergencyContact}</p>}
                  </div>
                  <div className="md:col-span-2 pt-4 border-t border-border/40">
                    <p className="text-sm text-muted-fg mb-1">Medical Notes & Allergies</p>
                <p className="text-sm font-medium text-fg">{student.medicalNotes || 'None specified.'}</p>
              </div>
            </div>
          </div>

          {/* Academic & Facility Info */}
          <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20">
              <h3 className="font-bold text-fg flex items-center gap-2"><GraduationCap className="w-4 h-4 text-brand-500"/> Enrollment & Facilities</h3>
            </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-sm text-muted-fg mb-1">Admission Date</p>
                    <p className="text-sm font-medium text-fg">{student.admissionDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-fg mb-1">Previous School</p>
                    <p className="text-sm font-medium text-fg">{student.previousSchool || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-fg mb-1">Transport Route</p>
                    <p className="text-sm font-medium text-fg">{student.transportRoute || 'Own Transport'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-fg mb-1">Hostel Allocation</p>
                    <p className="text-sm font-medium text-fg">{student.hostelRoom || 'Day Scholar'}</p>
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
              {student.timeline && student.timeline.map((act: any, i: number) => (
                <div key={i} className="pl-6 relative">
                  <div className="absolute w-3 h-3 bg-brand-500 rounded-full -left-[6.5px] top-1.5 border-2 border-surface-50 dark:border-surface-950"></div>
                  <h4 className="font-semibold text-fg text-sm">{act.title}</h4>
                  <p className="text-xs text-muted-fg mb-1">{new Date(act.date).toLocaleString()}</p>
                  {act.description && <p className="text-sm text-fg mt-2">{act.description}</p>}
                </div>
              ))}
              {(!student.timeline || student.timeline.length === 0) && (
                <p className="pl-6 text-muted-fg text-sm">No recorded activities.</p>
              )}
            </div>
          </div>
        )}

        {tab === 'attendance' && (
          <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-muted-fg mb-1">Total Tracked Days</p>
                <p className="text-3xl font-bold text-fg">{attStats?.totalDays || 0}</p>
              </div>
              <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-muted-fg mb-1">Present Days</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{attStats?.presentDays || 0}</p>
              </div>
              <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-muted-fg mb-1">Attendance Rate</p>
                <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{attStats?.percentage || 0}%</p>
              </div>
            </div>

            {/* History Table */}
            <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden mt-6">
              <div className="p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20">
                <h3 className="font-bold text-fg flex items-center gap-2"><CalendarDays className="w-4 h-4 text-brand-500"/> Detailed Tracking History</h3>
              </div>
              {attStats?.history && attStats.history.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-fg uppercase bg-surface-50 dark:bg-surface-900/50 border-b">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold">Status Marking</th>
                        <th className="px-6 py-4 font-semibold">Teacher Remarks</th>
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
                <div className="p-12 text-center text-muted-fg">No attendance records have been tracked for this student.</div>
              )}
            </div>
          </div>
        )}

        {tab === 'fees' && (
          <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-muted-fg mb-1">Total Billed</p>
                <p className="text-3xl font-bold text-fg">₹{feeStats?.totalBilled?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-muted-fg mb-1">Total Paid</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₹{feeStats?.totalPaid?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-6 shadow-sm">
                <p className="text-sm font-medium text-muted-fg mb-1">Pending Balance</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">₹{feeStats?.pendingBalance?.toFixed(2) || '0.00'}</p>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-sm overflow-hidden mt-6">
              <div className="p-5 border-b border-border/40 bg-surface-100/50 dark:bg-surface-900/20">
                <h3 className="font-bold text-fg flex items-center gap-2"><Wallet className="w-4 h-4 text-brand-500"/> Fee Invoices & Payment History</h3>
              </div>
              {feeStats?.invoices && feeStats.invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-fg uppercase bg-surface-50 dark:bg-surface-900/50 border-b">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Invoice Particulars</th>
                        <th className="px-6 py-4 font-semibold">Due Date</th>
                        <th className="px-6 py-4 font-semibold">Total</th>
                        <th className="px-6 py-4 font-semibold">Paid</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {feeStats.invoices.map((inv: any) => {
                        const pendingAmt = inv.amount - inv.amountPaid
                        return (
                          <tr key={inv._id} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/30 transition-colors group">
                            <td className="px-6 py-4">
                              <p className="font-semibold text-fg">{inv.title}</p>
                              {inv.payments.length > 0 && (
                                <p className="text-xs text-muted-fg mt-1">Last payment: {new Date(inv.payments[inv.payments.length-1].date).toISOString().split('T')[0]}</p>
                              )}
                            </td>
                            <td className="px-6 py-4 font-medium">{inv.dueDate}</td>
                            <td className="px-6 py-4 font-semibold text-fg">₹{inv.amount.toFixed(2)}</td>
                            <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">₹{inv.amountPaid.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-sm text-xs font-semibold border ${
                                inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                                inv.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                                inv.status === 'Partial' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                                'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                              }`}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {inv.status !== 'Paid' && !isStudentViewer ? (
                                <RecordPaymentForm invoiceId={inv._id} pendingAmount={pendingAmt} invoiceTitle={inv.title} />
                              ) : (
                                <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Settled</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-muted-fg">No fee invoices have been generated for this student.</div>
              )}
            </div>
          </div>
        )}

        {tab === 'documents' && (
          <DocumentsTab
            studentId={student._id?.toString() || student.id}
            initialDocs={student.documents || []}
            readOnly={isStudentViewer}
          />
        )}
      </div>

    </div>
  )
}
