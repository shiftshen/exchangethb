import { NextRequest } from 'next/server';
import { z } from 'zod';
import { fail, ok } from '@/lib/api-response';
import { compareCrypto } from '@/lib/compare';

const schema = z.object({
  symbol: z.enum(['BTC', 'ETH', 'USDT', 'XRP', 'DOGE', 'SOL']).default('BTC'),
  side: z.enum(['buy', 'sell']).default('buy'),
  amount: z.coerce.number().positive().default(1),
});

export async function GET(request: NextRequest) {
  const parsed = schema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
  if (!parsed.success) {
    return fail('bad_request', 400, undefined, parsed.error.flatten());
  }
  try {
    const data = await compareCrypto({ ...parsed.data, quoteMode: 'coin', includeWithdrawal: true, withdrawThb: parsed.data.side === 'sell' });
    return ok(data);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown';
    return fail('compare_crypto_failed', 500, undefined, detail);
  }
}
