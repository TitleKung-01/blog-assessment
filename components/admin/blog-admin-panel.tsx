"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Plus } from "lucide-react";

import { BlogArticleEditor } from "@/components/admin/blog-article-editor";
import { BlogArticleList } from "@/components/admin/blog-article-list";
import { AlertMessage } from "@/components/feedback/alert-message";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { credentialedFetch } from "@/lib/fetch";
import { slugify } from "@/lib/validation";
import type { AdminArticle, EditorMode } from "@/types";
import { createEmptyAdminArticle } from "@/types";

export function BlogAdminPanel() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<EditorMode>("edit");
  const [form, setForm] = useState<AdminArticle | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/blog", credentialedFetch);
        const data = (await response.json()) as {
          articles?: AdminArticle[];
          error?: string;
        };

        if (cancelled) return;

        if (!response.ok) {
          setError(data.error ?? "ไม่สามารถโหลดบทความได้");
          return;
        }

        const list = data.articles ?? [];
        setArticles(list);
        const first = list[0];
        if (first) {
          setSelectedId(first.id);
          setForm({ ...first, images: [...first.images] });
        }
      } catch {
        if (!cancelled) setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const publishedCount = useMemo(
    () => articles.filter((article) => article.isPublished).length,
    [articles],
  );

  function startCreate() {
    setMode("create");
    setSelectedId(null);
    setForm(createEmptyAdminArticle());
    setSlugTouched(false);
    setError(null);
    setSuccess(null);
  }

  function selectArticle(id: string) {
    const found = articles.find((article) => article.id === id);
    setMode("edit");
    setSelectedId(id);
    setForm(found ? { ...found, images: [...found.images] } : null);
    setSlugTouched(true);
    setError(null);
    setSuccess(null);
  }

  function updateField<K extends keyof AdminArticle>(
    key: K,
    value: AdminArticle[K],
  ) {
    setForm((current) => {
      if (!current) return current;
      const next = { ...current, [key]: value };
      if (mode === "create" && key === "title" && !slugTouched) {
        next.slug = slugify(value as string);
      }
      return next;
    });
    setSuccess(null);
  }

  function updateGalleryImage(index: number, value: string) {
    setForm((current) => {
      if (!current) return current;
      const images = [...current.images];
      while (images.length <= index) images.push("");
      images[index] = value;
      return { ...current, images };
    });
    setSuccess(null);
  }

  async function handleSave() {
    if (!form) return;

    if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
      setError("กรุณากรอกชื่อบทความ สรุปเนื้อหา และเนื้อหาให้ครบถ้วน");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      content: form.content,
      coverUrl: form.coverUrl,
      images: form.images.filter((url) => url.trim()),
      isPublished: form.isPublished,
    };

    try {
      const response = await fetch(
        mode === "create" ? "/api/blog" : `/api/blog/${form.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = (await response.json()) as {
        article?: AdminArticle;
        error?: string;
      };

      if (!response.ok || !data.article) {
        setError(data.error ?? "ไม่สามารถบันทึกได้");
        return;
      }

      const saved = data.article;

      setArticles((current) => {
        const exists = current.some((item) => item.id === saved.id);
        return exists
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...current];
      });

      setMode("edit");
      setSelectedId(saved.id);
      setForm({ ...saved, images: [...saved.images] });
      setSlugTouched(true);
      setSuccess(mode === "create" ? "สร้างบทความใหม่แล้ว" : "บันทึกบทความแล้ว");
    } catch {
      setError("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">จัดการบทความ</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ทั้งหมด {articles.length.toLocaleString("th-TH")} บทความ ·
            เผยแพร่ {publishedCount.toLocaleString("th-TH")} · ซ่อน{" "}
            {(articles.length - publishedCount).toLocaleString("th-TH")}
          </p>
        </div>
        <Button onClick={startCreate} className="gap-1.5">
          <Plus className="size-4" />
          สร้างบทความใหม่
        </Button>
      </div>

      {error ? (
        <AlertMessage variant="error" className="rounded-xl py-3">
          {error}
        </AlertMessage>
      ) : null}
      {success ? (
        <AlertMessage variant="success" className="rounded-xl py-3">
          {success}
        </AlertMessage>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <BlogArticleList
          articles={articles}
          selectedId={selectedId}
          mode={mode}
          isLoading={isLoading}
          onSelect={selectArticle}
          onCreate={startCreate}
        />

        {form ? (
          <BlogArticleEditor
            form={form}
            mode={mode}
            isSaving={isSaving}
            hasExistingArticles={articles.length > 0}
            onFieldChange={updateField}
            onSlugTouched={() => setSlugTouched(true)}
            onGalleryImageChange={updateGalleryImage}
            onSave={() => void handleSave()}
            onCancel={() => selectArticle(articles[0]!.id)}
          />
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <FileText className="size-6" />
              </span>
              <p className="text-sm text-muted-foreground">
                เลือกบทความจากรายการ หรือสร้างบทความใหม่
              </p>
              <Button onClick={startCreate} className="gap-1.5">
                <Plus className="size-4" />
                สร้างบทความแรก
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
