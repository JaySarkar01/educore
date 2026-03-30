import { Sidebar } from "@/components/layout/sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { getSchoolProfile } from "@/app/actions/school";
import { getDashboardStats } from "@/app/actions/dashboard";
import { MobileSidebarProvider } from "@/components/layout/mobile-sidebar-context";
import { normalizeRoleName } from "@/lib/rbac";
import { FloatingAIChatbot } from "@/components/dashboard/floating-ai-chatbot";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getSchoolProfile()
  const stats = await getDashboardStats()
  const role = normalizeRoleName(profile?.role)

  return (
    <MobileSidebarProvider>
      <div className="flex h-screen w-full bg-surface-50 dark:bg-surface-950 overflow-hidden relative">
        <Sidebar
          schoolName={profile?.schoolName}
          studentCount={stats?.studentCount}
          role={role}
          permissions={profile?.permissions || []}
        />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <DashboardNavbar
            adminName={profile?.adminName}
            role={profile?.roleLabel || 'School Admin'}
          />
          <main className="flex-1 overflow-y-auto bg-surface-50/50 dark:bg-surface-950/50">
            {children}
          </main>
        </div>
        <FloatingAIChatbot />
      </div>
    </MobileSidebarProvider>
  );
}
