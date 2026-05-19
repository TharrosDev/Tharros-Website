import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getBriefRateLimit, ipFrom } from "@/lib/ratelimit";

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

export async function POST(req: Request) {
  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — return 200 so bots can't fingerprint the rule.
  if (payload.company_name_alt && payload.company_name_alt.trim().length > 0) {
    console.warn("[/api/brief] honeypot tripped from", ipFrom(req));
    return NextResponse.json({ ok: true, accepted: true });
  }

  // Optional rate limit. No-ops until UPSTASH_REDIS_REST_URL/_TOKEN are set.
  const rl = getBriefRateLimit();
  if (rl) {
    const verdict = await rl.limit(ipFrom(req));
    if (!verdict.success) {
      return NextResponse.json(
        { ok: false, error: "Too many requests" },
        { status: 429, headers: { "Retry-After": "600" } },
      );
    }
  }

  // Persist to Supabase. RLS is on; service-role bypasses it.
  const state = payload.state ?? {};
  try {
    const { error } = await supabaseAdmin().from("brief_submissions").insert({
      draft_id: payload.draftId ?? null,
      state,
      prompt: payload.prompt,
      business_name: typeof state.businessName === "string" ? state.businessName : null,
      owner_name:    typeof state.ownerName    === "string" ? state.ownerName    : null,
      email:         typeof state.email        === "string" ? state.email        : null,
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
