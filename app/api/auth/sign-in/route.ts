import { NextResponse } from "next/server";

import {
  SESSION_COOKIE,
  createSessionToken,
  getClientIp,
  getSessionCookieOptions,
  isValidEmail,
  type UserRole,
} from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const AUTH_DELAY_MS = 500;

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (!checkRateLimit(`auth-signin:${ip}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";
  const password =
    typeof body === "object" &&
    body !== null &&
    "password" in body &&
    typeof body.password === "string"
      ? body.password
      : "";
  const expectedRole: UserRole | null =
    typeof body === "object" &&
    body !== null &&
    "role" in body &&
    body.role === "ADMIN"
      ? "ADMIN"
      : typeof body === "object" &&
          body !== null &&
          "role" in body &&
          body.role === "USER"
        ? "USER"
        : null;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  await new Promise((resolve) => setTimeout(resolve, AUTH_DELAY_MS));

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  if (expectedRole && user.role !== expectedRole) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const token = await createSessionToken(user.id, user.role);
  const response = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
  response.cookies.set(SESSION_COOKIE, token, getSessionCookieOptions());

  return response;
}
