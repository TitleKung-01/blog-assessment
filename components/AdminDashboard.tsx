"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  Check,
  Inbox,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";

import { BlogAdminPanel } from "@/components/admin/blog-admin-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CommentStatus = "PENDING" | "APPROVED" | "REJECTED";

type AdminComment = {
  id: string;
  name: string;
  content: string;
  slug: string;
  status: CommentStatus;
  createdAt: string;
  user?: { name: string; email: string } | null;
};

const sectionTabs = [
  { id: "articles", label: "จัดการบทความ" },
  { id: "comments", label: "จัดการคอมเมนต์" },
] as const;

type AdminSection = (typeof sectionTabs)[number]["id"];

const tabs: { label: string; status: CommentStatus }[] = [
  { label: "รออนุมัติ", status: "PENDING" },
  { label: "อนุมัติแล้ว", status: "APPROVED" },
  { label: "ถูกปฏิเสธ", status: "REJECTED" },
];

const statusMeta: Record<
  CommentStatus,
  { label: string; variant: "warning" | "success" | "destructive" }
> = {
  PENDING: { label: "รออนุมัติ", variant: "warning" },
  APPROVED: { label: "อนุมัติแล้ว", variant: "success" },
  REJECTED: { label: "ถูกปฏิเสธ", variant: "destructive" },
};

const fetchOptions: RequestInit = {
  credentials: "include",
};

export function AdminDashboard() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [activeSection, setActiveSection] =
    useState<AdminSection>("articles");
  const [activeStatus, setActiveStatus] = useState<CommentStatus>("PENDING");
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch("/api/auth/session", fetchOptions);
        const data = (await response.json()) as {
          authenticated?: boolean;
          user?: { role?: string };
        };

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

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/comments?status=${activeStatus}`,
        fetchOptions,
      );
      const data = (await response.json()) as {
        comments?: AdminComment[];
        error?: string;
      };

      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/admin/sign-in");
        }

        setError(data.error ?? "ไม่สามารถโหลดคอมเมนต์ได้");
        setComments([]);
        return;
      }

      setComments(data.comments ?? []);
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeStatus, router]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    void loadComments();
  }, [isReady, loadComments]);

  async function handleLogout() {
    await fetch("/api/auth/sign-out", { ...fetchOptions, method: "POST" });
    router.replace("/admin/sign-in");
    router.refresh();
  }

  async function handleAction(id: string, action: "approve" | "reject") {
    setActionId(id);
    setError(null);

    try {
      const response = await fetch(`/api/comments/${id}/${action}`, {
        ...fetchOptions,
        method: "PATCH",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/admin/sign-in");
        }

        setError(data.error ?? "ดำเนินการไม่สำเร็จ");
        return;
      }

      await loadComments();
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setActionId(null);
    }
  }

  if (!isReady) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground shadow-md shadow-primary/30">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              แดชบอร์ดผู้ดูแล
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              แก้ไขบทความ ควบคุมการเผยแพร่ และอนุมัติคอมเมนต์
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadComments()}
            disabled={isLoading}
            className="gap-1.5"
          >
            <RefreshCw
              className={`size-4 ${isLoading ? "animate-spin" : ""}`}
            />
            รีเฟรช
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void handleLogout()}
            className="gap-1.5"
          >
            <LogOut className="size-4" />
            ออกจากระบบ
          </Button>
        </div>
      </div>

      <Tabs
        value={activeSection}
        onValueChange={(value) => setActiveSection(value as AdminSection)}
      >
        <TabsList className="w-full sm:w-auto">
          {sectionTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {activeSection === "articles" ? <BlogAdminPanel /> : null}

      {activeSection === "comments" ? (
        <>
      <Tabs
        value={activeStatus}
        onValueChange={(value) => setActiveStatus(value as CommentStatus)}
      >
        <TabsList className="w-full sm:w-auto">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.status} value={tab.status}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((index) => (
            <Card key={index}>
              <CardContent className="flex flex-col gap-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Inbox className="size-6" />
          </span>
          <p className="text-sm text-muted-foreground">
            ไม่มีคอมเมนต์ในหมวดนี้
          </p>
        </motion.div>
      ) : (
        <ul className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {comments.map((comment, index) => {
              const meta = statusMeta[comment.status];
              const isActing = actionId === comment.id;
              return (
                <motion.li
                  key={comment.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, height: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                >
                  <Card className="transition-colors hover:border-primary/30">
                    <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge variant={meta.variant}>{meta.label}</Badge>
                          <Badge variant="outline" className="font-mono">
                            /blog/{comment.slug}
                          </Badge>
                          <Badge variant="secondary">
                            {comment.user?.name ?? comment.name}
                          </Badge>
                        </div>
                        <p className="whitespace-pre-wrap leading-7 text-card-foreground">
                          {comment.content}
                        </p>
                        <time
                          dateTime={comment.createdAt}
                          className="mt-2 block text-xs text-muted-foreground"
                        >
                          {new Date(comment.createdAt).toLocaleString("th-TH", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </time>
                      </div>

                      {comment.status === "PENDING" ? (
                        <div className="flex shrink-0 gap-2">
                          <Button
                            size="sm"
                            disabled={isActing}
                            onClick={() =>
                              void handleAction(comment.id, "approve")
                            }
                            className="gap-1.5"
                          >
                            {isActing ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Check className="size-4" />
                            )}
                            อนุมัติ
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={isActing}
                            onClick={() =>
                              void handleAction(comment.id, "reject")
                            }
                            className="gap-1.5"
                          >
                            <X className="size-4" />
                            ปฏิเสธ
                          </Button>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
        </>
      ) : null}
    </section>
  );
}
