"use server"

import { connectToDatabase } from "@/lib/db"
import { AttendanceModel, IAttendanceRecord } from "@/lib/models/Attendance"
import { StudentModel } from "@/lib/models/Student"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { revalidatePath } from "next/cache"

async function getSession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  return await decrypt(cookie)
}

// Get the attendance document for a specific class and date
export async function getClassAttendance(className: string, section: string, date: string) {
  const session = await getSession()
  if (!session || !session.schoolId) return null
  
  await connectToDatabase()
  
  // Clean empty section to ensure unique query match
  const sec = section || ""
  
  const attendance = await AttendanceModel.findOne({
    schoolId: session.schoolId,
    className,
    section: sec,
    date
  }).lean()

  if (attendance) {
    return JSON.parse(JSON.stringify(attendance))
  }

  // If no attendance exists for this date, fetch all students in this class/section and build a blank sheet
  const students = await StudentModel.find({ 
    schoolId: session.schoolId, 
    className, 
    section: sec,
    status: 'Active' 
  }).sort({ rollNumber: 1 }).lean()

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
  const session = await getSession()
  if (!session || !session.schoolId) return { error: "Not authorized" }

  await connectToDatabase()
  const sec = section || ""

  // Upsert the attendance document
  await AttendanceModel.findOneAndUpdate(
    { schoolId: session.schoolId, className, section: sec, date },
    { records, updatedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  // As a bonus (timeline hook), we log to the Student models if they are marked Absent
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

  revalidatePath('/dashboard/students/attendance')
  return { success: true }
}

// Get aggregate stats for a specific student's profile!
export async function getStudentAttendanceStats(studentId: string) {
  const session = await getSession()
  if (!session || !session.schoolId) return null

  await connectToDatabase()

  // Find all attendance docs that contain exactly this student
  const attendances = await AttendanceModel.find({
    schoolId: session.schoolId,
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
