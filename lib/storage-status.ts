import { promises as fs } from 'fs';
import path from 'path';
import { getPrismaClient, hasDatabaseUrl } from '@/lib/prisma';

const adminConfigPath = path.join(process.cwd(), 'content', 'admin-config.json');
const cashCachePath = path.join(process.cwd(), 'content', 'cash-scrape-cache.json');

export async function getStorageStatus() {
  const prisma = getPrismaClient();
  let databaseReachable = false;

  if (prisma && hasDatabaseUrl()) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      databaseReachable = true;
    } catch {
      databaseReachable = false;
    }
  }

  const [adminConfigFile, cashCacheFile] = await Promise.allSettled([
    fs.stat(adminConfigPath),
    fs.stat(cashCachePath),
  ]);

  return {
    mode: databaseReachable ? 'database' : 'file_fallback',
    databaseConfigured: hasDatabaseUrl(),
    databaseReachable,
    files: {
      adminConfig: adminConfigFile.status === 'fulfilled',
      cashCache: cashCacheFile.status === 'fulfilled',
    },
  };
}
