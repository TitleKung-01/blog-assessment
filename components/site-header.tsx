"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "หน้าแรก" },
  { href: "/blog/welcome", label: "บทความ" },
  { href: "/admin", label: "ผู้ดูแล" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-6">
        <Link href="/" className="group flex items-center gap-2 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground shadow-md shadow-primary/30 transition-transform group-hover:scale-105">
            <Sparkles className="size-4" />
          </span>
          <span className="tracking-tight">Aurora Blog</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href.split("/").slice(0, 2).join("/"));
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
          <Button asChild size="sm" className="hidden gap-1.5 sm:inline-flex">
            <Link href="/blog/welcome">
              <PenLine className="size-4" />
              เขียนคอมเมนต์
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
