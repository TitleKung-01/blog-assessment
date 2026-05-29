"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, Loader2, LogIn, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserRole } from "@/lib/auth";

type AuthMode = "sign-in" | "sign-up";

type AuthFormProps = {
  mode: AuthMode;
  role: UserRole;
  title: string;
  description: string;
  alternateHref: string;
  alternateLabel: string;
};

const fetchOptions: RequestInit = {
  credentials: "include",
};

export function AuthForm({
  mode,
  role,
  title,
  description,
  alternateHref,
  alternateLabel,
}: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupCode, setSignupCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const endpoint = mode === "sign-in" ? "/api/auth/sign-in" : "/api/auth/sign-up";
    const body =
      mode === "sign-in"
        ? { email, password, role }
        : {
            email,
            password,
            name,
            role,
            ...(role === "ADMIN" ? { signupCode } : {}),
          };

    try {
      const response = await fetch(endpoint, {
        ...fetchOptions,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      router.push(role === "ADMIN" ? "/admin" : "/");
      router.refresh();
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto w-full max-w-md"
    >
      <Card>
        <CardContent className="flex flex-col gap-6 py-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "sign-up" ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">ชื่อ</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="ชื่อของคุณ"
                  autoComplete="name"
                  required
                  disabled={isSubmitting}
                />
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={mode === "sign-up" ? "อย่างน้อย 8 ตัวอักษร" : "รหัสผ่าน"}
                autoComplete={
                  mode === "sign-in" ? "current-password" : "new-password"
                }
                minLength={mode === "sign-up" ? 8 : undefined}
                required
                disabled={isSubmitting}
              />
            </div>

            {mode === "sign-up" && role === "ADMIN" ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-code">รหัสสมัครผู้ดูแล</Label>
                <Input
                  id="signup-code"
                  type="password"
                  value={signupCode}
                  onChange={(event) => setSignupCode(event.target.value)}
                  placeholder="ADMIN_SIGNUP_CODE จาก .env"
                  required
                  disabled={isSubmitting}
                />
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              {error ? (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
                >
                  <AlertCircle className="size-4 shrink-0" />
                  {error}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <Button type="submit" size="lg" className="gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : mode === "sign-in" ? (
                <LogIn className="size-4" />
              ) : (
                <UserPlus className="size-4" />
              )}
              {mode === "sign-in" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            <Link href={alternateHref} className="font-medium text-primary hover:underline">
              {alternateLabel}
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
