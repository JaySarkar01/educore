import Link from "next/link"
import { Building2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-surface-50 dark:bg-surface-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="bg-brand-600 text-white p-1 rounded-md">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-fg">EduCore</span>
            </Link>
            <p className="text-muted-fg max-w-sm text-base">
              Next-generation Multi-Tenant School ERP SaaS. Digitize management, automate tasks, and empower educators globally.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-fg text-base">Product</h4>
            <ul className="space-y-2 text-muted-fg">
              <li><Link href="/#features" className="hover:text-fg transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-fg transition-colors">Pricing</Link></li>
              <li><Link href="/inquiry" className="hover:text-fg transition-colors border-l-2 border-brand-500 pl-2 text-fg font-medium">Register School</Link></li>
              <li><Link href="/login" className="hover:text-fg transition-colors">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-fg text-base">Legal</h4>
            <ul className="space-y-2 text-muted-fg">
              <li><Link href="#" className="hover:text-fg transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-fg transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-fg transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/40 mt-12 pt-8 text-muted-fg text-center sm:text-left">
          <p>© {new Date().getFullYear()} EduCore Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
