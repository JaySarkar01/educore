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
  AlertCircle 
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

interface Student {
  id: string;
  name: string;
  admissionNo: string;
  className: string;
  section: string;
  rollNumber: string;
  photo: string;
  parentPhone: string;
  address: string;
  bloodGroup?: string;
  dateOfBirth?: string;
}

interface School {
  schoolName: string;
  address: string;
  phone: string;
  city: string;
}

const IDCard = ({ student, school }: { student: Student; school: School }) => {
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    const key = student.admissionNo || student.id || ""
    if (!key) return
    QRCode.toDataURL(key)
      .then((dataUrl) => setQrCode(dataUrl))
      .catch(() => setQrCode(""))
  }, [student.admissionNo, student.id])

  return (
    <div className="id-card-wrapper p-4 bg-white border border-slate-200 rounded-xl shadow-sm w-[320px] h-[480px] relative overflow-hidden flex flex-col text-slate-800 break-inside-avoid">
      {/* Design Header */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-brand-600 -skew-y-3 origin-top-left -z-0" />
      
      {/* School Header */}
      <div className="relative z-10 text-center text-white mb-6 pt-2">
        <h3 className="font-bold text-lg leading-tight uppercase tracking-wider">{school.schoolName}</h3>
        <p className="text-[10px] opacity-90">{school.city}</p>
      </div>

      {/* Profile Section */}
      <div className="relative z-10 flex flex-col items-center flex-1 px-4 text-center">
        <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-slate-100 mb-4 transition-transform hover:scale-105 duration-300">
          {student.photo ? (
            <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200">
              <User className="w-12 h-12 text-slate-400" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-black text-slate-900 mb-1 leading-tight">{student.name}</h2>
        <div className="bg-brand-50 text-brand-700 px-3 py-0.5 rounded-full text-xs font-bold mb-4 border border-brand-100 uppercase tracking-tighter">
          Student ID Card
        </div>

        {/* Details Grid */}
        <div className="w-full space-y-2 text-left text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100">
          <div className="flex justify-between border-b border-slate-200 pb-1">
            <span className="text-slate-500 font-semibold uppercase tracking-widest text-[9px]">Admission No</span>
            <span className="font-bold text-slate-800">{student.admissionNo}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1">
            <span className="text-slate-500 font-semibold uppercase tracking-widest text-[9px]">Class & Sec</span>
            <span className="font-bold text-slate-800">Class {student.className} {student.section && `- ${student.section}`}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1">
            <span className="text-slate-500 font-semibold uppercase tracking-widest text-[9px]">Roll Number</span>
            <span className="font-bold text-slate-800">{student.rollNumber}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-slate-500 font-semibold uppercase tracking-widest text-[9px]">Parent Contact</span>
            <span className="font-bold text-slate-800">{student.parentPhone}</span>
          </div>
        </div>
      </div>

      {/* Footer / QR Section */}
      <div className="relative z-10 bg-slate-900 mt-auto p-4 flex items-center justify-between text-white rounded-b-xl -mx-4 -mb-4">
        <div className="flex flex-col gap-1 max-w-[180px]">
          <div className="flex items-center gap-1.5 opacity-80">
            <Phone className="w-2.5 h-2.5" />
            <span className="text-[10px] leading-none font-medium">{school.phone}</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-80">
            <MapPin className="w-2.5 h-2.5 overflow-visible shrink-0" />
            <span className="text-[10px] leading-tight font-medium truncate">{school.address}</span>
          </div>
        </div>
        <div className="bg-white p-1 rounded-lg shrink-0 shadow-inner">
          {qrCode && <img src={qrCode} alt="QR Code" className="w-14 h-14" />}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl" />
      <div className="absolute top-1/2 -left-10 w-20 h-20 bg-brand-500/5 rounded-full blur-xl" />
    </div>
  );
};

export default function StudentIDGenerator({ 
  students: initialStudents, 
  classes, 
  school 
}: { 
  students: Student[]; 
  classes: any[];
  school: School;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const componentRef = useRef<HTMLDivElement>(null);

  const filteredStudents = initialStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "All" || s.className === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <CreditCard className="w-10 h-10 text-brand-600" />
            ID Card Generator
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
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

      <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-8 pt-10">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              <Input
                placeholder="Search students by name or admission number..."
                className="pl-12 h-14 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-2xl focus-visible:ring-brand-500 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="h-14 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-2xl font-semibold focus:ring-brand-500">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <SelectValue placeholder="All Classes" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl border-slate-200">
                  <SelectItem value="All" className="font-semibold">All Classes</SelectItem>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.className} className="font-medium focus:bg-brand-50 focus:text-brand-700">
                      Class {c.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-10 bg-slate-50/30 dark:bg-transparent min-h-[400px]">
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
              <div className="p-6 bg-brand-50 dark:bg-brand-500/10 rounded-full mb-6">
                <Search className="w-12 h-12 text-brand-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No students found</h3>
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
