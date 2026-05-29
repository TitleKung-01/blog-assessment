import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const articles = await prisma.blogArticle.findMany({
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      coverUrl: true,
      images: true,
      viewCount: true,
      isPublished: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ articles });
}
