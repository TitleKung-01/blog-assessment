import { AdminDashboard } from "@/components/admin/admin-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 lg:py-16">
      <AdminDashboard />
    </main>
  );
}
