import type { PrismaClient } from "@/app/generated/prisma/client";
import type {
  BlogArticleListItem,
  BlogArticleQueryResult,
} from "@/types/blog";

export const BLOG_PAGE_SIZE = 10;
export type { BlogArticleListItem, BlogArticleQueryResult };

const listSelect = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  coverUrl: true,
  publishedAt: true,
  viewCount: true,
} as const;

function normalizePage(page: number) {
  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}

function buildPublicWhere(query: string) {
  return {
    isPublished: true,
    ...(query.length > 0
      ? {
          title: {
            contains: query,
            mode: "insensitive" as const,
          },
        }
      : {}),
  };
}

export async function getBlogArticles(
  prisma: PrismaClient,
  options: { query?: string; page?: number },
): Promise<BlogArticleQueryResult> {
  const page = normalizePage(options.page ?? 1);
  const query = options.query?.trim() ?? "";
  const where = buildPublicWhere(query);

  const [total, articles] = await Promise.all([
    prisma.blogArticle.count({ where }),
    prisma.blogArticle.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * BLOG_PAGE_SIZE,
      take: BLOG_PAGE_SIZE,
      select: listSelect,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  if (safePage !== page && total > 0) {
    const correctedArticles = await prisma.blogArticle.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (safePage - 1) * BLOG_PAGE_SIZE,
      take: BLOG_PAGE_SIZE,
      select: listSelect,
    });

    return {
      articles: correctedArticles,
      total,
      page: safePage,
      totalPages,
    };
  }

  return {
    articles,
    total,
    page: safePage,
    totalPages,
  };
}

export async function getBlogArticleBySlug(
  prisma: PrismaClient,
  slug: string,
  options: { includeUnpublished?: boolean } = {},
) {
  const article = await prisma.blogArticle.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      content: true,
      coverUrl: true,
      images: true,
      viewCount: true,
      isPublished: true,
      publishedAt: true,
    },
  });

  if (!article) return null;
  if (!options.includeUnpublished && !article.isPublished) return null;

  return article;
}

export async function incrementBlogViewCount(
  prisma: PrismaClient,
  id: string,
) {
  return prisma.blogArticle.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
    select: { viewCount: true },
  });
}

export function buildBlogListHref(query: string, page: number) {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set("q", query.trim());
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const search = params.toString();
  return search ? `/blog?${search}` : "/blog";
}
