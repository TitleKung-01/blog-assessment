"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  Check,
  Inbox,
  KeyRound,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";

import { ADMIN_STORAGE_KEY, getAdminAuthHeaders } from "@/lib/admin";
import { BorderBeam } from "@/components/magic/border-beam";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CommentStatus = "PENDING" | "APPROVED" | "REJECTED";

type AdminComment = {
  id: string;
  content: string;
  slug: string;
  status: CommentStatus;
  createdAt: string;
};

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

export function AdminDashboard() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState("");
  const [activeStatus, setActiveStatus] = useState<CommentStatus>("PENDING");
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate auth key from client-only sessionStorage on mount
      setApiKey(stored);
    }
  }, []);

  const loadComments = useCallback(async () => {
    if (!apiKey) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments?status=${activeStatus}`, {
        headers: getAdminAuthHeaders(apiKey),
      });
      const data = (await response.json()) as {
        comments?: AdminComment[];
        error?: string;
      };

      if (!response.ok) {
        if (response.status === 401) {
          sessionStorage.removeItem(ADMIN_STORAGE_KEY);
          setApiKey(null);
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
  }, [activeStatus, apiKey]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- refetch comments when api key or active status changes
    void loadComments();
  }, [loadComments]);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = inputKey.trim();

    if (!trimmed) {
      return;
    }

    sessionStorage.setItem(ADMIN_STORAGE_KEY, trimmed);
    setApiKey(trimmed);
    setInputKey("");
  }

  function handleLogout() {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setApiKey(null);
    setComments([]);
    setError(null);
  }

  async function handleAction(id: string, action: "approve" | "reject") {
    if (!apiKey) {
      return;
    }

    setActionId(id);
    setError(null);

    try {
      const response = await fetch(`/api/comments/${id}/${action}`, {
        method: "PATCH",
        headers: getAdminAuthHeaders(apiKey),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
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

  if (!apiKey) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto w-full max-w-md"
      >
        <Card className="relative overflow-hidden">
          <CardContent className="flex flex-col gap-6 py-2">
            <div className="flex flex-col gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground shadow-md shadow-primary/30">
                <KeyRound className="size-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  เข้าสู่ระบบผู้ดูแล
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  ใส่ค่า{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    ADMIN_API_KEY
                  </code>{" "}
                  จากไฟล์ .env เพื่อจัดการคอมเมนต์
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="admin-key">Admin API Key</Label>
                <Input
                  id="admin-key"
                  type="password"
                  value={inputKey}
                  onChange={(event) => setInputKey(event.target.value)}
                  placeholder="Bearer key"
                />
              </div>
              <Button type="submit" size="lg" className="gap-2">
                <ShieldCheck className="size-4" />
                เข้าสู่ระบบ
              </Button>
            </form>
          </CardContent>
          <BorderBeam size={140} duration={10} />
        </Card>
      </motion.div>
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
              อนุมัติหรือปฏิเสธคอมเมนต์ที่รอตรวจสอบ
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
            onClick={handleLogout}
            className="gap-1.5"
          >
            <LogOut className="size-4" />
            ออกจากระบบ
          </Button>
        </div>
      </div>

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
                            {comment.slug}
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
    </section>
  );
}
