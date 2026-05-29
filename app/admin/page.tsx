import { AdminDashboard } from "@/components/AdminDashboard";
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
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <AdminDashboard />
    </main>
  );
}
