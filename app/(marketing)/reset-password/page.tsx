"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { resetPasswordWithToken } from "@/app/actions/password"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResetPasswordPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const router = useRouter()

  const submit = (formData: FormData) => {
    setError("")
    startTransition(async () => {
      const res = await resetPasswordWithToken(formData)
      if ((res as any)?.error) {
        setError((res as any).error)
        return
      }
      router.push("/dashboard")
    })
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-24 bg-surface-50 dark:bg-surface-950 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md">
        <Card>
          <form action={submit}>
            <CardHeader>
              <CardTitle>Set New Password</CardTitle>
              <CardDescription>Use your email and reset token to set a new password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token">Reset Token</Label>
                <Input id="token" name="token" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isPending}>{isPending ? "Updating..." : "Update Password"}</Button>
              <Link href="/login" className="text-sm text-muted-fg hover:underline">Back to login</Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
