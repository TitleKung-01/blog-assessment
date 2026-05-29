import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, Clock, MessageSquareText } from "lucide-react";

import { CommentForm } from "@/components/CommentForm";
import { CommentList } from "@/components/CommentList";
import { AnimatedGradientText } from "@/components/magic/animated-gradient-text";
import { AuroraBackground } from "@/components/magic/aurora-background";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: slug,
    description: `อ่านบทความ: ${slug}`,
  };
}

async function getApprovedComments(slug: string) {
  return prisma.comment.findMany({
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
}

function toTitle(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const comments = await getApprovedComments(slug);

  return (
    <div className="flex flex-col">
      <AuroraBackground
        showRadialGradient={false}
        className="border-b border-border/60 px-6 pb-14 pt-12"
      >
        <article className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            กลับหน้าแรก
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">บทความ</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              {new Date().toLocaleDateString("th-TH", { dateStyle: "long" })}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              อ่าน 3 นาที
            </span>
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            <AnimatedGradientText>{toTitle(slug)}</AnimatedGradientText>
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            เนื้อหาบทความจะแสดงที่นี่ ด้านล่างคือพื้นที่แสดงความคิดเห็นที่ต้องผ่านการอนุมัติก่อนเผยแพร่
          </p>
        </article>
      </AuroraBackground>

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-14">
        <div className="prose-zinc max-w-none leading-8 text-foreground/90">
          <p>
            ยินดีต้อนรับสู่ Aurora Blog บทความนี้เป็นตัวอย่างสำหรับสาธิตระบบคอมเมนต์
            ที่ผู้อ่านสามารถมีส่วนร่วมได้อย่างปลอดภัย
            โดยทุกความคิดเห็นจะถูกตรวจสอบโดยผู้ดูแลก่อนแสดงต่อสาธารณะ
          </p>
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
