"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

const benefits = [
  "Digitize all school management processes",
  "Automate daily administrative tasks",
  "Reduce paperwork by up to 90%",
  "Improve parent-teacher communication",
  "Make data-driven decisions instantly",
  "Scale your institution seamlessly"
]

export function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-fg">Transforming Education Through Technology</h2>
            <p className="text-lg text-muted-fg mb-8 text-balance">
              Our goal is to provide a robust, multi-tenant SaaS platform where any school—regardless of size—can sign up and immediately transform their operations. Stop relying on fragmented tools and spreadsheets.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-fg">{benefit}</span>
                </div>
              ))}
            </div>
            <Link href="/inquiry">
              <Button size="lg" className="shadow-lg shadow-brand-500/20">Join the Platform</Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-1 rotate-3 shadow-2xl hover:rotate-0 transition-transform duration-500">
              <div className="w-full h-full bg-surface-50 dark:bg-surface-950 rounded-xl overflow-hidden flex items-center justify-center border border-border">
                {/* Simulated App UI */}
                <div className="w-full h-full p-6 flex flex-col gap-4 opacity-90 backdrop-blur-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <div className="w-32 h-6 bg-surface-200 dark:bg-surface-800 rounded-md"></div>
                    <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-surface-800"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-28 bg-brand-500/10 rounded-xl border border-brand-500/20"></div>
                    <div className="h-28 bg-brand-500/10 rounded-xl border border-brand-500/20"></div>
                  </div>
                  <div className="flex-1 bg-surface-200 dark:bg-surface-800 rounded-xl mt-4"></div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-brand-500/20 blur-[100px] -z-10 rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
