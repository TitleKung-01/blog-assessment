import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Admin sign up",
  robots: { index: false, follow: false },
};

export default function AdminSignUpPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
      <AuthForm
        mode="sign-up"
        role="ADMIN"
        title="สมัครผู้ดูแล"
        description="ต้องมีรหัสสมัครจาก ADMIN_SIGNUP_CODE ใน .env"
        alternateHref="/admin/sign-in"
        alternateLabel="มีบัญชีแล้ว? เข้าสู่ระบบ"
      />
    </main>
  );
}
