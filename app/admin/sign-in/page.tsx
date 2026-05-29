import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function AdminSignInPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <AuthForm
        mode="sign-in"
        role="ADMIN"
        title="เข้าสู่ระบบผู้ดูแล"
        description="สำหรับผู้ดูแลที่อนุมัติและจัดการคอมเมนต์"
        alternateHref="/admin/sign-up"
        alternateLabel="สมัครบัญชีผู้ดูแล"
      />
    </main>
  );
}
