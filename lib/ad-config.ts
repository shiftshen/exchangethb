// Runtime ad configuration. Values are read on the server at request time so an approved
// network can be switched on by editing env/web.env and restarting the container — no rebuild.
// Nothing is rendered until a zone id is present, so an unapproved network costs nothing.

export type AdNetwork = 'coinzilla' | 'cointraffic';
export type AdSlotName = 'home' | 'cash' | 'currency' | 'profile' | 'rates';

const zoneEnv: Record<AdNetwork, Record<AdSlotName, string>> = {
  coinzilla: {
    home: 'NEXT_COINZILLA_ZONE_HOME',
    cash: 'NEXT_COINZILLA_ZONE_CASH',
    currency: 'NEXT_COINZILLA_ZONE_CURRENCY',
    profile: 'NEXT_COINZILLA_ZONE_PROFILE',
    rates: 'NEXT_COINZILLA_ZONE_RATES',
  },
  cointraffic: {
    home: 'NEXT_COINTRAFFIC_ZONE_HOME',
    cash: 'NEXT_COINTRAFFIC_ZONE_CASH',
    currency: 'NEXT_COINTRAFFIC_ZONE_CURRENCY',
    profile: 'NEXT_COINTRAFFIC_ZONE_PROFILE',
    rates: 'NEXT_COINTRAFFIC_ZONE_RATES',
  },
};

export interface AdZone {
  network: AdNetwork;
  slot: AdSlotName;
  zoneId: string;
}

function readEnv(name: string): string {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

/** Config for a single slot, or null when the network has not been switched on. */
export function adZoneFor(network: AdNetwork, slot: AdSlotName): AdZone | null {
  const zoneId = readEnv(zoneEnv[network][slot]);
  if (!/^[A-Za-z0-9_-]{4,64}$/.test(zoneId)) return null;
  return { network, slot, zoneId };
}

/** True when at least one zone of the network is configured (the loader script is needed). */
export function networkEnabled(network: AdNetwork): boolean {
  const slots: AdSlotName[] = ['home', 'cash', 'currency', 'profile', 'rates'];
  return slots.some((slot) => adZoneFor(network, slot) !== null);
}

export const adNetworkScripts: Record<AdNetwork, string> = {
  coinzilla: 'https://cdn.coinzilla.com/lib/zone.js',
  cointraffic: 'https://cdn.cointraffic.io/js/cointraffic.js',
};
