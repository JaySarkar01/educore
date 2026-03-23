"use server"

import { connectToDatabase } from "@/lib/db"
import { TeacherModel } from "@/lib/models/Teacher"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { revalidatePath } from "next/cache"

async function getSession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  return await decrypt(cookie)
}

export async function getTeachers(querySearch?: string, deptFilter?: string) {
  const session = await getSession()
  if (!session || !session.schoolId) return []
  
  await connectToDatabase()
  
  const query: any = { schoolId: session.schoolId }
  if (querySearch) {
    query.$or = [
      { name: { $regex: querySearch, $options: 'i' } },
      { employeeId: { $regex: querySearch, $options: 'i' } },
      { email: { $regex: querySearch, $options: 'i' } }
    ]
  }
  if (deptFilter) {
    query.department = deptFilter
  }

  const teachers = await TeacherModel.find(query).sort({ _id: -1 }).lean()
  return teachers.map((t: any) => ({
    ...JSON.parse(JSON.stringify(t)),
    id: t._id.toString()
  }))
}

export async function getTeacherById(id: string) {
  if (!id || id === 'undefined' || id.length !== 24) return null

  const session = await getSession()
  if (!session || !session.schoolId) return null
  
  await connectToDatabase()
  try {
    const teacher = await TeacherModel.findOne({ _id: id, schoolId: session.schoolId }).lean()
    if (!teacher) return null
    return {
      ...JSON.parse(JSON.stringify(teacher)),
      id: teacher._id.toString()
    }
  } catch (e) {
    return null
  }
}

export async function addTeacher(formData: FormData) {
  const session = await getSession()
  if (!session || !session.schoolId) return { error: "Not authorized" }

  await connectToDatabase()
  
  const getString = (key: string) => formData.get(key)?.toString() || ""
  const getNum = (key: string) => parseFloat(formData.get(key)?.toString() || "0")

  // Auto-generate employee ID
  const count = await TeacherModel.countDocuments({ schoolId: session.schoolId })
  const employeeId = getString("employeeId") || `EMP-${1000 + count + 1}`

  const newTeacher = {
    schoolId: session.schoolId,
    name: getString("name") || "New Teacher",
    employeeId: employeeId,
    gender: getString("gender") || "Other",
    dateOfBirth: getString("dateOfBirth"),
    phone: getString("phone"),
    email: getString("email"),
    address: getString("address"),
    qualification: getString("qualification"),
    experience: getNum("experience"),
    joiningDate: getString("joiningDate") || new Date().toISOString().split('T')[0],
    department: getString("department"),
    subjects: getString("subjects").split(',').map(s => s.trim()).filter(Boolean),
    baseSalary: getNum("baseSalary"),
    status: getString("status") || "Active",
    timeline: [
      {
        title: "Faculty Onboarded",
        description: `Teacher officially joined the ${getString("department")} department.`,
        date: new Date()
      }
    ]
  }

  await TeacherModel.create(newTeacher)
  revalidatePath('/dashboard/teachers')
  return { success: true }
}

export async function assignSubjects(teacherId: string, subjectsInput: string) {
  const session = await getSession()
  if (!session || !session.schoolId) return { error: "Not authorized" }
  
  await connectToDatabase()
  
  const subjectsArray = subjectsInput.split(',').map(s => s.trim()).filter(Boolean)
  
  await TeacherModel.findByIdAndUpdate(teacherId, {
    subjects: subjectsArray,
    $push: {
      timeline: {
        title: "Subjects Updated",
        description: `Now assigned to teach: ${subjectsArray.join(', ')}`,
        date: new Date()
      }
    }
  })
  
  revalidatePath(`/dashboard/teachers/${teacherId}`)
  return { success: true }
}

export async function deleteTeacher(id: string) {
  const session = await getSession()
  if (!session || !session.schoolId) return;
  
  await connectToDatabase()
  await TeacherModel.findByIdAndDelete(id)
  revalidatePath('/dashboard/teachers')
}
