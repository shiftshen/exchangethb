import { promises as fs } from 'fs';
import path from 'path';

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
  try {
    const raw = await fs.readFile(logPath, 'utf8');
    const logs = JSON.parse(raw) as AuditEntry[];
    return logs.slice(-limit).reverse();
  } catch {
    return [];
  }
}

export async function appendAuditLog(entry: Omit<AuditEntry, 'at'>) {
  await fs.mkdir(path.dirname(logPath), { recursive: true });
  const current = await readAuditLog(2000);
  const next = [...current.reverse(), { at: new Date().toISOString(), ...entry }];
  await fs.writeFile(logPath, JSON.stringify(next.slice(-2000), null, 2));
}
