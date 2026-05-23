import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Precompute the expected credential at module load so the per-request handler
// doesn't allocate a Buffer + base64-encode on every /admin/* hit. Fails closed
// (503) if the password isn't configured — better than leaving /admin open.
const password = process.env.ADMIN_PASSWORD;
const expected = password
  ? "Basic " + Buffer.from(`magnus:${password}`).toString("base64")
  : null;

// Constant-time string comparison. A plain `!==` short-circuits on the first
// differing byte, leaking how much of the credential matched via response
// timing; folding every byte (and the length delta) into one accumulator keeps
// the comparison time independent of where the mismatch is. Pure JS so it runs
// on the Edge runtime, where node:crypto's timingSafeEqual isn't available.
function safeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export function middleware(req: NextRequest) {
  if (!expected) {
    return new NextResponse("Admin not configured", { status: 503 });
  }
  const provided = req.headers.get("authorization") ?? "";
  if (!safeEqual(provided, expected)) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Tharros Admin"' },
    });
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
