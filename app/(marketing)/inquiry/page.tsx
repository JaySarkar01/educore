"use client"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Building2, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { registerSchool } from "@/app/actions/school"

export default function InquiryPage() {
  const [isPending, startTransition] = useTransition()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleAction = (formData: FormData) => {
    setErrorMsg("")

    // Client-side password match check before hitting the server
    const password = formData.get("password")?.toString() ?? ""
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? ""
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.")
      return
    }

    startTransition(async () => {
      try {
        const res = await registerSchool(formData)
        if (res.error) {
          setErrorMsg(res.error)
        } else {
          setIsSubmitted(true)
        }
      } catch (err) {
        setErrorMsg("Failed to connect to the server.")
      }
    })
  }

  if (isSubmitted) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 py-24 bg-surface-50 dark:bg-surface-950 min-h-[calc(100vh-4rem)]">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-fg">Request Received!</h2>
          <p className="text-muted-fg text-lg text-balance">
            Your school registration request has been submitted successfully to the Super Admin.
          </p>
          <div className="p-4 bg-surface-200 dark:bg-surface-800 rounded-lg text-sm text-muted-fg">
            Status: <span className="font-semibold text-brand-600 dark:text-brand-400">Pending Approval</span>
            <br />
            You will receive an email once your account is activated.
          </div>
          <Link href="/" className="block mt-8">
            <Button className="w-full gap-2 text-lg h-12">
              Return Home <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 py-12 bg-surface-50 dark:bg-surface-950 mt-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-fg flex items-center justify-center gap-3">
            <Building2 className="w-10 h-10 text-brand-500" /> Register Your School
          </h1>
          <p className="text-lg text-muted-fg">
            Fill out the inquiry form below to get started with EduCore. Once approved by our team, your school will receive full access.
          </p>
        </div>

        <Card className="shadow-2xl shadow-brand-500/5">
          <form action={handleAction}>
            <CardHeader>
              <CardTitle className="text-2xl">School Details</CardTitle>
              <CardDescription>Basic information about your educational institution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {errorMsg && (
                <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-md text-sm border border-red-200 dark:border-red-500/20">
                  {errorMsg}
                </div>
              )}

              {/* School Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input id="schoolName" name="schoolName" required placeholder="Greenwood High School" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolEmail">School Email *</Label>
                  <Input id="schoolEmail" name="schoolEmail" type="email" required placeholder="info@greenwood.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="9876543210"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    title="Enter exactly 10 digits"
                    onInput={(e) => {
                      const el = e.currentTarget
                      el.value = el.value.replace(/\D/g, "").slice(0, 10)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" name="address" placeholder="123 Education Blvd" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" name="city" required placeholder="Mumbai" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" placeholder="MH" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      name="zip"
                      placeholder="400001"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      title="Enter exactly 6 digits"
                      onInput={(e) => {
                        const el = e.currentTarget
                        el.value = el.value.replace(/\D/g, "").slice(0, 6)
                      }}
                    />
                  </div>
                </div>
              </div>

              <hr className="border-border/50" />

              {/* Admin Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-fg">Administrator Account</h3>
                  <p className="text-sm text-muted-fg">This will be the primary admin account after approval.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Admin Full Name *</Label>
                    <Input id="adminName" name="adminName" required placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email *</Label>
                    <Input id="adminEmail" name="adminEmail" type="email" required placeholder="admin@greenwood.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input id="password" name="password" type="password" required minLength={8} />
                    <p className="text-xs text-muted-fg">Minimum 8 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} />
                  </div>
                </div>
              </div>

              <hr className="border-border/50" />

              <div className="space-y-2">
                <Label htmlFor="message">Message / Notes (Optional)</Label>
                <textarea
                  id="message"
                  name="message"
                  className="flex w-full rounded-md border border-border bg-surface-50 dark:bg-surface-900 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 min-h-[100px] resize-y"
                  placeholder="Any specific requirements or number of students you currently manage?"
                ></textarea>
              </div>
            </CardContent>
            <CardFooter className="bg-surface-100 dark:bg-surface-900/50 pt-6 rounded-b-xl border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-fg text-center sm:text-left">
                By submitting this form, you agree to our Terms of Service and Privacy Policy.
              </p>
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit Registration"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
