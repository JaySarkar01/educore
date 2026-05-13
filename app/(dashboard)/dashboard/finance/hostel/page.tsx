import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, BedDouble, Plus, Users } from "lucide-react"

export default function HostelPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-fg tracking-tight">Hostel Fees</h1>
          <p className="text-muted-fg mt-1 text-sm md:text-base">Accommodation ledger and boarding charges.</p>
        </div>
      </div>

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
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hostel Block</label>
                  <select className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm">
                    <option value="Boys Hostel A">Boys Hostel A</option>
                    <option value="Boys Hostel B">Boys Hostel B</option>
                    <option value="Girls Hostel 1">Girls Hostel 1</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Room Type</label>
                  <input type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="e.g. 2-Seater AC" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monthly Fee (₹)</label>
                  <input type="number" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="5000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Rooms</label>
                  <input type="number" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="20" />
                </div>
                <Button type="button" className="w-full">Save Room Type</Button>
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
                      <th className="px-4 py-3 font-semibold">Occupancy</th>
                      <th className="px-4 py-3 font-semibold">Monthly Fee</th>
                      <th className="px-4 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr className="hover:bg-surface-100/50 dark:hover:bg-surface-900/50">
                      <td className="px-4 py-3 font-medium text-fg">Boys Hostel A</td>
                      <td className="px-4 py-3 text-muted-fg">4-Seater Non-AC</td>
                      <td className="px-4 py-3 text-muted-fg">
                        <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/> 45/80</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">₹3,500</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">Edit</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-100/50 dark:hover:bg-surface-900/50">
                      <td className="px-4 py-3 font-medium text-fg">Boys Hostel A</td>
                      <td className="px-4 py-3 text-muted-fg">2-Seater AC</td>
                      <td className="px-4 py-3 text-muted-fg">
                        <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/> 18/20</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">₹6,000</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">Edit</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-100/50 dark:hover:bg-surface-900/50">
                      <td className="px-4 py-3 font-medium text-fg">Girls Hostel 1</td>
                      <td className="px-4 py-3 text-muted-fg">3-Seater Cooler</td>
                      <td className="px-4 py-3 text-muted-fg">
                        <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/> 55/60</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">₹4,500</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">Edit</Button>
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
