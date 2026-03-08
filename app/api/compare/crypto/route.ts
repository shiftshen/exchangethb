import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { compareCrypto } from '@/lib/compare';

const schema = z.object({
  symbol: z.enum(['BTC', 'ETH', 'USDT', 'XRP', 'DOGE', 'SOL']).default('BTC'),
  side: z.enum(['buy', 'sell']).default('buy'),
  amount: z.coerce.number().positive().default(1),
});

export async function GET(request: NextRequest) {
  const parsed = schema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  return NextResponse.json({ data: await compareCrypto({ ...parsed.data, quoteMode: 'coin', includeWithdrawal: true, withdrawThb: parsed.data.side === 'sell' }) });
}
