import { cashBranches, cashProviders } from '@/data/site';
import { readAdminConfig } from '@/lib/content-store';

const bangkokReferencePoint = {
  latitude: 13.7563,
  longitude: 100.5018,
};

export function haversineDistanceKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);
  const angle = Math.sin(dLat / 2) ** 2
    + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const distance = 2 * earthRadiusKm * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle));
  return Number(distance.toFixed(1));
}

export function getBangkokReferenceDistanceKm(branch: { latitude: number; longitude: number }) {
  return haversineDistanceKm(branch, bangkokReferencePoint);
}

export function getUserDistanceKm(
  branch: { latitude: number; longitude: number },
  userLocation: { latitude: number; longitude: number },
) {
  return haversineDistanceKm(branch, userLocation);
}

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
        distanceKm: getBangkokReferenceDistanceKm(branch),
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
