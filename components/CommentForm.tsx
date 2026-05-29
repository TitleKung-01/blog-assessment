"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

import { isThaiAndNumbers } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CommentFormProps = {
  slug: string;
};

const MAX_LENGTH = 1000;

export function CommentForm({ slug }: CommentFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedName = name.trim();
  const trimmedContent = content.trim();
  const hasInvalidName =
    trimmedName.length > 0 && !isThaiAndNumbers(trimmedName);
  const hasInvalidContent =
    trimmedContent.length > 0 && !isThaiAndNumbers(trimmedContent);
  const canSubmit =
    trimmedName.length > 0 &&
    trimmedContent.length > 0 &&
    !hasInvalidName &&
    !hasInvalidContent &&
    !isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content, slug }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "ไม่สามารถส่งคอมเมนต์ได้");
        return;
      }

      setName("");
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
            <Label htmlFor="comment-name" className="text-base">
              แสดงความคิดเห็น
            </Label>
            <p className="text-sm text-muted-foreground">
              กรอกชื่อและข้อความเป็นภาษาไทยและตัวเลขเท่านั้น
              คอมเมนต์จะแสดงหลังผู้ดูแลอนุมัติ
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="comment-name">ชื่อผู้ส่ง *</Label>
            <Input
              id="comment-name"
              name="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError(null);
              }}
              aria-invalid={hasInvalidName}
              placeholder="ชื่อของคุณ"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="comment">ข้อความ *</Label>
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
              aria-invalid={hasInvalidContent}
              placeholder="เขียนคอมเมนต์เป็นภาษาไทยและตัวเลข..."
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <AnimatePresence mode="wait">
              {hasInvalidName || hasInvalidContent ? (
                <motion.span
                  key="validation-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1 text-destructive"
                >
                  <AlertCircle className="size-3.5" />
                  รองรับเฉพาะภาษาไทยและตัวเลข
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
