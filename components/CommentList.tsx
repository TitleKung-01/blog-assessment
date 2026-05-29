"use client";

import { motion } from "motion/react";
import { MessageCircle, MessagesSquare } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type CommentListItem = {
  id: string;
  name?: string;
  content: string;
  createdAt: Date;
  user?: { name: string } | null;
};

type CommentListProps = {
  comments: CommentListItem[];
};

function getDisplayName(comment: CommentListItem) {
  return comment.user?.name?.trim() || comment.name?.trim() || "ผู้เยี่ยมชม";
}

function getInitial(comment: CommentListItem) {
  const displayName = getDisplayName(comment);
  return displayName[0]?.toUpperCase() ?? "?";
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-12 text-center"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <MessagesSquare className="size-6" />
        </span>
        <p className="text-sm text-muted-foreground">
          ยังไม่มีคอมเมนต์ที่ได้รับการอนุมัติ เป็นคนแรกที่แสดงความคิดเห็นได้เลย
        </p>
      </motion.div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {comments.map((comment, index) => (
        <motion.li
          key={comment.id}
          initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
        >
          <Card className="gap-0 py-0 transition-colors hover:border-primary/30">
            <CardContent className="flex gap-4 py-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-fuchsia-500 text-sm font-semibold text-primary-foreground shadow-sm">
                {getInitial(comment)}
              </span>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MessageCircle className="size-3.5" />
                  <span className="font-medium text-foreground/80">
                    {getDisplayName(comment)}
                  </span>
                  <time dateTime={new Date(comment.createdAt).toISOString()}>
                    {new Date(comment.createdAt).toLocaleString("th-TH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </div>
                <p className="whitespace-pre-wrap leading-7 text-card-foreground">
                  {comment.content}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.li>
      ))}
    </ul>
  );
}
