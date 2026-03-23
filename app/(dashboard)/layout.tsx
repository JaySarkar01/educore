import { Sidebar } from "@/components/layout/sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full bg-surface-50 dark:bg-surface-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto bg-surface-50/50 dark:bg-surface-950/50">
          {children}
        </main>
      </div>
    </div>
  );
}
