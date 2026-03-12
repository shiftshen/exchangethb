'use client';

import { useMemo, useState } from 'react';

type AdminConfig = {
  affiliateLinks: Record<string, unknown>;
  feeOverrides: Record<string, number>;
  exchangeProfiles: Record<string, unknown>;
  branchOverrides: Record<string, unknown>;
  scrapeReview: {
    hiddenAlerts: string[];
    providerModes: Record<string, 'auto' | 'force_fallback' | 'force_live'>;
    reviewNotes: Record<string, string>;
  };
  legal: { updatedAt: string };
};

type AlertRow = { provider: string; message: string; critical: boolean; observedAt: string | null };

export function ScrapeReviewEditor({ initialConfig, providers, alerts }: { initialConfig: AdminConfig; providers: string[]; alerts: AlertRow[] }) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const alertKeySet = useMemo(() => new Set(config.scrapeReview.hiddenAlerts), [config.scrapeReview.hiddenAlerts]);

  async function save() {
    setSaving(true);
    setMessage('');
    const response = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...config, legal: { updatedAt: new Date().toISOString() } }),
    });
    setSaving(false);
    setMessage(response.ok ? '已保存。' : '保存失败。');
  }

  async function rollback() {
    setSaving(true);
    setMessage('');
    const response = await fetch('/api/admin/scrape-cash/rollback', { method: 'POST' });
    setSaving(false);
    setMessage(response.ok ? '已回滚到上一份缓存快照。' : '回滚失败。');
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-200 p-4">
        <h3 className="font-semibold">Provider 审核模式</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {providers.map((provider) => (
            <div key={provider} className="rounded-xl border border-stone-200 p-3">
              <p className="text-sm font-semibold">{provider}</p>
              <select className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm" value={config.scrapeReview.providerModes[provider] || 'auto'} onChange={(event) => setConfig({ ...config, scrapeReview: { ...config.scrapeReview, providerModes: { ...config.scrapeReview.providerModes, [provider]: event.target.value as 'auto' | 'force_fallback' | 'force_live' } } })}>
                <option value="auto">自动判断</option>
                <option value="force_fallback">强制备用</option>
                <option value="force_live">强制实时</option>
              </select>
              <input className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm" placeholder="审核备注，例如：官方源短时异常，先回退" value={config.scrapeReview.reviewNotes[provider] || ''} onChange={(event) => setConfig({ ...config, scrapeReview: { ...config.scrapeReview, reviewNotes: { ...config.scrapeReview.reviewNotes, [provider]: event.target.value } } })} />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-stone-200 p-4">
        <h3 className="font-semibold">异常审核</h3>
        <div className="mt-4 space-y-2">
          {alerts.map((alert, index) => {
            const key = `${alert.provider} ${alert.message}`;
            const hidden = alertKeySet.has(key);
            return (
              <label key={`${key}-${index}`} className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${alert.critical ? 'border-rose-200 bg-rose-50' : 'border-amber-200 bg-amber-50'}`}>
                <input type="checkbox" checked={hidden} onChange={(event) => {
                  const next = new Set(config.scrapeReview.hiddenAlerts);
                  if (event.target.checked) next.add(key); else next.delete(key);
                  setConfig({ ...config, scrapeReview: { ...config.scrapeReview, hiddenAlerts: [...next] } });
                }} />
                <span>{alert.provider} · {alert.message}</span>
              </label>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="rounded-full bg-brand-700 px-5 py-3 text-sm font-medium text-white">{saving ? '处理中...' : '保存审核设置'}</button>
        <button onClick={rollback} disabled={saving} className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium">{saving ? '处理中...' : '回滚现金缓存'}</button>
        {message ? <span className="text-sm text-stone-600">{message}</span> : null}
      </div>
    </div>
  );
}
