import { getAdminSession } from '@/lib/auth';
import { getAdminCashHealth } from '@/lib/admin-cash-health';

function escapeCsv(value: string) {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return new Response('unauthorized', { status: 401 });
  }
  const url = new URL(request.url);
  const status = url.searchParams.get('status') || 'all';
  const criticalOnly = url.searchParams.get('critical') === '1';
  const data = await getAdminCashHealth();
  const providers = data.providerHealth.filter((item) => status === 'all' || item.status === status);
  const alerts = data.alerts.filter((item) => !criticalOnly || item.critical);
  const providerRows = providers.map((item) => [
    'provider_health',
    item.providerSlug,
    item.status,
    item.reasons.join('|'),
    item.currencies.join('|'),
    '',
  ]);
  const alertRows = alerts.map((item) => [
    'alert',
    item.provider,
    item.critical ? 'critical' : 'warning',
    '',
    '',
    item.message,
  ]);
  const lines = [
    ['type', 'provider', 'status', 'reasons', 'currencies', 'message'],
    ...providerRows,
    ...alertRows,
  ];
  const csv = `${lines.map((line) => line.map((cell) => escapeCsv(cell)).join(',')).join('\n')}\n`;
  return new Response(csv, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="cash-health-${Date.now()}.csv"`,
    },
  });
}
