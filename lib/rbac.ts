export type RoleName = "SUPER_ADMIN" | "SCHOOL_ADMIN" | "TEACHER" | "ACCOUNTANT" | "STUDENT"

export const PERMISSIONS = [
  "*",
  "dashboard.view",
  "user.manage",
  "role.manage",
  "settings.manage",
  "announcement.view",
  "announcement.create",
  "announcement.edit",
  "announcement.delete",
  "student.view",
  "student.create",
  "student.edit",
  "student.delete",
  "student.academic.view",
  "student.academic.edit",
  "teacher.view",
  "teacher.create",
  "teacher.edit",
  "teacher.delete",
  "attendance.view",
  "attendance.mark",
  "attendance.update",
  "exam.view",
  "exam.create",
  "exam.edit",
  "exam.delete",
  "marks.manage",
  "assignment.manage",
  "class.manage",
  "subject.manage",
  "fees.view",
  "fees.collect",
  "fees.update",
  "fees.receipt.download",
  "expenses.manage",
  "salary.manage",
  "finance.report.view",
  "report.view",
  "report.generate",
  "admitcard.download",
  "school.view",
  "school.approve",
] as const

export type PermissionKey = (typeof PERMISSIONS)[number]

export const ROLE_LABELS: Record<RoleName, string> = {
  SUPER_ADMIN: "Super Admin",
  SCHOOL_ADMIN: "Admin",
  TEACHER: "Teacher",
  ACCOUNTANT: "Accountant",
  STUDENT: "Student",
}

export const ROLE_PERMISSIONS: Record<RoleName, PermissionKey[]> = {
  SUPER_ADMIN: ["*"],
  SCHOOL_ADMIN: PERMISSIONS.filter((p) => p !== "*") as PermissionKey[],
  TEACHER: [
    "dashboard.view",
    "announcement.view",
    "student.view",
    "student.academic.view",
    "student.academic.edit",
    "teacher.view",
    "attendance.view",
    "attendance.mark",
    "attendance.update",
    "exam.view",
    "exam.create",
    "exam.edit",
    "marks.manage",
    "assignment.manage",
    "class.manage",
    "subject.manage",
    "report.view",
  ],
  ACCOUNTANT: [
    "dashboard.view",
    "announcement.view",
    "fees.view",
    "fees.collect",
    "fees.update",
    "fees.receipt.download",
    "expenses.manage",
    "salary.manage",
    "finance.report.view",
    "report.view",
  ],
  STUDENT: [
    "dashboard.view",
    "announcement.view",
    "student.view",
    "student.academic.view",
    "attendance.view",
    "exam.view",
    "fees.view",
    "fees.receipt.download",
    "admitcard.download",
  ],
}

export function normalizeRoleName(role?: string | null): RoleName {
  if (!role) return "STUDENT"
  if (role === "ADMIN") return "SUPER_ADMIN"
  if (role === "SCHOOL") return "SCHOOL_ADMIN"
  if (["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "ACCOUNTANT", "STUDENT"].includes(role)) {
    return role as RoleName
  }
  return "STUDENT"
}

export function hasPermission(granted: string[] = [], required: string) {
  if (!required) return true
  if (granted.includes("*")) return true
  return granted.includes(required)
}
