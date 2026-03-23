import { getClasses, getSubjects } from "@/app/actions/academic"
import { BookOpen, CopyMinus, Layers, GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AcademicsDashboardPage() {
  const classes = await getClasses()
  const subjects = await getSubjects()
  
  const totalSections = classes.reduce((sum: number, cls: any) => sum + (cls.sections?.length || 0), 0)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-fg tracking-tight">Academics Layout</h1>
        <p className="text-muted-fg mt-1 text-lg">High-level quantitative overview of curricular configurations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-fg">Structural Classes</CardTitle>
            <Layers className="w-4 h-4 text-brand-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fg">{classes.length}</div>
            <p className="text-xs text-muted-fg mt-1">Unique active grades</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-fg">Granular Sections</CardTitle>
            <CopyMinus className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fg">{totalSections}</div>
            <p className="text-xs text-muted-fg mt-1">Deep partitions generated</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-fg">Master Subjects</CardTitle>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fg">{subjects.length}</div>
            <p className="text-xs text-muted-fg mt-1">Unique curriculum courses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <Layers className="w-12 h-12 text-brand-500/40 mb-4" />
          <h3 className="text-xl font-bold text-fg mb-2">Class Logic Mapping</h3>
          <p className="text-muted-fg text-sm mb-6 max-w-sm">Determine hierarchical constraints, grouping parameters, and structural limits.</p>
          <Link href="/dashboard/classes/manage"><Button className="w-full sm:w-auto shadow-sm shadow-brand-500/20">Manage Classes</Button></Link>
        </div>
        <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <BookOpen className="w-12 h-12 text-emerald-500/40 mb-4" />
          <h3 className="text-xl font-bold text-fg mb-2">Subject Master Index</h3>
          <p className="text-muted-fg text-sm mb-6 max-w-sm">Construct the overarching academic curriculum elements taught across departments.</p>
          <Link href="/dashboard/classes/subjects"><Button className="w-full sm:w-auto shadow-sm shadow-brand-500/20">Manage Subjects</Button></Link>
        </div>
      </div>
    </div>
  )
}
