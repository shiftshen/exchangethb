import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { compareCash } from '@/lib/compare';

const schema = z.object({
  currency: z.enum(['USD', 'CNY', 'EUR', 'JPY', 'GBP']).default('USD'),
  amount: z.coerce.number().positive().default(1000),
  maxDistanceKm: z.coerce.number().positive().default(10),
});

export async function GET(request: NextRequest) {
  const parsed = schema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  return NextResponse.json({ data: await compareCash(parsed.data) });
}
