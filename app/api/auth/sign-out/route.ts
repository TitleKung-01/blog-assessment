import { NextResponse } from "next/server";

import {
  SESSION_COOKIE,
  clearSessionCookieOptions,
  getSession,
} from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession(request);
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(SESSION_COOKIE, "", clearSessionCookieOptions());

  if (session) {
    return response;
  }

  return response;
}
