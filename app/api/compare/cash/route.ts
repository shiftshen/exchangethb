import { NextRequest } from 'next/server';
import { z } from 'zod';
import { fail, ok } from '@/lib/api-response';
import { compareCashLive } from '@/lib/cash-live';

const schema = z.object({
  currency: z.enum(['USD', 'CNY', 'EUR', 'JPY', 'GBP']).default('USD'),
  amount: z.coerce.number().positive().default(1000),
  maxDistanceKm: z.coerce.number().positive().default(10),
});

export async function GET(request: NextRequest) {
  const parsed = schema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
  if (!parsed.success) {
    return fail('bad_request', 400, undefined, parsed.error.flatten());
  }
  try {
    const data = await compareCashLive(parsed.data);
    return ok(data);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown';
    return fail('compare_cash_failed', 500, undefined, detail);
  }
}
