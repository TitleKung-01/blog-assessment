"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { credentialedFetch } from "@/lib/fetch";
import type { AdminComment, CommentStatus } from "@/types";

export function useAdminComments(activeStatus: CommentStatus, isReady: boolean) {
  const router = useRouter();
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/comments?status=${activeStatus}`,
        credentialedFetch,
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
    await fetch("/api/auth/sign-out", {
      ...credentialedFetch,
      method: "POST",
    });
    router.replace("/admin/sign-in");
    router.refresh();
  }

  async function handleAction(id: string, action: "approve" | "reject") {
    setActionId(id);
    setError(null);

    try {
      const response = await fetch(`/api/comments/${id}/${action}`, {
        ...credentialedFetch,
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

  return {
    comments,
    error,
    isLoading,
    actionId,
    loadComments,
    handleLogout,
    handleAction,
  };
}
