import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Aurora Blog — บล็อกพร้อมระบบคอมเมนต์",
    template: "%s · Aurora Blog",
  },
  description:
    "อ่านบทความ ค้นหา และแสดงความคิดเห็นที่ผ่านการอนุมัติจากผู้ดูแล",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
          <footer className="border-t border-border/60 py-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-6 text-sm text-muted-foreground sm:flex-row">
              <p>© {new Date().getFullYear()} Aurora Blog</p>
              <p>
                สร้างด้วย Next.js · shadcn/ui · Framer Motion
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
