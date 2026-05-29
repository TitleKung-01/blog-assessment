import type { Metadata } from "next";

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
      <section className="border-b border-border/50 px-6 pb-12 pt-14">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium uppercase tracking-widest text-primary/80">
              Aurora Blog
            </p>
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              บทความทั้งหมด
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              ค้นหาและอ่านบทความที่คัดสรร
              {total > 0
                ? ` — มี ${total.toLocaleString("th-TH")} บทความในระบบ`
                : ""}
            </p>
          </div>

          <BlogSearchForm initialQuery={query} />
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-4xl flex-col px-6 py-12">
        {query ? (
          <p className="mb-8 text-sm text-muted-foreground">
            ผลการค้นหา &quot;{query}&quot; — พบ{" "}
            {total.toLocaleString("th-TH")} บทความ
          </p>
        ) : null}

        {articles.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/70 bg-surface/50 px-6 py-20 text-center">
            <p className="text-sm text-muted-foreground">
              {query
                ? "ไม่พบบทความที่ตรงกับคำค้นหา"
                : "ยังไม่มีบทความในระบบ"}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border/50">
            {articles.map((article) => (
              <li key={article.id} className="py-6 first:pt-0 last:pb-0">
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
