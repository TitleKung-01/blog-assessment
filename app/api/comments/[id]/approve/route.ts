import { isAdminAuthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type ApproveCommentRouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: ApproveCommentRouteProps,
) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.comment.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  if (existing.status !== "PENDING") {
    return NextResponse.json(
      { error: "Only pending comments can be approved" },
      { status: 400 },
    );
  }

  const comment = await prisma.comment.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  return NextResponse.json({
    message: "Comment approved",
    comment,
  });
}
