import { fail, ok } from '@/lib/api-response';
import { getAdminSession } from '@/lib/auth';
import { readAuditLog } from '@/lib/audit-log';

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return fail('unauthorized', 401);
  const url = new URL(request.url);
  const action = (url.searchParams.get('action') || '').trim();
  const limitRaw = Number(url.searchParams.get('limit') || '100');
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(500, Math.floor(limitRaw)) : 100;
  const logs = await readAuditLog(2000);
  const filtered = action ? logs.filter((row) => row.action.includes(action)) : logs;
  return ok(filtered.slice(0, limit));
}
