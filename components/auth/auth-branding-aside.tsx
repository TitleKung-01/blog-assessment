import { Sparkles } from "lucide-react";

import type { AuthMode, UserRole } from "@/types";

type AuthBrandingAsideProps = {
  mode: AuthMode;
  role: UserRole;
};

export function AuthBrandingAside({ mode, role }: AuthBrandingAsideProps) {
  return (
    <aside className="hidden flex-col justify-between bg-gradient-to-br from-primary/90 to-fuchsia-600 p-8 text-primary-foreground md:flex">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2.5 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Sparkles className="size-4" />
          </span>
          Aurora Blog
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold leading-tight tracking-tight">
            {mode === "sign-in" ? "ยินดีต้อนรับกลับ" : "เริ่มต้นใช้งาน"}
          </h2>
          <p className="text-sm leading-relaxed text-primary-foreground/85">
            {role === "ADMIN"
              ? "เข้าสู่ระบบเพื่อจัดการบทความและอนุมัติคอมเมนต์"
              : "สร้างบัญชีเพื่อแสดงความคิดเห็นในบทความที่คุณสนใจ"}
          </p>
        </div>
      </div>
      <p className="text-xs text-primary-foreground/70">
        ออกแบบให้อ่านสบายตาและใช้งานง่าย
      </p>
    </aside>
  );
}
