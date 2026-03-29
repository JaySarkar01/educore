"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building2, LayoutDashboard, Users, UserSquare2, BookOpen,
  ChevronDown, ChevronRight, GraduationCap,
  ClipboardCheck, CreditCard, BarChart3, Cog, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMobileSidebar } from './mobile-sidebar-context'
import { hasPermission, ROLE_LABELS, RoleName } from '@/lib/rbac'

// ─── Types ────────────────────────────────────────────────────────────────────

type NavSubItem = {
  label: string
  href: string
  permission?: string
}

function isRouteAllowedForRole(role: RoleName, href?: string) {
  if (!href || role === "SUPER_ADMIN" || role === "SCHOOL_ADMIN") return true

  if (role === "ACCOUNTANT") {
    return href === "/dashboard" || href.startsWith("/dashboard/students/fees")
  }

  if (role === "STUDENT") {
    return (
      href === "/dashboard" ||
      href === "/dashboard/students" ||
      href.startsWith("/dashboard/students/attendance") ||
      href.startsWith("/dashboard/students/fees")
    )
  }

  if (role === "TEACHER") {
    return (
      href === "/dashboard" ||
      href === "/dashboard/students" ||
      href.startsWith("/dashboard/students/attendance") ||
      href === "/dashboard/teachers" ||
      href.startsWith("/dashboard/teachers/attendance") ||
      href.startsWith("/dashboard/teachers/subjects") ||
      href.startsWith("/dashboard/teachers/reports")
    )
  }

  return true
}

type NavItem = {
  label: string
  icon: React.ElementType
  key: string
  href?: string        // flat link (no submenu)
  children?: NavSubItem[]
  permissionsAny?: string[]
}

type NavSection = {
  heading?: string     // optional section label
  items: NavItem[]
  permissionsAny?: string[]
}

// ─── Nav configuration ────────────────────────────────────────────────────────

const schoolNav: NavSection[] = [
  {
    items: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, key: 'overview' },
    ],
  },
  {
    heading: 'MEMBERS',
    items: [
      {
        label: 'Students',
        icon: GraduationCap,
        key: 'students',
        permissionsAny: ['student.view', 'student.create', 'student.edit'],
        children: [
          { label: 'All Students',       href: '/dashboard/students', permission: 'student.view' },
          { label: 'Add Student',        href: '/dashboard/students/add', permission: 'student.create' },
          { label: 'Manage Students',    href: '/dashboard/students/manage', permission: 'student.edit' },
        ],
      },
      {
        label: 'Staff',
        icon: UserSquare2,
        key: 'staff',
        permissionsAny: ['teacher.view', 'teacher.create', 'teacher.edit'],
        children: [
          { label: 'All Teachers',       href: '/dashboard/teachers', permission: 'teacher.view' },
          { label: 'Add Teacher',        href: '/dashboard/teachers/add', permission: 'teacher.create' },
          { label: 'Manage Teachers',    href: '/dashboard/teachers/manage', permission: 'teacher.edit' },
          { label: 'Departments',        href: '/dashboard/teachers/departments', permission: 'teacher.edit' },
        ],
      },
    ],
  },
  {
    heading: 'ACADEMICS',
    items: [
      {
        label: 'Classes & Subjects',
        icon: BookOpen,
        key: 'academics',
        permissionsAny: ['class.manage', 'subject.manage'],
        children: [
          { label: 'Manage Classes',     href: '/dashboard/classes/manage', permission: 'class.manage' },
          { label: 'Manage Subjects',    href: '/dashboard/classes/subjects', permission: 'subject.manage' },
          { label: 'Assign Subjects',    href: '/dashboard/teachers/subjects', permission: 'teacher.edit' },
        ],
      },
    ],
  },
  {
    heading: 'ATTENDANCE',
    items: [
      {
        label: 'Attendance',
        icon: ClipboardCheck,
        key: 'attendance',
        permissionsAny: ['attendance.view', 'attendance.mark'],
        children: [
          { label: 'Student Attendance', href: '/dashboard/students/attendance', permission: 'attendance.view' },
          { label: 'Staff Attendance',   href: '/dashboard/teachers/attendance', permission: 'attendance.view' },
        ],
      },
    ],
  },
  {
    heading: 'FINANCE',
    items: [
      {
        label: 'Fees',
        icon: CreditCard,
        key: 'fees',
        permissionsAny: ['fees.view', 'fees.collect'],
        children: [
          { label: 'Fee Records',        href: '/dashboard/students/fees', permission: 'fees.view' },
        ],
      },
    ],
  },
  {
    heading: 'REPORTS',
    items: [
      {
        label: 'Reports',
        icon: BarChart3,
        key: 'reports',
        permissionsAny: ['report.view', 'finance.report.view'],
        children: [
          { label: 'Teacher Reports',    href: '/dashboard/teachers/reports', permission: 'report.view' },
        ],
      },
    ],
  },
  {
    heading: 'SYSTEM',
    items: [
      { label: 'Users', href: '/dashboard/users', icon: Users, key: 'users', permissionsAny: ['user.manage'] },
      { label: 'Settings', href: '/dashboard/settings', icon: Cog, key: 'settings', permissionsAny: ['settings.manage'] },
    ],
  },
]

