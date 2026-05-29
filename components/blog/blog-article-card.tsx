import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ImageIcon } from "lucide-react";

import type { BlogArticleListItem } from "@/lib/blog-queries";
import { Card, CardContent } from "@/components/ui/card";

type BlogArticleCardProps = {
  article: BlogArticleListItem;
};

export function BlogArticleCard({ article }: BlogArticleCardProps) {
  return (
    <Card className="overflow-hidden py-0 transition-shadow hover:shadow-lg hover:shadow-primary/10">
      <Link href={`/blog/${article.slug}`} className="group flex flex-col sm:flex-row">
        <div className="relative aspect-[16/10] w-full shrink-0 bg-muted sm:w-56 md:w-64">
          {article.coverUrl ? (
            <Image
              src={article.coverUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 256px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-fuchsia-500/10 text-muted-foreground">
              <ImageIcon className="size-10 opacity-60" aria-hidden />
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col gap-3 py-5">
          <h2 className="text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
            {article.title}
          </h2>
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {article.summary}
          </p>
          <time
            dateTime={article.publishedAt.toISOString()}
            className="mt-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <CalendarDays className="size-3.5" />
            {article.publishedAt.toLocaleDateString("th-TH", {
              dateStyle: "long",
            })}
          </time>
        </CardContent>
      </Link>
    </Card>
  );
}
