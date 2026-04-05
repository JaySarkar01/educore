"use server"

import { connectToDatabase } from "@/lib/db"
import { IDCardModel } from "@/lib/models/IDCard"
import { IDCardTemplateModel } from "@/lib/models/IDCardTemplate"
import { StudentModel } from "@/lib/models/Student"
import { SchoolModel } from "@/lib/models/School"
import { authorizePermission, getAuthContext } from "@/lib/auth"
import { revalidatePath } from "next/cache"

// ── Utilities ─────────────────────────────────────────────────────────────────

function getAcademicYear(admissionDate: string): string {
  const date = new Date(admissionDate)
  if (isNaN(date.getTime())) {
    const now = new Date()
    const y = now.getFullYear()
    return `${y}-${String(y + 1).slice(-2)}`
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 1-12
  // Academic year starts in April (India)
  if (month >= 4) {
    return `${year}-${String(year + 1).slice(-2)}`
  } else {
    return `${year - 1}-${String(year).slice(-2)}`
  }
}

function generateIDCardNumber(schoolId: string, sequence: number): string {
  const year = new Date().getFullYear()
  const seq = String(sequence).padStart(4, "0")
  const prefix = schoolId.slice(-4).toUpperCase()
  return `IDC-${year}-${prefix}-${seq}`
}

function computeValidUntil(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
}

// ── Admin actions ─────────────────────────────────────────────────────────────

/** Get all students with their ID card status for the school */
export async function getIDCardManagementData() {
  // Use student.view which is universally available for admins, then allow any non-student role
  const auth = await authorizePermission("student.view")
  if (!auth.allowed || !auth.context.schoolId) return { students: [], template: null }

  // Only admins and teachers (not students themselves) should access the management view
  const role = auth.context.roleName
  if (role === "STUDENT" || role === "ACCOUNTANT") return { students: [], template: null }

  await connectToDatabase()
  const schoolId = auth.context.schoolId

  const [students, idCards, template] = await Promise.all([
    StudentModel.find({ schoolId }).sort({ className: 1, rollNumber: 1 }).lean(),
    IDCardModel.find({ schoolId }).lean(),
    IDCardTemplateModel.findOne({ schoolId }).lean(),
  ])

  const idCardMap = new Map((idCards as any[]).map(c => [c.studentId.toString(), c]))

  const result = (students as any[]).map(s => {
    const card = idCardMap.get(s._id.toString())
    const academicYear = getAcademicYear(s.admissionDate || "")
    return {
      id: s._id.toString(),
      name: s.name,
      admissionNo: s.admissionNo,
      className: s.className,
      section: s.section || "",
      rollNumber: s.rollNumber,
      photo: s.photo || "",
      status: s.status,
      idCardStatus: (card?.status || "Not Generated") as "Generated" | "Not Generated",
      idCardNumber: card?.idCardNumber || "",
      academicYear,
      transportRoute: s.transportRoute || "",
      parentName: s.parentName || "",
      parentPhone: s.parentPhone || "",
      motherName: s.motherName || "",
      bloodGroup: s.bloodGroup || "",
      dateOfBirth: s.dateOfBirth || "",
      address: s.address || "",
      pincode: s.pincode || "",
      emergencyContact: s.emergencyContact || "",
    }
  })

  return {
    students: result,
    template: template ? JSON.parse(JSON.stringify(template)) : null,
  }
}

/** Bulk generate or regenerate ID cards for given student IDs */
export async function generateIDCards(studentIds: string[]) {
  const auth = await authorizePermission("student.view")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }
  const role = auth.context.roleName
  if (role === "STUDENT" || role === "ACCOUNTANT") return { error: "Not authorized" }

  await connectToDatabase()
  const schoolId = auth.context.schoolId

  const template = await IDCardTemplateModel.findOne({ schoolId }).lean() as any
  const validityMonths = template?.validityMonths ?? 12

  // Find current max sequence
  const lastCard = await IDCardModel.findOne({ schoolId })
    .sort({ idCardNumber: -1 })
    .lean() as any

  let sequence = 0
  if (lastCard?.idCardNumber) {
    const parts = lastCard.idCardNumber.split("-")
    const last = parseInt(parts[parts.length - 1], 10)
    if (!isNaN(last)) sequence = last
  }

  const ops = studentIds.map(async (studentId, i) => {
    sequence++
    const idCardNumber = generateIDCardNumber(schoolId, sequence)
    const validUntil = computeValidUntil(validityMonths)
    const student = await StudentModel.findById(studentId).lean() as any
    const academicYear = getAcademicYear(student?.admissionDate || "")

    await IDCardModel.findOneAndUpdate(
      { schoolId, studentId },
      {
        $set: {
          idCardNumber,
          academicYear,
          status: "Generated",
          generatedAt: new Date(),
          validUntil,
          templateVersion: 1,
        }
      },
      { upsert: true }
    )
  })

  await Promise.all(ops)
  revalidatePath("/dashboard/students/id-cards")
  return { success: true, count: studentIds.length }
}

