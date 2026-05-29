import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  ImageIcon,
  MessageSquareText,
} from "lucide-react";

import { CommentForm } from "@/components/CommentForm";
import { CommentList } from "@/components/CommentList";
import { Badge } from "@/components/ui/badge";
import {
  getBlogArticleBySlug,
  incrementBlogViewCount,
} from "@/lib/blog-queries";
import { withPrisma } from "@/lib/prisma";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

async function getApprovedComments(slug: string) {
  return withPrisma((prisma) =>
    prisma.comment.findMany({
      where: { slug, status: "APPROVED" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    }),
  );
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await withPrisma((prisma) =>
    getBlogArticleBySlug(prisma, slug),
  );

  if (!article) {
    return { title: "ไม่พบบทความ" };
  }

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const article = await withPrisma(async (prisma) => {
    const found = await getBlogArticleBySlug(prisma, slug);
    if (!found) return null;
    await incrementBlogViewCount(prisma, found.id);
    return { ...found, viewCount: found.viewCount + 1 };
  });

  if (!article) {
    notFound();
  }

  const comments = await getApprovedComments(slug);

  return (
    <div className="flex flex-col">
      <section className="border-b border-border/60 bg-gradient-to-b from-primary/5 to-background px-6 pb-14 pt-12">
        <article className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            กลับหน้ารวม Blog
          </Link>

          {article.coverUrl ? (
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border bg-muted">
              <Image
                src={article.coverUrl}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          ) : (
            <div className="flex aspect-[21/9] w-full items-center justify-center rounded-2xl border border-dashed border-border bg-gradient-to-br from-primary/10 to-fuchsia-500/5 text-muted-foreground">
              <ImageIcon className="size-12 opacity-50" aria-hidden />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">บทความ</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              {article.publishedAt.toLocaleDateString("th-TH", {
                dateStyle: "long",
              })}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="size-3.5" />
              {article.viewCount.toLocaleString("th-TH")} ครั้ง
            </span>
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight text-primary sm:text-5xl">
            {article.title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            {article.summary}
          </p>
        </article>
      </section>

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-14">
        {article.images.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {article.images.map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"
              >
                <Image
                  src={imageUrl}
                  alt={`${article.title} รูปที่ ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 360px"
                />
              </div>
            ))}
          </div>
        ) : null}

        <div className="prose-zinc max-w-none whitespace-pre-wrap leading-8 text-foreground/90">
          {article.content}
        </div>

        <section aria-label="Comments" className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <MessageSquareText className="size-5 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight">
              ความคิดเห็น
            </h2>
            <Badge variant="outline" className="ml-1">
              {comments.length}
            </Badge>
          </div>

          <CommentList comments={comments} />
          <CommentForm slug={slug} />
        </section>
      </main>
    </div>
  );
}
