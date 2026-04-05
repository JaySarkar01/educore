"use client";

import { useState, useRef, useTransition, useMemo, useEffect } from "react";
import { generateIDCards } from "@/app/actions/id-card";
import { IDCard, StudentIDData, SchoolIDData, TemplateSettings } from "./id-card";
import { cn } from "@/lib/utils";
import {
  Search, SlidersHorizontal, X, Printer, Download, RefreshCw,
  Eye, CreditCard, CheckCircle2, AlertCircle, Users, LayoutList, Grid3X3,
  ChevronUp, ChevronDown, ArrowUpDown, Settings, ChevronDown as ChevronDownIcon,
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

// ── Mini component: themed select ────────────────────────────────────────────
function ThemedSelect({
  value, onChange, options, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { val: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none h-10 pl-3 pr-8 rounded-xl text-sm font-medium border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 cursor-pointer"
      >
        {options.map(o => (
          <option key={o.val} value={o.val}>{o.label}</option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-fg pointer-events-none" />
    </div>
  );
}

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
  const [localStudents, setLocalStudents] = useState<StudentRow[]>(initialStudents);
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
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  // Close filter on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node) &&
        filterBtnRef.current && !filterBtnRef.current.contains(e.target as Node)
      ) {
        setIsFiltersOpen(false);
      }
    }
    if (isFiltersOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isFiltersOpen]);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const sections = useMemo(() => ["All", ...Array.from(new Set(localStudents.map(s => s.section).filter(Boolean))).sort()], [localStudents]);
  const years = useMemo(() => ["All", ...Array.from(new Set(localStudents.map(s => s.academicYear).filter(Boolean))).sort().reverse()], [localStudents]);
  const routes = useMemo(() => ["All", ...Array.from(new Set(localStudents.map(s => s.transportRoute).filter(Boolean))).sort()], [localStudents]);
  const activeFilterCount = [classFilter, sectionFilter, yearFilter, statusFilter, transportFilter].filter(v => v !== "All").length;

  const filteredStudents = useMemo(() => {
    let list = localStudents.filter(s => {
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
    return [...list].sort((a, b) => {
      const av = (a[sortKey as keyof StudentRow] as string) || "";
      const bv = (b[sortKey as keyof StudentRow] as string) || "";
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [localStudents, searchTerm, classFilter, sectionFilter, yearFilter, statusFilter, transportFilter, sortKey, sortDir]);

  const stats = useMemo(() => ({
    total: localStudents.length,
    generated: localStudents.filter(s => s.idCardStatus === "Generated").length,
    notGenerated: localStudents.filter(s => s.idCardStatus === "Not Generated").length,
  }), [localStudents]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 text-brand-500" /> : <ChevronDown className="w-3 h-3 text-brand-500" />;
  }

  const toggleSelect = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAllFiltered = () => setSelected(new Set(filteredStudents.map(s => s.id)));
  const clearSelection = () => setSelected(new Set());
  const allSelected = filteredStudents.length > 0 && filteredStudents.every(s => selected.has(s.id));

  const handleGenerate = () => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    startTransition(async () => {
      const res = await generateIDCards(ids);
      if ((res as any).success) {
        showToast("success", `✅ ${(res as any).count} ID card(s) generated!`);
        clearSelection();
        setLocalStudents(prev => prev.map(s => ids.includes(s.id) ? { ...s, idCardStatus: "Generated" as const } : s));
      } else {
        showToast("error", (res as any).error || "Generation failed.");
      }
    });
  };

  const openPrintWindow = (printList: StudentRow[]) => {
    const win = window.open("", "PRINT_ID_CARDS", "width=1000,height=800");
    if (!win) return;
    const bg = template?.bgColor || "#1e40af";
    const accent = template?.accentColor || "#3b82f6";
    const cards = printList.map(s => `
      <div style="display:inline-block;margin:8px;vertical-align:top;page-break-inside:avoid;">
        <div style="width:320px;height:480px;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;font-family:Segoe UI,system-ui,sans-serif;display:flex;flex-direction:column;background:#fff;">
          <div style="background:linear-gradient(135deg,${bg},${accent});padding:14px 16px;flex-shrink:0;">
            <div style="color:#fff;font-weight:800;font-size:13px;text-transform:uppercase;">${school.schoolName}</div>
            <div style="color:rgba(255,255,255,0.75);font-size:9px;margin-top:2px;letter-spacing:1.5px;text-transform:uppercase;">Student Identity Card</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;padding:14px 16px 10px;background:#f8fafc;border-bottom:1px solid #e2e8f0;flex-shrink:0;">
            <div style="width:80px;height:80px;border-radius:50%;overflow:hidden;border:3px solid ${bg};background:#e2e8f0;">
              ${s.photo ? `<img src="${s.photo}" style="width:100%;height:100%;object-fit:cover;">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#64748b;">${s.name.charAt(0)}</div>`}
            </div>
            <div style="margin-top:10px;font-weight:800;font-size:14px;text-transform:uppercase;color:#0f172a;text-align:center;">${s.name}</div>
            <div style="margin-top:4px;padding:2px 10px;border-radius:4px;font-size:10px;font-weight:700;background:${bg}20;color:${bg};">Class ${s.className}${s.section ? ` - ${s.section}` : ""}</div>
          </div>
          <div style="flex:1;padding:10px 16px;display:flex;flex-direction:column;gap:6px;">
            ${[["Admission No.", s.admissionNo], ["Roll Number", s.rollNumber], ["ID Card No.", s.idCardNumber || "—"], ["Valid Till", "—"]].map(([l, v]) =>
              `<div style="display:flex;justify-content:space-between;border-bottom:1px solid #f1f5f9;padding-bottom:5px;"><span style="color:#64748b;font-size:10px;font-weight:600;">${l}</span><span style="color:#1e293b;font-size:10px;font-weight:700;">${v}</span></div>`
            ).join("")}
          </div>
          <div style="background:#0f172a;padding:8px 12px;flex-shrink:0;">
            <div style="color:#fff;font-size:9px;">${school.phone}</div>
            <div style="color:rgba(255,255,255,0.5);font-size:8px;">${school.address}, ${school.city}</div>
          </div>
        </div>
      </div>`).join("");
    win.document.write(`<html><head><title>ID Cards</title><style>@page{margin:10mm;size:A4;}body{margin:0;padding:8px;background:#fff;}-webkit-print-color-adjust:exact;print-color-adjust:exact;</style></head><body>${cards}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 800);
  };

  return (
    <div className="w-full space-y-5">

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-6 right-6 z-[999] px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-4 duration-300 flex items-center gap-2",
          toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
        )}>
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-fg flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-brand-600 shrink-0" />
            Student ID Cards
          </h1>
          <p className="text-muted-fg text-sm mt-1">Generate, manage, and download student identity cards</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setViewMode(v => v === "table" ? "grid" : "table")}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted transition-colors"
          >
            {viewMode === "table" ? <Grid3X3 className="w-4 h-4" /> : <LayoutList className="w-4 h-4" />}
            <span className="hidden sm:inline">{viewMode === "table" ? "Grid" : "Table"}</span>
          </button>
          <a
            href="/dashboard/students/id-cards/template"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Template</span>
          </a>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Students", value: stats.total, icon: Users, textColor: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/20" },
          { label: "Generated", value: stats.generated, icon: CheckCircle2, textColor: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
          { label: "Not Generated", value: stats.notGenerated, icon: AlertCircle, textColor: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
        ].map(({ label, value, icon: Icon, textColor, bg }) => (
          <div key={label} className={cn("rounded-2xl border p-3 sm:p-4 flex items-center gap-3", bg)}>
            <div className={cn("p-2 rounded-xl bg-background/70 shadow-sm shrink-0", textColor)}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className={cn("text-xl sm:text-2xl font-black", textColor)}>{value}</div>
              <div className="text-xs font-semibold text-muted-fg truncate">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search & Filter Row ── */}
      <div className="flex gap-2 relative z-30">
        {/* Search */}
        <div className="flex-1 relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg group-focus-within:text-brand-500 transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, admission number, or roll..."
            className="w-full pl-10 pr-10 h-11 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-fg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-fg hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Button */}
        <div className="relative">
          <button
            ref={filterBtnRef}
            onClick={() => setIsFiltersOpen(v => !v)}
            className={cn(
              "relative inline-flex items-center gap-2 h-11 px-4 rounded-xl border text-sm font-semibold transition-all",
              isFiltersOpen
                ? "bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-500/25"
                : "bg-background border-border text-foreground hover:border-brand-400 hover:text-brand-600"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className={cn(
                "absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border-2",
                isFiltersOpen ? "bg-white text-brand-700 border-brand-600" : "bg-brand-600 text-white border-background"
              )}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Floating Filter Panel */}
          {isFiltersOpen && (
            <div
              ref={filterPanelRef}
              className="absolute top-[calc(100%+8px)] right-0 w-72 sm:w-80 bg-background border border-border rounded-2xl shadow-2xl z-[200] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
              style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))" }}
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <span className="font-bold text-sm text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-500" /> Filter Options
                </span>
                <button onClick={() => setIsFiltersOpen(false)} className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-fg hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter body */}
              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {[
                  {
                    label: "Class",
                    value: classFilter,
                    onChange: setClassFilter,
                    options: [{ val: "All", label: "All Classes" }, ...classes.map(c => ({ val: c.className, label: `Class ${c.className}` }))]
                  },
                  {
                    label: "Section",
                    value: sectionFilter,
                    onChange: setSectionFilter,
                    options: sections.map(s => ({ val: s, label: s === "All" ? "All Sections" : `Section ${s}` }))
                  },
                  {
                    label: "Academic Year",
                    value: yearFilter,
                    onChange: setYearFilter,
                    options: years.map(y => ({ val: y, label: y === "All" ? "All Years" : y }))
                  },
                  {
                    label: "ID Card Status",
                    value: statusFilter,
                    onChange: setStatusFilter,
                    options: [
                      { val: "All", label: "All Statuses" },
                      { val: "Generated", label: "✅ Generated" },
                      { val: "Not Generated", label: "⚠️ Not Generated" }
                    ]
                  },
                  {
                    label: "Transport Route",
                    value: transportFilter,
                    onChange: setTransportFilter,
                    options: routes.map(r => ({ val: r, label: r === "All" ? "All Routes" : r }))
                  },
                ].map(({ label, value, onChange, options }) => (
                  <div key={label} className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-muted-fg uppercase tracking-widest">{label}</label>
                    <ThemedSelect value={value} onChange={onChange} options={options} />
                  </div>
                ))}
              </div>

              {/* Reset */}
              <div className="px-4 pb-4">
                <button
                  onClick={() => { setClassFilter("All"); setSectionFilter("All"); setYearFilter("All"); setStatusFilter("All"); setTransportFilter("All"); }}
                  className="w-full h-9 rounded-xl border border-border bg-muted text-foreground text-sm font-bold hover:bg-muted/70 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bulk Action Bar ── */}
      {selected.size > 0 && (
        <div className="bg-brand-600 text-white rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl shadow-brand-500/25 animate-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-3">
            <span className="bg-white/20 rounded-lg px-2.5 py-1 font-bold text-sm">{selected.size} selected</span>
            <span className="text-brand-100 text-sm hidden sm:block">Ready for bulk action</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleGenerate}
              disabled={isPending}
              className="inline-flex items-center gap-2 h-8 px-4 rounded-xl bg-white text-brand-700 hover:bg-brand-50 text-sm font-bold transition-colors disabled:opacity-60"
            >
              {isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
              {isPending ? "Generating..." : "Generate"}
            </button>
            <button
              onClick={() => openPrintWindow(filteredStudents.filter(s => selected.has(s.id)))}
              className="inline-flex items-center gap-2 h-8 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-sm font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print PDF
            </button>
            <button onClick={clearSelection} className="h-8 w-8 rounded-xl hover:bg-white/15 transition-colors flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      {viewMode === "table" && (
        <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Table toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => allSelected ? clearSelection() : selectAllFiltered()}
                className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
              />
              <span className="text-sm font-semibold text-muted-fg">
                {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""}
                {selected.size > 0 && <span className="ml-2 text-brand-600 dark:text-brand-400">· {selected.size} selected</span>}
              </span>
            </div>
            {selected.size > 0 && (
              <button onClick={clearSelection} className="text-xs font-semibold text-muted-fg hover:text-foreground transition-colors">
                Clear selection
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="px-4 py-3 text-left w-10"></th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-muted-fg uppercase tracking-wider">Photo</th>
                  <th className="px-3 py-3 text-left">
                    <button onClick={() => toggleSort("name")} className="flex items-center gap-1.5 text-xs font-bold text-muted-fg uppercase tracking-wider hover:text-foreground transition-colors">
                      Name <SortIcon k="name" />
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left">
                    <button onClick={() => toggleSort("admissionNo")} className="flex items-center gap-1.5 text-xs font-bold text-muted-fg uppercase tracking-wider hover:text-foreground transition-colors">
                      Admission No. <SortIcon k="admissionNo" />
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left">
                    <button onClick={() => toggleSort("className")} className="flex items-center gap-1.5 text-xs font-bold text-muted-fg uppercase tracking-wider hover:text-foreground transition-colors">
                      Class <SortIcon k="className" />
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-muted-fg uppercase tracking-wider hidden lg:table-cell">Roll</th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-muted-fg uppercase tracking-wider hidden xl:table-cell">ID Card No.</th>
                  <th className="px-3 py-3 text-left">
                    <button onClick={() => toggleSort("idCardStatus")} className="flex items-center gap-1.5 text-xs font-bold text-muted-fg uppercase tracking-wider hover:text-foreground transition-colors">
                      Status <SortIcon k="idCardStatus" />
                    </button>
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-muted-fg uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredStudents.length > 0 ? filteredStudents.map(s => (
                  <tr
                    key={s.id}
                    className={cn(
                      "group transition-colors",
                      selected.has(s.id) ? "bg-brand-50/40 dark:bg-brand-500/5" : "hover:bg-muted/30"
                    )}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(s.id)}
                        onChange={() => toggleSelect(s.id)}
                        className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3">
                      {s.photo ? (
                        <img src={s.photo} alt={s.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-background shadow-sm" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-brand-700 dark:text-brand-400 font-bold text-sm ring-2 ring-background shadow-sm">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 max-w-[180px]">
                      <div className="font-semibold text-foreground truncate">{s.name}</div>
                      <div className="text-xs text-muted-fg">{s.academicYear}</div>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs font-semibold text-muted-fg">{s.admissionNo}</td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded-lg bg-muted border border-border text-xs font-semibold text-foreground">
                        {s.className}{s.section && ` - ${s.section}`}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-muted-fg font-semibold text-xs hidden lg:table-cell">{s.rollNumber}</td>
                    <td className="px-3 py-3 font-mono text-xs text-muted-fg hidden xl:table-cell">{s.idCardNumber || "—"}</td>
                    <td className="px-3 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap",
                        s.idCardStatus === "Generated"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                      )}>
                        {s.idCardStatus === "Generated"
                          ? <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                          : <AlertCircle className="w-2.5 h-2.5 shrink-0" />}
                        {s.idCardStatus}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPreviewStudent(s)}
                          className="p-1.5 rounded-lg text-muted-fg hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                          title="Preview ID Card"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openPrintWindow([s])}
                          className="p-1.5 rounded-lg text-muted-fg hover:text-foreground hover:bg-muted transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            startTransition(async () => {
                              const res = await generateIDCards([s.id]);
                              if ((res as any).success) {
                                showToast("success", `✅ ID card generated for ${s.name}`);
                                setLocalStudents(prev => prev.map(st => st.id === s.id ? { ...st, idCardStatus: "Generated" as const } : st));
                              } else {
                                showToast("error", (res as any).error || "Generation failed.");
                              }
                            });
                          }}
                          className="p-1.5 rounded-lg text-muted-fg hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                          title="Regenerate"
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
                        <div className="p-4 rounded-full bg-muted"><Search className="w-8 h-8 text-muted-fg" /></div>
                        <p className="font-semibold text-foreground">No students found</p>
                        <p className="text-sm text-muted-fg">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredStudents.map(s => (
            <div
              key={s.id}
              onClick={() => toggleSelect(s.id)}
              className={cn(
                "relative bg-background border-2 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg group",
                selected.has(s.id) ? "border-brand-500 shadow-brand-500/20 shadow-md" : "border-border hover:border-brand-300"
              )}
            >
              {selected.has(s.id) && (
                <div className="absolute -top-2 -right-2 z-10 bg-brand-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">✓</div>
              )}
              <div className="p-3 flex items-center gap-2.5">
                {s.photo ? (
                  <img src={s.photo} alt={s.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-brand-700 dark:text-brand-400 font-bold text-base shrink-0">{s.name.charAt(0)}</div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-foreground text-sm truncate">{s.name}</p>
                  <p className="text-xs text-muted-fg truncate">Class {s.className}{s.section && ` - ${s.section}`}</p>
                </div>
              </div>
              <div className="px-3 pb-3 flex items-center justify-between gap-2">
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-bold border truncate",
                  s.idCardStatus === "Generated"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                )}>
                  {s.idCardStatus}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); setPreviewStudent(s); }}
                    className="p-1 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 text-brand-600 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); openPrintWindow([s]); }}
                    className="p-1 rounded-lg hover:bg-muted text-muted-fg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredStudents.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-muted"><Search className="w-8 h-8 text-muted-fg" /></div>
                <p className="font-semibold text-foreground">No students found</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Preview Modal ── */}
      {previewStudent && (
        <div
          className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewStudent(null)}
        >
          <div
            className="bg-background border border-border rounded-3xl shadow-2xl w-full max-w-[420px] max-h-[92vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-background z-10 rounded-t-3xl">
              <div>
                <h2 className="font-bold text-foreground">ID Card Preview</h2>
                <p className="text-xs text-muted-fg">{previewStudent.name} · {previewStudent.admissionNo}</p>
              </div>
              <button
                onClick={() => setPreviewStudent(null)}
                className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-fg hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Card */}
            <div className="p-5 flex flex-col items-center gap-5">
              <IDCard
                student={{
                  ...previewStudent,
                  parentName: previewStudent.parentName || "",
                  parentPhone: previewStudent.parentPhone || "",
                }}
                school={school}
                template={template || undefined}
              />

              {/* Action buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => openPrintWindow([previewStudent])}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Printer className="w-4 h-4" /> Print / Download PDF
                </button>
                <button
                  onClick={() => setPreviewStudent(null)}
                  className="h-11 px-5 rounded-2xl border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
