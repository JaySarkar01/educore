"use client"

// Interactive Client Component for Financial Reports
import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, Download, Printer, Wallet, TrendingUp, 
  AlertCircle, Calendar, Users, Layers, Info, Filter, ArrowUpRight
} from "lucide-react"

interface ReportsClientProps {
  invoices: any[]
  expenses: any[]
}

type ReportType = "daily" | "monthly" | "expense" | "pending"

export default function ReportsClient({ invoices, expenses }: ReportsClientProps) {
  const [activeReport, setActiveReport] = useState<ReportType>("daily")

  // Date formatting helpers
  const getLocalDateYMD = (dateInput: Date | string | number) => {
    const d = new Date(dateInput)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const r = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${r}`
  }

  const getLocalDateYM = (dateInput: Date | string | number) => {
    const d = new Date(dateInput)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    return `${y}-${m}`
  }

  // Current Date/Month contexts
  const todayYMD = useMemo(() => getLocalDateYMD(new Date()), [])
  const currentMonthYM = useMemo(() => getLocalDateYM(new Date()), [])

  // Report Specific Filter States
  const [dailyDate, setDailyDate] = useState<string>(todayYMD)
  const [monthlyMonth, setMonthlyMonth] = useState<string>(currentMonthYM)
  
  // Expense range (default current month)
  const [expenseStartDate, setExpenseStartDate] = useState<string>(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  })
  const [expenseEndDate, setExpenseEndDate] = useState<string>(todayYMD)

  // Pending fees filters
  const [pendingClass, setPendingClass] = useState<string>("ALL")
  const [pendingThreshold, setPendingThreshold] = useState<number>(0) // min days overdue

  // Extract classes from invoices dynamically
  const classList = useMemo(() => {
    const classes = new Set<string>()
    invoices.forEach((inv: any) => {
      if (inv.className) classes.add(inv.className)
    })
    return Array.from(classes).sort()
  }, [invoices])

  // --- TOP BAR KPI CARD CALCULATIONS (ALL DYNAMIC OVER CURRENT LIVE DATA) ---
  const todayCollectionsTotal = useMemo(() => {
    let total = 0
    invoices.forEach((inv: any) => {
      inv.payments?.forEach((p: any) => {
        if (getLocalDateYMD(p.date) === todayYMD) {
          total += p.amount
        }
      })
    })
    return total
  }, [invoices, todayYMD])

  const monthlyCollectionsTotal = useMemo(() => {
    let total = 0
    invoices.forEach((inv: any) => {
      inv.payments?.forEach((p: any) => {
        if (getLocalDateYM(p.date) === currentMonthYM) {
          total += p.amount
        }
      })
    })
    return total
  }, [invoices, currentMonthYM])

  const monthlyExpensesTotal = useMemo(() => {
    let total = 0
    expenses.forEach((exp: any) => {
      if (getLocalDateYM(exp.date) === currentMonthYM) {
        total += exp.amount
      }
    })
    return total
  }, [expenses, currentMonthYM])

  const totalOutstandingFees = useMemo(() => {
    let total = 0
    invoices.forEach((inv: any) => {
      if (inv.status !== 'Paid') {
        const balance = inv.amount - (inv.amountPaid || 0)
        if (balance > 0) total += balance
      }
    })
    return total
  }, [invoices])

  // --- REPORT DATA PROCESSING CORES ---

  // 1. Daily Collection Data
  const dailyPayments = useMemo(() => {
    const list: any[] = []
    invoices.forEach((inv: any) => {
      inv.payments?.forEach((p: any) => {
        if (getLocalDateYMD(p.date) === dailyDate) {
          list.push({
            receiptNumber: p.receiptNumber,
            studentName: inv.studentName,
            className: inv.className,
            title: inv.title,
            method: p.method,
            transactionId: p.transactionId || "-",
            amount: p.amount,
            date: p.date
          })
        }
      })
    })
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [invoices, dailyDate])

  const dailyMethodBreakdown = useMemo(() => {
    let cash = 0, bank = 0, card = 0, online = 0
    dailyPayments.forEach((p: any) => {
      if (p.method === "Cash") cash += p.amount
      else if (p.method === "Bank Transfer") bank += p.amount
      else if (p.method === "Card") card += p.amount
      else if (p.method === "Online") online += p.amount
    })
    return { cash, bank, card, online, total: cash + bank + card + online }
  }, [dailyPayments])

  // 2. Monthly Revenue Data
  const monthlyClassData = useMemo(() => {
    const classMap: Record<string, { className: string, billed: number, collected: number, count: number }> = {}

    invoices.forEach((inv: any) => {
      // Group payments in this month by student's class
      inv.payments?.forEach((p: any) => {
        const pMonth = getLocalDateYM(p.date)
        if (pMonth === monthlyMonth) {
          if (!classMap[inv.className]) {
            classMap[inv.className] = { className: inv.className, billed: 0, collected: 0, count: 0 }
          }
          classMap[inv.className].collected += p.amount
          classMap[inv.className].count += 1
        }
      })

      // Group invoices created in this month by student's class
      const iMonth = getLocalDateYM(inv.createdAt)
      if (iMonth === monthlyMonth) {
        if (!classMap[inv.className]) {
          classMap[inv.className] = { className: inv.className, billed: 0, collected: 0, count: 0 }
        }
        classMap[inv.className].billed += inv.amount
      }
    })

    return Object.values(classMap).sort((a, b) => a.className.localeCompare(b.className, undefined, { numeric: true }))
  }, [invoices, monthlyMonth])

  const monthlyComponentData = useMemo(() => {
    const compMap: Record<string, { name: string, collected: number, count: number }> = {}
    
    invoices.forEach((inv: any) => {
      inv.payments?.forEach((p: any) => {
        const pMonth = getLocalDateYM(p.date)
        if (pMonth === monthlyMonth) {
          const title = inv.title || "General Fee"
          if (!compMap[title]) {
            compMap[title] = { name: title, collected: 0, count: 0 }
          }
          compMap[title].collected += p.amount
          compMap[title].count += 1
        }
      })
    })

    return Object.values(compMap).sort((a, b) => b.collected - a.collected)
  }, [invoices, monthlyMonth])

  const monthlyTotals = useMemo(() => {
    let billed = 0, collected = 0
    monthlyClassData.forEach((c) => {
      billed += c.billed
      collected += c.collected
    })
    return { billed, collected }
  }, [monthlyClassData])

  // 3. Expense Report Data
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp: any) => {
      const expDate = exp.date.split('T')[0]
      return expDate >= expenseStartDate && expDate <= expenseEndDate
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [expenses, expenseStartDate, expenseEndDate])

  const expenseCategoryBreakdown = useMemo(() => {
    const catMap: Record<string, number> = {}
    let total = 0
    filteredExpenses.forEach((exp: any) => {
      catMap[exp.category] = (catMap[exp.category] || 0) + exp.amount
      total += exp.amount
    })
    const breakdown = Object.entries(catMap).map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount)
    return { breakdown, total }
  }, [filteredExpenses])

  // 4. Pending Fees Aging Data
  const filteredPendingInvoices = useMemo(() => {
    const list: any[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    invoices.forEach((inv: any) => {
      if (inv.status !== 'Paid') {
        const balance = inv.amount - (inv.amountPaid || 0)
        if (balance <= 0) return

        let daysOverdue = 0
        const dueDateObj = new Date(inv.dueDate)
        if (dueDateObj < today) {
          const diffTime = today.getTime() - dueDateObj.getTime()
          daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        }

        // Apply filters
        if (pendingClass !== 'ALL' && inv.className !== pendingClass) return
        if (daysOverdue < pendingThreshold) return

        list.push({
          _id: inv._id,
          studentName: inv.studentName,
          className: inv.className,
          title: inv.title,
          dueDate: inv.dueDate,
          daysOverdue,
          amount: inv.amount,
          amountPaid: inv.amountPaid || 0,
          balance
        })
      }
    })

    return list.sort((a, b) => b.daysOverdue - a.daysOverdue)
  }, [invoices, pendingClass, pendingThreshold])

  const pendingAgingBreakdown = useMemo(() => {
    let range0_30 = 0, range31_60 = 0, range61_90 = 0, range90Plus = 0
    let totalBalance = 0

    filteredPendingInvoices.forEach((item) => {
      totalBalance += item.balance
      if (item.daysOverdue <= 30) range0_30 += item.balance
      else if (item.daysOverdue <= 60) range31_60 += item.balance
      else if (item.daysOverdue <= 90) range61_90 += item.balance
      else range90Plus += item.balance
    })

    return { range0_30, range31_60, range61_90, range90Plus, totalBalance }
  }, [filteredPendingInvoices])

  // --- PRINT FUNCTIONALITY ---
  const handlePrint = () => {
    window.print()
  }

  // --- EXPORT CSV UTILITIES ---
  const cleanCSVCell = (val: any) => {
    if (val === null || val === undefined) return ""
    const str = String(val).replace(/"/g, '""')
    return str.includes(',') || str.includes('\n') || str.includes('"') ? `"${str}"` : str
  }

  const convertToCSV = (headers: string[], rows: any[][]) => {
    const csvRows = [headers.join(",")]
    rows.forEach(row => {
      csvRows.push(row.map(cleanCSVCell).join(","))
    })
    return csvRows.join("\n")
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export currently active report to CSV
  const handleExportCSV = () => {
    let headers: string[] = []
    let rows: any[][] = []
    let filename = `financial_report_${activeReport}`

    switch (activeReport) {
      case "daily":
        filename += `_${dailyDate}`
        headers = ["Receipt Number", "Student Name", "Class", "Fee Title", "Payment Method", "Transaction ID", "Amount", "Date/Time"]
        rows = dailyPayments.map(p => [
          p.receiptNumber, p.studentName, p.className, p.title, p.method, p.transactionId, p.amount, new Date(p.date).toLocaleString()
        ])
        break

      case "monthly":
        filename += `_${monthlyMonth}`
        headers = ["Class/Grade", "Invoiced Amount (Billed)", "Collected Amount", "Receipts Count"]
        rows = monthlyClassData.map(c => [
          c.className, c.billed, c.collected, c.count
        ])
        break

      case "expense":
        filename += `_from_${expenseStartDate}_to_${expenseEndDate}`
        headers = ["Date", "Expense Description", "Category", "Vendor", "Payment Method", "Amount"]
        rows = filteredExpenses.map(e => [
          new Date(e.date).toLocaleDateString(), e.title, e.category, e.vendorName || "-", e.paymentMethod, e.amount
        ])
        break

      case "pending":
        filename += `_aging_threshold_${pendingThreshold}days`
        headers = ["Student Name", "Class/Grade", "Fee Title", "Due Date", "Days Overdue", "Total Billed", "Amount Paid", "Balance Due"]
        rows = filteredPendingInvoices.map(p => [
          p.studentName, p.className, p.title, p.dueDate, p.daysOverdue, p.amount, p.amountPaid, p.balance
        ])
        break
    }

    const csv = convertToCSV(headers, rows)
    downloadCSV(csv, `${filename}.csv`)
  }

  // Export Combined CSV with all 4 reports in structured sections
  const handleExportAll = () => {
    let combinedCSV = ""

    // Section 1: Metadata
    combinedCSV += `=== SCHOOL FINANCE GENERAL METADATA ===\n`
    combinedCSV += `Generated At,${new Date().toLocaleString()}\n`
    combinedCSV += `Today Collections,₹${todayCollectionsTotal}\n`
    combinedCSV += `Current Month Collections,₹${monthlyCollectionsTotal}\n`
    combinedCSV += `Current Month Expenses,₹${monthlyExpensesTotal}\n`
    combinedCSV += `Total Outstanding Dues,₹${totalOutstandingFees}\n\n`

    // Section 2: Daily Fee Collection
    combinedCSV += `=== DAILY FEE COLLECTION REPORT (${dailyDate}) ===\n`
    combinedCSV += `Receipt Number,Student Name,Class,Fee Title,Payment Method,Transaction ID,Amount,Payment Date\n`
    dailyPayments.forEach(p => {
      combinedCSV += `${cleanCSVCell(p.receiptNumber)},${cleanCSVCell(p.studentName)},${cleanCSVCell(p.className)},${cleanCSVCell(p.title)},${cleanCSVCell(p.method)},${cleanCSVCell(p.transactionId)},${p.amount},${new Date(p.date).toLocaleString()}\n`
    })
    combinedCSV += `\n`

    // Section 3: Monthly Revenue by Class
    combinedCSV += `=== MONTHLY REVENUE REPORT BY CLASS (${monthlyMonth}) ===\n`
    combinedCSV += `Class Name,Total Billed,Total Collected,Receipts Count\n`
    monthlyClassData.forEach(c => {
      combinedCSV += `${cleanCSVCell(c.className)},${c.billed},${c.collected},${c.count}\n`
    })
    combinedCSV += `\n`

    // Section 4: Expenses List
    combinedCSV += `=== SCHOOL EXPENSES REPORT (from ${expenseStartDate} to ${expenseEndDate}) ===\n`
    combinedCSV += `Date,Title,Category,Vendor Name,Payment Method,Amount\n`
    filteredExpenses.forEach(e => {
      combinedCSV += `${new Date(e.date).toLocaleDateString()},${cleanCSVCell(e.title)},${cleanCSVCell(e.category)},${cleanCSVCell(e.vendorName || "-")},${cleanCSVCell(e.paymentMethod)},${e.amount}\n`
    })
    combinedCSV += `\n`

    // Section 5: Overdue / Aging Pending Fees
    combinedCSV += `=== OVERDUE FEES AGING REPORT (Class: ${pendingClass} | Overdue threshold: ${pendingThreshold}+ days) ===\n`
    combinedCSV += `Student Name,Class,Fee Title,Due Date,Days Overdue,Amount Billed,Amount Paid,Outstanding Balance\n`
    filteredPendingInvoices.forEach(p => {
      combinedCSV += `${cleanCSVCell(p.studentName)},${cleanCSVCell(p.className)},${cleanCSVCell(p.title)},${p.dueDate},${p.daysOverdue},${p.amount},${p.amountPaid},${p.balance}\n`
    })

    downloadCSV(combinedCSV, `school_finance_consolidated_report_${todayYMD}.csv`)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      
      {/* Dynamic print container style injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide non-report layout structures */
          aside, 
          header, 
          nav,
          footer,
          .print\\:hidden {
            display: none !important;
          }
          
          /* Force printable report to occupies full page width */
          body, html, main {
            width: 100% !important;
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Ensure main page content wrapper doesn't lock print layout */
          .max-w-7xl, .p-4, .md\\:p-6, .lg\\:p-8 {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Keep only our target printable wrapper visible and expand it */
          #printable-report {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 20px !important;
          }

          /* Hide card drop shadows for clean print outputs */
          .shadow-sm, .shadow-md, .shadow-lg, .border {
            box-shadow: none !important;
            border-color: #d1d5db !important;
          }

          /* Enhance tables readability on printer paper */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            border: 1px solid #9ca3af !important;
            padding: 8px !important;
            color: #000000 !important;
          }
          th {
            background-color: #f3f4f6 !important;
          }

          tr {
            page-break-inside: avoid !important;
          }
        }
      ` }} />

      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-fg tracking-tight">Financial Reports</h1>
          <p className="text-muted-fg mt-1 text-sm md:text-base">Generate comprehensive account statements, revenue breakdowns, and fee aging logs.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExportAll} variant="outline" className="gap-2 shadow-sm cursor-pointer border-border hover:bg-surface-100">
            <Download className="w-4 h-4 text-muted-fg" /> Export All Consolidated
          </Button>
          <Button onClick={handlePrint} className="gap-2 shadow-sm shadow-brand-500/20 bg-brand-600 hover:bg-brand-700 text-white cursor-pointer">
            <Printer className="w-4 h-4" /> Print Current Report
          </Button>
        </div>
      </div>

      {/* --- 4 REPORT KPI TYPE SELECTOR CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        {/* KPI 1: Daily Collection */}
        <div 
          onClick={() => setActiveReport("daily")}
          className={`cursor-pointer transition-all duration-300 rounded-xl border p-5 shadow-sm bg-surface-50 dark:bg-surface-950 flex flex-col justify-between h-32 hover:scale-[1.02] ${
            activeReport === "daily" 
              ? "border-brand-500 ring-2 ring-brand-500/10 dark:ring-brand-500/30" 
              : "border-border/60 hover:border-brand-300"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-fg uppercase tracking-wider">Daily Receipts</span>
            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-fg">
              ₹{todayCollectionsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-fg mt-1">Today's collection breakdown</p>
          </div>
        </div>

        {/* KPI 2: Monthly Revenue */}
        <div 
          onClick={() => setActiveReport("monthly")}
          className={`cursor-pointer transition-all duration-300 rounded-xl border p-5 shadow-sm bg-surface-50 dark:bg-surface-950 flex flex-col justify-between h-32 hover:scale-[1.02] ${
            activeReport === "monthly" 
              ? "border-emerald-500 ring-2 ring-emerald-500/10 dark:ring-emerald-500/30" 
              : "border-border/60 hover:border-emerald-300"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-fg uppercase tracking-wider">Monthly Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-fg">
              ₹{monthlyCollectionsTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-fg mt-1">Collected in {new Date().toLocaleString(undefined, { month: 'short', year: 'numeric' })}</p>
          </div>
        </div>

        {/* KPI 3: Expense Report */}
        <div 
          onClick={() => setActiveReport("expense")}
          className={`cursor-pointer transition-all duration-300 rounded-xl border p-5 shadow-sm bg-surface-50 dark:bg-surface-950 flex flex-col justify-between h-32 hover:scale-[1.02] ${
            activeReport === "expense" 
              ? "border-rose-500 ring-2 ring-rose-500/10 dark:ring-rose-500/30" 
              : "border-border/60 hover:border-rose-300"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-fg uppercase tracking-wider">Monthly Expense</span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-fg">
              ₹{monthlyExpensesTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-fg mt-1">Overhead spend this month</p>
          </div>
        </div>

        {/* KPI 4: Pending Fees */}
        <div 
          onClick={() => setActiveReport("pending")}
          className={`cursor-pointer transition-all duration-300 rounded-xl border p-5 shadow-sm bg-surface-50 dark:bg-surface-950 flex flex-col justify-between h-32 hover:scale-[1.02] ${
            activeReport === "pending" 
              ? "border-amber-500 ring-2 ring-amber-500/10 dark:ring-amber-500/30" 
              : "border-border/60 hover:border-amber-300"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-muted-fg uppercase tracking-wider">Outstanding Dues</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-fg">
              ₹{totalOutstandingFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-fg mt-1">Total pending balances aging</p>
          </div>
        </div>
      </div>

      {/* --- REPORT DETAILS VIEWS & FILTER WRAPPER --- */}
      <Card className="border-border/50 bg-surface-50 dark:bg-surface-950 shadow-md">
        
        {/* REPORT FILTERS HEADER BLOCK */}
        <CardHeader className="border-b border-border/40 py-5 px-6 print:hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                activeReport === 'daily' ? 'bg-brand-500' :
                activeReport === 'monthly' ? 'bg-emerald-500' :
                activeReport === 'expense' ? 'bg-rose-500' : 'bg-amber-500'
              }`} />
              <CardTitle className="text-lg font-bold text-fg">
                {activeReport === "daily" && "Daily Fee Collections Summary"}
                {activeReport === "monthly" && "Monthly Class & Component Revenues"}
                {activeReport === "expense" && "Expenses & Payments Detailed Audit"}
                {activeReport === "pending" && "Pending Invoices Aging Ledger"}
              </CardTitle>
            </div>

            {/* FILTER ACTIONS */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-fg mr-1 bg-surface-100 dark:bg-surface-900 px-2 py-1 rounded-md">
                <Filter className="w-3.5 h-3.5" /> Filter Parameters
              </div>

              {/* Daily collection filter */}
              {activeReport === "daily" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Select Date:</span>
                  <input 
                    type="date" 
                    value={dailyDate} 
                    onChange={(e) => setDailyDate(e.target.value)} 
                    className="h-9 px-3 border border-border rounded-md bg-surface-100 dark:bg-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/25"
                  />
                </div>
              )}

              {/* Monthly revenue filter */}
              {activeReport === "monthly" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Month:</span>
                  <input 
                    type="month" 
                    value={monthlyMonth} 
                    onChange={(e) => setMonthlyMonth(e.target.value)} 
                    className="h-9 px-3 border border-border rounded-md bg-surface-100 dark:bg-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
                  />
                </div>
              )}

              {/* Expense date range filter */}
              {activeReport === "expense" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">From:</span>
                  <input 
                    type="date" 
                    value={expenseStartDate} 
                    onChange={(e) => setExpenseStartDate(e.target.value)} 
                    className="h-9 px-3 border border-border rounded-md bg-surface-100 dark:bg-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/25"
                  />
                  <span className="text-sm font-medium">To:</span>
                  <input 
                    type="date" 
                    value={expenseEndDate} 
                    onChange={(e) => setExpenseEndDate(e.target.value)} 
                    className="h-9 px-3 border border-border rounded-md bg-surface-100 dark:bg-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/25"
                  />
                </div>
              )}

              {/* Pending aging report filter */}
              {activeReport === "pending" && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Class:</span>
                    <select 
                      value={pendingClass} 
                      onChange={(e) => setPendingClass(e.target.value)} 
                      className="h-9 px-3 border border-border rounded-md bg-surface-100 dark:bg-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25 min-w-[100px]"
                    >
                      <option value="ALL">All Classes</option>
                      {classList.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Overdue Threshold:</span>
                    <select 
                      value={pendingThreshold} 
                      onChange={(e) => setPendingThreshold(Number(e.target.value))} 
                      className="h-9 px-3 border border-border rounded-md bg-surface-100 dark:bg-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/25"
                    >
                      <option value={0}>All Overdue</option>
                      <option value={30}>30+ Days Overdue</option>
                      <option value={60}>60+ Days Overdue</option>
                      <option value={90}>90+ Days Overdue</option>
                    </select>
                  </div>
                </>
              )}

              {/* Export Active Report Button */}
              <Button onClick={handleExportCSV} variant="outline" size="sm" className="gap-2 cursor-pointer border-border hover:bg-surface-100 ml-2">
                <Download className="w-3.5 h-3.5 text-muted-fg" /> Export active CSV
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* PRINTABLE CONTAINER (RE-STYLED VIA GLOBAL MEDIA CSS DURING PRINT) */}
        <CardContent className="p-0" id="printable-report">
          
          {/* HEADER FOR PRINTING ONLY */}
          <div className="hidden print:block border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-bold text-center">EduCore School Management System</h1>
            <p className="text-center font-semibold text-sm text-gray-600 mt-1">OFFICIAL FINANCIAL REPORT DIRECTORY</p>
            <div className="flex justify-between text-xs text-gray-500 mt-4">
              <span>Date Generated: {new Date().toLocaleString()}</span>
              <span className="font-bold text-black uppercase">
                {activeReport === "daily" && `Daily fee collections: Date ${dailyDate}`}
                {activeReport === "monthly" && `Monthly revenues: Month ${monthlyMonth}`}
                {activeReport === "expense" && `School expenses: ${expenseStartDate} to ${expenseEndDate}`}
                {activeReport === "pending" && `Outstanding Dues aging list (Class: ${pendingClass})`}
              </span>
            </div>
          </div>

          {/* --- CONTENT 1: DAILY COLLECTION --- */}
          {activeReport === "daily" && (
            <div className="space-y-6">
              
              {/* Daily KPI boxes */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border-b border-border/40 bg-surface-100/35 dark:bg-surface-900/10 print:grid-cols-5 print:p-0 print:border-0 print:mb-4">
                <div className="p-4 rounded-xl border border-border/50 bg-surface-50 dark:bg-surface-950/40 print:p-2">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-muted-fg mb-1">Total Daily Cash</div>
                  <div className="text-lg font-bold text-brand-600 dark:text-brand-400">₹{dailyMethodBreakdown.cash.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-surface-50 dark:bg-surface-950/40 print:p-2">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-muted-fg mb-1">Bank Transfers</div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">₹{dailyMethodBreakdown.bank.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-surface-50 dark:bg-surface-950/40 print:p-2">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-muted-fg mb-1">Card Payments</div>
                  <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">₹{dailyMethodBreakdown.card.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="p-4 rounded-xl border border-border/50 bg-surface-50 dark:bg-surface-950/40 print:p-2">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-muted-fg mb-1">Online Payments</div>
                  <div className="text-lg font-bold text-amber-600 dark:text-amber-400">₹{dailyMethodBreakdown.online.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="p-4 rounded-xl border border-brand-200 bg-brand-50/20 dark:bg-brand-950/10 dark:border-brand-900/30 col-span-2 md:col-span-1 print:p-2 print:border-gray-400">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-brand-700 dark:text-brand-300 mb-1">Aggregate Dues</div>
                  <div className="text-lg font-black text-brand-700 dark:text-brand-300">₹{dailyMethodBreakdown.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
              </div>

              {/* Daily Table */}
              <div className="px-6 pb-6 print:px-0">
                {dailyPayments.length > 0 ? (
                  <div className="overflow-x-auto border border-border/50 rounded-xl overflow-hidden print:border-none print:rounded-none">
                    <table className="w-full text-sm text-left align-middle min-w-[700px] border-collapse">
                      <thead className="text-xs text-muted-fg uppercase bg-surface-100/90 dark:bg-surface-900/95 border-b border-border/50 print:bg-gray-100 print:text-black">
                        <tr>
                          <th className="px-4 py-3.5 font-bold">Receipt #</th>
                          <th className="px-4 py-3.5 font-bold">Student Name</th>
                          <th className="px-4 py-3.5 font-bold">Class</th>
                          <th className="px-4 py-3.5 font-bold">Fee Title</th>
                          <th className="px-4 py-3.5 font-bold">Method</th>
                          <th className="px-4 py-3.5 font-bold">Transaction ID</th>
                          <th className="px-4 py-3.5 font-bold text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {dailyPayments.map((p, idx) => (
                          <tr key={idx} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/35 print:hover:bg-transparent">
                            <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-600 dark:text-brand-400 print:text-black">{p.receiptNumber}</td>
                            <td className="px-4 py-3 font-medium text-fg print:text-black">{p.studentName}</td>
                            <td className="px-4 py-3 text-muted-fg print:text-black">{p.className}</td>
                            <td className="px-4 py-3 text-muted-fg print:text-black">{p.title}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                p.method === 'Cash' ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400' :
                                p.method === 'Bank Transfer' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' :
                                p.method === 'Card' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400' :
                                'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400'
                              } print:border-none print:p-0 print:bg-transparent print:text-black`}>
                                {p.method}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs font-mono text-muted-fg print:text-black">{p.transactionId}</td>
                            <td className="px-4 py-3 text-right font-semibold text-fg print:text-black">₹{p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-fg flex flex-col items-center justify-center gap-2">
                    <Info className="w-8 h-8 text-muted-fg/60" />
                    <p className="text-sm">No fee receipts were issued on {new Date(dailyDate).toLocaleDateString()}.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- CONTENT 2: MONTHLY REVENUE --- */}
          {activeReport === "monthly" && (
            <div className="space-y-8 p-6 print:p-0">
              
              {/* Monthly KPI boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-surface-100/35 dark:bg-surface-900/10 p-5 rounded-xl border border-border/50 print:bg-transparent print:border-0 print:p-0 print:grid-cols-3 print:mb-4">
                <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/40 border border-border/50 print:p-2">
                  <div className="text-xs text-muted-fg font-semibold uppercase mb-1">Fee Invoiced (Billed Dues)</div>
                  <div className="text-xl font-bold text-fg">₹{monthlyTotals.billed.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  <p className="text-[10px] text-muted-fg mt-1">Total invoice values created this month</p>
                </div>
                <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/40 border border-border/50 print:p-2">
                  <div className="text-xs text-muted-fg font-semibold uppercase mb-1">Fee Revenue Collected</div>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">₹{monthlyTotals.collected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  <p className="text-[10px] text-muted-fg mt-1">Total payments made this month</p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50/20 border border-emerald-200 dark:border-emerald-900/30 print:p-2 print:border-gray-400">
                  <div className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold uppercase mb-1">Collection Efficiency</div>
                  <div className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                    {monthlyTotals.billed > 0 
                      ? `${Math.round((monthlyTotals.collected / monthlyTotals.billed) * 100)}%`
                      : "100%"
                    }
                  </div>
                  <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 mt-1">Collected vs Billed ratio</p>
                </div>
              </div>

              {/* Monthly breakdown tables grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 print:grid-cols-1">
                
                {/* Class breakdown */}
                <div className="lg:col-span-3 space-y-4">
                  <h3 className="text-base font-bold text-fg flex items-center gap-2 border-b border-border/40 pb-2 print:text-black">
                    <Users className="w-4 h-4 text-emerald-500" /> Revenue breakdown by Class
                  </h3>
                  {monthlyClassData.length > 0 ? (
                    <div className="overflow-x-auto border border-border/50 rounded-xl overflow-hidden print:border-none print:rounded-none">
                      <table className="w-full text-sm text-left align-middle">
                        <thead className="text-xs text-muted-fg uppercase bg-surface-100/90 dark:bg-surface-900/95 border-b border-border/50 print:bg-gray-100 print:text-black">
                          <tr>
                            <th className="px-4 py-3 font-bold">Class Name</th>
                            <th className="px-4 py-3 font-bold text-right">Billed Invoiced</th>
                            <th className="px-4 py-3 font-bold text-right">Collected Revenue</th>
                            <th className="px-4 py-3 font-bold text-center">Receipts</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {monthlyClassData.map((c, idx) => (
                            <tr key={idx} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/35">
                              <td className="px-4 py-2.5 font-semibold text-fg print:text-black">{c.className}</td>
                              <td className="px-4 py-2.5 text-right text-muted-fg print:text-black">₹{c.billed.toLocaleString()}</td>
                              <td className="px-4 py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400 print:text-black">₹{c.collected.toLocaleString()}</td>
                              <td className="px-4 py-2.5 text-center font-mono text-xs text-muted-fg print:text-black">{c.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-muted-fg text-sm">No transaction events recorded in this month.</div>
                  )}
                </div>

                {/* Component title breakdown */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-base font-bold text-fg flex items-center gap-2 border-b border-border/40 pb-2 print:text-black">
                    <Layers className="w-4 h-4 text-brand-500" /> Revenue breakdown by Component
                  </h3>
                  {monthlyComponentData.length > 0 ? (
                    <div className="overflow-x-auto border border-border/50 rounded-xl overflow-hidden print:border-none print:rounded-none">
                      <table className="w-full text-sm text-left align-middle">
                        <thead className="text-xs text-muted-fg uppercase bg-surface-100/90 dark:bg-surface-900/95 border-b border-border/50 print:bg-gray-100 print:text-black">
                          <tr>
                            <th className="px-4 py-3 font-bold">Fee Component</th>
                            <th className="px-4 py-3 font-bold text-right">Collected</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {monthlyComponentData.map((c, idx) => (
                            <tr key={idx} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/35">
                              <td className="px-4 py-2.5 text-fg font-medium print:text-black">{c.name}</td>
                              <td className="px-4 py-2.5 text-right font-semibold text-brand-600 dark:text-brand-400 print:text-black">₹{c.collected.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-muted-fg text-sm">No component data recorded.</div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* --- CONTENT 3: EXPENSE REPORT --- */}
          {activeReport === "expense" && (
            <div className="space-y-8 p-6 print:p-0">
              
              {/* Expense KPI boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-surface-100/35 dark:bg-surface-900/10 p-5 rounded-xl border border-border/50 print:bg-transparent print:border-0 print:p-0 print:grid-cols-2 print:mb-4">
                <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/40 border border-border/50 print:p-2">
                  <div className="text-xs text-muted-fg font-semibold uppercase mb-1">Total Overhead Expenses</div>
                  <div className="text-xl font-bold text-rose-600 dark:text-rose-400">₹{expenseCategoryBreakdown.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  <p className="text-[10px] text-muted-fg mt-1">Total recorded outbound cashflows</p>
                </div>
                <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/40 border border-border/50 print:p-2">
                  <div className="text-xs text-muted-fg font-semibold uppercase mb-1">Outflow Transactions</div>
                  <div className="text-xl font-bold text-fg">{filteredExpenses.length} receipts</div>
                  <p className="text-[10px] text-muted-fg mt-1">Number of transactions in range</p>
                </div>
              </div>

              {/* Expense Tables grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 print:grid-cols-1">
                
                {/* Detailed Expense List */}
                <div className="lg:col-span-3 space-y-4">
                  <h3 className="text-base font-bold text-fg border-b border-border/40 pb-2 print:text-black">Individual Vouchers</h3>
                  {filteredExpenses.length > 0 ? (
                    <div className="overflow-x-auto border border-border/50 rounded-xl overflow-hidden print:border-none print:rounded-none">
                      <table className="w-full text-sm text-left align-middle">
                        <thead className="text-xs text-muted-fg uppercase bg-surface-100/90 dark:bg-surface-900/95 border-b border-border/50 print:bg-gray-100 print:text-black">
                          <tr>
                            <th className="px-4 py-3 font-bold">Date</th>
                            <th className="px-4 py-3 font-bold">Title</th>
                            <th className="px-4 py-3 font-bold">Category</th>
                            <th className="px-4 py-3 font-bold">Vendor</th>
                            <th className="px-4 py-3 font-bold text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {filteredExpenses.map((exp: any) => (
                            <tr key={exp._id} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/35">
                              <td className="px-4 py-2.5 text-muted-fg print:text-black">{new Date(exp.date).toLocaleDateString()}</td>
                              <td className="px-4 py-2.5 font-medium text-fg print:text-black">{exp.title}</td>
                              <td className="px-4 py-2.5 text-muted-fg print:text-black">{exp.category}</td>
                              <td className="px-4 py-2.5 text-muted-fg print:text-black">{exp.vendorName || "-"}</td>
                              <td className="px-4 py-2.5 text-right font-semibold text-rose-600 dark:text-rose-400 print:text-black">₹{exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-muted-fg text-sm">No expenses recorded for this timeframe.</div>
                  )}
                </div>

                {/* Category-wise Breakdown */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-base font-bold text-fg border-b border-border/40 pb-2 print:text-black">Spend by Category</h3>
                  {expenseCategoryBreakdown.breakdown.length > 0 ? (
                    <div className="overflow-x-auto border border-border/50 rounded-xl overflow-hidden print:border-none print:rounded-none">
                      <table className="w-full text-sm text-left align-middle">
                        <thead className="text-xs text-muted-fg uppercase bg-surface-100/90 dark:bg-surface-900/95 border-b border-border/50 print:bg-gray-100 print:text-black">
                          <tr>
                            <th className="px-4 py-3 font-bold">Category</th>
                            <th className="px-4 py-3 font-bold text-right">Spend Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {expenseCategoryBreakdown.breakdown.map((cat, idx) => (
                            <tr key={idx} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/35">
                              <td className="px-4 py-2.5 text-fg font-medium print:text-black">{cat.category}</td>
                              <td className="px-4 py-2.5 text-right font-semibold text-rose-600 dark:text-rose-400 print:text-black">₹{cat.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-muted-fg text-sm">No category distribution.</div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* --- CONTENT 4: PENDING FEES (AGING) --- */}
          {activeReport === "pending" && (
            <div className="space-y-8 p-6 print:p-0">
              
              {/* Aging brackets cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-surface-100/35 dark:bg-surface-900/10 p-5 rounded-xl border border-border/50 print:grid-cols-5 print:p-0 print:border-0 print:mb-4">
                <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/40 border border-border/50 print:p-2">
                  <div className="text-[10px] text-muted-fg font-bold uppercase tracking-wider mb-1">0-30 Days Dues</div>
                  <div className="text-base font-bold text-fg">₹{pendingAgingBreakdown.range0_30.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/40 border border-border/50 print:p-2">
                  <div className="text-[10px] text-muted-fg font-bold uppercase tracking-wider mb-1">31-60 Days Dues</div>
                  <div className="text-base font-bold text-fg">₹{pendingAgingBreakdown.range31_60.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/40 border border-border/50 print:p-2">
                  <div className="text-[10px] text-muted-fg font-bold uppercase tracking-wider mb-1">61-90 Days Dues</div>
                  <div className="text-base font-bold text-fg">₹{pendingAgingBreakdown.range61_90.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/40 border border-border/50 print:p-2">
                  <div className="text-[10px] text-muted-fg font-bold uppercase tracking-wider mb-1">90+ Days Aging</div>
                  <div className="text-base font-bold text-rose-600 dark:text-rose-400">₹{pendingAgingBreakdown.range90Plus.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-lg bg-amber-50/20 border border-amber-200 dark:border-amber-900/30 col-span-2 md:col-span-1 print:p-2 print:border-gray-400">
                  <div className="text-[10px] text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wider mb-1">Total Unpaid Balance</div>
                  <div className="text-base font-black text-amber-700 dark:text-amber-300">₹{pendingAgingBreakdown.totalBalance.toLocaleString()}</div>
                </div>
              </div>

              {/* Pending aging list table */}
              <div className="space-y-4">
                <div className="flex justify-between items-center print:text-black">
                  <h3 className="text-base font-bold text-fg">Overdue Outstanding Invoices</h3>
                  <span className="text-xs text-muted-fg font-medium">Found {filteredPendingInvoices.length} invoices matching criteria</span>
                </div>
                {filteredPendingInvoices.length > 0 ? (
                  <div className="overflow-x-auto border border-border/50 rounded-xl overflow-hidden print:border-none print:rounded-none">
                    <table className="w-full text-sm text-left align-middle min-w-[750px]">
                      <thead className="text-xs text-muted-fg uppercase bg-surface-100/90 dark:bg-surface-900/95 border-b border-border/50 print:bg-gray-100 print:text-black">
                        <tr>
                          <th className="px-4 py-3 font-bold">Student Name</th>
                          <th className="px-4 py-3 font-bold">Class</th>
                          <th className="px-4 py-3 font-bold">Invoice Title</th>
                          <th className="px-4 py-3 font-bold">Due Date</th>
                          <th className="px-4 py-3 font-bold text-center">Days Overdue</th>
                          <th className="px-4 py-3 font-bold text-right">Invoiced Amount</th>
                          <th className="px-4 py-3 font-bold text-right">Paid</th>
                          <th className="px-4 py-3 font-bold text-right">Outstanding Dues</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {filteredPendingInvoices.map((p, idx) => (
                          <tr key={idx} className="hover:bg-surface-100/30 dark:hover:bg-surface-900/35">
                            <td className="px-4 py-2.5 font-semibold text-fg print:text-black">{p.studentName}</td>
                            <td className="px-4 py-2.5 text-muted-fg print:text-black">{p.className}</td>
                            <td className="px-4 py-2.5 text-muted-fg print:text-black">{p.title}</td>
                            <td className="px-4 py-2.5 text-muted-fg print:text-black">{p.dueDate}</td>
                            <td className="px-4 py-2.5 text-center font-mono text-xs font-semibold print:text-black">
                              <span className={`px-2 py-0.5 rounded-full ${
                                p.daysOverdue === 0 ? 'text-muted-fg' :
                                p.daysOverdue <= 30 ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400' :
                                p.daysOverdue <= 90 ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400' :
                                'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                              } print:p-0 print:bg-transparent print:text-black`}>
                                {p.daysOverdue === 0 ? "Not Overdue" : `${p.daysOverdue} days`}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-right text-muted-fg print:text-black">₹{p.amount.toLocaleString()}</td>
                            <td className="px-4 py-2.5 text-right text-muted-fg print:text-black">₹{p.amountPaid.toLocaleString()}</td>
                            <td className="px-4 py-2.5 text-right font-semibold text-amber-600 dark:text-amber-400 print:text-black">₹{p.balance.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-fg flex flex-col items-center justify-center gap-2">
                    <Info className="w-8 h-8 text-muted-fg/60" />
                    <p className="text-sm">Great! No pending invoices fit these filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}
