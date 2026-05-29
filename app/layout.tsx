import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Sparkles } from "lucide-react";
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

const footerLinks = [
  { href: "/blog", label: "บทความทั้งหมด" },
  { href: "/admin", label: "ผู้ดูแล" },
  { href: "/sign-in", label: "เข้าสู่ระบบ" },
];

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
          <footer className="mt-auto border-t border-border/50 bg-surface/50">
            <div className="mx-auto w-full max-w-5xl px-6 py-12">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col gap-3">
                  <Link
                    href="/blog"
                    className="group flex w-fit items-center gap-2.5 font-semibold"
                  >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground shadow-sm">
                      <Sparkles className="size-3.5" />
                    </span>
                    <span className="tracking-tight">Aurora Blog</span>
                  </Link>
                  <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                    แพลตฟอร์มอ่านบทความและแสดงความคิดเห็น
                    ที่ออกแบบมาให้อ่านสบายตา
                  </p>
                </div>

                <nav
                  aria-label="Footer navigation"
                  className="flex flex-wrap gap-x-6 gap-y-2"
                >
                  {footerLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row">
                <p>© {new Date().getFullYear()} Aurora Blog</p>
                <p>สร้างด้วย Next.js · shadcn/ui · Motion</p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
