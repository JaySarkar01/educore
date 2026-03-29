"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { changePasswordAfterFirstLogin } from "@/app/actions/password"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForcedPasswordChangePage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const router = useRouter()

  const submit = (formData: FormData) => {
    setError("")
    startTransition(async () => {
      const res = await changePasswordAfterFirstLogin(formData)
      if ((res as any)?.error) {
        setError((res as any).error)
        return
      }
      router.push("/dashboard")
    })
  }

  return (
    <div className="p-6 md:p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-fg">Change Password</h1>
      <p className="text-sm text-muted-fg mt-1">For security, you must change your temporary password before continuing.</p>

      <form action={submit} className="space-y-4 mt-6 border border-border/50 rounded-xl p-5 bg-surface-50 dark:bg-surface-950">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input id="currentPassword" name="currentPassword" type="password" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input id="newPassword" name="newPassword" type="password" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required />
        </div>
        <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save New Password"}</Button>
      </form>
    </div>
  )
}
