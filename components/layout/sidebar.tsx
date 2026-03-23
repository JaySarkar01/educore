"use client"
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, LayoutDashboard, Users, UserSquare2, BookOpen, Settings, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type SubmenuLink = { name: string; href: string }
type NavLink = {
  name: string;
  href?: string;
  icon: React.ElementType;
  key?: string;
  submenu?: SubmenuLink[];
}

export function Sidebar() {
  const pathname = usePathname()
  
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'students': pathname.startsWith('/dashboard/students')
  })

  const toggleMenu = (key: string) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const schoolLinks: NavLink[] = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { 
      name: 'Students', 
      href: '/dashboard/students',
      icon: Users,
      key: 'students',
      submenu: [
        { name: 'Dashboard', href: '/dashboard/students' },
        { name: 'Add Student', href: '/dashboard/students/add' },
        { name: 'Manage Students', href: '/dashboard/students/manage' },
        { name: 'Attendance', href: '/dashboard/students/attendance' },
        { name: 'Fees', href: '/dashboard/students/fees' },
        { name: 'Documents', href: '/dashboard/students/documents' },
        { name: 'Promotion', href: '/dashboard/students/promotion' },
        { name: 'ID Cards', href: '/dashboard/students/id-cards' },
        { name: 'Alumni', href: '/dashboard/students/alumni' },
        { name: 'Reports', href: '/dashboard/students/reports' },
      ]
    },
    { 
      name: 'Teachers', 
      icon: UserSquare2,
      key: 'teachers',
      submenu: [
        { name: 'Dashboard', href: '/dashboard/teachers' },
        { name: 'Add Teacher', href: '/dashboard/teachers/add' },
        { name: 'Manage Teachers', href: '/dashboard/teachers/manage' },
        { name: 'Assign Subjects', href: '/dashboard/teachers/subjects' },
        { name: 'Attendance', href: '/dashboard/teachers/attendance' },
        { name: 'Reports', href: '/dashboard/teachers/reports' },
      ]
    },
    { 
      name: 'Academics', 
      icon: BookOpen,
      key: 'academics',
      submenu: [
        { name: 'Dashboard', href: '/dashboard/classes' },
        { name: 'Manage Classes', href: '/dashboard/classes/manage' },
        { name: 'Manage Subjects', href: '/dashboard/classes/subjects' },
      ]
    },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const adminLinks: NavLink[] = [
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
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
        {links.map((link) => {
          const Icon = link.icon
          
          if (link.submenu) {
            const isOpen = openMenus[link.key!]
            return (
              <div key={link.name} className="space-y-1 text-fg relative">
                <button 
                  onClick={() => toggleMenu(link.key!)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 text-fg hover:bg-surface-200/50 dark:hover:bg-surface-800/50 group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    {link.name}
                  </div>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-muted-fg group-hover:text-fg transition-colors" /> : <ChevronRight className="w-4 h-4 text-muted-fg group-hover:text-fg transition-colors" />}
                </button>
                {isOpen && (
                  <div className="pl-9 pr-2 py-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <div className="absolute left-5 top-10 bottom-2 w-px bg-border/60"></div>
                    {link.submenu.map((sublink) => {
                      const isSubActive = pathname === sublink.href
                      return (
                        <Link 
                          key={sublink.name} 
                          href={sublink.href}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative",
                            isSubActive 
                              ? "bg-brand-500/10 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 shadow-sm" 
                              : "text-muted-fg hover:text-fg hover:bg-surface-200 dark:hover:bg-surface-800"
                          )}
                        >
                          {isSubActive && <div className="absolute -left-4 w-1.5 h-1.5 rounded-full bg-brand-500"></div>}
                          {sublink.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          const isActive = link.href ? (pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin' && link.href !== '/dashboard')) : false
          return (
            <Link 
              key={link.name} 
              href={link.href || '#'}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
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
