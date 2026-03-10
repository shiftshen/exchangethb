'use client';

import { useState } from 'react';

type BranchOverride = {
  name?: string;
  address?: string;
  hours?: string;
  mapsUrl?: string;
  isVisible?: boolean;
};

type AdminConfig = {
  affiliateLinks: Record<string, unknown>;
  feeOverrides: Record<string, number>;
  exchangeProfiles: Record<string, unknown>;
  branchOverrides: Record<string, BranchOverride>;
  scrapeReview: { hiddenAlerts: string[]; providerModes: Record<string, string>; reviewNotes: Record<string, string> };
  legal: { updatedAt: string };
};

type BranchRow = {
  id: string;
  providerSlug: string;
  name: string;
  address: string;
  hours: string;
  mapsUrl: string;
};

export function BranchManagerEditor({ initialConfig, branches }: { initialConfig: AdminConfig; branches: BranchRow[] }) {
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
      {branches.map((branch) => {
        const override = config.branchOverrides[branch.id] || {};
        return (
          <div key={branch.id} className="rounded-2xl border border-stone-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">{branch.providerSlug} · {branch.id}</h3>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={override.isVisible ?? true} onChange={(event) => setConfig({ ...config, branchOverrides: { ...config.branchOverrides, [branch.id]: { ...override, isVisible: event.target.checked } } })} />
                visible
              </label>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input className="rounded-xl border border-stone-300 px-3 py-2 text-sm" value={override.name ?? branch.name} onChange={(event) => setConfig({ ...config, branchOverrides: { ...config.branchOverrides, [branch.id]: { ...override, name: event.target.value } } })} />
              <input className="rounded-xl border border-stone-300 px-3 py-2 text-sm" value={override.address ?? branch.address} onChange={(event) => setConfig({ ...config, branchOverrides: { ...config.branchOverrides, [branch.id]: { ...override, address: event.target.value } } })} />
              <input className="rounded-xl border border-stone-300 px-3 py-2 text-sm" value={override.hours ?? branch.hours} onChange={(event) => setConfig({ ...config, branchOverrides: { ...config.branchOverrides, [branch.id]: { ...override, hours: event.target.value } } })} />
              <input className="rounded-xl border border-stone-300 px-3 py-2 text-sm" value={override.mapsUrl ?? branch.mapsUrl} onChange={(event) => setConfig({ ...config, branchOverrides: { ...config.branchOverrides, [branch.id]: { ...override, mapsUrl: event.target.value } } })} />
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="rounded-full bg-brand-700 px-5 py-3 text-sm font-medium text-white">{saving ? 'Working...' : 'Save branches'}</button>
        {message ? <span className="text-sm text-stone-600">{message}</span> : null}
      </div>
    </div>
  );
}
