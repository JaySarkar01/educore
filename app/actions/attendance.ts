"use server"

import { connectToDatabase } from "@/lib/db"
import { AttendanceModel, IAttendanceRecord } from "@/lib/models/Attendance"
import { StudentModel } from "@/lib/models/Student"
import { AcademicClassModel } from "@/lib/models/AcademicClass"
import { revalidatePath } from "next/cache"
import { authorizePermission } from "@/lib/auth"
import { logAudit } from "@/lib/audit"

// Get the attendance document for a specific class and date
export async function getClassAttendance(className: string, section: string, date: string) {
  const auth = await authorizePermission("attendance.view")
  if (!auth.allowed || !auth.context.schoolId) return null

  if (auth.context.roleName === "STUDENT") return null
  
  await connectToDatabase()

  if (auth.context.roleName === "TEACHER") {
    const assigned = await AcademicClassModel.findOne({
      schoolId: auth.context.schoolId,
      className,
      classTeacherId: auth.context.linkedTeacherId,
    }).lean()
    if (!assigned) return null
  }
  
  // Build student query
  const studentQuery: any = { 
    schoolId: auth.context.schoolId, 
    className, 
    status: 'Active' 
  }
  if (section && section !== 'All') {
    studentQuery.section = section
  }

  // Clean empty section for attendance record lookup
  const sec = (!section || section === 'All') ? "" : section
  
  const attendance = await AttendanceModel.findOne({
    schoolId: auth.context.schoolId,
    className,
    section: sec,
    date
  }).lean()

  if (attendance) {
    return JSON.parse(JSON.stringify(attendance))
  }

  // If no attendance exists for this date, fetch students based on the flexible query
  const students = await StudentModel.find(studentQuery).sort({ rollNumber: 1 }).lean()

  if (!students.length) return { template: true, records: [] }

  const templateRecords: IAttendanceRecord[] = students.map((s: any) => ({
    studentId: s._id.toString(),
    studentName: s.name,
    rollNumber: s.rollNumber,
    status: 'Present', // Default to Present for quick marking
    remarks: ''
  }))

  return { template: true, records: templateRecords }
}

// Save or Update Attendance
export async function saveClassAttendance(className: string, section: string, date: string, records: IAttendanceRecord[]) {
  const auth = await authorizePermission("attendance.mark")
  if (!auth.allowed || !auth.context.schoolId) return { error: "Not authorized" }

  await connectToDatabase()

  if (auth.context.roleName === "TEACHER") {
    const assigned = await AcademicClassModel.findOne({
      schoolId: auth.context.schoolId,
      className,
      classTeacherId: auth.context.linkedTeacherId,
    }).lean()
    if (!assigned) return { error: "Not authorized for this class" }
  }

  const sec = (!section || section === 'All') ? "" : section

  // Upsert the attendance document
  await AttendanceModel.findOneAndUpdate(
    { schoolId: auth.context.schoolId, className, section: sec, date },
    { records, updatedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  // As a bonus (timeline hook), we log to the Student models if they are marked Absent or Leave
  const absentStudents = records.filter(r => r.status === 'Absent')
  for (const record of absentStudents) {
    await StudentModel.findByIdAndUpdate(record.studentId, {
      $push: {
        timeline: {
          title: "Marked Absent",
          description: `Student was marked Absent on ${date}.`,
          date: new Date()
        }
      }
    })
  }

  const leaveStudents = records.filter(r => r.status === 'Leave')
  for (const record of leaveStudents) {
    await StudentModel.findByIdAndUpdate(record.studentId, {
      $push: {
        timeline: {
          title: "On Leave",
          description: `Student was on Approved Leave on ${date}.`,
          date: new Date()
        }
      }
    })
  }

  revalidatePath('/dashboard/students/attendance')
  await logAudit(auth.context, {
    action: "attendance.mark",
    resource: "Attendance",
    details: { className, section: sec, date, recordsCount: records.length },
  })
  return { success: true }
}

// Get aggregate stats for a specific student's profile!
export async function getStudentAttendanceStats(studentId: string) {
  const auth = await authorizePermission("attendance.view")
  if (!auth.allowed || !auth.context.schoolId) return null

  await connectToDatabase()

  if (auth.context.roleName === "STUDENT") {
    if (!auth.context.linkedStudentId || auth.context.linkedStudentId !== studentId) return null
  }

  if (auth.context.roleName === "TEACHER") {
    if (!auth.context.linkedTeacherId) return null
    const student = await StudentModel.findOne({ _id: studentId, schoolId: auth.context.schoolId })
      .select("className")
      .lean()
    if (!student) return null

    const assigned = await AcademicClassModel.findOne({
      schoolId: auth.context.schoolId,
      className: (student as any).className,
      classTeacherId: auth.context.linkedTeacherId,
    }).lean()

    if (!assigned) return null
  }

  // Find all attendance docs that contain exactly this student
  const attendances = await AttendanceModel.find({
    schoolId: auth.context.schoolId,
    "records.studentId": studentId
  }).sort({ date: -1 }).lean()

  let totalDays = 0
  let presentDays = 0
  const history: any[] = []

  for (const att of attendances) {
    const studentRecord = (att as any).records.find((r: any) => r.studentId === studentId)
    if (studentRecord) {
      totalDays++
      if (['Present', 'Late', 'Half-Day'].includes(studentRecord.status)) {
        presentDays++ // Late or Half-Day count computationally as mostly present, but we maintain the string
      }
      history.push({
        date: (att as any).date,
        status: studentRecord.status,
        remarks: studentRecord.remarks
      })
    }
  }

  const percentage = totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100)

  return JSON.parse(JSON.stringify({
    totalDays,
    presentDays,
    percentage,
    history
  }))
}

// Get monthly attendance for a whole class (for the Calendar view)
export async function getMonthlyClassAttendance(className: string, section: string, month: number, year: number) {
  const auth = await authorizePermission("attendance.view")
  if (!auth.allowed || !auth.context.schoolId) return []

  if (auth.context.roleName === "STUDENT") return []
  
  await connectToDatabase()

  if (auth.context.roleName === "TEACHER") {
    const assigned = await AcademicClassModel.findOne({
      schoolId: auth.context.schoolId,
      className,
      classTeacherId: auth.context.linkedTeacherId,
    }).lean()
    if (!assigned) return []
  }

  const sec = (!section || section === 'All') ? "" : section

  // Create regex or range for the month
  // Date format is YYYY-MM-DD
  const monthStr = month < 10 ? `0${month}` : `${month}`
  const prefix = `${year}-${monthStr}`

  const attendances = await AttendanceModel.find({
    schoolId: auth.context.schoolId,
    className,
    section: sec,
    date: { $regex: `^${prefix}` }
  }).sort({ date: 1 }).lean()

  return JSON.parse(JSON.stringify(attendances))
}
