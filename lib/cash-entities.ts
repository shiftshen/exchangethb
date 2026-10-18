import { cashBranches, cashProviders } from '@/data/site';
import { readAdminConfig, type BranchOverride } from '@/lib/content-store';

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

export function hasCoordinates(branch: { latitude: number | null; longitude: number | null }): branch is { latitude: number; longitude: number } {
  return branch.latitude !== null && branch.longitude !== null && Number.isFinite(branch.latitude) && Number.isFinite(branch.longitude);
}

export function getBangkokReferenceDistanceKm(branch: { latitude: number | null; longitude: number | null }) {
  return hasCoordinates(branch) ? haversineDistanceKm(branch, bangkokReferencePoint) : 0;
}

export function getUserDistanceKm(
  branch: { latitude: number | null; longitude: number | null },
  userLocation: { latitude: number; longitude: number },
) {
  return hasCoordinates(branch) ? haversineDistanceKm(branch, userLocation) : 0;
}

export function effectiveBranchLocation(branch: { latitude: number | null; longitude: number | null; locationPrecision?: string }, override: BranchOverride, now = Date.now()) {
  const location = override.googleLocation;
  const fetchedAt = location ? Date.parse(location.fetchedAt) : NaN;
  if (override.googlePlaceVerified && location && fetchedAt <= now && now - fetchedAt < 30 * 86_400_000) {
    return { latitude: location.latitude, longitude: location.longitude, locationPrecision: 'address' as const };
  }
  return { latitude: branch.latitude, longitude: branch.longitude, locationPrecision: branch.locationPrecision };
}

export function getVerifiedBranchMapsUrl(branch: { name: string; mapsUrl: string }, override: BranchOverride) {
  return override.googlePlaceVerified && override.googlePlaceId ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.name)}&query_place_id=${encodeURIComponent(override.googlePlaceId)}` : override.mapsUrl || branch.mapsUrl;
}

export async function getEffectiveCashBranches() {
  const config = await readAdminConfig();
  return cashBranches
    .map((branch) => {
      const override = config.branchOverrides[branch.id] || {};
      const location = effectiveBranchLocation(branch, override);
      return {
        ...branch,
        ...location,
        name: override.name || branch.name,
        address: override.address || branch.address,
        hours: override.hours || branch.hours,
        mapsUrl: getVerifiedBranchMapsUrl(branch, override),
        isVisible: override.isVisible ?? true,
        distanceKm: getBangkokReferenceDistanceKm(location),
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
