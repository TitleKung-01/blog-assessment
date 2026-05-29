export type BlogArticleListItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverUrl: string | null;
  publishedAt: Date;
  viewCount: number;
};

export type BlogArticleQueryResult = {
  articles: BlogArticleListItem[];
  total: number;
  page: number;
  totalPages: number;
};

export type AdminArticle = {
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

export type EditorMode = "create" | "edit";

export function createEmptyAdminArticle(): AdminArticle {
  return {
    id: "",
    title: "",
    slug: "",
    summary: "",
    content: "",
    coverUrl: null,
    images: [],
    viewCount: 0,
    isPublished: true,
    publishedAt: new Date().toISOString(),
  };
}
