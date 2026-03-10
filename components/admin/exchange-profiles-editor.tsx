'use client';

import { useState } from 'react';

type Profile = {
  recommended: boolean;
  tags: string[];
  riskNote: string;
};

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
  exchangeProfiles: Record<string, Profile>;
  branchOverrides: Record<string, unknown>;
  scrapeReview: { hiddenAlerts: string[]; providerModes: Record<string, string>; reviewNotes: Record<string, string> };
  legal: { updatedAt: string };
};

export function ExchangeProfilesEditor({ initialConfig, exchangeSlugs }: { initialConfig: AdminConfig; exchangeSlugs: string[] }) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function save() {
    setSaving(true);
    setMessage('');
    const response = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...config, legal: { updatedAt: new Date().toISOString() } }),
    });
    setSaving(false);
    setMessage(response.ok ? 'Saved.' : 'Save failed.');
  }

  return (
    <div className="space-y-4">
      {exchangeSlugs.map((slug) => {
        const profile = config.exchangeProfiles[slug] || { recommended: true, tags: [], riskNote: '' };
        return (
          <div key={slug} className="rounded-2xl border border-stone-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">{slug}</h3>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={profile.recommended} onChange={(event) => setConfig({ ...config, exchangeProfiles: { ...config.exchangeProfiles, [slug]: { ...profile, recommended: event.target.checked } } })} />
                recommended
              </label>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input className="rounded-xl border border-stone-300 px-3 py-2 text-sm" value={profile.tags.join(', ')} placeholder="tags: liquidity,thb,secure" onChange={(event) => setConfig({ ...config, exchangeProfiles: { ...config.exchangeProfiles, [slug]: { ...profile, tags: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) } } })} />
              <input className="rounded-xl border border-stone-300 px-3 py-2 text-sm" value={profile.riskNote} placeholder="risk note" onChange={(event) => setConfig({ ...config, exchangeProfiles: { ...config.exchangeProfiles, [slug]: { ...profile, riskNote: event.target.value } } })} />
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="rounded-full bg-brand-700 px-5 py-3 text-sm font-medium text-white">{saving ? 'Working...' : 'Save exchange profiles'}</button>
        {message ? <span className="text-sm text-stone-600">{message}</span> : null}
      </div>
    </div>
  );
}