/** Get a single student's ID card data (for preview/student portal) */
export async function getStudentIDCard(studentId: string) {
  const auth = await getAuthContext()
  if (!auth?.schoolId) return null

  // RBAC: student can only access their own
  if (auth.roleName === "STUDENT") {
    if (auth.linkedStudentId !== studentId) return null
  }

  await connectToDatabase()
  const [student, card, template, school] = await Promise.all([
    StudentModel.findById(studentId).lean(),
    IDCardModel.findOne({ studentId }).lean(),
    IDCardTemplateModel.findOne({ schoolId: auth.schoolId }).lean(),
    SchoolModel.findById(auth.schoolId).lean(),
  ])

  if (!student) return null

  return {
    student: JSON.parse(JSON.stringify(student)),
    card: card ? JSON.parse(JSON.stringify(card)) : null,
    template: template ? JSON.parse(JSON.stringify(template)) : null,
    school: school ? JSON.parse(JSON.stringify(school)) : null,
  }
}

// ── Template actions ──────────────────────────────────────────────────────────

export async function getIDCardTemplate() {
  const auth = await authorizePermission("student.view")
  if (!auth.allowed || !auth.context.schoolId) return null
  if (auth.context.roleName === "STUDENT") return null

  await connectToDatabase()
  const template = await IDCardTemplateModel.findOne({ schoolId: auth.context.schoolId }).lean()
  return template ? JSON.parse(JSON.stringify(template)) : null
}

export async function saveIDCardTemplate(formData: FormData) {
  const auth = await authorizePermission("student.view")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }
  if (auth.context.roleName === "STUDENT" || auth.context.roleName === "ACCOUNTANT") return { error: "Not authorized" }

  await connectToDatabase()
  const schoolId = auth.context.schoolId

  await IDCardTemplateModel.findOneAndUpdate(
    { schoolId },
    {
      $set: {
        schoolLogo:         formData.get("schoolLogo")?.toString() || "",
        bgColor:            formData.get("bgColor")?.toString() || "#1e40af",
        accentColor:        formData.get("accentColor")?.toString() || "#3b82f6",
        orientation:        formData.get("orientation")?.toString() || "portrait",
        showTransportRoute: formData.get("showTransportRoute") === "true",
        showBloodGroup:     formData.get("showBloodGroup") === "true",
        showMotherName:     formData.get("showMotherName") === "true",
        showAddress:        formData.get("showAddress") === "true",
        validityMonths:     Number(formData.get("validityMonths")) || 12,
        footerInstructions: formData.get("footerInstructions")?.toString() || "If found, please return to the school.",
        signatureLabel:     formData.get("signatureLabel")?.toString() || "Principal",
      }
    },
    { upsert: true }
  )

  revalidatePath("/dashboard/students/id-cards")
  revalidatePath("/dashboard/students/id-cards/template")
  return { success: true }
}
