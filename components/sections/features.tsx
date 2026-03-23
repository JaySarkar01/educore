"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, Calendar, DollarSign, FileText, Clock, ShieldCheck, Building, BarChart3, Cloud } from "lucide-react"

const features = [
  { title: "Student Management", description: "Complete student lifecycle tracking from admission to alumni.", icon: GraduationCap },
  { title: "Teacher Management", description: "Staff attendance, payroll, and performance tracking.", icon: Users },
  { title: "Attendance System", description: "Automated daily attendance with instant parent notifications.", icon: Calendar },
  { title: "Fees Management", description: "Online payments, automated invoicing, and receipt generation.", icon: DollarSign },
  { title: "Exams & Results", description: "Custom grading systems and instant report card generation.", icon: FileText },
  { title: "Timetable Management", description: "Conflict-free automatic scheduling for classes and exams.", icon: Clock },
  { title: "Role-Based Access", description: "Secure portals for Admins, Teachers, Students, and Parents.", icon: ShieldCheck },
  { title: "Multi-School Support", description: "Manage an entire district or group of schools from one super-admin dashboard.", icon: Building },
  { title: "Reports & Analytics", description: "Deep insights into academic performance and financial health.", icon: BarChart3 },
  { title: "Cloud-Based", description: "Access your school data securely from anywhere, on any device.", icon: Cloud },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-surface-50/50 dark:bg-surface-950/50 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-fg">Everything You Need to Run a School</h2>
          <p className="text-muted-fg max-w-2xl mx-auto">Our ERP system provides comprehensive tools built specifically for modern educational institutions.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
            >
              <Card className="h-full border-border/50 hover:border-brand-500/30 transition-colors group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center mb-4 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
