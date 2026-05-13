import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-fg tracking-tight">Financial Reports</h1>
          <p className="text-muted-fg mt-1 text-sm md:text-base">Generate comprehensive account statements and analytics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export All
          </Button>
          <Button className="gap-2 shadow-sm shadow-brand-500/20">
            <Printer className="w-4 h-4" /> Print Summary
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-500" /> Daily Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-fg">
            Generates PDF/Excel of all fee receipts categorized by method (Cash, Bank) for end-of-day bank reconciliation.
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" /> Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-fg">
            Breaks down income by class, grade, and components (tuition vs late fees) over the specified month.
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-rose-500" /> Expense Report
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-fg">
            Details all outward transaction flows, categorizing maintenance, utility and payroll overheads.
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-500" /> Pending Fees
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-fg">
            Chronological aging report of unpaid dues spanning 30/60/90+ days threshold lists.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
