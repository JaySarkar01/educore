"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, Mail, Phone, MapPin, Loader2, Trash } from "lucide-react"
import { useState, useTransition } from "react"
import { addVendor, deleteVendor } from "@/app/actions/finance"
import { useRouter } from "next/navigation"

export default function VendorsClient({ initialVendors }: { initialVendors: any[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  async function handleAdd(formData: FormData) {
    setError("")
    startTransition(async () => {
      const res = await addVendor(formData)
      if (res?.error) {
        setError(res.error)
      } else {
        const form = document.getElementById("vendor-form") as HTMLFormElement
        if (form) form.reset()
        router.refresh()
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this vendor?")) return
    startTransition(async () => {
      await deleteVendor(id)
      router.refresh()
    })
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-fg tracking-tight">Vendors & Suppliers</h1>
          <p className="text-muted-fg mt-1 text-sm md:text-base">Manage school vendors, contacts, and purchase orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="border-border/50 bg-surface-50 dark:bg-surface-950">
            <CardHeader className="border-b border-border/40">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-500" />
                Add New Vendor
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form id="vendor-form" action={handleAdd} className="space-y-4">
                {error && <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">{error}</div>}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <input name="companyName" required type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="e.g. ABC Supplies" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Person</label>
                  <input name="contactPerson" required type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <input name="phone" required type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="+91" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select name="category" required className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm">
                      <option value="Stationary">Stationary</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="IT">IT & Software</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input name="email" type="email" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="contact@abc.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <textarea name="address" className="w-full min-h-[80px] rounded-md border border-border p-3 bg-surface-50 text-sm" placeholder="123 Street..."></textarea>
                </div>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Register Vendor
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-surface-50 dark:bg-surface-950 overflow-hidden">
            <CardHeader className="border-b border-border/40">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-500" />
                Registered Vendors
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                  {initialVendors.length === 0 ? (
                    <div className="col-span-1 sm:col-span-2 p-8 text-center text-muted-fg">
                      No vendors registered yet.
                    </div>
                  ) : (
                    initialVendors.map((vendor) => (
                      <div key={vendor._id} className="border border-border/50 rounded-lg p-4 hover:shadow-md transition-shadow bg-surface-100/50 dark:bg-surface-900/50 group">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-fg">{vendor.companyName}</h3>
                            <span className="text-[10px] uppercase font-bold text-brand-600 bg-brand-100 dark:bg-brand-900/30 rounded px-2 py-0.5 mt-1 inline-block">{vendor.category}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={isPending}
                            onClick={() => handleDelete(vendor._id)}
                            className="h-6 w-6 p-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="space-y-2 text-xs text-muted-fg mt-4">
                          <div className="flex items-center gap-2 font-medium text-fg"><Users className="w-3.5 h-3.5" /> {vendor.contactPerson}</div>
                          <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {vendor.phone}</div>
                          {vendor.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {vendor.email}</div>}
                          {vendor.address && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {vendor.address}</div>}
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}