"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/blog", label: "Blog" },
  { href: "/admin", label: "ผู้ดูแล" },
];

type SessionUser = {
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export function SiteHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const data = (await response.json()) as {
          authenticated?: boolean;
          user?: SessionUser;
        };
        setUser(data.authenticated && data.user ? data.user : null);
      } catch {
        setUser(null);
      }
    }

    void loadSession();
  }, [pathname]);

  async function handleSignOut() {
    await fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    window.location.href = "/blog";
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-6">
        <Link href="/blog" className="group flex items-center gap-2 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground shadow-md shadow-primary/30 transition-transform group-hover:scale-105">
            <Sparkles className="size-4" />
          </span>
          <span className="tracking-tight">Aurora Blog</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "text-foreground",
                )}
              >
                {isActive ? (
                  <span className="absolute inset-0 -z-10 rounded-full bg-accent" />
                ) : null}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user?.role === "ADMIN" ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void handleSignOut()}
                className="gap-1.5"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/sign-in">เข้าสู่ระบบผู้ดูแล</Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
