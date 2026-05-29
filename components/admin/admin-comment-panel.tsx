"use client";

import { AnimatePresence } from "motion/react";
import { Inbox } from "lucide-react";

import { AdminCommentCard } from "@/components/admin/admin-comment-card";
import { AlertMessage } from "@/components/feedback/alert-message";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminComment, CommentStatus } from "@/types";
import { commentFilterTabs } from "@/types";

type AdminCommentPanelProps = {
  comments: AdminComment[];
  activeStatus: CommentStatus;
  error: string | null;
  isLoading: boolean;
  actionId: string | null;
  onStatusChange: (status: CommentStatus) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export function AdminCommentPanel({
  comments,
  activeStatus,
  error,
  isLoading,
  actionId,
  onStatusChange,
  onApprove,
  onReject,
}: AdminCommentPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {commentFilterTabs.map((tab) => (
          <Button
            key={tab.status}
            variant={activeStatus === tab.status ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusChange(tab.status)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {error ? <AlertMessage variant="error" animated>{error}</AlertMessage> : null}

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((index) => (
            <Card key={index} className="border-border/50 shadow-soft">
              <CardContent className="flex flex-col gap-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <EmptyState icon={Inbox} message="ไม่มีคอมเมนต์ในหมวดนี้" />
      ) : (
        <ul className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {comments.map((comment, index) => (
              <AdminCommentCard
                key={comment.id}
                comment={comment}
                index={index}
                isActing={actionId === comment.id}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
