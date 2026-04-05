"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import { 
  Download, 
  Printer, 
  Search, 
  Filter, 
  CreditCard, 
  Loader2, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  SlidersHorizontal,
  X,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { IDCard, StudentIDData, SchoolIDData } from "./id-card";



export default function StudentIDGenerator({ 
  students: initialStudents, 
  classes, 
  school 
}: { 
  students: StudentIDData[]; 
  classes: any[];
  school: SchoolIDData;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const componentRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFiltersOpen(false);
      }
    }
    if (isFiltersOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFiltersOpen]);


  const filteredStudents = initialStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "All" || s.className === classFilter;
    // mock batch filter: if admission starts with/contains batch year, or just mock it.
    const matchesBatch = batchFilter === "All" || s.admissionNo.includes(batchFilter);
    return matchesSearch && matchesClass && matchesBatch;
  });

  const batches = ["2023", "2024", "2025", "2026"];


  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <CreditCard className="w-10 h-10 text-brand-600" />
            ID Card Generator
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Generate and print professional student identity cards in bulk
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => {
            // Print bulk: open a new window with the cards and trigger print
            if (!componentRef.current) return
            const html = componentRef.current.innerHTML
            const printWindow = window.open("", "PRINT", "width=800,height=600")
            if (!printWindow) return
            printWindow.document.write(`
              <html>
                <head>
                  <title>Student ID Cards</title>
                  <style>
                    @media print {
                      body { margin: 0; }
                      .id-card-wrapper { page-break-inside: avoid; break-inside: avoid; }
                    }
                    .id-card-wrapper { width: 320px; height: 480px; display:inline-block; margin:10px; }
                  </style>
                </head>
                <body>${html}</body>
              </html>
            `)
            printWindow.document.close()
            printWindow.focus()
            setTimeout(() => { printWindow.print(); /* printWindow.close(); */ }, 500)
          }}
          className="h-14 px-8 rounded-2xl shadow-xl shadow-brand-500/20 gap-2 font-bold text-base transition-all hover:scale-105 active:scale-95 group"
        >
          <Printer className="w-5 h-5 group-hover:animate-bounce" />
          Print Bulk ID Cards
        </Button>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
        <div className="p-4 md:p-6 lg:p-8 border-b border-slate-100 bg-slate-50/30">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center relative z-40">
            {/* Quick Search */}
            <div className="flex-1 relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <Input
                placeholder="Quick search by name or admission number..."
                className="w-full pl-14 h-14 bg-white border border-slate-200 rounded-2xl focus-visible:ring-2 focus-visible:ring-brand-500/20 focus-visible:border-brand-500 shadow-sm text-base font-medium placeholder:text-slate-400 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Toggle Button */}
            <div className="relative" ref={filterRef}>
              <Button
                variant="outline"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={cn(
                  "h-14 px-6 rounded-2xl border-slate-200 bg-white font-semibold flex items-center gap-2 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300",
                  isFiltersOpen && "border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/50"
                )}
              >
                <SlidersHorizontal className="w-5 h-5 text-brand-600" />
                Advanced Filters
                {(classFilter !== "All" || batchFilter !== "All") && (
                  <span className="absolute -top-2 -right-2 bg-brand-600 text-white text-[10px] flex items-center justify-center w-6 h-6 rounded-full font-bold border-2 border-white shadow-sm">
                    {(classFilter !== "All" ? 1 : 0) + (batchFilter !== "All" ? 1 : 0)}
                  </span>
                )}
              </Button>

              {/* Dropdown Overlay */}
              {isFiltersOpen && (
                <div className="absolute top-full right-0 mt-3 w-[320px] md:w-[360px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <Filter className="w-4 h-4 text-brand-500" />
                       Filter Options
                    </h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100" onClick={() => setIsFiltersOpen(false)}>
                      <X className="w-4 h-4 text-slate-500" />
                    </Button>
                  </div>

                  <div className="space-y-5">
                    {/* Class Filter */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Class</label>
                      <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl font-medium focus:ring-brand-500 shadow-none">
                          <SelectValue placeholder="All Classes" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl border-slate-100">
                          <SelectItem value="All" className="font-semibold cursor-pointer">All Classes</SelectItem>
                          {classes.map(c => (
                            <SelectItem key={c.id} value={c.className} className="cursor-pointer">
                              Class {c.className}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Batch/Year Filter */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Batch Year
                      </label>
                      <Select value={batchFilter} onValueChange={setBatchFilter}>
                        <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl font-medium focus:ring-brand-500 shadow-none">
                          <SelectValue placeholder="All Batches" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl border-slate-100">
                          <SelectItem value="All" className="font-semibold cursor-pointer">All Batches</SelectItem>
                          {batches.map(b => (
                            <SelectItem key={b} value={b} className="cursor-pointer">
                              Batch {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Clear Filters */}
                    <div className="pt-2">
                      <Button 
                        variant="secondary" 
                        onClick={() => { setClassFilter("All"); setBatchFilter("All"); setIsFiltersOpen(false); }}
                        className="w-full rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        Reset All Filters
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-10 bg-slate-50/30 min-h-[400px]">
          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {filteredStudents.map(student => (
                <div key={student.id} className="group relative flex justify-center">
                  <div className="absolute inset-0 bg-brand-500/10 rounded-3xl blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 scale-90" />
                  <div className="relative transform transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-1">
                    <IDCard student={student} school={school} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="p-6 bg-brand-50 rounded-full mb-6">
                <Search className="w-12 h-12 text-brand-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No students found</h3>
              <p className="text-slate-500 max-w-xs mx-auto font-medium">Try adjusting your filters or search keywords to find the student you're looking for.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Print-only container */}
      <div className="hidden">
        <div ref={componentRef} className="print-container p-8 bg-white grid grid-cols-2 gap-8">
          {filteredStudents.map(student => (
            <IDCard key={student.id} student={student} school={school} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .print-container {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
            padding: 20px !important;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .id-card-wrapper {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 20px !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
