"use server"

import { connectToDatabase } from "@/lib/db"
import { AcademicClassModel } from "@/lib/models/AcademicClass"
import { SubjectModel } from "@/lib/models/Subject"
import { revalidatePath } from "next/cache"
import { authorizePermission, getAuthContext } from "@/lib/auth"
import { hasPermission } from "@/lib/rbac"
import { logAudit } from "@/lib/audit"
import { TeacherModel } from "@/lib/models/Teacher"

// ---- CLASSES ----
export async function getClasses() {
  const auth = await getAuthContext()
  if (!auth || !auth.schoolId) return []
  await connectToDatabase()

  let classes: any[] = []
  // Admins (or users with class.manage) see all classes
  if (hasPermission(auth.permissions, "class.manage")) {
    classes = await AcademicClassModel.find({ schoolId: auth.schoolId }).sort({ className: 1 }).lean()
  } else if (auth.linkedTeacherId) {
    // Teachers see only classes assigned to them
    classes = await AcademicClassModel.find({ schoolId: auth.schoolId, classTeacherId: auth.linkedTeacherId }).sort({ className: 1 }).lean()
  } else {
    return []
  }

  return classes.map((c: any) => ({
    ...JSON.parse(JSON.stringify(c)),
    id: c._id.toString(),
    _id: c._id.toString()
  }))
}

export async function addClass(formData: FormData) {
  const auth = await authorizePermission("class.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }
  await connectToDatabase()

  const className = formData.get("className")?.toString().trim().replace(/^Class\s+/i, "")
  const sectionsInput = formData.get("sections")?.toString() || ""
  
  if (!className) return { error: "Class name is required" }

  const sections = sectionsInput.split(',').map(s => s.trim()).filter(Boolean)

  try {
    await AcademicClassModel.create({
      schoolId: auth.context.schoolId,
      className,
      sections
    })
    revalidatePath('/dashboard/classes/manage')
    return { success: true }
  } catch (err: any) {
    if (err.code === 11000) return { error: "Class mapping already exists" }
    return { error: "Failed to create class" }
  }
}

export async function deleteClass(id: string) {
  const auth = await authorizePermission("class.manage")
  if (!auth.allowed || !auth.context.schoolId) return;
  if (!id || id.length !== 24) return;
  await connectToDatabase()
  await AcademicClassModel.findOneAndDelete({ _id: id, schoolId: auth.context.schoolId })
  revalidatePath('/dashboard/classes/manage')
}

export async function assignClassTeacher(classId: string, teacherId: string) {
  const auth = await authorizePermission("class.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }
  
  await connectToDatabase()
  
  const classRecord = await AcademicClassModel.findOne({ _id: classId, schoolId: auth.context.schoolId })
  if (!classRecord) return { error: "Class not found" }
  
  let teacherName = "Unassigned"
  if (teacherId) {
    const teacher = await TeacherModel.findOne({ _id: teacherId, schoolId: auth.context.schoolId })
    if (!teacher) return { error: "Teacher not found" }
    teacherName = teacher.name
  }
  
  classRecord.classTeacherId = teacherId || null
  await classRecord.save()
  
  revalidatePath('/dashboard/classes/manage')
  await logAudit(auth.context, {
    action: "class.manage",
    resource: "Class",
    resourceId: classId,
    details: { message: `Assigned ${teacherName} as Class Teacher for ${classRecord.className}` },
  })
  
  return { success: true }
}

// ---- SUBJECTS ----
export async function getSubjects() {
  const auth = await authorizePermission("subject.manage")
  if (!auth.allowed || !auth.context.schoolId) return []
  await connectToDatabase()
  const subjects = await SubjectModel.find({ schoolId: auth.context.schoolId }).sort({ subjectName: 1 }).lean()
  return subjects.map((s: any) => ({
    ...JSON.parse(JSON.stringify(s)),
    id: s._id.toString()
  }))
}

export async function addSubject(formData: FormData) {
  const auth = await authorizePermission("subject.manage")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }
  await connectToDatabase()

  const subjectName = formData.get("subjectName")?.toString().trim()
  const subjectCode = formData.get("subjectCode")?.toString().trim()
  const type = formData.get("type")?.toString() || "Theory"

  if (!subjectName || !subjectCode) return { error: "Missing required fields" }

  try {
    await SubjectModel.create({
      schoolId: auth.context.schoolId,
      subjectName,
      subjectCode,
      type
    })
    revalidatePath('/dashboard/classes/subjects')
    return { success: true }
  } catch (err: any) {
    if (err.code === 11000) return { error: "Subject Code already exists" }
    return { error: "Failed to create subject" }
  }
}

export async function deleteSubject(id: string) {
  const auth = await authorizePermission("subject.manage")
  if (!auth.allowed || !auth.context.schoolId) return;
  if (!id || id.length !== 24) return;
  await connectToDatabase()
  await SubjectModel.findOneAndDelete({ _id: id, schoolId: auth.context.schoolId })
  revalidatePath('/dashboard/classes/subjects')
}
