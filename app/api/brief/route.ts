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
    // Webhook is optional — client already saved locally and the operator can
    // re-export from /admin/briefs. Log but don't fail the user-facing flow.
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

export async function GET() {
  return NextResponse.json(
    { error: "POST a submission payload — see /brief for the form" },
    { status: 405 },
  );
}
