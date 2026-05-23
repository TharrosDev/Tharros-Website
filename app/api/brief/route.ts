import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { clientIp, rateLimit, readJsonCapped, tooManyRequests } from "@/lib/api/guard";

interface Payload {
  source?: string;
  id: string;
  timestamp: string;
  state: Record<string, unknown>;
  prompt: string;
  draftId?: string;
  /** Honeypot — real users never see this field; if filled, treat as bot. */
  company_name_alt?: string;
}

// Final submissions are rare per visitor; keep the window tight so a single IP
// can't flood brief_submissions or burn the Zapier quota.
const MAX_BODY_BYTES = 512 * 1024;
const RATE_MAX = 5;
const RATE_WINDOW_MS = 5 * 60 * 1000;

// Defensive caps for the indexed scalar columns so a 512 KB single field can't
// bloat an index. The full payload still lives in `state`/`prompt`.
function cap(v: unknown, max: number): string | null {
  return typeof v === "string" && v ? v.slice(0, max) : null;
}

export async function POST(req: Request) {
  const limit = rateLimit(`brief:${clientIp(req)}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.allowed) return tooManyRequests(limit.retryAfter);

  const parsed = await readJsonCapped<Payload>(req, MAX_BODY_BYTES);
  if (!parsed.ok) return parsed.response;
  const payload = parsed.data;

  // Honeypot — return 200 so bots can't fingerprint the rule.
  if (payload.company_name_alt && payload.company_name_alt.trim().length > 0) {
    console.warn("[/api/brief] honeypot tripped from", clientIp(req));
    return NextResponse.json({ ok: true, accepted: true });
  }

  // Persist to Supabase. RLS is on; service-role bypasses it.
  const state = payload.state ?? {};
  const prompt = typeof payload.prompt === "string" ? payload.prompt.slice(0, 200_000) : "";
  try {
    const { error } = await supabaseAdmin().from("brief_submissions").insert({
      draft_id: payload.draftId ?? null,
      state,
      prompt,
      business_name: cap(state.businessName, 300),
      owner_name:    cap(state.ownerName, 300),
      email:         cap(state.email, 320),
    });
    if (error) console.error("[/api/brief] insert failed:", error);
    // Fall through. Zapier copy is the backup; never block a real submission
    // on a DB hiccup.
  } catch (e) {
    console.error("[/api/brief] supabase unreachable:", e);
  }

  const webhook = process.env.THARROS_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ ok: true, forwarded: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`[/api/brief] Webhook responded ${res.status}`);
      return NextResponse.json({ ok: true, forwarded: false, webhookStatus: res.status });
    }
    return NextResponse.json({ ok: true, forwarded: true });
  } catch (e) {
    console.error("[/api/brief] Webhook fetch failed:", e);
    return NextResponse.json({ ok: true, forwarded: false });
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "POST a submission payload — see /brief for the form" },
    { status: 405 },
  );
}
