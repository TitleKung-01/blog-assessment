"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Loader2, Save } from "lucide-react";

import { MAX_BLOG_GALLERY_IMAGES } from "@/lib/validation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type AdminArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverUrl: string | null;
  images: string[];
  viewCount: number;
  isPublished: boolean;
  publishedAt: string;
};

const fetchOptions: RequestInit = { credentials: "include" };

export function BlogAdminPanel() {
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/blog", fetchOptions);
      const data = (await response.json()) as {
        articles?: AdminArticle[];
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "ไม่สามารถโหลดบทความได้");
        return;
      }

      const list = data.articles ?? [];
      setArticles(list);
      if (list.length > 0) {
        setSelectedId((current) => current ?? list[0]!.id);
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    const selected = articles.find((article) => article.id === selectedId);
    setForm(selected ? { ...selected, images: [...selected.images] } : null);
    setSuccess(null);
  }, [selectedId, articles]);

  function updateField<K extends keyof AdminArticle>(
    key: K,
    value: AdminArticle[K],
  ) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
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

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/blog/${form.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          summary: form.summary,
          content: form.content,
          coverUrl: form.coverUrl,
          images: form.images.filter((url) => url.trim()),
          isPublished: form.isPublished,
        }),
      });

      const data = (await response.json()) as {
        article?: AdminArticle;
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "ไม่สามารถบันทึกได้");
        return;
      }

      if (data.article) {
        setArticles((current) =>
          current.map((item) =>
            item.id === data.article!.id ? data.article! : item,
          ),
        );
        setForm(data.article);
      }

      setSuccess("บันทึกบทความแล้ว");
    } catch {
      setError("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">กำลังโหลดบทความ...</p>;
  }

  if (articles.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        ยังไม่มีบทความในระบบ รัน `npm run db:seed` เพื่อเพิ่มข้อมูลตัวอย่าง
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          {success}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card>
          <CardContent className="flex flex-col gap-2 py-4">
            <p className="text-sm font-medium">รายการบทความ</p>
            {articles.map((article) => (
              <button
                key={article.id}
                type="button"
                onClick={() => setSelectedId(article.id)}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  selectedId === article.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <span className="line-clamp-2 font-medium">{article.title}</span>
                <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge
                    variant={article.isPublished ? "success" : "warning"}
                    className="px-1.5 py-0"
                  >
                    {article.isPublished ? "เผยแพร่" : "ซ่อน"}
                  </Badge>
                  {article.viewCount.toLocaleString("th-TH")} views
                </span>
              </button>
            ))}
          </CardContent>
        </Card>

        {form ? (
          <Card>
            <CardContent className="flex flex-col gap-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">แก้ไขบทความ</h2>
                  <p className="text-xs text-muted-foreground">
                    วันที่โพสต์:{" "}
                    {new Date(form.publishedAt).toLocaleString("th-TH")} · Views:{" "}
                    {form.viewCount.toLocaleString("th-TH")} (แก้ไขไม่ได้)
                  </p>
                </div>
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <Link href={`/blog/${form.slug}`} target="_blank">
                    <ExternalLink className="size-4" />
                    ดูหน้าบทความ
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="title">ชื่อบทความ</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="published">สถานะ</Label>
                  <select
                    id="published"
                    value={form.isPublished ? "published" : "draft"}
                    onChange={(e) =>
                      updateField("isPublished", e.target.value === "published")
                    }
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="published">เผยแพร่</option>
                    <option value="draft">ซ่อน (Unpublish)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="summary">สรุปเนื้อหา</Label>
                <Textarea
                  id="summary"
                  rows={2}
                  value={form.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="content">เนื้อหาเต็ม</Label>
                <Textarea
                  id="content"
                  rows={8}
                  value={form.content}
                  onChange={(e) => updateField("content", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cover">URL ภาพปก</Label>
                <Input
                  id="cover"
                  value={form.coverUrl ?? ""}
                  onChange={(e) =>
                    updateField("coverUrl", e.target.value.trim() || null)
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="flex flex-col gap-3">
                <Label>รูปภาพเพิ่มเติม (สูงสุด {MAX_BLOG_GALLERY_IMAGES} รูป)</Label>
                {Array.from({ length: MAX_BLOG_GALLERY_IMAGES }).map((_, index) => (
                  <Input
                    key={index}
                    value={form.images[index] ?? ""}
                    onChange={(e) => updateGalleryImage(index, e.target.value)}
                    placeholder={`URL รูปที่ ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="self-start gap-2"
              >
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                บันทึกการแก้ไข
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
