"use client";

import Link from "next/link";
import {
  CalendarDays,
  Eye,
  EyeOff,
  ExternalLink,
  FilePlus2,
  FileText,
  ImageIcon,
  Loader2,
  Plus,
  Save,
} from "lucide-react";

import { MAX_BLOG_GALLERY_IMAGES } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AdminArticle, EditorMode } from "@/types";

type BlogArticleEditorProps = {
  form: AdminArticle;
  mode: EditorMode;
  isSaving: boolean;
  hasExistingArticles: boolean;
  onFieldChange: <K extends keyof AdminArticle>(
    key: K,
    value: AdminArticle[K],
  ) => void;
  onSlugTouched: () => void;
  onGalleryImageChange: (index: number, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function BlogArticleEditor({
  form,
  mode,
  isSaving,
  hasExistingArticles,
  onFieldChange,
  onSlugTouched,
  onGalleryImageChange,
  onSave,
  onCancel,
}: BlogArticleEditorProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-5 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-fuchsia-500 text-primary-foreground shadow-sm shadow-primary/30">
              {mode === "create" ? (
                <FilePlus2 className="size-4" />
              ) : (
                <FileText className="size-4" />
              )}
            </span>
            <div>
              <h3 className="text-base font-semibold">
                {mode === "create" ? "สร้างบทความใหม่" : "แก้ไขบทความ"}
              </h3>
              {mode === "edit" ? (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="size-3" />
                  {new Date(form.publishedAt).toLocaleDateString("th-TH", {
                    dateStyle: "medium",
                  })}
                  <span aria-hidden>·</span>
                  <Eye className="size-3" />
                  {form.viewCount.toLocaleString("th-TH")} views
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  กรอกข้อมูลแล้วกดเผยแพร่
                </p>
              )}
            </div>
          </div>
          {mode === "edit" && form.slug ? (
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href={`/blog/${form.slug}`} target="_blank">
                <ExternalLink className="size-4" />
                ดูหน้าบทความ
              </Link>
            </Button>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="title">ชื่อบทความ</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => onFieldChange("title", e.target.value)}
            placeholder="เช่น เริ่มต้นเขียนบล็อกอย่างมือโปร"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => {
                onSlugTouched();
                onFieldChange("slug", e.target.value);
              }}
              placeholder="my-first-post"
            />
            <p className="text-xs text-muted-foreground">/blog/{form.slug || "…"}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="published">สถานะการเผยแพร่</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={form.isPublished ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => onFieldChange("isPublished", true)}
              >
                <Eye className="size-4" />
                เผยแพร่
              </Button>
              <Button
                type="button"
                variant={!form.isPublished ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => onFieldChange("isPublished", false)}
              >
                <EyeOff className="size-4" />
                ซ่อน
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="summary">สรุปเนื้อหา</Label>
          <Textarea
            id="summary"
            rows={2}
            value={form.summary}
            onChange={(e) => onFieldChange("summary", e.target.value)}
            placeholder="สรุปสั้น ๆ ที่จะแสดงในหน้ารวมบทความ"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="content">เนื้อหาเต็ม</Label>
          <Textarea
            id="content"
            rows={10}
            value={form.content}
            onChange={(e) => onFieldChange("content", e.target.value)}
            placeholder="เขียนเนื้อหาบทความที่นี่..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="cover">URL ภาพปก</Label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <Input
              id="cover"
              value={form.coverUrl ?? ""}
              onChange={(e) =>
                onFieldChange("coverUrl", e.target.value.trim() || null)
              }
              placeholder="https://..."
              className="flex-1"
            />
            <div
              className="flex h-20 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted bg-cover bg-center text-muted-foreground sm:w-32"
              style={
                form.coverUrl
                  ? { backgroundImage: `url("${form.coverUrl}")` }
                  : undefined
              }
            >
              {form.coverUrl ? null : <ImageIcon className="size-5 opacity-60" />}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label>รูปภาพเพิ่มเติม (สูงสุด {MAX_BLOG_GALLERY_IMAGES} รูป)</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {Array.from({ length: MAX_BLOG_GALLERY_IMAGES }).map((_, index) => (
              <Input
                key={index}
                value={form.images[index] ?? ""}
                onChange={(e) => onGalleryImageChange(index, e.target.value)}
                placeholder={`URL รูปที่ ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
          <Button onClick={onSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : mode === "create" ? (
              <Plus className="size-4" />
            ) : (
              <Save className="size-4" />
            )}
            {mode === "create" ? "สร้างบทความ" : "บันทึกการแก้ไข"}
          </Button>
          {mode === "create" && hasExistingArticles ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSaving}
            >
              ยกเลิก
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
