import type { EvidenceCheck } from '@/lib/content-store';
import { recent } from '@/lib/data-quality';

export const licenseLookup = 'https://market.sec.or.th/LicenseCheck/views/DABusiness';
export const cashLicenseLookup = 'https://www.bot.or.th/en/our-roles/financial-markets/foreign-exchange-regulations/foreign-exchange-business/authorized-money-changers.html';
export const referenceRatesUrl = 'https://www.bot.or.th/en/statistics/exchange-rate.html';

export function evidenceState(evidence?: EvidenceCheck, now = Date.now()) {
  if (!evidence || evidence.status === 'unknown') return 'unknown' as const;
  if (!recent(evidence.checkedAt, 366 * 24 * 60 * 60_000, now) || Date.parse(evidence.expiresAt) < now) return 'expired' as const;
  return evidence.status;
}

export function providerEvidence(slug: string, evidence: Record<string, Record<string, EvidenceCheck>> = {}, kind: 'cash' | 'crypto' = 'crypto') {
  const keys = kind === 'cash' ? ['license'] as const : ['license', 'fees', 'operations'] as const;
  return keys.map(key => ({ key, state: evidenceState(evidence[slug]?.[key]),
    sourceUrl: evidence[slug]?.[key]?.sourceUrl || (key === 'license' ? kind === 'cash' ? cashLicenseLookup : licenseLookup : null),
    checkedAt: evidence[slug]?.[key]?.checkedAt || null, expiresAt: evidence[slug]?.[key]?.expiresAt || null,
    note: evidence[slug]?.[key]?.note || '' }));
}
