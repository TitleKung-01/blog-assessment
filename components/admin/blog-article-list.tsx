"use client";

import { Eye, FilePlus2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AdminArticle, EditorMode } from "@/types";

type BlogArticleListProps = {
  articles: AdminArticle[];
  selectedId: string | null;
  mode: EditorMode;
  isLoading: boolean;
  onSelect: (id: string) => void;
  onCreate: () => void;
};

export function BlogArticleList({
  articles,
  selectedId,
  mode,
  isLoading,
  onSelect,
  onCreate,
}: BlogArticleListProps) {
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={onCreate}
        className={cn(
          "flex items-center gap-2 rounded-xl border border-dashed px-3 py-3 text-sm font-medium transition-colors",
          mode === "create"
            ? "border-primary bg-primary/5 text-primary"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
        )}
      >
        <FilePlus2 className="size-4" />
        บทความใหม่
      </button>

      {isLoading ? (
        <p className="px-1 text-sm text-muted-foreground">กำลังโหลดบทความ...</p>
      ) : articles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
          ยังไม่มีบทความ เริ่มจากปุ่ม “บทความใหม่”
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {articles.map((article) => {
            const isActive = mode === "edit" && selectedId === article.id;
            return (
              <button
                key={article.id}
                type="button"
                onClick={() => onSelect(article.id)}
                className={cn(
                  "rounded-xl border px-3 py-3 text-left text-sm transition-colors",
                  isActive
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30 hover:bg-accent/40",
                )}
              >
                <span className="line-clamp-2 font-medium leading-snug">
                  {article.title}
                </span>
                <span className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge
                    variant={article.isPublished ? "success" : "warning"}
                    className="px-1.5 py-0"
                  >
                    {article.isPublished ? "เผยแพร่" : "ซ่อน"}
                  </Badge>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="size-3" />
                    {article.viewCount.toLocaleString("th-TH")}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
