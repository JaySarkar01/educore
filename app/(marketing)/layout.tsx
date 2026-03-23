import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  return (
    <>
      <Navbar session={session} />
      <main className="flex-1 flex flex-col pt-16">{children}</main>
      <Footer />
    </>
  );
}
