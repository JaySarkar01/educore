"use server"

import { connectToDatabase } from "@/lib/db"
import { StudentModel } from "@/lib/models/Student"
import { TeacherModel } from "@/lib/models/Teacher"
import { FeeInvoiceModel } from "@/lib/models/Fee"
import { AcademicClassModel } from "@/lib/models/AcademicClass"
import { authorizePermission } from "@/lib/auth"

export async function getDashboardStats() {
  const auth = await authorizePermission("dashboard.view")
  if (!auth.allowed || !auth.context.schoolId) return null

  await connectToDatabase()

  const schoolId = auth.context.schoolId

  const studentCount = await StudentModel.countDocuments({ schoolId, status: 'Active' })
  const teacherCount = await TeacherModel.countDocuments({ schoolId, status: 'Active' })
  const classCount = await AcademicClassModel.countDocuments({ schoolId })

  const invoices = await FeeInvoiceModel.find({ schoolId }).lean()
  let revenue = 0
  for (const inv of invoices as any) {
    revenue += inv.amountPaid || 0
  }

  // Extract master global timeline
  const recentStudents = await StudentModel.find({ schoolId, "timeline.0": { $exists: true } }).select('timeline name').lean()
  const recentTeachers = await TeacherModel.find({ schoolId, "timeline.0": { $exists: true } }).select('timeline name').lean()

  let allActivities: any[] = []
  
  for (const s of recentStudents as any) {
    const sActs = s.timeline.map((act: any) => ({ ...act, author: `Student: ${s.name}` }))
    allActivities = [...allActivities, ...sActs]
  }

  for (const t of recentTeachers as any) {
    const tActs = t.timeline.map((act: any) => ({ ...act, author: `Teacher: ${t.name}` }))
    allActivities = [...allActivities, ...tActs]
  }

  allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  return {
    studentCount,
    teacherCount,
    classCount,
    revenue,
    recentActivity: allActivities.slice(0, 6)
  }
}
