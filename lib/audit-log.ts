import { promises as fs } from 'fs';
import path from 'path';
import { getPrismaClient } from '@/lib/prisma';

const logPath = path.join(process.cwd(), 'content', 'admin-audit-log.json');

export interface AuditEntry {
  at: string;
  actor: string;
  action: string;
  target: string;
  ip?: string;
  note?: string;
}

export async function readAuditLog(limit = 50): Promise<AuditEntry[]> {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const logs = await prisma.adminAuditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return logs.map((row) => {
        const payload = (row.payload || {}) as { ip?: string; note?: string };
        return {
          at: row.createdAt.toISOString(),
          actor: row.adminEmail,
          action: row.action,
          target: row.target,
          ip: payload.ip,
          note: payload.note,
        };
      });
    } catch {
      // Fall back to file storage when DB is unavailable.
    }
  }
  try {
    const raw = await fs.readFile(logPath, 'utf8');
    const logs = JSON.parse(raw) as AuditEntry[];
    return logs.slice(-limit).reverse();
  } catch {
    return [];
  }
}

export async function appendAuditLog(entry: Omit<AuditEntry, 'at'>) {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      await prisma.adminAuditLog.create({
        data: {
          adminEmail: entry.actor,
          action: entry.action,
          target: entry.target,
          payload: {
            ip: entry.ip,
            note: entry.note,
          },
        },
      });
      return;
    } catch {
      // Fall through to file persistence.
    }
  }
  await fs.mkdir(path.dirname(logPath), { recursive: true });
  const current = await readAuditLog(2000);
  const next = [...current.reverse(), { at: new Date().toISOString(), ...entry }];
  await fs.writeFile(logPath, JSON.stringify(next.slice(-2000), null, 2));
}
