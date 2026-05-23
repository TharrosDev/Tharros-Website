import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { clientIp, rateLimit, readJsonCapped, tooManyRequests } from "@/lib/api/guard";

interface Body {
  draftId: string;
  state: Record<string, unknown>;
  stepIndex: number;
  visited: number[];
  email?: string;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BODY_BYTES = 512 * 1024;
// Autosave is debounced (~600ms) client-side; 60/min leaves ample headroom for
// a real user while capping a scripted flood of draft rows.
const RATE_MAX = 60;
const RATE_WINDOW_MS = 60 * 1000;

export async function POST(req: Request) {
  const limit = rateLimit(`draft:${clientIp(req)}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.allowed) return tooManyRequests(limit.retryAfter);

  const parsed = await readJsonCapped<Body>(req, MAX_BODY_BYTES);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  if (!body.draftId || typeof body.draftId !== "string") {
    return NextResponse.json({ ok: false, error: "Missing draftId" }, { status: 400 });
  }
  // brief_drafts.id is a uuid column; only attempt the upsert when the draftId
  // is a real uuid. Older clients with a legacy 'local-<timestamp>' id silently
  // skip the server sync (localStorage still saves locally).
  if (!UUID_RE.test(body.draftId)) {
    return NextResponse.json({ ok: true, skipped: "non-uuid draftId" });
  }

  try {
    const { data, error } = await supabaseAdmin()
      .from("brief_drafts")
      .upsert({
        id: body.draftId,
        state: body.state ?? {},
        step_index: typeof body.stepIndex === "number" ? body.stepIndex : -1,
        visited: Array.isArray(body.visited) ? body.visited : [],
        email: typeof body.email === "string" ? body.email.slice(0, 320) : null,
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
