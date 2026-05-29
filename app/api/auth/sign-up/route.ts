import { NextResponse } from "next/server";

import {
  SESSION_COOKIE,
  createSessionToken,
  getClientIp,
  getSessionCookieOptions,
  isValidEmail,
  isValidPassword,
  type UserRole,
} from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const AUTH_DELAY_MS = 500;

function parseSignUpBody(body: unknown): {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  signupCode: string;
} {
  if (typeof body !== "object" || body === null) {
    return { email: "", password: "", name: "", role: "USER", signupCode: "" };
  }

  const role =
    "role" in body && body.role === "ADMIN" ? ("ADMIN" as const) : "USER";

  return {
    email:
      "email" in body && typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "",
    password:
      "password" in body && typeof body.password === "string"
        ? body.password
        : "",
    name:
      "name" in body && typeof body.name === "string" ? body.name.trim() : "",
    role,
    signupCode:
      "signupCode" in body && typeof body.signupCode === "string"
        ? body.signupCode.trim()
        : "",
  };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (!checkRateLimit(`auth-signup:${ip}`, 5, 15 * 60 * 1000)) {
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

  const { email, password, name, role, signupCode } = parseSignUpBody(body);

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "Email, name, and password are required" },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (!isValidPassword(password)) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  if (role === "ADMIN") {
    const adminCode = process.env.ADMIN_SIGNUP_CODE;
    if (!adminCode || signupCode !== adminCode) {
      await new Promise((resolve) => setTimeout(resolve, AUTH_DELAY_MS));
      return NextResponse.json(
        { error: "Invalid admin signup code" },
        { status: 403 },
      );
    }
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await new Promise((resolve) => setTimeout(resolve, AUTH_DELAY_MS));
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

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
