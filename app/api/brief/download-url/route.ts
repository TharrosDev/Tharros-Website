import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { clientIp, rateLimit, readJsonCapped, tooManyRequests } from "@/lib/api/guard";

interface Body {
  /** Object key inside `brief-uploads`, as returned by /api/brief/upload-url. */
  path: string;
  /** Seconds the signed URL should remain valid for. Defaults to 7 days. */
  expiresIn?: number;
}

const MAX_EXPIRES = 60 * 60 * 24 * 30; // 30 days hard cap
const MAX_BODY_BYTES = 16 * 1024;
const RATE_MAX = 30;
const RATE_WINDOW_MS = 60 * 1000;

export async function POST(req: Request) {
  const limit = rateLimit(`download:${clientIp(req)}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.allowed) return tooManyRequests(limit.retryAfter);

  const parsed = await readJsonCapped<Body>(req, MAX_BODY_BYTES);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  if (!body.path || typeof body.path !== "string") {
    return NextResponse.json({ ok: false, error: "Missing path" }, { status: 400 });
  }
  // The path shape is `<uuid>/<uuid>-<filename>`. Reject anything else so the
  // endpoint isn't a generic signer for arbitrary keys.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[a-zA-Z0-9._-]+$/i.test(body.path)) {
    return NextResponse.json({ ok: false, error: "Bad path" }, { status: 400 });
  }

  const expiresIn = Math.min(Math.max(body.expiresIn ?? 60 * 60 * 24 * 7, 60), MAX_EXPIRES);

  const { data, error } = await supabaseAdmin()
    .storage
    .from("brief-uploads")
    .createSignedUrl(body.path, expiresIn);

  if (error || !data) {
    console.error("[/api/brief/download-url] createSignedUrl failed:", error);
    return NextResponse.json({ ok: false, error: "Could not sign download URL" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, downloadUrl: data.signedUrl });
}
