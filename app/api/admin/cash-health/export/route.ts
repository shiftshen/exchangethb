import { getAdminSession } from '@/lib/auth';
import { getAdminCashHealth } from '@/lib/admin-cash-health';

const exportFields = ['type', 'provider', 'status', 'severity', 'reasons', 'currencies', 'observedAt', 'message'] as const;

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
  const range = url.searchParams.get('range') || 'all';
  const fieldsRequested = (url.searchParams.get('fields') || '').split(',').map((item) => item.trim()).filter(Boolean);
  const selectedFields = [...new Set(fieldsRequested.filter((item): item is typeof exportFields[number] => exportFields.includes(item as typeof exportFields[number])))];
  const fields = selectedFields.length ? selectedFields : [...exportFields];
  const data = await getAdminCashHealth({ range });
  const providers = data.providerHealth.filter((item) => status === 'all' || item.status === status);
  const alerts = data.alerts.filter((item) => !criticalOnly || item.critical);
  const providerRows = providers.map((item) => ({
    type: 'provider_health',
    provider: item.providerSlug,
    status: item.status,
    severity: '',
    reasons: item.reasons.join('|'),
    currencies: item.currencies.join('|'),
    observedAt: item.observedAt || '',
    message: '',
  }));
  const alertRows = alerts.map((item) => ({
    type: 'alert',
    provider: item.provider,
    status: '',
    severity: item.critical ? 'critical' : 'warning',
    reasons: '',
    currencies: '',
    observedAt: item.observedAt || '',
    message: item.message,
  }));
  const records = [...providerRows, ...alertRows];
  const lines = [
    fields,
    ...records.map((record) => fields.map((field) => record[field] || '')),
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
