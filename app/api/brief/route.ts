// app/api/brief/route.ts — Server-side endpoint that catches form submissions
// and forwards them to your Zapier webhook. Keeps the webhook URL out of the
// client bundle (it's only available as a server-side env var).
//
// POST body: { state, prompt, timestamp, id, source }
// Response:  { ok: true } on success, { ok: false, error } on failure.

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const webhook = process.env.THARROS_WEBHOOK_URL;
  if (!webhook) {
    // No webhook configured — that's OK, the submission still got saved
    // client-side. Don't block the user; log a warning for the operator.
    console.warn("[/api/brief] THARROS_WEBHOOK_URL not set — skipping forward");
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
      return NextResponse.json(
        { ok: false, error: `Webhook ${res.status}` },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, forwarded: true });
  } catch (e) {
    console.error("[/api/brief] Webhook fetch failed:", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Forward failed" },
      { status: 502 },
    );
  }
}

// Reject anything other than POST cleanly.
export async function GET() {
  return NextResponse.json(
    { error: "POST a submission payload — see /brief for the form" },
    { status: 405 },
  );
}
