"use client";

import {
  FileText,
  LogOut,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AdminSection } from "@/types";

const sectionIcons = {
  articles: FileText,
  comments: MessageSquare,
} as const;

const sectionTabs = [
  { id: "articles" as const, label: "จัดการบทความ" },
  { id: "comments" as const, label: "จัดการคอมเมนต์" },
];

type AdminSidebarProps = {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  isLoading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
};

export function AdminSidebar({
  activeSection,
  onSectionChange,
  isLoading,
  onRefresh,
  onLogout,
}: AdminSidebarProps) {
  return (
    <aside className="flex shrink-0 flex-col gap-6 lg:w-56">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground shadow-sm">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <h1 className="text-lg font-bold tracking-tight">แดชบอร์ด</h1>
          <p className="text-xs text-muted-foreground">ผู้ดูแลระบบ</p>
        </div>
      </div>

      <nav className="flex flex-row gap-1 lg:flex-col">
        {sectionTabs.map((tab) => {
          const Icon = sectionIcons[tab.id];
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSectionChange(tab.id)}
              className={cn(
                "flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors lg:flex-none",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="hidden flex-col gap-2 lg:flex">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="justify-start gap-1.5"
        >
          <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
          รีเฟรช
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="justify-start gap-1.5"
        >
          <LogOut className="size-4" />
          ออกจากระบบ
        </Button>
      </div>
    </aside>
  );
}
