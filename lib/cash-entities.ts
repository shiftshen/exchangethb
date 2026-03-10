import { cashBranches, cashProviders } from '@/data/site';
import { readAdminConfig } from '@/lib/content-store';

export async function getEffectiveCashBranches() {
  const config = await readAdminConfig();
  return cashBranches
    .map((branch) => {
      const override = config.branchOverrides[branch.id] || {};
      return {
        ...branch,
        name: override.name || branch.name,
        address: override.address || branch.address,
        hours: override.hours || branch.hours,
        mapsUrl: override.mapsUrl || branch.mapsUrl,
        isVisible: override.isVisible ?? true,
      };
    })
    .filter((branch) => branch.isVisible);
}

export async function getEffectiveCashProviders() {
  const config = await readAdminConfig();
  return cashProviders.map((provider) => {
    const mode = config.scrapeReview.providerModes[provider.slug] || 'auto';
    const note = config.scrapeReview.reviewNotes[provider.slug] || '';
    return { ...provider, reviewMode: mode, reviewNote: note };
  });
}
