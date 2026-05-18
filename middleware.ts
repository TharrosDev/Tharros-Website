import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const password = process.env.ADMIN_PASSWORD;

  // Fail closed if the password isn't configured — better than serving /admin
  // unprotected in production.
  if (!password) {
    return new NextResponse("Admin not configured", { status: 503 });
  }

  const expected = "Basic " + Buffer.from(`magnus:${password}`).toString("base64");

  if (auth !== expected) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Tharros Admin"' },
    });
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
