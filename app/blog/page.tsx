import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

import { BlogArticleCard } from "@/components/blog/blog-article-card";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { BlogSearchForm } from "@/components/blog/blog-search-form";
import { getBlogArticles } from "@/lib/blog-queries";
import { withPrisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "หน้ารวม Blog",
  description: "อ่านบทความทั้งหมด ค้นหาจากชื่อเรื่อง และเลื่อนดูทีละ 10 รายการ",
};

type BlogIndexPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

function parsePage(value: string | undefined) {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export default async function BlogIndexPage({ searchParams }: BlogIndexPageProps) {
  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const page = parsePage(pageParam);

  const { articles, total, page: currentPage, totalPages } = await withPrisma(
    (prisma) => getBlogArticles(prisma, { query, page }),
  );

  return (
    <div className="flex flex-col">
      <section className="border-b border-border/60 bg-gradient-to-b from-primary/5 to-background px-6 pb-10 pt-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground shadow-md shadow-primary/30">
              <BookOpen className="size-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                หน้ารวม Blog
              </h1>
              <p className="text-sm text-muted-foreground">
                แสดงบทความทั้งหมด พร้อมค้นหาชื่อเรื่องและแบ่งหน้าทีละ 10 รายการ
              </p>
            </div>
          </div>

          <BlogSearchForm initialQuery={query} />
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
        {query ? (
          <p className="text-sm text-muted-foreground">
            ผลการค้นหา &quot;{query}&quot; — พบ{" "}
            {total.toLocaleString("th-TH")} บทความ
          </p>
        ) : null}

        {articles.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              {query
                ? "ไม่พบบทความที่ตรงกับคำค้นหา"
                : "ยังไม่มีบทความในระบบ"}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-5">
            {articles.map((article) => (
              <li key={article.id}>
                <BlogArticleCard article={article} />
              </li>
            ))}
          </ul>
        )}

        <BlogPagination
          page={currentPage}
          totalPages={totalPages}
          query={query}
          total={total}
        />
      </main>
    </div>
  );
}
