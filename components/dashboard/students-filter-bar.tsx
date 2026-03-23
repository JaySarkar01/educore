"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, Download, Upload, Filter, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export function StudentsFilterBar({ initialQuery, initialClass }: { initialQuery: string, initialClass: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const q = formData.get("q")?.toString() || ""
    const cls = formData.get("class")?.toString() || ""
    
    const params = new URLSearchParams(searchParams.toString())
    if (q) params.set("q", q)
    else params.delete("q")
    
    if (cls) params.set("class", cls)
    else params.delete("class")
    
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col w-full lg:w-auto space-y-3">
      <div className="flex flex-col xl:flex-row gap-3 w-full items-start xl:items-center">
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-fg" />
            <Input 
              name="q" 
              defaultValue={initialQuery} 
              className="pl-9 h-9 border-surface-200 dark:border-surface-800 focus:bg-surface-50 dark:focus:bg-surface-950 transition-colors text-sm" 
              placeholder="Search student, adm no..." 
            />
          </div>
          <div className="w-24 sm:w-28">
            <Input 
              name="class" 
              defaultValue={initialClass} 
              className="h-9 border-surface-200 dark:border-surface-800 text-sm" 
              placeholder="Class" 
            />
          </div>
          <select title="Gender" name="gender" className="h-9 rounded-md border border-surface-200 dark:border-surface-800 text-sm px-3 bg-surface-50 dark:bg-surface-950 text-muted-fg focus:outline-none focus:ring-1 focus:ring-brand-500">
             <option value="">Gender</option>
             <option value="Male">Male</option>
             <option value="Female">Female</option>
          </select>
          <select title="Status" name="status" className="h-9 rounded-md border border-surface-200 dark:border-surface-800 text-sm px-3 bg-surface-50 dark:bg-surface-950 text-muted-fg focus:outline-none focus:ring-1 focus:ring-brand-500">
             <option value="">Status</option>
             <option value="Active">Active</option>
             <option value="Inactive">Inactive</option>
          </select>
          
          <Button type="submit" variant="secondary" className="h-9 px-4 gap-2 text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/20">
            <Filter className="w-4 h-4"/> Filter
          </Button>
        </form>
        
        <div className="flex items-center gap-2 border-t w-full xl:w-auto xl:border-t-0 pt-3 xl:pt-0 border-border/40">
           <Button variant="outline" size="sm" className="h-9 gap-2 shadow-sm text-muted-fg hover:text-fg">
             <Upload className="w-4 h-4"/> Import
           </Button>
           <Button variant="outline" size="sm" className="h-9 gap-2 shadow-sm text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500/20 dark:hover:bg-emerald-500/10">
             <Download className="w-4 h-4"/> Export Excel
           </Button>
           <Button variant="outline" size="icon" className="h-9 shadow-sm text-muted-fg">
             <MoreHorizontal className="w-4 h-4"/>
           </Button>
        </div>
      </div>
    </div>
  )
}
