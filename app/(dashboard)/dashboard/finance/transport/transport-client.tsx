"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bus, Settings, Plus, MapPin } from "lucide-react"
import { addTransportRoute, deleteTransportRoute } from "@/app/actions/finance"

export default function TransportClient({ initialRoutes }: { initialRoutes: any[] }) {
  const [isPending, startTransition] = useTransition()
  
  const submitRef = async (formData: FormData) => {
    startTransition(async () => {
      await addTransportRoute(formData)
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      startTransition(async () => {
        await deleteTransportRoute(id)
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card className="border-border/50 bg-surface-50 dark:bg-surface-950">
          <CardHeader className="border-b border-border/40">
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-500" />
              Add New Route
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form action={submitRef} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Route Name/Number</label>
                <input name="routeName" required type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="Route 1 (North Area)" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Fee (₹)</label>
                <input name="monthlyFee" required type="number" min="0" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="1500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity (Seats)</label>
                <input name="capacity" required type="number" min="0" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="45" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vehicle Reg.</label>
                  <input name="vehicleReg" type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="DL-1A-1234" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Driver</label>
                  <input name="driverName" type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="Name" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Major Stops</label>
                <textarea name="stops" className="w-full min-h-[80px] rounded-md border border-border p-3 bg-surface-50 text-sm" placeholder="City Center, Metro Station, Park..."></textarea>
              </div>
              <Button disabled={isPending} type="submit" className="w-full">Create Route</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="border-border/50 bg-surface-50 dark:bg-surface-950 overflow-hidden">
          <CardHeader className="border-b border-border/40">
            <CardTitle className="text-base flex items-center gap-2">
              <Bus className="w-4 h-4 text-brand-500" />
              Active Routes & Fees
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
              <table className="w-full text-sm text-left align-middle">
                <thead className="text-xs text-muted-fg uppercase bg-surface-100/80 dark:bg-surface-900/80 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Route</th>
                    <th className="px-4 py-3 font-semibold">Vehicle</th>
                    <th className="px-4 py-3 font-semibold">Capacity</th>
                    <th className="px-4 py-3 font-semibold">Monthly Fee</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {initialRoutes.map((route: any) => (
                    <tr key={route._id} className="hover:bg-surface-100/50 dark:hover:bg-surface-900/50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-fg">{route.routeName}</div>
                        <div className="text-xs text-muted-fg mt-0.5 max-w-[200px] truncate"><MapPin className="inline w-3 h-3 mr-1"/>{route.stops || "No stops defined"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-fg">{route.vehicleReg || "N/A"}</div>
                        <div className="text-xs text-muted-fg mt-0.5">{route.driverName || "N/A"}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-fg">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">0</span>/{route.capacity}
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">₹{route.monthlyFee}</td>
                      <td className="px-4 py-3 text-right">
                        <Button disabled={isPending} onClick={() => handleDelete(route._id)} variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Delete</Button>
                      </td>
                    </tr>
                  ))}
                  {initialRoutes.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-fg font-medium text-sm">
                        No transport routes found. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
