import { isAdminAuthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { isThaiText } from "@/lib/validation";
import { NextResponse } from "next/server";

const ADMIN_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();
  const status = searchParams.get("status")?.trim().toUpperCase();

  if (
    status &&
    ADMIN_STATUSES.includes(status as (typeof ADMIN_STATUSES)[number])
  ) {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        status: status as (typeof ADMIN_STATUSES)[number],
        ...(slug ? { slug } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  }

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: {
      slug,
      status: "APPROVED",
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ comments });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const content =
    typeof body === "object" &&
    body !== null &&
    "content" in body &&
    typeof body.content === "string"
      ? body.content.trim()
      : "";
  const slug =
    typeof body === "object" &&
    body !== null &&
    "slug" in body &&
    typeof body.slug === "string"
      ? body.slug.trim()
      : "";

  if (!content || !slug) {
    return NextResponse.json(
      { error: "content and slug are required" },
      { status: 400 },
    );
  }

  if (!isThaiText(content)) {
    return NextResponse.json(
      { error: "Comments must be written in Thai" },
      { status: 400 },
    );
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      slug,
      status: "PENDING",
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    {
      message: "Comment submitted and pending approval",
      comment,
    },
    { status: 201 },
  );
}
