import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeGalleryImages } from "@/lib/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { id } = await context.params;

  const article = await prisma.blogArticle.findUnique({
    where: { id },
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
      updatedAt: true,
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({ article });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const data: {
    title?: string;
    slug?: string;
    summary?: string;
    content?: string;
    coverUrl?: string | null;
    images?: string[];
    isPublished?: boolean;
  } = {};

  if ("title" in body && typeof body.title === "string") {
    data.title = body.title.trim();
  }
  if ("slug" in body && typeof body.slug === "string") {
    data.slug = body.slug.trim();
  }
  if ("summary" in body && typeof body.summary === "string") {
    data.summary = body.summary.trim();
  }
  if ("content" in body && typeof body.content === "string") {
    data.content = body.content.trim();
  }
  if ("coverUrl" in body) {
    data.coverUrl =
      typeof body.coverUrl === "string" ? body.coverUrl.trim() || null : null;
  }
  if ("images" in body && Array.isArray(body.images)) {
    data.images = normalizeGalleryImages(
      body.images.filter((item): item is string => typeof item === "string"),
    );
  }
  if ("isPublished" in body && typeof body.isPublished === "boolean") {
    data.isPublished = body.isPublished;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  if (data.slug) {
    const existing = await prisma.blogArticle.findFirst({
      where: { slug: data.slug, NOT: { id } },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  try {
    const article = await prisma.blogArticle.update({
      where: { id },
      data,
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
        updatedAt: true,
      },
    });

    return NextResponse.json({ article });
  } catch {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
}
