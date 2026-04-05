"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";

export interface StudentIDData {
  id: string;
  name: string;
  admissionNo: string;
  className: string;
  section: string;
  rollNumber: string;
  photo: string;
  parentPhone: string;
  parentName?: string;
  motherName?: string;
  address?: string;
  pincode?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  transportRoute?: string;
  idCardNumber?: string;
  validUntil?: string;
}

export interface SchoolIDData {
  schoolName: string;
  address: string;
  phone: string;
  city: string;
  schoolLogo?: string;
}

export interface TemplateSettings {
  bgColor?: string;
  accentColor?: string;
  showTransportRoute?: boolean;
  showBloodGroup?: boolean;
  showMotherName?: boolean;
  showAddress?: boolean;
  signatureLabel?: string;
  footerInstructions?: string;
}

const DEFAULT_TEMPLATE: TemplateSettings = {
  bgColor: "#1e40af",
  accentColor: "#3b82f6",
  showTransportRoute: true,
  showBloodGroup: true,
  showMotherName: true,
  showAddress: true,
  signatureLabel: "Principal",
  footerInstructions: "If found, please return to the school. Thank you.",
};

// ── Front Card ────────────────────────────────────────────────────────────────

function IDCardFront({
  student,
  school,
  template,
  qrCode,
}: {
  student: StudentIDData;
  school: SchoolIDData;
  template: TemplateSettings;
  qrCode: string;
}) {
  const bg = template.bgColor || "#1e40af";
  const accent = template.accentColor || "#3b82f6";

  return (
    <div
      className="id-card-front relative overflow-hidden flex flex-col"
      style={{
        width: 320,
        height: 480,
        backgroundColor: "#ffffff",
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${bg} 0%, ${accent} 100%)`,
          padding: "14px 16px 10px",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Decorative circle top right */}
        <div
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: -10,
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.07)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
          {school.schoolLogo ? (
            <img
              src={school.schoolLogo}
              alt="Logo"
              style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", background: "#fff", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 18,
                color: "#fff",
                fontWeight: 800,
              }}
            >
              {school.schoolName.charAt(0)}
            </div>
          )}
          <div>
            <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 13, lineHeight: 1.2, letterSpacing: 0.3, textTransform: "uppercase" }}>
              {school.schoolName}
            </div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 9, marginTop: 2, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>
              Student Identity Card
            </div>
          </div>
        </div>
      </div>

      {/* Photo + Name */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -1, paddingTop: 16, paddingBottom: 12, backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            overflow: "hidden",
            border: `3px solid ${bg}`,
            backgroundColor: "#e2e8f0",
            flexShrink: 0,
          }}
        >
          {student.photo ? (
            <img src={student.photo} alt={student.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", backgroundColor: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#64748b" }}>
              {student.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div style={{ marginTop: 10, textAlign: "center" }}>
          <div style={{ color: "#0f172a", fontWeight: 800, fontSize: 15, letterSpacing: 0.3, textTransform: "uppercase" }}>
            {student.name}
          </div>
          <div style={{ marginTop: 4, display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
            <span style={{ backgroundColor: `${bg}18`, color: bg, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, border: `1px solid ${bg}30` }}>
              Class {student.className} {student.section && `- ${student.section}`}
            </span>
            {template.showBloodGroup && student.bloodGroup && (
              <span style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, border: "1px solid #fca5a5" }}>
                {student.bloodGroup}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div style={{ flex: 1, padding: "10px 16px 8px", display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          ["Admission No.", student.admissionNo],
          ["Roll Number", student.rollNumber],
          ["ID Card No.", student.idCardNumber || "—"],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 5 }}>
            <span style={{ color: "#64748b", fontSize: 10, fontWeight: 600, letterSpacing: 0.3 }}>{label}</span>
            <span style={{ color: "#1e293b", fontSize: 10, fontWeight: 700 }}>{value}</span>
          </div>
        ))}

        {/* Validity */}
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 5 }}>
          <span style={{ color: "#64748b", fontSize: 10, fontWeight: 600, letterSpacing: 0.3 }}>Valid Till</span>
          <span style={{ color: "#dc2626", fontSize: 10, fontWeight: 700 }}>{student.validUntil || "—"}</span>
        </div>
      </div>

      {/* Footer with QR */}
      <div
        style={{
          backgroundColor: "#0f172a",
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>School Contact</div>
          <div style={{ color: "#ffffff", fontSize: 9, fontWeight: 600, marginTop: 2 }}>{school.phone}</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 8, marginTop: 1, maxWidth: 160, lineHeight: 1.3 }}>{school.address}, {school.city}</div>
        </div>
        {qrCode && (
          <div style={{ backgroundColor: "#ffffff", padding: 4, borderRadius: 6, flexShrink: 0 }}>
            <img src={qrCode} alt="QR Code" style={{ width: 52, height: 52 }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Back Card ─────────────────────────────────────────────────────────────────

function IDCardBack({
  student,
  school,
  template,
}: {
  student: StudentIDData;
  school: SchoolIDData;
  template: TemplateSettings;
}) {
  const bg = template.bgColor || "#1e40af";
  const accent = template.accentColor || "#3b82f6";

  const rows: [string, string | undefined, boolean][] = [
    ["Date of Birth", student.dateOfBirth, true],
    ["Blood Group", student.bloodGroup, !!template.showBloodGroup],
    ["Father's Name", student.parentName, true],
    ["Mother's Name", student.motherName, !!template.showMotherName],
    ["Emergency Contact", student.emergencyContact || student.parentPhone, true],
    ["Transport Route", student.transportRoute, !!template.showTransportRoute],
    ...(template.showAddress ? [["Address", student.address ? `${student.address}${student.pincode ? ` - ${student.pincode}` : ""}` : undefined, true] as [string, string | undefined, boolean]] : []),
  ];

  return (
    <div
      className="id-card-back relative overflow-hidden flex flex-col"
      style={{
        width: 320,
        height: 480,
        backgroundColor: "#ffffff",
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Header strip */}
      <div
        style={{
          background: `linear-gradient(135deg, ${bg}, ${accent})`,
          padding: "10px 16px",
          flexShrink: 0,
        }}
      >
        <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>Additional Information</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, marginTop: 1 }}>{student.name} — {student.admissionNo}</div>
      </div>

      {/* Info rows */}
      <div style={{ flex: 1, padding: "10px 16px", display: "flex", flexDirection: "column", gap: 7 }}>
        {rows.filter(([,value, show]) => show && value).map(([label, value]) => (
          <div key={label} style={{ display: "flex", gap: 8, borderBottom: "1px solid #f1f5f9", paddingBottom: 6 }}>
            <div style={{ width: 100, flexShrink: 0 }}>
              <span style={{ color: "#64748b", fontSize: 9, fontWeight: 700, letterSpacing: 0.3, textTransform: "uppercase" }}>{label}</span>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ color: "#1e293b", fontSize: 10, fontWeight: 600, lineHeight: 1.3 }}>{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Signature area */}
      <div style={{ padding: "8px 16px", display: "flex", justifyContent: "space-between", borderTop: "1px dashed #e2e8f0", alignItems: "flex-end", flexShrink: 0 }}>
        <div>
          <div style={{ width: 80, height: 1, backgroundColor: "#94a3b8", marginBottom: 3 }} />
          <div style={{ color: "#64748b", fontSize: 8, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>Student Sign</div>
        </div>
        <div style={{ textAlign: "right" }}>
          {/* Stamp circle */}
          <div style={{ width: 42, height: 42, borderRadius: "50%", border: "1.5px solid #94a3b8", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
            <span style={{ color: "#94a3b8", fontSize: 7, textAlign: "center", lineHeight: 1.2, fontWeight: 700, textTransform: "uppercase", padding: 2 }}>School Stamp</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ width: 80, height: 1, backgroundColor: "#94a3b8", marginBottom: 3 }} />
          <div style={{ color: "#64748b", fontSize: 8, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{template.signatureLabel || "Principal"}</div>
        </div>
      </div>

      {/* Footer instructions */}
      <div
        style={{
          background: `linear-gradient(135deg, ${bg}, ${accent})`,
          padding: "6px 16px",
          flexShrink: 0,
        }}
      >
        <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 8, textAlign: "center", lineHeight: 1.4, fontWeight: 500, letterSpacing: 0.3 }}>
          {template.footerInstructions || "If found, please return to the school. Thank you."}
        </div>
      </div>
    </div>
  );
}

// ── Main Exported IDCard ──────────────────────────────────────────────────────

export function IDCard({
  student,
  school,
  template = DEFAULT_TEMPLATE,
  showBack = false,
}: {
  student: StudentIDData;
  school: SchoolIDData;
  template?: TemplateSettings;
  showBack?: boolean;
}) {
  const [qrCode, setQrCode] = useState<string>("");
  const [side, setSide] = useState<"front" | "back">(showBack ? "back" : "front");

  useEffect(() => {
    const key = [student.idCardNumber, student.admissionNo, student.id].filter(Boolean).join("|");
    if (!key) return;
    QRCode.toDataURL(key, { margin: 1, width: 120 })
      .then(setQrCode)
      .catch(() => setQrCode(""));
  }, [student.idCardNumber, student.admissionNo, student.id]);

  const mergedTemplate = { ...DEFAULT_TEMPLATE, ...template };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Flip Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setSide("front")}
          style={{
            padding: "4px 14px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            border: "1.5px solid",
            borderColor: side === "front" ? (template.bgColor || "#1e40af") : "#e2e8f0",
            backgroundColor: side === "front" ? (template.bgColor || "#1e40af") : "#ffffff",
            color: side === "front" ? "#ffffff" : "#64748b",
            transition: "all 0.2s",
          }}
        >
          Front
        </button>
        <button
          onClick={() => setSide("back")}
          style={{
            padding: "4px 14px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            border: "1.5px solid",
            borderColor: side === "back" ? (template.bgColor || "#1e40af") : "#e2e8f0",
            backgroundColor: side === "back" ? (template.bgColor || "#1e40af") : "#ffffff",
            color: side === "back" ? "#ffffff" : "#64748b",
            transition: "all 0.2s",
          }}
        >
          Back
        </button>
      </div>

      {side === "front" ? (
        <IDCardFront student={student} school={school} template={mergedTemplate} qrCode={qrCode} />
      ) : (
        <IDCardBack student={student} school={school} template={mergedTemplate} />
      )}
    </div>
  );
}

// Export for print with both sides side by side
export function IDCardPrintSheet({
  student,
  school,
  template = DEFAULT_TEMPLATE,
  qrCode,
}: {
  student: StudentIDData;
  school: SchoolIDData;
  template?: TemplateSettings;
  qrCode: string;
}) {
  const mergedTemplate = { ...DEFAULT_TEMPLATE, ...template };
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <IDCardFront student={student} school={school} template={mergedTemplate} qrCode={qrCode} />
      <IDCardBack student={student} school={school} template={mergedTemplate} />
    </div>
  );
}
