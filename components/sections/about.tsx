"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    CheckCircle2,
    Bot,
    IndianRupee,
    Sparkles,
    TrendingDown,
    BarChart3,
    Building2,
    Users,
    CreditCard,
    Calendar,
    Bell,
    ArrowUpRight,
    DollarSign,
    Activity,
    School,
    BookOpen,
    Clock
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const benefits = [
    {
        text: "AI-powered administrative workflows",
        icon: Bot,
        color: "from-purple-500 to-pink-500",
        bgGradient: "from-purple-500/10 to-pink-500/10"
    },
    {
        text: "Real-time financial tracking in ₹ (INR)",
        icon: IndianRupee,
        color: "from-emerald-500 to-teal-500",
        bgGradient: "from-emerald-500/10 to-teal-500/10"
    },
    {
        text: "Automate daily tasks with AI Assistant",
        icon: Sparkles,
        color: "from-amber-500 to-orange-500",
        bgGradient: "from-amber-500/10 to-orange-500/10"
    },
    {
        text: "Reduce overhead costs by up to 60%",
        icon: TrendingDown,
        color: "from-rose-500 to-red-500",
        bgGradient: "from-rose-500/10 to-red-500/10"
    },
    {
        text: "Make data-driven decisions instantly",
        icon: BarChart3,
        color: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
        text: "Scale your institution seamlessly",
        icon: Building2,
        color: "from-indigo-500 to-violet-500",
        bgGradient: "from-indigo-500/10 to-violet-500/10"
    }
]

// Real-time data simulation
const mockData = {
    totalStudents: 1247,
    totalRevenue: 2845000,
    pendingFees: 342000,
    attendance: 94.2,
    upcomingEvents: 3,
    newApplications: 28
}

const recentActivities = [
    { id: 1, action: "Fee payment received", amount: "₹45,000", student: "Aarav Sharma", time: "2 min ago", type: "payment" },
    { id: 2, action: "New admission", student: "Ishita Verma", time: "1 hour ago", type: "admission" },
    { id: 3, action: "Staff attendance", count: "142/150", time: "3 hours ago", type: "attendance" },
    { id: 4, action: "Exam results published", grade: "Class 10", time: "5 hours ago", type: "exam" }
]

const quickStats = [
    { label: "Total Students", value: "1,247", change: "+12%", icon: Users, color: "blue" },
    { label: "Revenue (MTD)", value: "₹28.45L", change: "+8%", icon: IndianRupee, color: "emerald" },
    { label: "Attendance", value: "94.2%", change: "+2%", icon: Activity, color: "purple" },
    { label: "Staff Members", value: "156", change: "+5", icon: School, color: "orange" }
]

