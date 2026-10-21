import { adNetworkScripts, adZoneFor, networkEnabled, type AdNetwork, type AdSlotName } from '@/lib/ad-config';

/**
 * Server-rendered ad container. Renders nothing at all until the network's zone id is set in
 * the container environment, so an unapproved network never ships empty markup or a 404 script.
 */
export function AdSlot({ network, slot, className }: { network: AdNetwork; slot: AdSlotName; className?: string }) {
  const zone = adZoneFor(network, slot);
  if (!zone) return null;
  return (
    <aside className={className ?? 'my-8'} aria-label="Advertisement" data-ad-network={zone.network} data-ad-slot={zone.slot}>
      <div className="ad-container" data-ad-zone={zone.zoneId} data-network={zone.network} />
      {networkEnabled(network) ? <script src={adNetworkScripts[network]} async data-ad-loader={network} /> : null}
    </aside>
  );
}
