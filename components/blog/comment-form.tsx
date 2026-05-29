"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, Loader2, Send } from "lucide-react";

import { AlertMessage } from "@/components/feedback/alert-message";
import { isThaiAndNumbers } from "@/lib/validation";
import { Button } from "@/components/ui/button";
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
    <section className="rounded-2xl bg-surface/60 p-6 shadow-soft sm:p-8">
      <div className="mb-6 border-b border-border/50 pb-5">
        <h3 className="text-lg font-semibold tracking-tight">แสดงความคิดเห็น</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          กรอกชื่อและข้อความเป็นภาษาไทยและตัวเลขเท่านั้น
          คอมเมนต์จะแสดงหลังผู้ดูแลอนุมัติ
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

        <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <AnimatePresence mode="wait">
            {hasInvalidName || hasInvalidContent ? (
              <motion.span
                key="validation-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-destructive"
              >
                <AlertCircle className="size-3.5 shrink-0" />
                รองรับเฉพาะภาษาไทยและตัวเลข
              </motion.span>
            ) : (
              <span key="spacer" />
            )}
          </AnimatePresence>
          <span className="shrink-0 tabular-nums">
            {content.length}/{MAX_LENGTH}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {error ? (
            <AlertMessage key="error" variant="error" animated>
              {error}
            </AlertMessage>
          ) : success ? (
            <AlertMessage key="success" variant="success" animated>
              {success}
            </AlertMessage>
          ) : null}
        </AnimatePresence>

        <Button type="submit" disabled={!canSubmit} className="self-start gap-2">
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
    </section>
  );
}
