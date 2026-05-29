export const ADMIN_STORAGE_KEY = "blog-admin-api-key";

export function isAdminAuthorized(request: Request): boolean {
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${adminKey}`;
}

export function getAdminAuthHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
  };
}
