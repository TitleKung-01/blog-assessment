"use client";

import { motion } from "motion/react";
import { MessageCircle, MessagesSquare } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import type { PublicComment } from "@/types";

type CommentListProps = {
  comments: PublicComment[];
};

function getDisplayName(comment: PublicComment) {
  return comment.user?.name?.trim() || comment.name?.trim() || "ผู้เยี่ยมชม";
}

function getInitial(comment: PublicComment) {
  const displayName = getDisplayName(comment);
  return displayName[0]?.toUpperCase() ?? "?";
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <EmptyState
        icon={MessagesSquare}
        message="ยังไม่มีคอมเมนต์ที่ได้รับการอนุมัติ เป็นคนแรกที่แสดงความคิดเห็นได้เลย"
        className="py-14"
      />
    );
  }

  return (
    <ul className="flex flex-col gap-5">
      {comments.map((comment, index) => (
        <motion.li
          key={comment.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
        >
          <article className="rounded-xl bg-surface/60 p-5 shadow-soft transition-shadow hover:shadow-soft-hover">
            <div className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-fuchsia-500 text-sm font-semibold text-primary-foreground">
                {getInitial(comment)}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <MessageCircle className="size-3.5 text-muted-foreground" />
                    {getDisplayName(comment)}
                  </span>
                  <time
                    dateTime={new Date(comment.createdAt).toISOString()}
                    className="text-xs text-muted-foreground"
                  >
                    {new Date(comment.createdAt).toLocaleString("th-TH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </div>
                <p className="whitespace-pre-wrap leading-[1.85] text-foreground/90">
                  {comment.content}
                </p>
              </div>
            </div>
          </article>
        </motion.li>
      ))}
    </ul>
  );
}
