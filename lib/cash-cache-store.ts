import { promises as fs } from 'fs';
import path from 'path';
import type { InputJsonValue } from '@prisma/client/runtime/library';
import { getPrismaClient } from '@/lib/prisma';
import { ScrapeResult } from '@/lib/scrapers/cash';

const cachePath = path.join(process.cwd(), 'content', 'cash-scrape-cache.json');
const cacheBackupPath = path.join(process.cwd(), 'content', 'cash-scrape-cache.backup.json');
const cacheStateKey = 'latest';

export interface CashCachePayload {
  generatedAt: string | null;
  results: ScrapeResult[];
}

function toJsonValue<T>(value: T): InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as InputJsonValue;
}

async function readFileCache(): Promise<CashCachePayload> {
  try {
    const raw = await fs.readFile(cachePath, 'utf8');
    return JSON.parse(raw) as CashCachePayload;
  } catch {
    return { generatedAt: null, results: [] };
  }
}

async function writeFileCache(payload: CashCachePayload, previous?: CashCachePayload | null) {
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  if (previous?.results?.length) {
    await fs.writeFile(cacheBackupPath, JSON.stringify(previous, null, 2));
  }
  await fs.writeFile(cachePath, JSON.stringify(payload, null, 2));
}

export async function readCashCache(): Promise<CashCachePayload> {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const state = await prisma.cashScrapeCacheState.findUnique({ where: { key: cacheStateKey } });
      if (state?.value) {
        return state.value as unknown as CashCachePayload;
      }
    } catch {
      // Fall back to file storage when DB is unavailable.
    }
  }
  return readFileCache();
}

export async function writeCashCache(payload: CashCachePayload, previous?: CashCachePayload | null) {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      await prisma.cashScrapeCacheState.upsert({
        where: { key: cacheStateKey },
        update: {
          value: toJsonValue(payload),
          previousValue: previous ? toJsonValue(previous) : undefined,
        },
        create: {
          key: cacheStateKey,
          value: toJsonValue(payload),
          previousValue: previous ? toJsonValue(previous) : undefined,
        },
      });
    } catch {
      await writeFileCache(payload, previous);
      return;
    }
  }
  await writeFileCache(payload, previous);
}

export async function rollbackCashCache(): Promise<CashCachePayload> {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const state = await prisma.cashScrapeCacheState.findUnique({ where: { key: cacheStateKey } });
      const backup = state?.previousValue as unknown as CashCachePayload | null | undefined;
      if (backup) {
        await prisma.cashScrapeCacheState.update({
          where: { key: cacheStateKey },
          data: {
            value: toJsonValue(backup),
          },
        });
        await writeFileCache(backup, state?.value as CashCachePayload | undefined);
        return backup;
      }
    } catch {
      // Fall through to file backup.
    }
  }

  const raw = await fs.readFile(cacheBackupPath, 'utf8');
  const backup = JSON.parse(raw) as CashCachePayload;
  await fs.writeFile(cachePath, JSON.stringify(backup, null, 2));
  return backup;
}
