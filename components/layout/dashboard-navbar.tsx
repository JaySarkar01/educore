"use client"
import { Bell, Search, Menu, LogOut, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/school'
import Link from 'next/link'

export function DashboardNavbar() {
  return (
    <header className="h-16 flex flex-shrink-0 items-center justify-between px-6 border-b border-border/40 bg-surface-50/50 dark:bg-surface-900/50 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden text-muted-fg hover:text-fg">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="relative hidden sm:flex items-center text-muted-fg">
          <Search className="absolute left-3 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search students, staff, classes..." 
            className="h-10 w-72 rounded-lg border border-border bg-surface-100 dark:bg-surface-900/50 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-muted-fg/70"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-2 text-muted-fg hover:text-fg">
            <ExternalLink className="w-4 h-4" /> View Site
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="relative text-muted-fg hover:text-fg">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-500 rounded-full border border-surface-50 dark:border-surface-950"></span>
        </Button>
        
        <div className="h-6 w-px bg-border/50 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium leading-none text-fg">Admin User</p>
            <p className="text-xs text-muted-fg mt-1">Administrator</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-sm border border-brand-200 dark:border-brand-500/30">
            A
          </div>
        </div>
        
        <form action={logout}>
          <Button type="submit" variant="ghost" size="icon" className="text-muted-fg hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </header>
  )
}
