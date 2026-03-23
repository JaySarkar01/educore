import { FileLineChart, TrendingUp, AlertCircle, FileText } from "lucide-react"

export default function TeacherReportsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-fg tracking-tight">Faculty Reports</h1>
        <p className="text-muted-fg mt-1 text-lg">Performance and Evaluation analytics.</p>
      </div>

      <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 border-dashed rounded-xl p-16 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-brand-500/10 dark:bg-brand-500/20 rounded-full flex items-center justify-center mb-6">
          <TrendingUp className="w-10 h-10 text-brand-600 dark:text-brand-400" />
        </div>
        <h3 className="text-xl font-bold text-fg">Performance Analytics Module</h3>
        <p className="text-muted-fg max-w-md mt-2 text-base">This reporting module empowers Super Admins to track metrics such as Class Failure Rates, Subject Passing Averages, and Anonymous Student Feedback against specific Teachers.</p>
        
        <div className="mt-8 flex gap-4 text-sm font-semibold text-brand-600 dark:text-brand-400">
          <span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4"/> Upcoming Feature</span>
        </div>
      </div>
    </div>
  )
}
