import { SESSION_COOKIE, getSession } from "@/lib/auth";

export {
  SESSION_COOKIE,
  clearSessionCookieOptions,
  createSessionToken,
  getClientIp,
  getSession,
  getSessionCookieOptions,
  isValidEmail,
  isValidPassword,
  readSessionToken,
  requireAdmin,
  requireAuth,
  verifySessionToken,
  type SessionPayload,
  type UserRole,
} from "@/lib/auth";

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;

export async function isAdminAuthorized(request: Request): Promise<boolean> {
  const session = await getSession(request);
  return session?.role === "ADMIN";
}
