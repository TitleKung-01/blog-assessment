"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, Sparkles, X } from "lucide-react";

import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/blog", label: "Blog" },
  { href: "/admin", label: "ผู้ดูแล" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function handleSignOut() {
    await fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/blog";
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-5xl items-center justify-between gap-4 px-6">
        <Link
          href="/blog"
          className="group flex items-center gap-2.5 font-semibold"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Sparkles className="size-4" />
          </span>
          <span className="tracking-tight">Aurora Blog</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
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
              <span className="hidden text-sm text-muted-foreground lg:inline">
                {user.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void handleSignOut()}
                className="hidden gap-1.5 sm:inline-flex"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/admin/sign-in">เข้าสู่ระบบผู้ดูแล</Link>
            </Button>
          )}
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={isMobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-border/50 bg-background/95 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-border/50 pt-4">
            {user?.role === "ADMIN" ? (
              <div className="flex flex-col gap-2">
                <p className="px-3 text-sm text-muted-foreground">{user.name}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void handleSignOut()}
                  className="justify-start gap-1.5"
                >
                  <LogOut className="size-4" />
                  ออกจากระบบ
                </Button>
              </div>
            ) : (
              <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                <Link href="/admin/sign-in" onClick={closeMobileMenu}>
                  เข้าสู่ระบบผู้ดูแล
                </Link>
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
