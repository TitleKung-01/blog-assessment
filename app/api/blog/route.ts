import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeGalleryImages, slugify } from "@/lib/validation";

const articleSelect = {
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
  updatedAt: true,
} as const;

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const articles = await prisma.blogArticle.findMany({
    orderBy: { publishedAt: "desc" },
    select: articleSelect,
  });

  return NextResponse.json({ articles });
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const summary = typeof raw.summary === "string" ? raw.summary.trim() : "";
  const content = typeof raw.content === "string" ? raw.content.trim() : "";
  const slugInput = typeof raw.slug === "string" ? raw.slug.trim() : "";
  const coverUrl =
    typeof raw.coverUrl === "string" && raw.coverUrl.trim()
      ? raw.coverUrl.trim()
      : null;
  const images = Array.isArray(raw.images)
    ? normalizeGalleryImages(
        raw.images.filter((item): item is string => typeof item === "string"),
      )
    : [];
  const isPublished =
    typeof raw.isPublished === "boolean" ? raw.isPublished : true;

  if (!title || !summary || !content) {
    return NextResponse.json(
      { error: "กรุณากรอกชื่อบทความ สรุปเนื้อหา และเนื้อหาให้ครบถ้วน" },
      { status: 400 },
    );
  }

  const slug = slugify(slugInput || title) || `article-${Date.now()}`;

  const existing = await prisma.blogArticle.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Slug นี้ถูกใช้แล้ว กรุณาเปลี่ยนใหม่" },
      { status: 409 },
    );
  }

  const article = await prisma.blogArticle.create({
    data: { title, slug, summary, content, coverUrl, images, isPublished },
    select: articleSelect,
  });

  return NextResponse.json({ article }, { status: 201 });
}
