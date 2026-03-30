"use server"

import { authorizePermission } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import { StudentModel } from "@/lib/models/Student"
import { TeacherModel } from "@/lib/models/Teacher"
import { FeeInvoiceModel } from "@/lib/models/Fee"
import { AttendanceModel } from "@/lib/models/Attendance"
import { geminiClient } from "@/lib/ai"

/**
 * AI Tool definitions to retrieve system data safely
 */
const SYSTEM_TOOLS = {
  get_student_count: async (schoolId: string) => {
    const count = await StudentModel.countDocuments({ schoolId, status: "Active" })
    const byClass = await StudentModel.aggregate([
      { $match: { schoolId, status: "Active" } },
      { $group: { _id: "$className", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
    return { total: count, breakdown: byClass }
  },
  get_teacher_count: async (schoolId: string) => {
    const count = await TeacherModel.countDocuments({ schoolId, status: "Active" })
    return { total: count }
  },
  get_fee_summary: async (schoolId: string) => {
    const invoices = await FeeInvoiceModel.find({ schoolId }).lean()
    let totalPending = 0
    let totalReceived = 0
    let overdueCount = 0
    const today = new Date().toISOString().split('T')[0]

    for (const inv of invoices as any) {
      totalReceived += inv.amountPaid || 0
      totalPending += (inv.amount - inv.amountPaid)
      if (inv.status !== 'Paid' && inv.dueDate < today) {
        overdueCount++
      }
    }
    return { totalReceived, totalPending, overdueCount, totalInvoices: invoices.length }
  },
  get_recent_system_activity: async (schoolId: string) => {
    // We can pull from timelines of students/teachers or audit logs
    const students = await StudentModel.find({ schoolId, "timeline.0": { $exists: true } })
      .sort({ "timeline.date": -1 })
      .limit(5)
      .select("name timeline")
      .lean()
    
    const activities = (students as any[]).flatMap((s: any) => 
      s.timeline.map((t: any) => ({ ...t, studentName: s.name }))
    ).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)
    
    return { recentActivities: activities }
  },
  get_attendance_summary: async (schoolId: string) => {
    const today = new Date().toISOString().split('T')[0]
    const attendance = await AttendanceModel.find({ schoolId, date: today }).lean()
    
    if (!attendance.length) {
      // Find latest attendance if today hasn't been marked
      const lastRec = await AttendanceModel.findOne({ schoolId }).sort({ date: -1 }).lean()
      if (!lastRec) return { message: "No attendance data found yet." }
      
      const counts = lastRec.records.reduce((acc: any, r: any) => {
        acc[r.status] = (acc[r.status] || 0) + 1
        return acc
      }, {})
      
      return { 
        status: "Latest data from " + lastRec.date, 
        overview: counts,
        details: `Stats from Class ${lastRec.className} ${lastRec.section || ''}`
      }
    }

    const globalCounts = attendance.reduce((acc: any, classAtt: any) => {
      classAtt.records.forEach((r: any) => {
        acc[r.status] = (acc[r.status] || 0) + 1
      })
      return acc
    }, {})

    return { 
      status: "Today's summary (" + today + ")",
      overall: globalCounts,
      classesMarked: attendance.length
    }
  }
}

export async function chatWithAssistant(messages: { role: string, content: string }[]) {
  const auth = await authorizePermission("dashboard.view")
  if (!auth.allowed || !auth.context.schoolId) {
    return { error: "You do not have permission to use the AI assistant." }
  }

  const schoolId = auth.context.schoolId

  try {
    // Initial system prompt
    const systemPrompt = `
      You are the "Educore AI Assistant", a highly specialized ERP bot for school management in India.
      Your goal is to provide accurate summaries of students, teachers, fees, and activities.

      CRITICAL RULES:
      1. ALL monetary values MUST be displayed in Indian Rupees (₹) with the ₹ symbol.
      2. ONLY use the provided context and tool data to get real-time statistics. Never hallucinate numbers.
      3. If a user asks for counts or money, rely strictly on the system context data provided.
      4. Be professional, concise, and helpful.
      5. Use tables or bullet points for data breakdown when suitable.
      6. The current school ID is ${schoolId}.
    `

    // Format messages for Gemini SDK
    const lastUserMessage = messages[messages.length - 1]?.content || ""

    // Determine which tools to call with manual keyword fallback for reliability
    const q = lastUserMessage.toLowerCase();
    let intents = "";

    // Manual keyword detection (Highest Reliability)
    if (q.includes("student") || q.includes("class") || q.includes("how many")) intents += "student_counts,";
    if (q.includes("fee") || q.includes("money") || q.includes("pending") || q.includes("received") || q.includes("revenue")) intents += "fee_summary,";
    if (q.includes("teacher") || q.includes("staff") || q.includes("employee")) intents += "teacher_counts,";
    if (q.includes("attendance") || q.includes("present") || q.includes("absent")) intents += "attendance_summary,";
    if (q.includes("activity") || q.includes("recent") || q.includes("happen") || q.includes("timeline")) intents += "recent_activity,";

    // AI Intent validation with a clearer prompt
    const intentResponse = await geminiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ 
        role: "user", 
        parts: [{ text: `Task: Identify the user's intent for a school ERP system.
        Input: "${lastUserMessage}"
        Available Tools: [student_counts, teacher_counts, fee_summary, recent_activity, attendance_summary]
        Instruction: Respond ONLY with a comma-separated list of the tool names needed to answer the question, or 'none' if no tools match.` }] 
      }]
    })

    intents += (intentResponse.text || "none").toLowerCase()
    let contextualData = ""

    await connectToDatabase()

    if (intents.includes("student_counts")) {
      const data = await SYSTEM_TOOLS.get_student_count(schoolId)
      contextualData += `\n[REAL-TIME STUDENT DATA]: Total Active Students: ${data.total}. Breakdown by Class: ${JSON.stringify(data.breakdown)}`
    }
    if (intents.includes("teacher_counts")) {
      const data = await SYSTEM_TOOLS.get_teacher_count(schoolId)
      contextualData += `\n[REAL-TIME TEACHER DATA]: Total Active Teachers: ${data.total}`
    }
    if (intents.includes("fee_summary")) {
      const data = await SYSTEM_TOOLS.get_fee_summary(schoolId)
      contextualData += `\n[REAL-TIME FINANCE DATA]: Total Collected: ₹${data.totalReceived}, Total Pending: ₹${data.totalPending}, Overdue Invoices: ${data.overdueCount}`
    }
    if (intents.includes("recent_activity")) {
      const data = await SYSTEM_TOOLS.get_recent_system_activity(schoolId)
      contextualData += `\n[RECENT SYSTEM ACTIVITY]: ${JSON.stringify(data.recentActivities)}`
    }
    if (intents.includes("attendance_summary")) {
      const data = await (SYSTEM_TOOLS as any).get_attendance_summary(schoolId)
      contextualData += `\n[REAL-TIME ATTENDANCE DATA]: ${JSON.stringify(data)}`
    }

    // Now generate the actual user-facing response with the data we pulled
    const finalResponse = await geminiClient.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...messages.slice(0, -1).map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        })),
        {
          role: "user",
          parts: [{ text: `REAL-TIME SYSTEM DATA: ${contextualData || "The user is asking a general question; no specialized tool data was retrieved."}\n\nUSER QUERY: ${lastUserMessage}` }]
        }
      ]
    })

    return { 
      role: "assistant", 
      content: finalResponse.text || "I apologize, but I couldn't generate a response."
    }

  } catch (error: any) {
    console.error("Chat AI Error:", error)
    return { error: "The AI is currently unavailable. Please try again later." }
  }
}
