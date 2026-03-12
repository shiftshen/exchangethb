import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __exchangethbPrisma: PrismaClient | undefined;
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0);
}

export function getPrismaClient() {
  if (!hasDatabaseUrl()) return null;
  if (!globalThis.__exchangethbPrisma) {
    globalThis.__exchangethbPrisma = new PrismaClient();
  }
  return globalThis.__exchangethbPrisma;
}
