import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bus, Settings, Plus, MapPin } from "lucide-react"

export default function TransportPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-fg tracking-tight">Transport Fees</h1>
          <p className="text-muted-fg mt-1 text-sm md:text-base">Manage bus routes and specific transport billing mapping.</p>
        </div>
      </div>

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
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Route Name/Number</label>
                  <input type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="Route 1 (North Area)" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monthly Fee (₹)</label>
                  <input type="number" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="1500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Capacity (Seats)</label>
                  <input type="number" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="45" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle Reg.</label>
                    <input type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="DL-1A-1234" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Driver</label>
                    <input type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="Name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Major Stops</label>
                  <textarea className="w-full min-h-[80px] rounded-md border border-border p-3 bg-surface-50 text-sm" placeholder="City Center, Metro Station, Park..."></textarea>
                </div>
                <Button type="button" className="w-full">Create Route</Button>
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
                    <tr className="hover:bg-surface-100/50 dark:hover:bg-surface-900/50">
                      <td className="px-4 py-3">
                         <div className="font-medium text-fg">Route 1 (North)</div>
                         <div className="text-xs text-muted-fg mt-0.5 max-w-[200px] truncate"><MapPin className="inline w-3 h-3 mr-1"/>City Center, Alpha Mall, Tech Park</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-fg">UP-14-BT-1122</div>
                        <div className="text-xs text-muted-fg mt-0.5">Raju Kumar</div>
                      </td>
                      <td className="px-4 py-3 text-muted-fg">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">40</span>/45
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">₹1,500</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">Manage</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-100/50 dark:hover:bg-surface-900/50">
                      <td className="px-4 py-3">
                         <div className="font-medium text-fg">Route 2 (South)</div>
                         <div className="text-xs text-muted-fg mt-0.5 max-w-[200px] truncate"><MapPin className="inline w-3 h-3 mr-1"/>Railway Station, Civil Lines</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-fg">UP-14-BT-9988</div>
                        <div className="text-xs text-muted-fg mt-0.5">Amit Singh</div>
                      </td>
                      <td className="px-4 py-3 text-muted-fg">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">32</span>/40
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">₹2,000</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">Manage</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
