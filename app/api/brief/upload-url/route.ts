import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/server";

interface Body {
  draftId: string;
  filename: string;
  size: number;
  type: string;
}

const MAX_BYTES = 50 * 1024 * 1024;

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
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.draftId || !body.filename || typeof body.size !== "number") {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }
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

  return NextResponse.json({ ok: true, path, token: data.token, signedUrl: data.signedUrl });
}
