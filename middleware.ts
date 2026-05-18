import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Precompute the expected credential at module load so the per-request handler
// doesn't allocate a Buffer + base64-encode on every /admin/* hit. Fails closed
// (503) if the password isn't configured — better than leaving /admin open.
const password = process.env.ADMIN_PASSWORD;
const expected = password
  ? "Basic " + Buffer.from(`magnus:${password}`).toString("base64")
  : null;

export function middleware(req: NextRequest) {
  if (!expected) {
    return new NextResponse("Admin not configured", { status: 503 });
  }
  if (req.headers.get("authorization") !== expected) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Tharros Admin"' },
    });
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
