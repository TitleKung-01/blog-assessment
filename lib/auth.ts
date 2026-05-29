import { NextResponse } from "next/server";

import type { SessionPayload, UserRole } from "@/types/auth";

export const SESSION_COOKIE = "session";
export type { SessionPayload, UserRole };

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function getAuthSecret(): string | undefined {
  return (
    process.env.AUTH_SECRET ??
    process.env.ADMIN_SESSION_SECRET ??
    process.env.ADMIN_API_KEY
  );
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let index = 0; index < a.length; index++) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return result === 0;
}

async function signPayload(payloadB64: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payloadB64),
  );

  return Buffer.from(signature).toString("base64url");
}

export async function createSessionToken(
  userId: string,
  role: UserRole,
): Promise<string> {
  const secret = getAuthSecret();
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }

  const payload: SessionPayload = {
    sub: userId,
    role,
    exp: Date.now() + SESSION_TTL_MS,
    n: crypto.randomUUID(),
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const signature = await signPayload(payloadB64, secret);

  return `${payloadB64}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) {
    return null;
  }

  const secret = getAuthSecret();
  if (!secret) {
    return null;
  }

  const separator = token.indexOf(".");
  if (separator === -1) {
    return null;
  }

  const payloadB64 = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = await signPayload(payloadB64, secret);

  if (!timingSafeEqualStrings(signature, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8"),
    ) as SessionPayload;

    if (
      typeof payload.sub !== "string" ||
      (payload.role !== "USER" && payload.role !== "ADMIN") ||
      typeof payload.exp !== "number" ||
      payload.exp <= Date.now()
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function readSessionToken(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return undefined;
  }

  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${SESSION_COOKIE}=`)) {
      return decodeURIComponent(trimmed.slice(SESSION_COOKIE.length + 1));
    }
  }

  return undefined;
}

export async function getSession(
  request: Request,
): Promise<SessionPayload | null> {
  return verifySessionToken(readSessionToken(request));
}

export async function requireAuth(
  request: Request,
): Promise<SessionPayload | NextResponse> {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return session;
}

export async function requireAdmin(
  request: Request,
): Promise<SessionPayload | NextResponse> {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return session;
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export function clearSessionCookieOptions() {
  return {
    ...getSessionCookieOptions(),
    maxAge: 0,
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}
