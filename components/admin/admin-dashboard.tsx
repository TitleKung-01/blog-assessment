"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, RefreshCw } from "lucide-react";

import { AdminCommentPanel } from "@/components/admin/admin-comment-panel";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { BlogAdminPanel } from "@/components/admin/blog-admin-panel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminComments } from "@/hooks/use-admin-comments";
import { credentialedFetch } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import type { AdminSection, CommentStatus, SessionResponse } from "@/types";

export function AdminDashboard() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("articles");
  const [activeStatus, setActiveStatus] = useState<CommentStatus>("PENDING");

  const {
    comments,
    error,
    isLoading,
    actionId,
    loadComments,
    handleLogout,
    handleAction,
  } = useAdminComments(activeStatus, isReady);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch("/api/auth/session", credentialedFetch);
        const data = (await response.json()) as SessionResponse;

        if (!data.authenticated || data.user?.role !== "ADMIN") {
          router.replace("/admin/sign-in");
          return;
        }

        setIsReady(true);
      } catch {
        router.replace("/admin/sign-in");
      }
    }

    void checkAdmin();
  }, [router]);

  if (!isReady) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isLoading={isLoading}
        onRefresh={() => void loadComments()}
        onLogout={() => void handleLogout()}
      />

      <div className="min-w-0 flex-1">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:hidden">
          <p className="text-sm text-muted-foreground">
            {activeSection === "articles"
              ? "แก้ไขและเผยแพร่บทความ"
              : "อนุมัติและจัดการคอมเมนต์"}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadComments()}
              disabled={isLoading}
              className="gap-1.5"
            >
              <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
              รีเฟรช
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void handleLogout()}
              className="gap-1.5"
            >
              <LogOut className="size-4" />
              ออก
            </Button>
          </div>
        </div>

        {activeSection === "articles" ? <BlogAdminPanel /> : null}

        {activeSection === "comments" ? (
          <AdminCommentPanel
            comments={comments}
            activeStatus={activeStatus}
            error={error}
            isLoading={isLoading}
            actionId={actionId}
            onStatusChange={setActiveStatus}
            onApprove={(id) => void handleAction(id, "approve")}
            onReject={(id) => void handleAction(id, "reject")}
          />
        ) : null}
      </div>
    </section>
  );
}
