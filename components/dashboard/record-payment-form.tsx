"use client"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, X, Loader2 } from "lucide-react"
import { recordFeePayment } from "@/app/actions/fees"

export function RecordPaymentForm({ invoiceId, pendingAmount, invoiceTitle }: { invoiceId: string, pendingAmount: number, invoiceTitle: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleAction = (formData: FormData) => {
    startTransition(async () => {
      const amount = parseFloat(formData.get("amount")?.toString() || "0")
      const method = formData.get("method")?.toString() || "Cash"
      const txnId = formData.get("transactionId")?.toString()
      
      const res = await recordFeePayment(invoiceId, amount, method, txnId)
      if (res?.error) {
        alert(res.error)
      } else {
        setIsOpen(false)
      }
    })
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} size="sm" className="h-8 text-xs font-semibold gap-2 shadow-sm shadow-brand-500/20">
        <CreditCard className="w-3.5 h-3.5" /> Pay Now
      </Button>
    )
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm" className="h-8 text-xs font-semibold gap-2 shadow-sm shadow-brand-500/20">
        <CreditCard className="w-3.5 h-3.5" /> Pay Now
      </Button>
      <div className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 shadow-2xl">
        <div className="bg-surface-50 dark:bg-surface-950 border border-border/50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-5 border-b border-border/40">
            <div>
              <h2 className="text-xl font-bold text-fg">Record Payment</h2>
              <p className="text-sm text-muted-fg mt-1 pr-6 truncate" title={invoiceTitle}>Obligation: {invoiceTitle}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-fg hover:text-fg" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <form action={handleAction} className="p-6 space-y-5">
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg p-4 mb-2">
              <p className="text-sm text-amber-800 dark:text-amber-300 font-medium text-center">Pending Balance</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-400 text-center">${pendingAmount.toFixed(2)}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount ($) *</Label>
              <Input id="amount" name="amount" type="number" step="0.01" max={pendingAmount} required defaultValue={pendingAmount} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Payment Method *</Label>
              <select id="method" name="method" required className="flex h-10 w-full rounded-md border border-border bg-surface-50 dark:bg-surface-950 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500">
                <option value="Cash">Cash</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Bank Transfer">Bank Transfer / NEFT</option>
                <option value="Online">Online Gateway (Stripe/Razorpay)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID / Cheque No (Optional)</Label>
              <Input id="transactionId" name="transactionId" placeholder="AX12345678" />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/40 mt-6">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="shadow-sm shadow-brand-500/20">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Payment"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
