import { getPrismaClient } from '@/lib/prisma';

type Usage = { hour: number; hourly: number; day: number; daily: number; month: string; monthly: number };
const emptyUsage = (): Usage => ({ hour: -1, hourly: 0, day: -1, daily: 0, month: '', monthly: 0 });
let localUsage = emptyUsage();

export function reserveGooglePlacesRequest(previous: unknown, now = Date.now()): Usage | null {
  const source = previous as Partial<Usage> | null;
  // Corrupt persisted counters fail closed rather than silently resetting the allowance.
  if (source && (!Number.isInteger(source.hour) || !Number.isInteger(source.day) || typeof source.month !== 'string' ||
    ![source.hourly, source.daily, source.monthly].every(n => Number.isInteger(n) && Number(n) >= 0))) return null;
  const usage = { ...(source || emptyUsage()) } as Usage;
  const hour = Math.floor(now / 3_600_000), day = Math.floor(now / 86_400_000), month = new Date(now).toISOString().slice(0, 7);
  if (usage.hour !== hour) { usage.hour = hour; usage.hourly = 0; }
  if (usage.day !== day) { usage.day = day; usage.daily = 0; }
  if (usage.month !== month) { usage.month = month; usage.monthly = 0; }
  if (usage.hourly >= 25 || usage.daily >= 25 || usage.monthly >= 500) return null;
  usage.hourly++; usage.daily++; usage.monthly++;
  return usage;
}

export async function takeGooglePlacesBudget(): Promise<boolean> {
  try {
    const db = getPrismaClient();
    if (!db) {
      if (process.env.NODE_ENV === 'production') return false;
      const next = reserveGooglePlacesRequest(localUsage);
      if (!next) return false;
      localUsage = next; return true;
    }
    // One transaction lock across both web replicas and restarts, using the existing state table.
    // This bounds this application's requests; it is not a monetary cap for the shared Cloud project.
    return await db.$transaction(async tx => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(838634, 137995)`;
      const row = await tx.adminConfigState.findUnique({ where: { key: 'google-places-usage' } });
      const next = reserveGooglePlacesRequest(row?.value);
      if (!next) return false;
      await tx.adminConfigState.upsert({ where: { key: 'google-places-usage' }, create: { key: 'google-places-usage', value: next }, update: { value: next } });
      return true;
    }, { maxWait: 3000, timeout: 5000 });
  } catch { return false; }
}
