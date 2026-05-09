import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { connectToDatabase } from "@/lib/db";
import { SystemSettingsModel } from "@/lib/models/SystemSettings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

import type { Viewport } from "next";

async function getAppSettings() {
  try {
    await connectToDatabase()
    const settings = await SystemSettingsModel.findOne({}).lean()
    // Explicitly serialize to avoid Mongoose document serialization issues
    const plainSettings = settings ? JSON.parse(JSON.stringify(settings)) : null
    return {
      appName: plainSettings?.appName || 'EduCore',
      appVersion: plainSettings?.appVersion || '1.0.0',
    }
  } catch {
    return {
      appName: 'EduCore',
      appVersion: '1.0.0',
    }
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" }
  ]
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAppSettings()
  
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://educore.vercel.app"),
    title: {
      default: `${settings.appName} - Next-Gen Multi-Tenant School ERP`,
      template: `%s | ${settings.appName}`
    },
    description: "Digitize and automate school administration with our cloud-based SaaS platform for modern education.",
    keywords: ["School ERP", "Education Management", "SaaS", "Student Management", "Teacher Portal", "Fee Management"],
    authors: [{ name: "Jay Sarkar" }],
    creator: "Jay Sarkar",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://educore.vercel.app",
      title: `${settings.appName} - Multi-Tenant School ERP`,
      description: "Digitize and automate school administration with our cloud-based SaaS platform.",
      siteName: settings.appName,
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.appName} - Multi-Tenant School ERP`,
      description: "Digitize and automate school administration with our cloud-based SaaS platform.",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-brand-500/30">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
