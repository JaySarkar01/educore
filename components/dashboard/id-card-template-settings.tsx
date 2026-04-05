"use client";

import { useState, useTransition } from "react";
import { saveIDCardTemplate } from "@/app/actions/id-card";
import { IDCard } from "./id-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudinaryUploader } from "./cloudinary-uploader";
import { Settings, Palette, Save, RotateCcw, Eye } from "lucide-react";

const DEMO_STUDENT = {
  id: "demo",
  name: "Priya Sharma",
  admissionNo: "ADM-2024-001",
  className: "10",
  section: "A",
  rollNumber: "12",
  photo: "",
  parentName: "Ramesh Sharma",
  parentPhone: "9876543210",
  bloodGroup: "B+",
  dateOfBirth: "15 March 2009",
  address: "123 MG Road, New Delhi",
  pincode: "110001",
  emergencyContact: "9876543210",
  transportRoute: "Route 3 - Connaught Place",
  idCardNumber: "IDC-2024-DEMO-0001",
  validUntil: "31 March 2026",
};

interface TemplateForm {
  schoolLogo: string;
  bgColor: string;
  accentColor: string;
  orientation: "portrait" | "landscape";
  showTransportRoute: boolean;
  showBloodGroup: boolean;
  showMotherName: boolean;
  showAddress: boolean;
  validityMonths: number;
  footerInstructions: string;
  signatureLabel: string;
}

const DEFAULTS: TemplateForm = {
  schoolLogo: "",
  bgColor: "#1e40af",
  accentColor: "#3b82f6",
  orientation: "portrait",
  showTransportRoute: true,
  showBloodGroup: true,
  showMotherName: true,
  showAddress: true,
  validityMonths: 12,
  footerInstructions: "If found, please return to the school. Thank you.",
  signatureLabel: "Principal",
};

export default function IDCardTemplateSettings({
  initialTemplate,
  school,
}: {
  initialTemplate: TemplateForm | null;
  school: { schoolName: string; address: string; phone: string; city: string };
}) {
  const [form, setForm] = useState<TemplateForm>(initialTemplate ? { ...DEFAULTS, ...initialTemplate } : DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const set = <K extends keyof TemplateForm>(key: K, value: TemplateForm[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, String(v)));
    startTransition(async () => {
      await saveIDCardTemplate(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-fg flex items-center gap-3">
            <Settings className="w-8 h-8 text-brand-600" /> ID Card Template Settings
          </h1>
          <p className="text-muted-fg text-sm mt-1">Configure the ID card design for all students in your school</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setForm(DEFAULTS)} className="rounded-xl gap-2 font-semibold">
            <RotateCcw className="w-4 h-4" /> Reset Defaults
          </Button>
          <Button onClick={handleSave} disabled={isPending} className="rounded-xl gap-2 font-bold shadow-lg shadow-brand-500/20">
            <Save className="w-4 h-4" />
            {isPending ? "Saving..." : saved ? "✅ Saved!" : "Save Template"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* School Branding */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <h2 className="font-bold text-slate-800 flex items-center gap-2 text-sm"><Palette className="w-4 h-4 text-brand-500" /> School Branding</h2>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">School Logo</label>
              <CloudinaryUploader
                endpoint="/api/upload/student-photo"
                value={form.schoolLogo}
                onChange={(url: string) => set("schoolLogo", url)}
                onRemove={() => set("schoolLogo", "")}
                label="Upload School Logo"
                accept="image/*"
                avatarMode={false}
              />
            </div>
          </div>

          {/* Colors */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <h2 className="font-bold text-slate-800 text-sm">Colors</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Header Background Color", key: "bgColor" as const },
                { label: "Accent Color", key: "accentColor" as const },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form[key] as string}
                      onChange={e => set(key, e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                    />
                    <Input
                      value={form[key] as string}
                      onChange={e => set(key, e.target.value)}
                      className="font-mono text-sm h-10 rounded-xl border-slate-200"
                      maxLength={7}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card Options */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
            <h2 className="font-bold text-slate-800 text-sm">Card Options</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Validity Period</label>
                <Select value={String(form.validityMonths)} onValueChange={v => set("validityMonths", Number(v))}>
                  <SelectTrigger className="h-10 rounded-xl border-slate-200 text-sm font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {[6, 12, 18, 24, 36].map(m => (
                      <SelectItem key={m} value={String(m)} className="text-sm">{m} Months</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Signature Label</label>
                <Input
                  value={form.signatureLabel}
                  onChange={e => set("signatureLabel", e.target.value)}
                  placeholder="e.g. Principal"
                  className="h-10 rounded-xl border-slate-200 text-sm font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Footer Instructions (Back)</label>
              <Input
                value={form.footerInstructions}
                onChange={e => set("footerInstructions", e.target.value)}
                className="h-10 rounded-xl border-slate-200 text-sm font-medium"
              />
            </div>
          </div>

          {/* Field Visibility */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <h2 className="font-bold text-slate-800 text-sm">Field Visibility (Back of Card)</h2>
            {[
              { key: "showBloodGroup" as const, label: "Blood Group" },
              { key: "showTransportRoute" as const, label: "Transport Route" },
              { key: "showMotherName" as const, label: "Mother's Name" },
              { key: "showAddress" as const, label: "Address" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 cursor-pointer">
                <span className="text-sm font-semibold text-slate-700">{label}</span>
                <div
                  onClick={() => set(key, !form[key])}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${form[key] ? "bg-brand-600" : "bg-slate-200"}`}
                >
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${form[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-brand-500" />
              <h2 className="font-bold text-slate-800 text-sm">Live Preview</h2>
            </div>
            <div className="flex flex-col items-center gap-2">
              <IDCard
                student={{
                  ...DEMO_STUDENT,
                  transportRoute: form.showTransportRoute ? DEMO_STUDENT.transportRoute : "",
                  bloodGroup: form.showBloodGroup ? DEMO_STUDENT.bloodGroup : undefined,
                }}
                school={{
                  schoolName: school.schoolName,
                  address: school.address,
                  phone: school.phone,
                  city: school.city,
                  schoolLogo: form.schoolLogo,
                }}
                template={{
                  bgColor: form.bgColor,
                  accentColor: form.accentColor,
                  showTransportRoute: form.showTransportRoute,
                  showBloodGroup: form.showBloodGroup,
                  showMotherName: form.showMotherName,
                  showAddress: form.showAddress,
                  signatureLabel: form.signatureLabel,
                  footerInstructions: form.footerInstructions,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
