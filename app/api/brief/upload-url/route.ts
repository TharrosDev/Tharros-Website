import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/server";
import { clientIp, rateLimit, readJsonCapped, tooManyRequests } from "@/lib/api/guard";

interface Body {
  draftId: string;
  filename: string;
  size: number;
  type: string;
}

const MAX_BYTES = 50 * 1024 * 1024;
const MAX_BODY_BYTES = 16 * 1024; // metadata only — never large
const RATE_MAX = 20;
const RATE_WINDOW_MS = 60 * 1000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ALLOWED_PREFIXES = [
  "image/",
  "video/",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function isAllowedType(t: string): boolean {
  if (!t) return true;
  return ALLOWED_PREFIXES.some((p) => t === p || t.startsWith(p));
}

export async function POST(req: Request) {
  const limit = rateLimit(`upload:${clientIp(req)}`, RATE_MAX, RATE_WINDOW_MS);
  if (!limit.allowed) return tooManyRequests(limit.retryAfter);

  const parsed = await readJsonCapped<Body>(req, MAX_BODY_BYTES);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  if (!body.draftId || !body.filename || typeof body.size !== "number") {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }
  // draftId is interpolated into the storage key, so it must be a bare uuid —
  // never a path fragment that could contain "/" or "..".
  if (!UUID_RE.test(body.draftId)) {
    return NextResponse.json({ ok: false, error: "Bad draftId" }, { status: 400 });
  }
  // NOTE: this size check is advisory. The hard limit is enforced by the
  // bucket's file_size_limit (see supabase/migrations) — the signed PUT itself
  // ignores this value.
  if (body.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "File too large (50 MB max)" }, { status: 413 });
  }
  if (!isAllowedType(body.type)) {
    return NextResponse.json({ ok: false, error: "Unsupported file type" }, { status: 415 });
  }

  const safe = body.filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "file";
  const path = `${body.draftId}/${randomUUID()}-${safe}`;

  const { data, error } = await supabaseAdmin()
    .storage
    .from("brief-uploads")
    .createSignedUploadUrl(path);

  if (error || !data) {
    console.error("[/api/brief/upload-url] createSignedUploadUrl failed:", error);
    return NextResponse.json({ ok: false, error: "Could not prepare upload" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    path,
    token: data.token,
    uploadUrl: data.signedUrl,
  });
}
