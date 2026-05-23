import "server-only";
import { NextResponse } from "next/server";

/** Client IP from proxy headers. Vercel sets x-forwarded-for; the left-most
 *  entry is the originating client. Spoofable when the app isn't behind a
 *  trusted proxy, so treat the key as best-effort, not an identity. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim() || "anon";
  return req.headers.get("x-real-ip")?.trim() || "anon";
}

/**
 * Read a request body with a hard byte ceiling and parse it as JSON.
 *
 * `req.json()` buffers the entire body before we can inspect its size, so a
 * client that omits/forges Content-Length and streams a multi-GB body can OOM
 * the function. This reads the stream chunk-by-chunk and aborts the moment the
 * running total crosses `maxBytes`, so peak memory is bounded regardless of
 * what the client claims.
 */
export async function readJsonCapped<T>(
  req: Request,
  maxBytes: number,
): Promise<
  | { ok: true; data: T }
  | { ok: false; response: NextResponse }
> {
  const declared = req.headers.get("content-length");
  if (declared && Number(declared) > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "Payload too large" },
        { status: 413 },
      ),
    };
  }

  const reader = req.body?.getReader();
  if (!reader) {
    // No body — let JSON.parse fail below into the 400 path.
    return badJson();
  }

  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.length;
      if (total > maxBytes) {
        await reader.cancel();
        return {
          ok: false,
          response: NextResponse.json(
            { ok: false, error: "Payload too large" },
            { status: 413 },
          ),
        };
      }
      chunks.push(value);
    }
  } catch {
    return badJson();
  }

  const buf = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    buf.set(c, offset);
    offset += c.length;
  }

  try {
    const text = new TextDecoder().decode(buf);
    return { ok: true, data: JSON.parse(text) as T };
  } catch {
    return badJson();
  }
}

function badJson(): { ok: false; response: NextResponse } {
  return {
    ok: false,
    response: NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    ),
  };
}

// ---------------------------------------------------------------------------
// Best-effort in-memory rate limiter.
//
// This is a per-instance fixed-window counter. On a serverless platform each
// warm instance keeps its own map, so it does NOT give a globally precise
// limit — but it meaningfully throttles a single attacker hammering a warm
// instance and costs nothing. For a hard, distributed guarantee, back this
// with Upstash/Redis. The map is pruned so a flood of distinct keys can't grow
// it without bound (which would itself be a memory-exhaustion vector).
// ---------------------------------------------------------------------------

interface Bucket {
  count: number;
  reset: number;
}

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 10_000;

function prune(now: number): void {
  for (const [key, b] of buckets) {
    if (now > b.reset) buckets.delete(key);
  }
  // Hard ceiling: if pruning expired entries wasn't enough, drop the oldest.
  if (buckets.size > MAX_TRACKED_KEYS) {
    const overflow = buckets.size - MAX_TRACKED_KEYS;
    let i = 0;
    for (const key of buckets.keys()) {
      if (i++ >= overflow) break;
      buckets.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter: number;
}

/** Fixed-window limiter. Returns whether the call is allowed and, if not, how
 *  many seconds until the window resets. */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  if (buckets.size > MAX_TRACKED_KEYS) prune(now);

  const b = buckets.get(key);
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (b.count >= max) {
    return { allowed: false, retryAfter: Math.ceil((b.reset - now) / 1000) };
  }
  b.count++;
  return { allowed: true, retryAfter: 0 };
}

/** 429 response with a Retry-After header. */
export function tooManyRequests(retryAfter: number): NextResponse {
  return NextResponse.json(
    { ok: false, error: "Too many requests" },
    { status: 429, headers: { "Retry-After": String(Math.max(retryAfter, 1)) } },
  );
}
