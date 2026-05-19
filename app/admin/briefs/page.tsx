import type { Metadata } from "next";
import { AdminApp } from "@/components/onboarding/AdminApp";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { FormState, Submission } from "@/components/onboarding/lib/types";

export const metadata: Metadata = {
  title: "Briefs · Tharros Admin",
  robots: { index: false, follow: false },
};

// Route is gated by middleware.ts (HTTP Basic auth on /admin/*).
// Force dynamic so each request re-reads brief_submissions; we never want a
// stale build-time snapshot served to the admin.
export const dynamic = "force-dynamic";

interface RemoteRow {
  id: string;
  created_at: string;
  state: FormState;
  prompt: string;
}

async function loadRemote(): Promise<Submission[]> {
  try {
    const { data, error } = await supabaseAdmin()
      .from("brief_submissions")
      .select("id, created_at, state, prompt")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error || !data) return [];
    return (data as RemoteRow[]).map((r) => ({
      id: r.id,
      timestamp: r.created_at,
      state: r.state,
      prompt: r.prompt,
    }));
  } catch (e) {
    console.error("[/admin/briefs] supabase load failed:", e);
    return [];
  }
}

export default async function AdminBriefsPage() {
  const remote = await loadRemote();
  return <AdminApp initialRemote={remote} />;
}
