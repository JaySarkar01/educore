"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    description: "Perfect for single, small schools just getting started.",
    price: "$49",
    features: ["Up to 500 Students", "Basic Attendance & Exams", "1 Admin Account", "Standard Support"],
    popular: false,
  },
  {
    name: "Professional",
    description: "Ideal for growing institutions needing more power.",
    price: "$149",
    features: ["Up to 2000 Students", "Advanced Reporting & Analytics", "Unlimited Teacher Accounts", "Priority Support", "Custom Domain"],
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For multi-school districts and large academies.",
    price: "Custom",
    features: ["Unlimited Students", "Multi-Tenant Dashboard", "Dedicated Account Manager", "Custom Integrations", "SLA Guarantee"],
    popular: false,
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-surface-50 dark:bg-surface-950 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-fg">Simple, Transparent Pricing</h2>
          <p className="text-muted-fg max-w-2xl mx-auto">Choose the perfect plan for your institution&apos;s needs.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`h-full flex flex-col relative ${plan.popular ? 'border-brand-500 shadow-xl shadow-brand-500/10' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-brand-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-fg">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-muted-fg">/month</span>}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-fg">
                        <Check className="w-4 h-4 text-brand-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/inquiry" className="w-full">
                    <Button variant={plan.popular ? "default" : "outline"} className="w-full">
                      {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
