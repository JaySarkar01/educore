"use client";

import { useState, useRef, useTransition, useMemo, useCallback } from "react";
import { generateIDCards } from "@/app/actions/id-card";
import { IDCard, StudentIDData, SchoolIDData, TemplateSettings } from "./id-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Search, SlidersHorizontal, X, Printer, Download, RefreshCw,
  Eye, CreditCard, CheckCircle2, AlertCircle, Users, LayoutList, Grid3X3,
  Filter, Calendar, ChevronUp, ChevronDown, ArrowUpDown,
} from "lucide-react";

interface StudentRow {
  id: string;
  name: string;
  admissionNo: string;
  className: string;
  section: string;
  rollNumber: string;
  photo: string;
  status: string;
  idCardStatus: "Generated" | "Not Generated";
  idCardNumber: string;
  academicYear: string;
  transportRoute: string;
  parentName?: string;
  parentPhone?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  address?: string;
  pincode?: string;
  motherName?: string;
  emergencyContact?: string;
}

type SortKey = "name" | "admissionNo" | "className" | "idCardStatus" | "academicYear";
type ViewMode = "table" | "grid";

export default function IDCardManagement({
  students: initialStudents,
  classes,
  school,
  template,
}: {
  students: StudentRow[];
  classes: { id: string; className: string }[];
  school: SchoolIDData;
  template: TemplateSettings | null;
}) {
  const [students, setStudents] = useState<StudentRow[]>(initialStudents);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [transportFilter, setTransportFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [previewStudent, setPreviewStudent] = useState<StudentRow | null>(null);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // Derived filter data
  const sections = useMemo(() => ["All", ...Array.from(new Set(initialStudents.map(s => s.section).filter(Boolean))).sort()], [initialStudents]);
  const years = useMemo(() => ["All", ...Array.from(new Set(initialStudents.map(s => s.academicYear).filter(Boolean))).sort().reverse()], [initialStudents]);
  const routes = useMemo(() => ["All", ...Array.from(new Set(initialStudents.map(s => s.transportRoute).filter(Boolean))).sort()], [initialStudents]);

  const activeFilterCount = [classFilter, sectionFilter, yearFilter, statusFilter, transportFilter].filter(v => v !== "All").length;

  const filteredStudents = useMemo(() => {
    let list = initialStudents.filter(s => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (!s.name.toLowerCase().includes(q) && !s.admissionNo.toLowerCase().includes(q) && !s.rollNumber.toLowerCase().includes(q)) return false;
      }
      if (classFilter !== "All" && s.className !== classFilter) return false;
      if (sectionFilter !== "All" && s.section !== sectionFilter) return false;
      if (yearFilter !== "All" && s.academicYear !== yearFilter) return false;
      if (statusFilter !== "All" && s.idCardStatus !== statusFilter) return false;
      if (transportFilter !== "All" && s.transportRoute !== transportFilter) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      const av = (a[sortKey as keyof StudentRow] as string) || "";
      const bv = (b[sortKey as keyof StudentRow] as string) || "";
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return list;
  }, [initialStudents, searchTerm, classFilter, sectionFilter, yearFilter, statusFilter, transportFilter, sortKey, sortDir]);

  const stats = useMemo(() => ({
    total: initialStudents.length,
    generated: initialStudents.filter(s => s.idCardStatus === "Generated").length,
    notGenerated: initialStudents.filter(s => s.idCardStatus === "Not Generated").length,
  }), [initialStudents]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />;

  const toggleSelect = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAll = () => setSelected(new Set(filteredStudents.map(s => s.id)));
  const clearSelection = () => setSelected(new Set());
  const allSelected = filteredStudents.length > 0 && filteredStudents.every(s => selected.has(s.id));

  const handleGenerate = () => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    startTransition(async () => {
      const res = await generateIDCards(ids);
      if (res.success) {
        showToast("success", `✅ ${res.count} ID card(s) generated successfully!`);
        clearSelection();
        // Refresh data by updating local state status
        setStudents(prev => prev.map(s => ids.includes(s.id) ? { ...s, idCardStatus: "Generated" } : s));
      } else {
        showToast("error", res.error || "Generation failed.");
      }
    });
  };

  const handlePrintSelected = () => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    const printStudents = filteredStudents.filter(s => ids.includes(s.id));
    openPrintWindow(printStudents);
  };

  const openPrintWindow = (printStudents: StudentRow[]) => {
    const printWindow = window.open("", "PRINT_ID_CARDS", "width=1000,height=800");
    if (!printWindow) return;

    const bg = template?.bgColor || "#1e40af";
    const accent = template?.accentColor || "#3b82f6";

    const cards = printStudents.map(s => `
      <div class="card-sheet" style="display:inline-block; margin: 10px; vertical-align: top;">
        <div style="width:320px; height:480px; border-radius:14px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08); font-family:Segoe UI,system-ui,sans-serif; display:flex; flex-direction:column; page-break-inside:avoid;">
          <div style="background:linear-gradient(135deg,${bg},${accent}); padding:14px 16px 10px; flex-shrink:0;">
            <div style="color:#fff; font-weight:800; font-size:13px; text-transform:uppercase; letter-spacing:0.3px;">${school.schoolName}</div>
            <div style="color:rgba(255,255,255,0.7); font-size:9px; margin-top:2px; letter-spacing:1.5px; text-transform:uppercase;">Student Identity Card</div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; padding:14px 16px 10px; background:#f8fafc; border-bottom:1px solid #e2e8f0; flex-shrink:0;">
            <div style="width:80px; height:80px; border-radius:50%; overflow:hidden; border:3px solid ${bg}; background:#e2e8f0;">
              ${s.photo ? `<img src="${s.photo}" style="width:100%;height:100%;object-fit:cover;" />` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#64748b;">${s.name.charAt(0)}</div>`}
            </div>
            <div style="margin-top:10px; text-align:center; font-weight:800; font-size:14px; text-transform:uppercase; color:#0f172a;">${s.name}</div>
            <div style="margin-top:4px; background:${bg}18; color:${bg}; border:1px solid ${bg}30; padding:2px 10px; border-radius:4px; font-size:10px; font-weight:700;">Class ${s.className}${s.section ? ` - ${s.section}` : ""}</div>
          </div>
          <div style="flex:1; padding:10px 16px; display:flex; flex-direction:column; gap:6px;">
            ${[["Admission No.", s.admissionNo], ["Roll Number", s.rollNumber], ["ID Card No.", s.idCardNumber || "—"]].map(([l, v]) => `<div style="display:flex;justify-content:space-between;border-bottom:1px solid #f1f5f9;padding-bottom:5px;"><span style="color:#64748b;font-size:10px;font-weight:600;">${l}</span><span style="color:#1e293b;font-size:10px;font-weight:700;">${v}</span></div>`).join("")}
          </div>
          <div style="background:#0f172a; padding:8px 12px; display:flex; align-items:center; justify-content:space-between; flex-shrink:0;">
            <div><div style="color:#fff;font-size:9px;font-weight:600;">${school.phone}</div><div style="color:rgba(255,255,255,0.5);font-size:8px;margin-top:1px;">${school.address}, ${school.city}</div></div>
          </div>
        </div>
      </div>
    `).join("");

    printWindow.document.write(`
      <html><head><title>Student ID Cards</title>
      <style>
        @page { margin: 10mm; size: A4; }
        body { margin: 0; padding: 10px; background: white; }
        @media print { .card-sheet { page-break-inside: avoid; } -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      </style></head>
      <body>${cards}</body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 800);
  };

  const t = { ...{ bgColor: "#1e40af", accentColor: "#3b82f6" }, ...template };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-4 duration-300",
          toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
        )}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-fg flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-brand-600" /> Student ID Cards
          </h1>
          <p className="text-muted-fg font-medium mt-1 text-sm">Generate, manage, and download student identity cards</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-xl gap-2 font-semibold" onClick={() => setViewMode(v => v === "table" ? "grid" : "table")}>
            {viewMode === "table" ? <Grid3X3 className="w-4 h-4" /> : <LayoutList className="w-4 h-4" />}
            {viewMode === "table" ? "Grid View" : "Table View"}
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-xl gap-2 font-semibold">
            <a href="/dashboard/students/id-cards/template">⚙ Template Settings</a>
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Students", value: stats.total, icon: Users, color: "text-brand-600", bg: "bg-brand-50 border-brand-100" },
          { label: "Generated", value: stats.generated, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Not Generated", value: stats.notGenerated, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={cn("rounded-2xl border p-4 flex items-center gap-4", bg)}>
            <div className={cn("p-2.5 rounded-xl bg-white shadow-sm", color)}><Icon className="w-5 h-5" /></div>
            <div>
              <div className={cn("text-2xl font-black", color)}>{value}</div>
              <div className="text-xs font-semibold text-muted-fg">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
          <Input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, admission number, or roll..."
            className="pl-11 h-12 rounded-xl bg-white border-slate-200 shadow-sm focus-visible:ring-brand-500 font-medium text-sm"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={cn("h-12 px-5 rounded-xl border-slate-200 bg-white font-semibold gap-2 relative shadow-sm", isFiltersOpen && "border-brand-500 ring-2 ring-brand-500/20")}
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {isFiltersOpen && (
            <div className="absolute top-full right-0 mt-2 w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Filter className="w-4 h-4 text-brand-500" /> Filter Options</h3>
                <button onClick={() => setIsFiltersOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Class", value: classFilter, onChange: setClassFilter, options: [{ val: "All", label: "All Classes" }, ...classes.map(c => ({ val: c.className, label: `Class ${c.className}` }))] },
                  { label: "Section", value: sectionFilter, onChange: setSectionFilter, options: sections.map(s => ({ val: s, label: s === "All" ? "All Sections" : `Section ${s}` })) },
                  { label: "Academic Year", value: yearFilter, onChange: setYearFilter, options: years.map(y => ({ val: y, label: y === "All" ? "All Years" : y })) },
                  { label: "ID Card Status", value: statusFilter, onChange: setStatusFilter, options: [{ val: "All", label: "All Statuses" }, { val: "Generated", label: "Generated" }, { val: "Not Generated", label: "Not Generated" }] },
                  { label: "Transport Route", value: transportFilter, onChange: setTransportFilter, options: routes.map(r => ({ val: r, label: r === "All" ? "All Routes" : r })) },
                ].map(({ label, value, onChange, options }) => (
                  <div key={label} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger className="h-10 bg-slate-50 border-slate-200 rounded-xl text-sm font-medium shadow-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl shadow-xl border-slate-100">
                        {options.map(o => (
                          <SelectItem key={o.val} value={o.val} className="text-sm cursor-pointer">{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100">
                <Button variant="secondary" className="w-full rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200"
                  onClick={() => { setClassFilter("All"); setSectionFilter("All"); setYearFilter("All"); setStatusFilter("All"); setTransportFilter("All"); setIsFiltersOpen(false); }}>
                  Reset All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="bg-brand-600 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl shadow-brand-500/30 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="bg-white/20 rounded-lg px-3 py-1 font-bold text-sm">{selected.size} selected</span>
            <span className="text-brand-100 text-sm">Ready for bulk action</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handleGenerate} disabled={isPending}
              className="bg-white text-brand-700 hover:bg-brand-50 rounded-xl font-bold h-9 gap-2 shadow-sm">
              {isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              {isPending ? "Generating..." : "Generate ID Cards"}
            </Button>
            <Button size="sm" onClick={handlePrintSelected}
              className="bg-white/20 hover:bg-white/30 rounded-xl font-bold h-9 gap-2 border border-white/30">
              <Printer className="w-4 h-4" />Print / Download PDF
            </Button>
            <Button size="sm" variant="ghost" onClick={clearSelection}
              className="text-white hover:bg-white/20 rounded-xl font-bold h-9">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={allSelected ? clearSelection : selectAll}
                className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
              />
              <span className="text-sm font-semibold text-slate-600">{filteredStudents.length} students</span>
            </div>
            {selected.size > 0 && (
              <button onClick={clearSelection} className="text-xs text-slate-500 hover:text-slate-800 font-semibold">Deselect all</button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/30">
                  <th className="px-4 py-3 text-left w-8"></th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Photo</th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => toggleSort("name")} className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-700">
                      Student Name <SortIcon k="name" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => toggleSort("admissionNo")} className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-700">
                      Admission No <SortIcon k="admissionNo" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => toggleSort("className")} className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-700">
                      Class <SortIcon k="className" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Roll No</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ID Card No.</th>
                  <th className="px-4 py-3 text-left">
                    <button onClick={() => toggleSort("idCardStatus")} className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-700">
                      Status <SortIcon k="idCardStatus" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.length > 0 ? filteredStudents.map(s => (
                  <tr key={s.id} className={cn("hover:bg-slate-50/60 transition-colors group", selected.has(s.id) && "bg-brand-50/30")}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(s.id)}
                        onChange={() => toggleSelect(s.id)}
                        className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {s.photo ? (
                        <img src={s.photo} alt={s.name} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm border-2 border-white shadow-sm">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{s.name}</div>
                      <div className="text-xs text-slate-400">{s.academicYear}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 font-semibold">{s.admissionNo}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 rounded-md text-xs font-semibold text-slate-700">
                        {s.className}{s.section && ` - ${s.section}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-semibold text-xs">{s.rollNumber}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{s.idCardNumber || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border",
                        s.idCardStatus === "Generated"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        {s.idCardStatus === "Generated" ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                        {s.idCardStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setPreviewStudent(s)}
                          className="p-1.5 rounded-lg hover:bg-brand-50 text-brand-600 hover:text-brand-700 transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openPrintWindow([s])}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelected(new Set([s.id])); }}
                          className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 transition-colors"
                          title="Generate / Regenerate"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-full bg-slate-100"><Search className="w-8 h-8 text-slate-400" /></div>
                        <p className="font-semibold text-slate-500">No students found</p>
                        <p className="text-sm text-slate-400">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map(s => (
            <div
              key={s.id}
              onClick={() => toggleSelect(s.id)}
              className={cn(
                "relative bg-white rounded-2xl border-2 shadow-sm cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg group",
                selected.has(s.id) ? "border-brand-500 shadow-brand-500/20" : "border-slate-200"
              )}
            >
              {selected.has(s.id) && (
                <div className="absolute -top-2 -right-2 z-10 bg-brand-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">✓</div>
              )}
              <div className="p-4 flex items-center gap-3">
                {s.photo ? (
                  <img src={s.photo} alt={s.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg flex-shrink-0">{s.name.charAt(0)}</div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{s.name}</p>
                  <p className="text-xs text-slate-500">Class {s.className}{s.section && ` - ${s.section}`}</p>
                  <p className="text-xs text-slate-400 font-mono">{s.admissionNo}</p>
                </div>
              </div>
              <div className="px-4 pb-3 flex items-center justify-between">
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                  s.idCardStatus === "Generated" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                )}>
                  {s.idCardStatus}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => { e.stopPropagation(); setPreviewStudent(s); }} className="p-1.5 rounded-lg hover:bg-brand-50 text-brand-600"><Eye className="w-3.5 h-3.5" /></button>
                  <button onClick={e => { e.stopPropagation(); openPrintWindow([s]); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><Download className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewStudent && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewStudent(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-800">ID Card Preview</h2>
                <p className="text-sm text-slate-500">{previewStudent.name}</p>
              </div>
              <button onClick={() => setPreviewStudent(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center gap-6">
              <IDCard
                student={{
                  ...previewStudent,
                  parentName: previewStudent.parentName || "",
                  parentPhone: previewStudent.parentPhone || "",
                }}
                school={school}
                template={template || undefined}
              />
              <div className="flex gap-3 w-full">
                <Button
                  onClick={() => openPrintWindow([previewStudent])}
                  className="flex-1 rounded-xl gap-2 font-bold"
                >
                  <Printer className="w-4 h-4" /> Print / Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreviewStudent(null)}
                  className="rounded-xl font-semibold"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
