import { promises as fs } from 'fs';
import path from 'path';
import { AffiliateLink, ExchangeSlug } from '@/lib/types';
import { cashBranches, exchanges } from '@/data/site';

const storePath = path.join(process.cwd(), 'content', 'admin-config.json');

export type ScrapeReviewProviderMode = 'auto' | 'force_fallback' | 'force_live';

export interface ExchangeProfileOverride {
  recommended: boolean;
  tags: string[];
  riskNote: string;
}

export interface BranchOverride {
  name?: string;
  address?: string;
  hours?: string;
  mapsUrl?: string;
  isVisible?: boolean;
}

export interface AdminConfigStore {
  affiliateLinks: Record<ExchangeSlug, AffiliateLink>;
  feeOverrides: Record<string, number>;
  exchangeProfiles: Record<string, ExchangeProfileOverride>;
  branchOverrides: Record<string, BranchOverride>;
  scrapeReview: {
    hiddenAlerts: string[];
    providerModes: Record<string, ScrapeReviewProviderMode>;
    reviewNotes: Record<string, string>;
  };
  legal: { updatedAt: string };
}

function defaultExchangeProfiles() {
  return Object.fromEntries(exchanges.map((exchange) => [exchange.slug, { recommended: true, tags: [], riskNote: '' }])) as Record<string, ExchangeProfileOverride>;
}

function defaultBranchOverrides() {
  return Object.fromEntries(cashBranches.map((branch) => [branch.id, { isVisible: true }])) as Record<string, BranchOverride>;
}

function defaultConfig(): AdminConfigStore {
  return {
    affiliateLinks: {} as Record<ExchangeSlug, AffiliateLink>,
    feeOverrides: {},
    exchangeProfiles: defaultExchangeProfiles(),
    branchOverrides: defaultBranchOverrides(),
    scrapeReview: {
      hiddenAlerts: [],
      providerModes: {},
      reviewNotes: {},
    },
    legal: { updatedAt: new Date().toISOString() },
  };
}

function normalizeConfig(input: Partial<AdminConfigStore>): AdminConfigStore {
  const base = defaultConfig();
  return {
    ...base,
    ...input,
    affiliateLinks: { ...base.affiliateLinks, ...(input.affiliateLinks || {}) },
    feeOverrides: { ...base.feeOverrides, ...(input.feeOverrides || {}) },
    exchangeProfiles: { ...base.exchangeProfiles, ...(input.exchangeProfiles || {}) },
    branchOverrides: { ...base.branchOverrides, ...(input.branchOverrides || {}) },
    scrapeReview: {
      hiddenAlerts: input.scrapeReview?.hiddenAlerts || [],
      providerModes: input.scrapeReview?.providerModes || {},
      reviewNotes: input.scrapeReview?.reviewNotes || {},
    },
    legal: input.legal || base.legal,
  };
}

export async function readAdminConfig(): Promise<AdminConfigStore> {
  try {
    const raw = await fs.readFile(storePath, 'utf8');
    return normalizeConfig(JSON.parse(raw) as Partial<AdminConfigStore>);
  } catch {
    return defaultConfig();
  }
}

export async function writeAdminConfig(config: AdminConfigStore) {
  await fs.writeFile(storePath, JSON.stringify(normalizeConfig(config), null, 2));
}
