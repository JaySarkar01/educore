"use client";

import { useRef } from "react";
import { Download, CreditCard, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IDCard, StudentIDData, SchoolIDData, TemplateSettings } from "./id-card";

interface IDCardRecord {
  idCardNumber: string;
  validUntil: string;
  status: "Generated" | "Not Generated" | "Expired";
  academicYear: string;
}

export function StudentIDTab({
  student,
  school,
  template,
  cardRecord,
}: {
  student: StudentIDData;
  school: SchoolIDData;
  template?: TemplateSettings;
  cardRecord?: IDCardRecord | null;
}) {
  const componentRef = useRef<HTMLDivElement>(null);

  const studentData: StudentIDData = {
    ...student,
    idCardNumber: cardRecord?.idCardNumber || "",
    validUntil: cardRecord?.validUntil || "",
  };

  const isGenerated = cardRecord?.status === "Generated";

  const handlePrint = () => {
    if (!componentRef.current) return;
    const bg = template?.bgColor || "#1e40af";
    const accent = template?.accentColor || "#3b82f6";

    const printWindow = window.open("", "PRINT", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>My ID Card - ${student.name}</title>
          <style>
            @page { margin: 10mm; }
            body { margin: 0; display: flex; justify-content: center; align-items: flex-start; padding: 20px; background: white; }
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          </style>
        </head>
        <body>${componentRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 800);
  };

  return (
    <div className="flex flex-col items-center space-y-8 pt-6 pb-12 animate-in slide-in-from-bottom-4 duration-300">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-fg">My Student ID Card</h3>
        <p className="text-muted-fg text-sm max-w-xs mx-auto">Your official school identity card. Download or print for use.</p>
      </div>

      {!isGenerated ? (
        <div className="max-w-sm w-full bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
          <div className="p-4 bg-amber-100 rounded-full">
            <AlertCircle className="w-10 h-10 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-amber-800">ID Card Not Yet Generated</h4>
            <p className="text-sm text-amber-700 mt-1">
              Your school administrator has not generated your ID card yet. Please contact your school for assistance.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Card Info Banner */}
          <div className="flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-2xl px-5 py-3 max-w-sm w-full">
            <Info className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-brand-800">Card No: </span>
              <span className="font-mono text-brand-700 text-xs">{cardRecord?.idCardNumber}</span>
              {cardRecord?.validUntil && (
                <span className="text-brand-600 text-xs ml-2">· Valid till: {cardRecord.validUntil}</span>
              )}
            </div>
          </div>

          {/* Card Preview */}
          <div className="bg-slate-50 p-6 md:p-10 rounded-3xl border border-slate-200 shadow-lg relative overflow-hidden">
            <div ref={componentRef} className="relative z-10 flex justify-center">
              <IDCard
                student={studentData}
                school={school}
                template={template}
              />
            </div>
          </div>

          {/* Download Button */}
          <Button
            onClick={handlePrint}
            size="lg"
            className="rounded-2xl shadow-lg shadow-brand-500/20 font-bold px-10 gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <Download className="w-5 h-5" /> Download / Print ID Card
          </Button>
        </>
      )}
    </div>
  );
}
