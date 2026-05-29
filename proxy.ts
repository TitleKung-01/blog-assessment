import { NextResponse, type NextRequest } from "next/server";

import { readSessionToken, verifySessionToken } from "@/lib/auth";

function requiresAdminAuth(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;

  if (
    request.method === "PATCH" &&
    (pathname.endsWith("/approve") ||
      pathname.endsWith("/reject") ||
      pathname.startsWith("/api/blog/"))
  ) {
    return true;
  }

  if (request.method === "GET" && pathname.startsWith("/api/blog")) {
    return true;
  }

  if (
    request.method === "GET" &&
    pathname === "/api/comments" &&
    request.nextUrl.searchParams.has("status")
  ) {
    return true;
  }

  return false;
}

function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  return response;
}

export async function proxy(request: NextRequest) {
  if (requiresAdminAuth(request)) {
    const session = await verifySessionToken(readSessionToken(request));

    if (!session || session.role !== "ADMIN") {
      return withSecurityHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );
    }
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/api/comments/:path*", "/api/auth/:path*", "/api/blog/:path*"],
};
