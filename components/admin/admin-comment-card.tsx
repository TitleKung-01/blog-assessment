"use client";

import { motion } from "motion/react";
import { Check, Loader2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminComment } from "@/types";
import { commentStatusMeta } from "@/types";

type AdminCommentCardProps = {
  comment: AdminComment;
  index: number;
  isActing: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export function AdminCommentCard({
  comment,
  index,
  isActing,
  onApprove,
  onReject,
}: AdminCommentCardProps) {
  const meta = commentStatusMeta[comment.status];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, height: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Card className="border-border/50 shadow-soft transition-shadow hover:shadow-soft-hover">
        <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant={meta.variant}>{meta.label}</Badge>
              <Badge variant="outline" className="font-mono text-xs">
                /blog/{comment.slug}
              </Badge>
              <Badge variant="secondary">
                {comment.user?.name ?? comment.name}
              </Badge>
            </div>
            <p className="whitespace-pre-wrap leading-[1.85] text-card-foreground">
              {comment.content}
            </p>
            <time
              dateTime={comment.createdAt}
              className="mt-2 block text-xs text-muted-foreground"
            >
              {new Date(comment.createdAt).toLocaleString("th-TH", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </time>
          </div>

          {comment.status === "PENDING" ? (
            <div className="flex shrink-0 gap-2">
              <Button
                size="sm"
                disabled={isActing}
                onClick={() => onApprove(comment.id)}
                className="gap-1.5"
              >
                {isActing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                อนุมัติ
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={isActing}
                onClick={() => onReject(comment.id)}
                className="gap-1.5"
              >
                <X className="size-4" />
                ปฏิเสธ
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.li>
  );
}
