import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" }
  ]
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://educore.vercel.app"),
  title: {
    default: "EduCore - Next-Gen Multi-Tenant School ERP",
    template: "%s | EduCore"
  },
  description: "Digitize and automate school administration with our cloud-based SaaS platform for modern education.",
  keywords: ["School ERP", "Education Management", "SaaS", "Student Management", "Teacher Portal", "Fee Management"],
  authors: [{ name: "Jay Sarkar" }],
  creator: "Jay Sarkar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://educore.vercel.app",
    title: "EduCore - Multi-Tenant School ERP",
    description: "Digitize and automate school administration with our cloud-based SaaS platform.",
    siteName: "EduCore",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduCore - Multi-Tenant School ERP",
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
};

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
