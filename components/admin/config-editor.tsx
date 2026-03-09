'use client';

import { useMemo, useState } from 'react';
import { trackEvent } from '@/lib/analytics-client';

type AffiliateLink = {
  status: 'reward_available' | 'campaign_only' | 'official_only';
  officialUrl: string;
  trackingUrl?: string;
  startAt?: string;
  endAt?: string;
  disclosure: { th: string; en: string; zh: string };
};

type AdminConfig = {
  affiliateLinks: Record<string, AffiliateLink>;
  feeOverrides: Record<string, number>;
  legal: { updatedAt: string };
};

export function ConfigEditor({ initialConfig, initialCachePreview }: { initialConfig: AdminConfig; initialCachePreview: string }) {
  const [config, setConfig] = useState(initialConfig);
  const [cachePreview, setCachePreview] = useState(initialCachePreview);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const feeRows = useMemo(() => Object.entries(config.feeOverrides), [config.feeOverrides]);

  async function save() {
    setSaving(true);
    setMessage('');
    trackEvent('admin_config_save_attempt');
    const response = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...config, legal: { updatedAt: new Date().toISOString() } }),
    });
    setSaving(false);
    trackEvent('admin_config_save_result', { ok: response.ok });
    setMessage(response.ok ? 'Saved.' : 'Save failed.');
  }

  async function refreshCash() {
    setSaving(true);
    setMessage('');
    trackEvent('admin_cash_refresh_attempt');
    const response = await fetch('/api/admin/scrape-cash', { method: 'POST' });
    const data = await response.json().catch(() => null);
    if (data?.data) setCachePreview(JSON.stringify(data.data, null, 2));
    setSaving(false);
    trackEvent('admin_cash_refresh_result', { ok: response.ok });
    setMessage(response.ok ? 'Cash scrape refreshed.' : 'Cash scrape failed.');
  }

  function updateFeeOverride(key: string, value: string) {
    setConfig({ ...config, feeOverrides: { ...config.feeOverrides, [key]: Number(value) } });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {Object.entries(config.affiliateLinks).map(([slug, link]) => (
          <div key={slug} className="rounded-2xl border border-stone-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">{slug}</h3>
              <select value={link.status} onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...link, status: event.target.value as AffiliateLink['status'] } } })} className="rounded-xl border border-stone-300 px-3 py-2 text-sm">
                <option value="official_only">official_only</option>
                <option value="campaign_only">campaign_only</option>
                <option value="reward_available">reward_available</option>
              </select>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <input className="rounded-xl border border-stone-300 px-3 py-2 text-sm" value={link.officialUrl} onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...link, officialUrl: event.target.value } } })} />
              <input className="rounded-xl border border-stone-300 px-3 py-2 text-sm" placeholder="Tracking URL" value={link.trackingUrl || ''} onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...link, trackingUrl: event.target.value } } })} />
              <input className="rounded-xl border border-stone-300 px-3 py-2 text-sm" placeholder="Campaign start (ISO)" value={link.startAt || ''} onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...link, startAt: event.target.value } } })} />
              <input className="rounded-xl border border-stone-300 px-3 py-2 text-sm" placeholder="Campaign end (ISO)" value={link.endAt || ''} onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...link, endAt: event.target.value } } })} />
              <input className="rounded-xl border border-stone-300 px-3 py-2 text-sm" value={link.disclosure.en} onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...link, disclosure: { ...link.disclosure, en: event.target.value } } } })} />
              <input className="rounded-xl border border-stone-300 px-3 py-2 text-sm" value={link.disclosure.th} onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...link, disclosure: { ...link.disclosure, th: event.target.value } } } })} />
              <input className="rounded-xl border border-stone-300 px-3 py-2 text-sm" value={link.disclosure.zh} onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...link, disclosure: { ...link.disclosure, zh: event.target.value } } } })} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-stone-200 p-4">
        <h3 className="font-semibold">Fee overrides</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {feeRows.map(([key, value]) => (
            <label key={key} className="space-y-2 text-sm">
              <span className="block text-stone-600">{key}</span>
              <input type="number" step="0.01" className="w-full rounded-xl border border-stone-300 px-3 py-2" value={value} onChange={(event) => updateFeeOverride(key, event.target.value)} />
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={save} disabled={saving} className="rounded-full bg-brand-700 px-5 py-3 text-sm font-medium text-white">{saving ? 'Working...' : 'Save admin config'}</button>
        <button onClick={refreshCash} disabled={saving} className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium">Refresh cash scrape cache</button>
      </div>
      {message ? <p className="text-sm text-stone-600">{message}</p> : null}

      <div className="rounded-2xl border border-stone-200 p-4">
        <h3 className="font-semibold">Cash scrape cache preview</h3>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-stone-950 p-4 text-xs text-stone-100">{cachePreview}</pre>
      </div>
    </div>
  );
}
