import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { connectToDatabase } from "@/lib/db";
import { SystemSettingsModel } from "@/lib/models/SystemSettings";

async function getAppName() {
  try {
    await connectToDatabase()
    const settings = await SystemSettingsModel.findOne({}).lean()
    // Explicitly serialize to avoid Mongoose document serialization issues
    const plainSettings = settings ? JSON.parse(JSON.stringify(settings)) : null
    return plainSettings?.appName || 'EduCore'
  } catch (error) {
    return 'EduCore'
  }
}

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);
  const appName = await getAppName()

  return (
    <>
      <Navbar session={session} appName={appName} />
      <main className="flex-1 flex flex-col pt-16">{children}</main>
      <Footer />
    </>
  );
}
