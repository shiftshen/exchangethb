import type { NextRequest } from 'next/server';
import { cashBranches, publicCashProviders, exchanges } from '@/data/site';
import { readAdminConfig } from '@/lib/content-store';
import { getGooglePlace } from '@/lib/google-places';
import { getPrismaClient } from '@/lib/prisma';
import { providerEvidence } from '@/lib/provider-evidence';
import { fail, ok } from '@/lib/api-response';

export async function GET(request: NextRequest, { params }: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug } = await params;
  if (!(kind === 'cash' ? publicCashProviders : kind === 'crypto' ? exchanges : []).some(p => p.slug === slug)) return fail('not_found',404);
  const config = await readAdminConfig();
  const branch = cashBranches.find(b => b.providerSlug === slug && b.id === request.nextUrl.searchParams.get('branch'));
  const branchConfig = branch ? config.branchOverrides[branch.id] : undefined;
  const google = kind === 'cash' ? await getGooglePlace(branchConfig?.googlePlaceId,branchConfig?.googlePlaceVerified) : null;
  if (branch && google?.status === 'available' && google.location) {
    // Refresh only the coordinate cache; never persist Google's reviews, stars or author details.
    // Match the current place identity atomically so a concurrent admin edit cannot be overwritten.
    try {
      const db = getPrismaClient();
      if (db) await db.$executeRaw`UPDATE "AdminConfigState" SET "value" = jsonb_set("value", ARRAY['branchOverrides', ${branch.id}, 'googleLocation']::text[], ${JSON.stringify({ ...google.location, fetchedAt: google.fetchedAt })}::jsonb), "updatedAt" = NOW() WHERE "key" = 'global' AND "value"->'branchOverrides'->${branch.id}->>'googlePlaceId' = ${branchConfig?.googlePlaceId || ''} AND "value"->'branchOverrides'->${branch.id}->>'googlePlaceVerified' = 'true'`;
    } catch { /* The current review response remains valid if coordinate persistence fails. */ }
  }
  const response = ok({ evidence: providerEvidence(slug,config.evidence,kind as 'cash' | 'crypto'), google, branch: branch ? { id:branch.id,name:branch.name,address:branch.address } : null });
  response.headers.set('Cache-Control','private, no-store');
  return response;
}