const adminNav: NavSection[] = [
  {
    items: [
      { label: 'Overview',    href: '/admin',          icon: LayoutDashboard, key: 'admin-overview' },
      { label: 'All Schools', href: '/admin/schools',  icon: Building2,       key: 'admin-schools', permissionsAny: ['school.view'] },
    ],
  },
  {
    heading: 'SYSTEM',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Cog, key: 'admin-settings', permissionsAny: ['settings.manage'] },
    ],
  },
]

// ─── Helper: is any child of NavItem currently active ─────────────────────────

function isItemActive(item: NavItem, pathname: string): boolean {
  if (item.href) {
    if (item.href === '/dashboard' || item.href === '/admin') return pathname === item.href
    return pathname.startsWith(item.href)
  }
  return item.children?.some(c => pathname.startsWith(c.href)) ?? false
}

// ─── Sidebar Component ────────────────────────────────────────────────────────

export function Sidebar({
  schoolName = 'EduCore',
  studentCount = 0,
  role = 'SCHOOL_ADMIN',
  permissions = [],
}: {
  schoolName?: string
  studentCount?: number
  role?: RoleName
  permissions?: string[]
}) {
  const pathname = usePathname()
  const isSuperAdmin = role === 'SUPER_ADMIN' || pathname.startsWith('/admin')
  const sections = isSuperAdmin ? adminNav : schoolNav
  const { isOpen: mobileOpen, close: closeMobile } = useMobileSidebar()

  // Initialize open menus: auto-open those whose children match the current path
  const initialOpen: Record<string, boolean> = {}
  schoolNav.forEach(section =>
    section.items.forEach(item => {
      if (item.children && isItemActive(item, pathname)) {
        initialOpen[item.key] = true
      }
    })
  )
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(initialOpen)

  // Close mobile sidebar on route change
  useEffect(() => { closeMobile() }, [pathname])

  const toggle = (key: string) =>
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }))

  const visibleSections = sections
    .map(section => {
      if (section.permissionsAny?.length && !section.permissionsAny.some(p => hasPermission(permissions, p))) {
        return null
      }

      const filteredItems = section.items
        .map(item => {
          if (!isRouteAllowedForRole(role, item.href)) {
            return null
          }

          if (item.permissionsAny?.length && !item.permissionsAny.some(p => hasPermission(permissions, p))) {
            return null
          }

          if (!item.children) return item

          const children = item.children.filter(
            child =>
              isRouteAllowedForRole(role, child.href) &&
              (!child.permission || hasPermission(permissions, child.permission))
          )
          if (!children.length) return null

          return { ...item, children }
        })
        .filter(Boolean) as NavItem[]

      if (!filteredItems.length) return null
      return { ...section, items: filteredItems }
    })
    .filter(Boolean) as NavSection[]

  const sidebarContent = (
    <>
      {/* ── Logo / Brand ──────────────────────────────────────────────────── */}
      <div className="h-16 flex items-center px-5 border-b border-border/40 flex-shrink-0 gap-3">
        <div className="bg-brand-600 text-white p-1.5 rounded-lg shadow-sm shadow-brand-500/20 flex-shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm leading-tight text-fg truncate">
            {isSuperAdmin ? 'EduCore' : schoolName}
          </p>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-fg/70 mt-0.5">
            {ROLE_LABELS[role]}
          </p>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={closeMobile}
          className="md:hidden p-1.5 rounded-lg text-muted-fg hover:text-fg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hide space-y-4">
        {visibleSections.map((section, si) => (
          <div key={si}>
            {section.heading && (
              <p className="px-3 mb-1.5 text-[10px] font-bold tracking-widest uppercase text-muted-fg/50 select-none">
                {section.heading}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map(item => {
                const Icon = item.icon

                // ── Flat link (no children) ────────────────────────────────
                if (!item.children) {
                  const active = isItemActive(item, pathname)
                  return (
                    <Link
                      key={item.key}
                      href={item.href!}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150',
                        active
                          ? 'bg-brand-500/10 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300'
                          : 'text-muted-fg hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-fg'
                      )}
                    >
                      <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-brand-600 dark:text-brand-400' : '')} />
                      {item.label}
                    </Link>
                  )
                }

                // ── Collapsible group ──────────────────────────────────────
                const isOpen = openMenus[item.key]
                const hasActiveChild = isItemActive(item, pathname)

                return (
                  <div key={item.key}>
                    <button
                      onClick={() => toggle(item.key)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 group',
                        hasActiveChild
                          ? 'text-brand-700 dark:text-brand-300'
                          : 'text-muted-fg hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-fg'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn('w-4 h-4 flex-shrink-0', hasActiveChild ? 'text-brand-600 dark:text-brand-400' : '')} />
                        {item.label}
                      </div>
                      {isOpen
                        ? <ChevronDown className="w-3.5 h-3.5 text-muted-fg/60 transition-transform" />
                        : <ChevronRight className="w-3.5 h-3.5 text-muted-fg/60 transition-transform" />
                      }
                    </button>

                    {isOpen && (
                      <div className="mt-0.5 ml-4 pl-3 border-l border-border/50 space-y-0.5 pb-1 animate-in slide-in-from-top-1 duration-150">
                        {item.children.map(child => {
                          const isChildActive = pathname === child.href || (child.href !== '/dashboard' && pathname.startsWith(child.href))
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                'flex items-center px-3 py-2 rounded-md text-sm transition-all duration-150',
                                isChildActive
                                  ? 'bg-brand-500/10 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 font-semibold'
                                  : 'text-muted-fg font-medium hover:text-fg hover:bg-surface-100 dark:hover:bg-surface-800'
                              )}
                            >
                              {isChildActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2 flex-shrink-0" />
                              )}
                              {child.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Plan usage widget ─────────────────────────────────────────────── */}
      {!isSuperAdmin && (
        <div className="p-3 border-t border-border/40">
          <div className="bg-brand-50 dark:bg-brand-500/10 rounded-xl p-3.5 text-xs border border-brand-100 dark:border-brand-500/20">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-brand-900 dark:text-brand-100">Standard Plan</p>
              <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-500/20 px-1.5 py-0.5 rounded-full">
                {Math.round((studentCount / 500) * 100)}%
              </span>
            </div>
            <p className="text-brand-700 dark:text-brand-300 mb-2">{studentCount} / 500 students</p>
            <div className="w-full bg-brand-200 dark:bg-brand-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-brand-600 dark:bg-brand-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((studentCount / 500) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
      <aside className="w-64 border-r border-border/40 bg-surface-50/50 dark:bg-surface-900/50 hidden md:flex flex-col h-full flex-shrink-0 backdrop-blur-xl">
        {sidebarContent}
      </aside>

      {/* ── Mobile backdrop ───────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-surface-50 dark:bg-surface-900 border-r border-border/40 shadow-xl md:hidden transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
