import { Sidebar } from "@/components/layout/sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { getSchoolProfile } from "@/app/actions/school";
import { getDashboardStats } from "@/app/actions/dashboard";
import { MobileSidebarProvider } from "@/components/layout/mobile-sidebar-context";
import { normalizeRoleName } from "@/lib/rbac";
import { FloatingAIChatbot } from "@/components/dashboard/floating-ai-chatbot";
import { getAuthContext } from "@/lib/auth";
import { getStudentById } from "@/app/actions/student";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getSchoolProfile()
  const stats = await getDashboardStats()
  const role = normalizeRoleName(profile?.role)

  // If current user is a STUDENT, prefer showing student-specific identity in the header/sidebar
  const auth = await getAuthContext()
  let studentDisplayName: string | null = null
  if (auth?.roleName === "STUDENT" && auth.linkedStudentId) {
    try {
      const student = await getStudentById(auth.linkedStudentId as string)
      if (student) studentDisplayName = student.name
    } catch (e) {
      // ignore and fallback to school profile
    }
  }

  return (
    <MobileSidebarProvider>
      <div className="flex h-screen w-full bg-surface-50 dark:bg-surface-950 overflow-hidden relative">
        <Sidebar
          // If a student is logged in, show their name in the sidebar header instead of school name
          schoolName={studentDisplayName || profile?.schoolName}
          studentCount={stats?.studentCount}
          role={role}
          permissions={profile?.permissions || []}
        />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <DashboardNavbar
            // Show student name in navbar when student is logged in, otherwise show admin/school contact
            adminName={studentDisplayName || profile?.adminName}
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
