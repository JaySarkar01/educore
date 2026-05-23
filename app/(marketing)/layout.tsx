import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { getPublicSystemSettings } from "@/app/actions/settings"
import { SiteMaintenanceNotice } from "@/components/layout/site-maintenance-notice"

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);
  const settings = await getPublicSystemSettings()

  return (
    <>
      <Navbar session={session} appName={settings.appName} />
      <main className="flex-1 flex flex-col pt-16">{children}</main>
      <Footer />
      <SiteMaintenanceNotice maintenanceMode={settings.maintenanceMode} maintenanceMessage={settings.maintenanceMessage} />
    </>
  );
}
