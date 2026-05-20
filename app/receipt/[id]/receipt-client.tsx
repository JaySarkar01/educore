"use client"

import { Button } from "@/components/ui/button"
import { Printer, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"

export default function ReceiptClient() {
  const router = useRouter()
  // Since we rely on window.print natively for page-level printing (using print stylesheet),
  // we don't necessarily need react-to-print for full page, but users might have extensions 
  // blocking layout. Let's use standard window.print as it works universally with our CSS.

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-surface-50 border-b border-border/50 p-4 flex justify-between items-center print:hidden rounded-t-lg">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
      <div className="flex gap-2">
        <Button onClick={handlePrint} className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm">
          <Printer className="w-4 h-4 mr-2" /> Print Receipt
        </Button>
      </div>
    </div>
  )
}
