import { NextRequest } from 'next/server';
import { appendAuditLog } from '@/lib/audit-log';
import { fail, ok } from '@/lib/api-response';
import { getAdminSession } from '@/lib/auth';
import { readAdminConfig, writeAdminConfig } from '@/lib/content-store';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return fail('unauthorized', 401);
  return ok(await readAdminConfig());
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return fail('unauthorized', 401);
  try {
    const body = await request.json();
    await writeAdminConfig(body);
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;
    await appendAuditLog({ actor: session, action: 'admin.config.updated', target: 'admin-config', ip });
    return ok(true);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'unknown';
    return fail('admin_config_update_failed', 500, undefined, detail);
  }
}
