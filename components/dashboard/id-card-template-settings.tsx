"use client";

import { useState, useTransition } from "react";
import { saveIDCardTemplate } from "@/app/actions/id-card";
import { IDCard } from "./id-card";
import { CloudinaryUploader } from "./cloudinary-uploader";
import { Settings, Palette, Save, RotateCcw, Eye, PenLine } from "lucide-react";

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
  principalSignature: string;
  schoolStamp: string;
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
  principalSignature: "",
  schoolStamp: "",
};

// Reusable field label
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-bold text-muted-fg uppercase tracking-widest mb-1.5">
      {children}
    </label>
  );
}

// Reusable card section
function Section({ title, icon: Icon, children }: { title: string; icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-background rounded-2xl border border-border p-5 space-y-4 shadow-sm">
      <h2 className="font-bold text-foreground text-sm flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-brand-500" />}
        {title}
      </h2>
      {children}
    </div>
  );
}

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
  const [isUploading, setIsUploading] = useState(false);

  const set = <K extends keyof TemplateForm>(key: K, value: TemplateForm[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (isUploading) return;
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, String(v)));
    startTransition(async () => {
      await saveIDCardTemplate(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  const inputCls = "w-full h-10 px-3 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all";
  const selectCls = "w-full appearance-none h-10 pl-3 pr-8 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 cursor-pointer";

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-foreground flex items-center gap-3">
            <Settings className="w-7 h-7 text-brand-600 shrink-0" /> ID Card Template
          </h1>
          <p className="text-muted-fg text-sm mt-1">Configure the ID card design for all students in your school</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setForm(DEFAULTS)}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={isPending || isUploading}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-brand-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            {isUploading ? "Uploading..." : isPending ? "Saving..." : saved ? "✅ Saved!" : "Save Template"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

        {/* ── Left: Settings Panel ── */}
        <div className="space-y-4">

          {/* School Branding */}
          <Section title="School Branding" icon={Palette}>
            <div>
              <Label>School Logo</Label>
              <CloudinaryUploader
                endpoint="/api/upload/student-photo"
                value={form.schoolLogo}
                onChange={(url: string) => set("schoolLogo", url)}
                onRemove={() => set("schoolLogo", "")}
                label="Upload school logo (PNG / JPG)"
                accept="image/*"
                maxMB={2}
                avatarMode={false}
              />
            </div>
          </Section>

          {/* Colors */}
          <Section title="Card Colors">
            <div className="grid grid-cols-2 gap-4">
              {([
                ["Header Background", "bgColor"],
                ["Accent / Badge Color", "accentColor"],
              ] as const).map(([label, key]) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form[key] as string}
                      onChange={e => set(key, e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-border p-0.5 bg-background"
                    />
                    <input
                      type="text"
                      value={form[key] as string}
                      onChange={e => set(key, e.target.value)}
                      maxLength={7}
                      className={inputCls + " font-mono"}
                      placeholder="#1e40af"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Card Options */}
          <Section title="Card Options">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Validity Period</Label>
                <div className="relative">
                  <select
                    value={form.validityMonths}
                    onChange={e => set("validityMonths", Number(e.target.value))}
                    className={selectCls}
                  >
                    {[6, 12, 18, 24, 36].map(m => (
                      <option key={m} value={m}>{m} Months</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-fg text-xs">▾</span>
                </div>
              </div>
            </div>
            <div>
              <Label>Footer Instructions (Back of card)</Label>
              <input
                type="text"
                value={form.footerInstructions}
                onChange={e => set("footerInstructions", e.target.value)}
                className={inputCls}
                placeholder="If found, please return to the school..."
              />
            </div>
          </Section>

          {/* Principal Signature + School Stamp — side by side */}
          <Section title="Principal Signature & School Stamp" icon={PenLine}>
            <p className="text-xs text-muted-fg -mt-1">
              Upload images that appear on the back of every ID card in the signature row.
              Use a transparent PNG for best results.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Signature */}
              <div className="space-y-3">
                <div>
                  <Label>Signature Label</Label>
                  <input
                    type="text"
                    value={form.signatureLabel}
                    onChange={e => set("signatureLabel", e.target.value)}
                    placeholder="e.g. Principal"
                    className={inputCls}
                  />
                </div>
                <div>
                  <Label>Principal Signature Image</Label>
                  <CloudinaryUploader
                    endpoint="/api/upload/student-photo"
                    value={form.principalSignature}
                    onChange={(url: string) => { set("principalSignature", url); setIsUploading(false); }}
                    onRemove={() => set("principalSignature", "")}
                    label="Upload signature (PNG recommended)"
                    accept="image/*"
                    maxMB={1}
                    avatarMode={false}
                  />
                  {form.principalSignature && (
                    <div className="mt-2 p-3 bg-white rounded-xl border border-border shadow-sm flex items-center gap-3">
                      <img src={form.principalSignature} alt="Signature" className="h-10 max-w-[120px] object-contain" />
                      <button
                        onClick={() => set("principalSignature", "")}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold ml-auto"
                      >Remove</button>
                    </div>
                  )}
                </div>
              </div>

              {/* School Stamp */}
              <div className="space-y-3">
                <div>
                  <Label>School Stamp / Seal</Label>
                  <p className="text-xs text-muted-fg mb-2">Upload your school's official stamp or seal. It appears in the centre of the signature row.</p>
                  <CloudinaryUploader
                    endpoint="/api/upload/student-photo"
                    value={form.schoolStamp}
                    onChange={(url: string) => { set("schoolStamp", url); setIsUploading(false); }}
                    onRemove={() => set("schoolStamp", "")}
                    label="Upload stamp / seal image"
                    accept="image/*"
                    maxMB={2}
                    avatarMode={false}
                  />
                  {form.schoolStamp && (
                    <div className="mt-2 p-3 bg-white rounded-xl border border-border shadow-sm flex items-center gap-3">
                      <img src={form.schoolStamp} alt="School Stamp" className="h-12 w-12 object-contain" />
                      <button
                        onClick={() => set("schoolStamp", "")}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold ml-auto"
                      >Remove</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Section>

          {/* Field Visibility */}
          <Section title="Field Visibility (Back of Card)">
            <p className="text-xs text-muted-fg -mt-1">Toggle which optional fields appear on the back of the card.</p>
            <div className="space-y-1">
              {([
                ["showBloodGroup", "Blood Group"],
                ["showTransportRoute", "Transport Route"],
                ["showMotherName", "Mother's Name"],
                ["showAddress", "Address"],
              ] as const).map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0"
                >
                  <span className="text-sm font-medium text-foreground">{label}</span>
                  <button
                    type="button"
                    onClick={() => set(key, !form[key])}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${form[key] ? "bg-brand-600" : "bg-muted border border-border"}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${form[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* ── Right: Live Preview ── */}
        <div className="lg:sticky lg:top-6 self-start">
          <div className="bg-background border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-brand-500" />
              <h2 className="font-bold text-foreground text-sm">Live Preview</h2>
              <span className="ml-auto text-xs text-muted-fg bg-muted px-2 py-0.5 rounded-full">Updates instantly</span>
            </div>
            <div className="flex flex-col items-center gap-2 overflow-x-auto">
              <IDCard
                student={{
                  ...DEMO_STUDENT,
                  transportRoute: form.showTransportRoute ? DEMO_STUDENT.transportRoute : "",
                  bloodGroup: form.showBloodGroup ? DEMO_STUDENT.bloodGroup : undefined,
                  motherName: form.showMotherName ? "Sunita Sharma" : undefined,
                  address: form.showAddress ? DEMO_STUDENT.address : undefined,
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
                  principalSignature: form.principalSignature,
                  schoolStamp: form.schoolStamp,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
