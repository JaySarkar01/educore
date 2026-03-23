import { Sidebar } from "@/components/layout/sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { getSchoolProfile } from "@/app/actions/school";
import { getDashboardStats } from "@/app/actions/dashboard";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getSchoolProfile()
  const stats = await getDashboardStats()
  const role = profile?.role === 'ADMIN' ? 'ADMIN' : 'SCHOOL'

  return (
    <div className="flex h-screen w-full bg-surface-50 dark:bg-surface-950 overflow-hidden">
      <Sidebar
        schoolName={profile?.schoolName}
        studentCount={stats?.studentCount}
        role={role as 'ADMIN' | 'SCHOOL'}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardNavbar
          adminName={profile?.adminName}
          role={profile?.role === 'ADMIN' ? 'Super Admin' : 'School Admin'}
        />
        <main className="flex-1 overflow-y-auto bg-surface-50/50 dark:bg-surface-950/50">
          {children}
        </main>
      </div>
    </div>
  );
}
