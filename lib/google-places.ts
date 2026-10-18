import { sourceJson } from '@/lib/source-http';
import { takeGooglePlacesBudget } from '@/lib/google-places-budget';

export type GooglePlaceResult = { status: 'available'; name: string; address: string; rating: number | null; count: number; mapsUrl: string | null;
  reviews: Array<{ text: string; author: string; authorUrl: string | null; avatar: string | null; rating: number; publishedAt: string; url: string | null }>;
  attributions: Array<{ provider: string; url: string | null }>; fetchedAt: string; location?: { latitude: number; longitude: number } } | { status: 'not_configured' | 'identity_unverified' | 'limited' | 'unavailable' };


function googleUrl(value: unknown) {
  if (typeof value !== 'string') return null;
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && !u.username && !u.password && (u.hostname === 'google.com' || u.hostname.endsWith('.google.com') || u.hostname.endsWith('.googleusercontent.com')) ? value : null;
  } catch { return null; }
}

export async function getGooglePlace(placeId?: string, verified = false): Promise<GooglePlaceResult> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (process.env.GOOGLE_PLACES_ENABLED !== '1' || !key || key.startsWith('replace_')) return { status: 'not_configured' };
  if (!placeId || !/^[A-Za-z0-9_-]{10,200}$/.test(placeId) || !verified) return { status: 'identity_unverified' };
  if (!await takeGooglePlacesBudget()) return { status: 'limited' };
  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
    const headers = { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'id,displayName,formattedAddress,rating,userRatingCount,googleMapsUri,reviews,attributions,location' };
    const started = Date.now();
    let p;
    try { p = await sourceJson(url, 12000, { headers }); }
    catch (error) {
      // A transient resolver failure made no successful API request. Retry once on
      // the same host/path/exit; no alternate DNS, proxy or TLS bypass.
      if ((error as { cause?: { code?: string } }).cause?.code !== 'EAI_AGAIN') throw error;
      const remaining = 12000 - (Date.now() - started) - 300;
      if (remaining < 1000) throw error;
      if (!await takeGooglePlacesBudget()) return { status: 'limited' };
      await new Promise(resolve => setTimeout(resolve, 300));
      p = await sourceJson(url, remaining, { headers });
    }
    if (p.id !== placeId || !p.displayName?.text || !p.formattedAddress) return { status: 'unavailable' };
    return { status: 'available', name: p.displayName.text, address: p.formattedAddress,
      rating: typeof p.rating === 'number' && p.rating >= 1 && p.rating <= 5 ? p.rating : null,
      count: Number.isInteger(p.userRatingCount) && p.userRatingCount >= 0 ? p.userRatingCount : 0,
      mapsUrl: googleUrl(p.googleMapsUri), fetchedAt: new Date().toISOString(),
      location: Number.isFinite(p.location?.latitude) && Math.abs(p.location.latitude) <= 90 && Number.isFinite(p.location?.longitude) && Math.abs(p.location.longitude) <= 180 ? { latitude: p.location.latitude, longitude: p.location.longitude } : undefined,
      reviews: (Array.isArray(p.reviews) ? p.reviews : []).slice(0,5).map((r: { text?: {text?: string}; originalText?: {text?:string}; authorAttribution?: {displayName?:string;uri?:string;photoUri?:string}; rating?: number; publishTime?:string; googleMapsUri?:string }) => ({
        text: r.originalText?.text || r.text?.text || '', author: r.authorAttribution?.displayName || '', authorUrl: googleUrl(r.authorAttribution?.uri), avatar: googleUrl(r.authorAttribution?.photoUri),
        rating: typeof r.rating === 'number' && r.rating >= 1 && r.rating <= 5 ? r.rating : 0, publishedAt: r.publishTime || '', url: googleUrl(r.googleMapsUri),
      })).filter((r: {author:string;url:string|null}) => r.author && r.url),
      attributions: (Array.isArray(p.attributions) ? p.attributions : []).map((a: {provider?:string;providerUri?:string}) => ({provider: a.provider || '', url: googleUrl(a.providerUri)})),
    };
  } catch (error) {
    const cause = error as { name?: string; message?: string; cause?: { code?: string } };
    // Diagnostics contain no request URLs, credential headers, review text or user coordinates.
    console.warn('google_places_unavailable', { name: cause.name || 'UnknownError', code: cause.message?.match(/^source_http_(\d{3})$/)?.[1] || cause.cause?.code || 'request_failed' });
    return { status: 'unavailable' };
  }
}
