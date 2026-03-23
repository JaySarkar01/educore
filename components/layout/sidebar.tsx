"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, LayoutDashboard, Users, UserSquare2, BookOpen, Settings, CheckSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()

  const schoolLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Students', href: '/dashboard/students', icon: Users },
    { name: 'Teachers', href: '/dashboard/teachers', icon: UserSquare2 },
    { name: 'Classes', href: '/dashboard/classes', icon: BookOpen },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const adminLinks = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'All Schools', href: '/admin/schools', icon: Building2 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]
  
  const isSuperAdmin = pathname.startsWith('/admin')
  const links = isSuperAdmin ? adminLinks : schoolLinks

  return (
    <aside className="w-64 border-r border-border/40 bg-surface-50/50 dark:bg-surface-900/50 hidden md:flex flex-col h-full flex-shrink-0 backdrop-blur-xl">
      <div className="h-16 flex items-center px-6 border-b border-border/40 flex-shrink-0">
        <div className="bg-brand-600 text-white p-1.5 rounded-lg mr-2 shadow-sm shadow-brand-500/20">
          <Building2 className="w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight text-fg">{isSuperAdmin ? 'SuperAdmin' : 'EduCore'}</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin' && link.href !== '/dashboard')
          const Icon = link.icon
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-brand-500/10 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300" 
                  : "text-muted-fg hover:bg-surface-200 dark:hover:bg-surface-800 hover:text-fg"
              )}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          )
        })}
      </nav>
      
      {/* Bottom context area (e.g. storage limits, help) */}
      <div className="p-4 border-t border-border/40">
        <div className="bg-brand-50 dark:bg-brand-500/10 rounded-xl p-4 text-xs text-brand-900 dark:text-brand-100 border border-brand-100 dark:border-brand-500/20">
          <p className="font-semibold mb-1">Standard Plan</p>
          <p className="opacity-80">140/500 Students</p>
          <div className="w-full bg-brand-200 dark:bg-brand-900 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-brand-600 dark:bg-brand-400 h-full w-[28%] rounded-full"></div>
          </div>
        </div>
      </div>
    </aside>
  )
}
