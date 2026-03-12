import { promises as fs } from 'fs';
import path from 'path';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { AffiliateLink, ExchangeSlug } from '@/lib/types';
import { cashBranches, exchanges } from '@/data/site';
import { getPrismaClient } from '@/lib/prisma';

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

const copyGroupSchema = z.object({
  th: z.string(),
  en: z.string(),
  zh: z.string(),
});

const affiliateLinkSchema = z.object({
  status: z.enum(['reward_available', 'campaign_only', 'official_only']),
  trackingUrl: z.string().optional(),
  officialUrl: z.string(),
  disclosure: copyGroupSchema,
  startAt: z.string().optional(),
  endAt: z.string().optional(),
});

const exchangeProfileSchema = z.object({
  recommended: z.boolean(),
  tags: z.array(z.string()),
  riskNote: z.string(),
});

const branchOverrideSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  hours: z.string().optional(),
  mapsUrl: z.string().optional(),
  isVisible: z.boolean().optional(),
});

const adminConfigSchema = z.object({
  affiliateLinks: z.record(z.string(), affiliateLinkSchema).default({}),
  feeOverrides: z.record(z.string(), z.number()).default({}),
  exchangeProfiles: z.record(z.string(), exchangeProfileSchema).default({}),
  branchOverrides: z.record(z.string(), branchOverrideSchema).default({}),
  scrapeReview: z.object({
    hiddenAlerts: z.array(z.string()).default([]),
    providerModes: z.record(z.string(), z.enum(['auto', 'force_fallback', 'force_live'])).default({}),
    reviewNotes: z.record(z.string(), z.string()).default({}),
  }).default({
    hiddenAlerts: [],
    providerModes: {},
    reviewNotes: {},
  }),
  legal: z.object({
    updatedAt: z.string(),
  }).default({ updatedAt: new Date().toISOString() }),
});

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

export function parseAdminConfig(input: unknown): AdminConfigStore {
  const parsed = adminConfigSchema.parse(input);
  return normalizeConfig(parsed);
}

function toJsonValue<T>(value: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function readAdminConfig(): Promise<AdminConfigStore> {
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      const state = await prisma.adminConfigState.findUnique({ where: { key: 'global' } });
      if (state?.value) {
        return parseAdminConfig(state.value);
      }
    } catch {
      // Fall back to file storage when DB is unavailable.
    }
  }
  try {
    const raw = await fs.readFile(storePath, 'utf8');
    return parseAdminConfig(JSON.parse(raw));
  } catch {
    return defaultConfig();
  }
}

export async function writeAdminConfig(config: AdminConfigStore) {
  const normalized = parseAdminConfig(config);
  const prisma = getPrismaClient();
  if (prisma) {
    try {
      await prisma.adminConfigState.upsert({
        where: { key: 'global' },
        update: { value: toJsonValue(normalized) },
        create: { key: 'global', value: toJsonValue(normalized) },
      });
    } catch {
      // Fall through to file persistence.
    }
  }
  await fs.writeFile(storePath, JSON.stringify(normalized, null, 2));
}
