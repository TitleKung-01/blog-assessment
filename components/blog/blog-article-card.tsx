import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, ImageIcon } from "lucide-react";

import { estimateReadMinutes } from "@/lib/blog-utils";
import type { BlogArticleListItem } from "@/types";

type BlogArticleCardProps = {
  article: BlogArticleListItem;
};

export function BlogArticleCard({ article }: BlogArticleCardProps) {
  const readMinutes = estimateReadMinutes(`${article.summary} ${article.title}`);

  return (
    <article className="group">
      <Link
        href={`/blog/${article.slug}`}
        className="flex flex-col gap-5 sm:flex-row sm:items-start"
      >
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-52">
          {article.coverUrl ? (
            <Image
              src={article.coverUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, 208px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-fuchsia-500/5 text-muted-foreground">
              <ImageIcon className="size-8 opacity-50" aria-hidden />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2.5 py-0.5">
          <h2 className="text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
            {article.title}
          </h2>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.summary}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <time
              dateTime={article.publishedAt.toISOString()}
              className="inline-flex items-center gap-1.5"
            >
              <CalendarDays className="size-3.5" />
              {article.publishedAt.toLocaleDateString("th-TH", {
                dateStyle: "long",
              })}
            </time>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5" />
              อ่านประมาณ {readMinutes} นาที
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
