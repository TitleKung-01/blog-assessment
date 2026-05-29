import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import { getDirectDatabaseUrl, sanitizePostgresUrl } from "@/lib/database-url";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

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

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: getConnectionString() });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
