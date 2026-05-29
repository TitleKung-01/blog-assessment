"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

import { isThaiText } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CommentFormProps = {
  slug: string;
};

const MAX_LENGTH = 1000;

export function CommentForm({ slug }: CommentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmed = content.trim();
  const hasNonThai = trimmed.length > 0 && !isThaiText(trimmed);
  const canSubmit = trimmed.length > 0 && !hasNonThai && !isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, slug }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "ไม่สามารถส่งคอมเมนต์ได้");
        return;
      }

      setContent("");
      setSuccess("ส่งคอมเมนต์แล้ว รอการอนุมัติจากผู้ดูแล");
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-primary/10 bg-gradient-to-br from-card to-accent/20">
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="comment" className="text-base">
              แสดงความคิดเห็น
            </Label>
            <p className="text-sm text-muted-foreground">
              กรุณาเขียนเป็นภาษาไทย คอมเมนต์จะแสดงหลังผู้ดูแลอนุมัติ
            </p>
          </div>

          <Textarea
            id="comment"
            name="content"
            rows={4}
            maxLength={MAX_LENGTH}
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              if (error) setError(null);
            }}
            aria-invalid={hasNonThai}
            placeholder="เขียนคอมเมนต์เป็นภาษาไทย..."
          />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <AnimatePresence mode="wait">
              {hasNonThai ? (
                <motion.span
                  key="thai-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1 text-destructive"
                >
                  <AlertCircle className="size-3.5" />
                  รองรับเฉพาะตัวอักษรภาษาไทย
                </motion.span>
              ) : (
                <span key="spacer" />
              )}
            </AnimatePresence>
            <span className="tabular-nums">
              {content.length}/{MAX_LENGTH}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {error ? (
              <motion.p
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
              >
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </motion.p>
            ) : success ? (
              <motion.p
                key="success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-sm text-success"
              >
                <CheckCircle2 className="size-4 shrink-0" />
                {success}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <Button type="submit" disabled={!canSubmit} className="self-start">
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                กำลังส่ง...
              </>
            ) : (
              <>
                <Send className="size-4" />
                ส่งคอมเมนต์
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
