import { promises as fs } from 'fs';
import path from 'path';
import { AffiliateLink, ExchangeSlug } from '@/lib/types';

const storePath = path.join(process.cwd(), 'content', 'admin-config.json');

export interface AdminConfigStore {
  affiliateLinks: Record<ExchangeSlug, AffiliateLink>;
  feeOverrides: Record<string, number>;
  legal: { updatedAt: string };
}

export async function readAdminConfig(): Promise<AdminConfigStore> {
  const raw = await fs.readFile(storePath, 'utf8');
  return JSON.parse(raw) as AdminConfigStore;
}

export async function writeAdminConfig(config: AdminConfigStore) {
  await fs.writeFile(storePath, JSON.stringify(config, null, 2));
}