export function About() {
    const [selectedStat, setSelectedStat] = useState(0)
    const [animatedValue, setAnimatedValue] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedStat((prev) => (prev + 1) % quickStats.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const targets = [1247, 2845000, 94.2, 156]
        let start = 0
        const duration = 2000
        const step = (targets[selectedStat] / duration) * 16
        const timer = setInterval(() => {
            start += step
            if (start >= targets[selectedStat]) {
                setAnimatedValue(targets[selectedStat])
                clearInterval(timer)
            } else {
                setAnimatedValue(Math.floor(start))
            }
        }, 16)
        return () => clearInterval(timer)
    }, [selectedStat])

    return (
        <section id="about" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-transparent to-cyan-50 dark:from-brand-950/20 dark:via-transparent dark:to-cyan-950/20 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column - Benefits */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-4xl font-bold mb-6 text-fg"
                        >
                            Transforming Education Through Technology
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-muted-fg mb-8 text-balance"
                        >
                            Our goal is to provide a robust, multi-tenant SaaS platform where any school—regardless of size—can sign up and immediately transform their operations. Stop relying on fragmented tools and spreadsheets.
                        </motion.p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {benefits.map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * i + 0.3 }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="group relative"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r ${benefit.bgGradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
                                    <div className={`relative flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r ${benefit.bgGradient} border border-border/50 hover:border-transparent transition-all duration-300 backdrop-blur-sm`}>
                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${benefit.color} shadow-lg`}>
                                            <benefit.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-sm text-fg font-medium group-hover:translate-x-1 transition-transform duration-300">
                                            {benefit.text}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Link href="/inquiry">
                                <Button
                                    size="lg"
                                    className="shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30 transition-all duration-300 group"
                                >
                                    <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                    Join the Platform
                                    <motion.span
                                        className="ml-2"
                                        initial={{ x: 0 }}
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        →
                                    </motion.span>
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Real Dashboard UI */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <motion.div
                            className="rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-1 shadow-2xl"
                            whileHover={{ scale: 1.02, rotate: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="w-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
                                {/* Dashboard Header */}
                                <div className="bg-gradient-to-r from-brand-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 p-4 border-b border-border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-fg">School Dashboard</h3>
                                            <p className="text-xs text-muted-fg">Welcome back, Principal Sharma</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                                <Bell className="w-4 h-4 text-muted-fg" />
                                            </div>
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                                <Calendar className="w-4 h-4 text-muted-fg" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats Grid */}
                                <div className="grid grid-cols-2 gap-3 p-4">
                                    {quickStats.map((stat, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            className={`p-3 rounded-xl bg-gradient-to-br from-${stat.color}-50 to-transparent dark:from-${stat.color}-950/20 border border-${stat.color}-200 dark:border-${stat.color}-800 cursor-pointer transition-all`}
                                            onClick={() => setSelectedStat(idx)}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <stat.icon className={`w-4 h-4 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{stat.change}</span>
                                            </div>
                                            <p className="text-xs text-muted-fg">{stat.label}</p>
                                            <p className="text-xl font-bold text-fg">
                                                {selectedStat === idx ? (
                                                    <motion.span
                                                        key={animatedValue}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                    >
                                                        {stat.label === "Revenue (MTD)" ? `₹${(animatedValue / 100000).toFixed(1)}L` :
                                                            stat.label === "Attendance" ? `${animatedValue.toFixed(1)}%` :
                                                                animatedValue.toLocaleString()}
                                                    </motion.span>
                                                ) : (
                                                    stat.value
                                                )}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>

                        

                                {/* Recent Activity */}
                                <div className="px-4 pb-4">
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-3">
                                        <p className="text-xs font-medium text-fg mb-3">Recent Activity</p>
                                        <div className="space-y-2">
                                            {recentActivities.map((activity, idx) => (
                                                <motion.div
                                                    key={activity.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex items-center justify-between text-xs"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-6 h-6 rounded-full bg-${activity.type === 'payment' ? 'emerald' : activity.type === 'admission' ? 'blue' : 'purple'}-100 dark:bg-${activity.type === 'payment' ? 'emerald' : activity.type === 'admission' ? 'blue' : 'purple'}-900/30 flex items-center justify-center`}>
                                                            {activity.type === 'payment' && <CreditCard className="w-3 h-3 text-emerald-600" />}
                                                            {activity.type === 'admission' && <Users className="w-3 h-3 text-blue-600" />}
                                                            {activity.type === 'attendance' && <Clock className="w-3 h-3 text-purple-600" />}
                                                            {activity.type === 'exam' && <BookOpen className="w-3 h-3 text-orange-600" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-fg">{activity.action}</p>
                                                            <p className="text-muted-fg">{activity.student || activity.grade || activity.count}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-muted-fg">{activity.time}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="p-4 border-t border-border bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="default" className="flex-1 text-xs">
                                            Generate Report
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                                            Send Notification
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Animated floating elements */}
                        <motion.div
                            className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />

                        <motion.div
                            className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl"
                            animate={{
                                scale: [1.2, 1, 1.2],
                                opacity: [0.4, 0.7, 0.4],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}