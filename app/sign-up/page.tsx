import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign up",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
      <AuthForm
        mode="sign-up"
        role="USER"
        title="สมัครสมาชิก"
        description="สร้างบัญชีผู้ใช้เพื่อคอมเมนต์ในบทความ"
        alternateHref="/sign-in"
        alternateLabel="มีบัญชีแล้ว? เข้าสู่ระบบ"
      />
    </main>
  );
}
