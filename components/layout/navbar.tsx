"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, LogOut, LayoutDashboard } from "lucide-react"
import { SessionPayload } from "@/lib/session"
import { logout } from "@/app/actions/school"

export function Navbar({ session }: { session: SessionPayload | null }) {
  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-brand-600 text-white p-1.5 rounded-lg group-hover:bg-brand-500 transition-colors">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-fg">EduCore</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-fg">
          <Link href="/#features" className="hover:text-fg transition-colors">Features</Link>
          <Link href="/#about" className="hover:text-fg transition-colors">About</Link>
          <Link href="/#pricing" className="hover:text-fg transition-colors">Pricing</Link>
        </div>
        
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href={session.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                <Button variant="ghost" className="hidden sm:inline-flex gap-2 text-brand-700 dark:text-brand-300">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Button>
              </Link>
              <form action={logout}>
                <Button type="submit" variant="outline" className="gap-2 text-muted-fg">
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex">Login</Button>
              </Link>
              <Link href="/inquiry">
                <Button className="shadow-lg shadow-brand-500/20">Register School</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
