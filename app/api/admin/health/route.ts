import { NextResponse } from 'next/server';
import { getAdapterHealth } from '@/lib/market-data';
import { runCashScrapers } from '@/lib/scrapers/cash';

export async function GET() {
  const [health, cash] = await Promise.all([getAdapterHealth(), runCashScrapers()]);
  return NextResponse.json({
    status: 'ok',
    services: ['web', 'worker', 'postgres', 'redis'],
    marketAdapters: health,
    cashScrapers: cash.map((item) => ({ provider: item.provider, ok: item.ok, notes: item.notes })),
    timestamp: new Date().toISOString(),
  });
}
