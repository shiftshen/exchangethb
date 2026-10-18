import { cashCurrencies } from '@/lib/types';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { fail, ok } from '@/lib/api-response';
import { compareCashLive } from '@/lib/cash-live';

const schema = z.object({
  currency: z.enum(cashCurrencies).default('USD'),
  amount: z.coerce.number().finite().positive().max(1e12).default(1000),
  side: z.enum(['buy', 'sell']).default('sell'),
  banknote: z.coerce.number().finite().positive().max(1e6).optional(),
  maxDistanceKm: z.coerce.number().positive().default(10),
  userLat: z.coerce.number().min(-90).max(90).optional(),
  userLng: z.coerce.number().min(-180).max(180).optional(),
  prioritizeNearest: z.enum(['true', 'false']).default('false').transform(value => value === 'true'),
});

export async function GET(request: NextRequest) {
  const parsed = schema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
  if (!parsed.success) {
    return fail('bad_request', 400, undefined, parsed.error.flatten());
  }
  try {
    const data = await compareCashLive({
      currency: parsed.data.currency,
      amount: parsed.data.amount,
      side: parsed.data.side,
      banknote: parsed.data.banknote,
      maxDistanceKm: parsed.data.maxDistanceKm,
      prioritizeNearest: parsed.data.prioritizeNearest,
      userLatitude: parsed.data.userLat,
      userLongitude: parsed.data.userLng,
    });
    return ok(data);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown';
    return fail('compare_cash_failed', 500, undefined, detail);
  }
}
