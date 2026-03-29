"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { requestPasswordReset } from "@/app/actions/password"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [resetToken, setResetToken] = useState("")

  const submit = (formData: FormData) => {
    setMessage("")
    setResetToken("")
    startTransition(async () => {
      const email = formData.get("email")?.toString() || ""
      const res = await requestPasswordReset(email)
      setMessage("If an account exists, a reset token has been generated.")
      if ((res as any)?.resetToken) setResetToken((res as any).resetToken)
    })
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-24 bg-surface-50 dark:bg-surface-950 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md">
        <Card>
          <form action={submit}>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>Enter your account email to generate a reset token.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              {message && <p className="text-sm text-muted-fg">{message}</p>}
              {resetToken && (
                <div className="text-xs rounded-md border border-border/50 p-3 bg-surface-100 dark:bg-surface-900">
                  <p className="font-semibold mb-1">Reset Token (for now, copy manually):</p>
                  <p className="font-mono break-all">{resetToken}</p>
                  <Link href="/reset-password" className="text-brand-600 dark:text-brand-400 hover:underline mt-2 inline-block">Go to reset form</Link>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isPending}>{isPending ? "Generating..." : "Generate Reset Token"}</Button>
              <Link href="/login" className="text-sm text-muted-fg hover:underline">Back to login</Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
