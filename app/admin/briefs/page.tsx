// app/admin/briefs/page.tsx — Admin view of submitted briefs.
//
// IMPORTANT: This route must be auth-gated. See middleware.ts in the project
// root and the README for setup. Without middleware, anyone who knows the URL
// can see what's cached in *their own* browser's localStorage — which is
// nothing useful for a stranger, but you still want to gate the URL so the
// admin UI isn't publicly discoverable.

import type { Metadata } from "next";
import { AdminApp } from "@/components/onboarding/AdminApp";

export const metadata: Metadata = {
  title: "Briefs · Tharros Admin",
  robots: { index: false, follow: false },
};

export default function AdminBriefsPage() {
  return <AdminApp />;
}
