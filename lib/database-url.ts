/** Prisma dev adds pool params that PostgreSQL/libpq reject; Studio passes URLs through as-is. */
const PRISMA_ONLY_PARAMS = [
  "connection_limit",
  "connect_timeout",
  "max_idle_connection_lifetime",
  "pool_timeout",
  "socket_timeout",
] as const;

function parseDirectUrlFromPrismaPostgresUrl(
  prismaPostgresUrl: string,
): string | undefined {
  if (
    !prismaPostgresUrl.startsWith("prisma+postgres://") &&
    !prismaPostgresUrl.startsWith("prisma://")
  ) {
    return undefined;
  }

  try {
    const apiKey = new URL(prismaPostgresUrl).searchParams.get("api_key");
    if (!apiKey) {
      return undefined;
    }

    const payload = JSON.parse(
      Buffer.from(apiKey, "base64url").toString("utf8"),
    ) as { databaseUrl?: string };

    if (!payload.databaseUrl?.startsWith("postgres")) {
      return undefined;
    }

    return sanitizePostgresUrl(payload.databaseUrl);
  } catch {
    return undefined;
  }
}

export function sanitizePostgresUrl(url: string): string {
  try {
    const parsed = new URL(url);
    for (const key of PRISMA_ONLY_PARAMS) {
      parsed.searchParams.delete(key);
    }
    // Avoid Windows localhost / IPv6 quirks in some clients (e.g. Prisma Studio).
    if (parsed.hostname === "localhost") {
      parsed.hostname = "127.0.0.1";
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export function getDirectDatabaseUrl(): string | undefined {
  const fromPrismaDev = process.env.DATABASE_URL
    ? parseDirectUrlFromPrismaPostgresUrl(process.env.DATABASE_URL)
    : undefined;

  const raw =
    process.env.DIRECT_DATABASE_URL ?? fromPrismaDev ?? process.env.DATABASE_URL;

  if (
    !raw ||
    raw.startsWith("prisma+postgres://") ||
    raw.startsWith("prisma://")
  ) {
    return fromPrismaDev;
  }

  return sanitizePostgresUrl(raw);
}
