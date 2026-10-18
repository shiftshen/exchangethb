import { AffiliateLink, AffiliateStatus } from '@/lib/types';

function isActiveWindow(link: AffiliateLink, now: Date) {
  if (!link.startAt && !link.endAt) return true;
  const start = link.startAt ? new Date(link.startAt).getTime() : Number.NEGATIVE_INFINITY;
  const end = link.endAt ? new Date(link.endAt).getTime() : Number.POSITIVE_INFINITY;
  const time = now.getTime();
  if ((link.startAt && !Number.isFinite(start)) || (link.endAt && !Number.isFinite(end))) return false;
  return time >= start && time <= end;
}

export function resolveAffiliateLink(link: AffiliateLink, now = new Date()) {
  const windowActive = isActiveWindow(link, now);
  const hasTracking = Boolean(link.trackingUrl && link.trackingUrl.trim().length > 0);
  let effectiveStatus: AffiliateStatus = link.status;

  if ((link.status === 'campaign_only' || link.status === 'reward_available') && (!windowActive || !hasTracking)) {
    effectiveStatus = 'official_only';
  }

  const outboundUrl = effectiveStatus === 'official_only' ? link.officialUrl : (link.trackingUrl || link.officialUrl);
  return { ...link, effectiveStatus, outboundUrl, downgraded: effectiveStatus !== link.status };
}
