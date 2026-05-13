import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, Mail, Phone, MapPin } from "lucide-react"

export default function VendorsPage() {
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
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <input type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="e.g. ABC Supplies" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Person</label>
                  <input type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <input type="text" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="+91" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm">
                      <option value="Stationary">Stationary</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="IT">IT & Software</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" className="w-full h-9 rounded-md border border-border px-3 bg-surface-50 text-sm" placeholder="contact@abc.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <textarea className="w-full min-h-[80px] rounded-md border border-border p-3 bg-surface-50 text-sm" placeholder="123 Street..."></textarea>
                </div>
                <Button type="button" className="w-full">Register Vendor</Button>
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
                  {/* Vendor Cards */}
                  <div className="border border-border/50 rounded-lg p-4 hover:shadow-md transition-shadow bg-surface-100/50 dark:bg-surface-900/50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-fg">EduTech Solutions</h3>
                        <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-100 rounded px-2 py-0.5">Software</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Edit</Button>
                    </div>
                    <div className="space-y-2 text-xs text-muted-fg mt-4">
                      <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +91 9876543210</div>
                      <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> contact@edutech.in</div>
                      <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Sector 4, Tech Park</div>
                    </div>
                  </div>

                  <div className="border border-border/50 rounded-lg p-4 hover:shadow-md transition-shadow bg-surface-100/50 dark:bg-surface-900/50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-fg">City Stationary</h3>
                        <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-100 rounded px-2 py-0.5">Stationary</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Edit</Button>
                    </div>
                    <div className="space-y-2 text-xs text-muted-fg mt-4">
                      <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +91 9988776655</div>
                      <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> sales@citystation.com</div>
                      <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Market Road, Central</div>
                    </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
