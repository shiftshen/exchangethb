import { afterEach, expect, it, vi } from 'vitest';
const store = vi.hoisted(() => ({ value: undefined as unknown }));
vi.mock('@/lib/prisma', () => ({ getPrismaClient: () => ({ $transaction: async (run: (tx: unknown) => Promise<boolean>) => run({
  $executeRaw: vi.fn(), adminConfigState: { findUnique: async () => store.value === undefined ? null : { value: store.value }, upsert: async (args: { update: { value: unknown } }) => { store.value = args.update.value; } },
}) }) }));
afterEach(() => { vi.useRealTimers(); store.value = undefined; vi.resetModules(); });
it('retains the allowance across isolated module instances and hour boundaries', async () => {
  vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-02T00:00:00Z'));
  const first = await import('@/lib/google-places-budget');
  for (let i = 0; i < 25; i++) expect(await first.takeGooglePlacesBudget()).toBe(true);
  vi.resetModules(); const restarted = await import('@/lib/google-places-budget');
  expect(await restarted.takeGooglePlacesBudget()).toBe(false);
  vi.setSystemTime(new Date('2026-10-02T01:00:00Z'));
  expect(await restarted.takeGooglePlacesBudget()).toBe(false); // Daily allowance survives the hour reset.
  vi.setSystemTime(new Date('2026-10-03T00:00:00Z'));
  expect(await restarted.takeGooglePlacesBudget()).toBe(true);
});
it('fails closed for corrupted saved counters', async () => {
  store.value = { hourly: -1 }; const budget = await import('@/lib/google-places-budget');
  expect(await budget.takeGooglePlacesBudget()).toBe(false);
});
