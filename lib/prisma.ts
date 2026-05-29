import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import { getDirectDatabaseUrl, sanitizePostgresUrl } from "@/lib/database-url";

type Connection = { pool: Pool; client: PrismaClient };

type PrismaGlobal = {
  connection?: Connection;
};

const globalForPrisma = globalThis as unknown as PrismaGlobal;

function getConnectionString() {
  const directUrl = getDirectDatabaseUrl();
  if (directUrl) {
    return directUrl;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl?.startsWith("postgres://")) {
    return sanitizePostgresUrl(databaseUrl);
  }

  throw new Error(
    "Set DIRECT_DATABASE_URL for local Prisma Postgres (from `npm run db:local`).",
  );
}

function isConnectionError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const message =
    "message" in error && typeof error.message === "string"
      ? error.message.toLowerCase()
      : "";

  return (
    message.includes("server has closed the connection") ||
    message.includes("connection terminated") ||
    message.includes("econnreset") ||
    message.includes("connection refused") ||
    message.includes("connect econnrefused")
  );
}

function getPoolMax(connectionString: string) {
  const fromEnv = Number(process.env.DB_POOL_MAX);
  if (Number.isFinite(fromEnv) && fromEnv > 0) {
    return fromEnv;
  }

  try {
    const host = new URL(connectionString).hostname;
    // The local Prisma Postgres dev engine only accepts a single concurrent
    // connection; opening more triggers "Connection terminated unexpectedly".
    if (host === "localhost" || host === "127.0.0.1") {
      return 1;
    }
  } catch {
    // Fall through to the default for unparsable connection strings.
  }

  return 10;
}

function createConnection(): Connection {
  const connectionString = getConnectionString();
  const pool = new Pool({
    connectionString,
    max: getPoolMax(connectionString),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  // pg requires an 'error' listener so a dropped idle connection doesn't crash
  // the process. The pool stays usable and lazily opens a fresh backing
  // connection on the next query, so we deliberately keep it (no teardown here).
  pool.on("error", () => undefined);

  return { pool, client: new PrismaClient({ adapter: new PrismaPg(pool) }) };
}

function isConnectionReady(
  connection: Connection | undefined,
): connection is Connection {
  return (
    !!connection &&
    typeof connection.client.blogArticle?.findMany === "function"
  );
}

function getConnection(): Connection {
  if (isConnectionReady(globalForPrisma.connection)) {
    return globalForPrisma.connection;
  }

  const connection = createConnection();
  globalForPrisma.connection = connection;
  return connection;
}

/**
 * Tears down the cached connection. Reserved for explicit lifecycle management
 * (e.g. scripts/tests); the request path relies on the persistent pool instead.
 */
export async function resetPrismaClient() {
  const stale = globalForPrisma.connection;
  globalForPrisma.connection = undefined;

  if (stale) {
    await stale.client.$disconnect().catch(() => undefined);
    await stale.pool.end().catch(() => undefined);
  }
}

/**
 * Single shared Prisma client. Implemented as a lazy proxy so modules that
 * import `prisma` always resolve the current live connection and never hold a
 * reference to a pool that has been torn down.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getConnection().client;
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export async function withPrisma<T>(
  operation: (client: PrismaClient) => Promise<T>,
): Promise<T> {
  try {
    return await operation(getConnection().client);
  } catch (error) {
    if (!isConnectionError(error)) {
      throw error;
    }

    // Retry once on the same persistent pool; pg discards the dead backing
    // connection and establishes a new one for the retry.
    return operation(getConnection().client);
  }
}
