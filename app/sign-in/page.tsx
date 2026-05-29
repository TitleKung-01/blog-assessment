import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <AuthForm
        mode="sign-in"
        role="USER"
        title="เข้าสู่ระบบ"
        description="เข้าสู่ระบบเพื่อแสดงความคิดเห็นในบทความ"
        alternateHref="/sign-up"
        alternateLabel="ยังไม่มีบัญชี? สมัครสมาชิก"
      />
    </main>
  );
}
