"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, BedDouble, Plus, Users } from "lucide-react"
import { addHostelRoom, deleteHostelRoom } from "@/app/actions/finance"

export default function HostelClient({ initialRooms }: { initialRooms: any[] }) {
  const [isPending, startTransition] = useTransition()
  
  const submitRef = async (formData: FormData) => {
    startTransition(async () => {
      await addHostelRoom(formData)
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      startTransition(async () => {
        await deleteHostelRoom(id)
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
              Add Room Type
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form action={submitRef} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hostel Block</label>
                <select name="block" required className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm">
                  <option value="Boys Hostel A">Boys Hostel A</option>
                  <option value="Boys Hostel B">Boys Hostel B</option>
                  <option value="Girls Hostel 1">Girls Hostel 1</option>
                  <option value="Girls Hostel 2">Girls Hostel 2</option>
                  <option value="Staff Quarters">Staff Quarters</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Type</label>
                <input name="roomType" required type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="e.g. 2-Seater AC" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Fee (₹)</label>
                <input name="monthlyFee" required type="number" min="0" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="5000" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Total Rooms</label>
                <input name="totalRooms" required type="number" min="1" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="20" />
              </div>
              <Button disabled={isPending} type="submit" className="w-full">Save Room Type</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="border-border/50 bg-surface-50 dark:bg-surface-950 overflow-hidden">
          <CardHeader className="border-b border-border/40">
            <CardTitle className="text-base flex items-center gap-2">
              <Home className="w-4 h-4 text-brand-500" />
              Hostel Fee Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
              <table className="w-full text-sm text-left align-middle">
                <thead className="text-xs text-muted-fg uppercase bg-surface-100/80 dark:bg-surface-900/80 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Block</th>
                    <th className="px-4 py-3 font-semibold">Room Type</th>
                    <th className="px-4 py-3 font-semibold">Rooms</th>
                    <th className="px-4 py-3 font-semibold">Monthly Fee</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {initialRooms.map((room: any) => (
                    <tr key={room._id} className="hover:bg-surface-100/50 dark:hover:bg-surface-900/50">
                      <td className="px-4 py-3 font-medium text-fg">{room.block}</td>
                      <td className="px-4 py-3 text-muted-fg">{room.roomType}</td>
                      <td className="px-4 py-3 text-muted-fg">
                        <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/> {room.totalRooms}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">₹{room.monthlyFee}</td>
                      <td className="px-4 py-3 text-right">
                        <Button disabled={isPending} onClick={() => handleDelete(room._id)} variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Delete</Button>
                      </td>
                    </tr>
                  ))}
                  {initialRooms.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-fg font-medium text-sm">
                        No hostel rooms defined. Add one to get started.
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
