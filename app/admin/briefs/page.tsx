import type { Metadata } from "next";
import { AdminApp } from "@/components/onboarding/AdminApp";

// Route is gated by middleware.ts (HTTP Basic auth on /admin/*).
export const metadata: Metadata = {
  title: "Briefs · Tharros Admin",
  robots: { index: false, follow: false },
};

export default function AdminBriefsPage() {
  return <AdminApp />;
}
