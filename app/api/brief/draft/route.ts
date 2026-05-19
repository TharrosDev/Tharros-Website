import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

interface Body {
  draftId: string;
  state: Record<string, unknown>;
  stepIndex: number;
  visited: number[];
  email?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.draftId || typeof body.draftId !== "string") {
    return NextResponse.json({ ok: false, error: "Missing draftId" }, { status: 400 });
  }
  // brief_drafts.id is a uuid column; only attempt the upsert when the draftId
  // is a real uuid. Older clients with a legacy 'local-<timestamp>' id silently
  // skip the server sync (localStorage still saves locally).
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.draftId)) {
    return NextResponse.json({ ok: true, skipped: "non-uuid draftId" });
  }

  try {
    const { data, error } = await supabaseAdmin()
      .from("brief_drafts")
      .upsert({
        id: body.draftId,
        state: body.state ?? {},
        step_index: body.stepIndex ?? -1,
        visited: body.visited ?? [],
        email: body.email ?? null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" })
      .select("id, updated_at")
      .single();

    if (error || !data) {
      console.error("[/api/brief/draft] upsert failed:", error);
      return NextResponse.json({ ok: false, error: "Could not save draft" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: data.id, updatedAt: data.updated_at });
  } catch (e) {
    console.error("[/api/brief/draft] supabase unreachable:", e);
    return NextResponse.json({ ok: false, error: "Server unreachable" }, { status: 500 });
  }
}
