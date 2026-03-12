'use client';

import { useState } from 'react';

type Profile = {
  recommended: boolean;
  tags: string[];
  riskNote: string;
};

type LinkStatus = 'reward_available' | 'campaign_only' | 'official_only';

type AffiliateLink = {
  status: LinkStatus;
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

  const statusOptions: Array<{ value: LinkStatus; label: string }> = [
    { value: 'reward_available', label: '优先走统计链接' },
    { value: 'campaign_only', label: '活动专用链接' },
    { value: 'official_only', label: '只走官网链接' },
  ];

  function toDateTimeLocal(value?: string) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const offsetMs = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
  }

  function fromDateTimeLocal(value: string) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString();
  }

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

  return (
    <div className="space-y-4">
      {exchangeSlugs.map((slug) => {
        const profile = config.exchangeProfiles[slug] || { recommended: true, tags: [], riskNote: '' };
        const affiliate = config.affiliateLinks[slug] || {
          status: 'official_only' as AffiliateLink['status'],
          officialUrl: '',
          trackingUrl: '',
          startAt: '',
          endAt: '',
          disclosure: { th: '', en: '', zh: '' },
        };
        return (
          <div key={slug} className="space-y-4 rounded-2xl border border-stone-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">{slug}</h3>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={profile.recommended} onChange={(event) => setConfig({ ...config, exchangeProfiles: { ...config.exchangeProfiles, [slug]: { ...profile, recommended: event.target.checked } } })} />
                推荐展示
              </label>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-stone-700">标签</label>
                <input className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm" value={profile.tags.join(', ')} placeholder="例如：liquidity, thb, secure" onChange={(event) => setConfig({ ...config, exchangeProfiles: { ...config.exchangeProfiles, [slug]: { ...profile, tags: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) } } })} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-stone-700">风险说明</label>
                <input className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm" value={profile.riskNote} placeholder="例如：提现时间可能随网络拥堵波动" onChange={(event) => setConfig({ ...config, exchangeProfiles: { ...config.exchangeProfiles, [slug]: { ...profile, riskNote: event.target.value } } })} />
              </div>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-medium text-stone-900">跳转链接设置</h4>
                  <p className="mt-1 text-sm text-stone-600">这个区域决定前台所有“去平台 / 查看详情”按钮最终跳向哪里。想做来源统计、活动跳转或渠道归因，就填写统计链接；不填则回退到官网链接。</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-700">链接状态</label>
                  <select
                    value={affiliate.status}
                    onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...affiliate, status: event.target.value as AffiliateLink['status'] } } })}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-stone-500">只影响前台按钮最终跳到哪里，不会改变比较排序本身。</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-700">官网链接</label>
                  <input
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                    value={affiliate.officialUrl}
                    placeholder="例如：https://www.bitkub.com"
                    onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...affiliate, officialUrl: event.target.value } } })}
                  />
                  <p className="text-xs text-stone-500">没有推广链接时，前台默认跳这个地址。</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-stone-700">统计链接 / 跳转链接</label>
                  <input
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                    value={affiliate.trackingUrl || ''}
                    placeholder="例如：https://partner.example.com/ref/your-id"
                    onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...affiliate, trackingUrl: event.target.value } } })}
                  />
                  <p className="text-xs text-stone-500">有渠道参数、统计参数或活动落地页时填这里。留空则回退官网链接。</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-700">活动开始时间</label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                    value={toDateTimeLocal(affiliate.startAt)}
                    onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...affiliate, startAt: fromDateTimeLocal(event.target.value) } } })}
                  />
                  <p className="text-xs text-stone-500">可留空。示例：2026-03-13 09:00。</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-700">活动结束时间</label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                    value={toDateTimeLocal(affiliate.endAt)}
                    onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...affiliate, endAt: fromDateTimeLocal(event.target.value) } } })}
                  />
                  <p className="text-xs text-stone-500">可留空。到期后你可以改回官网或新的活动链接。</p>
                </div>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-700">英文按钮说明</label>
                  <textarea
                    className="min-h-24 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                    value={affiliate.disclosure.en}
                    placeholder="This link may open an official or tracked destination page."
                    onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...affiliate, disclosure: { ...affiliate.disclosure, en: event.target.value } } } })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-700">泰文按钮说明</label>
                  <textarea
                    className="min-h-24 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                    value={affiliate.disclosure.th}
                    placeholder="ลิงก์นี้อาจพาไปยังหน้าทางการหรือหน้าปลายทางที่มีการติดตาม"
                    onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...affiliate, disclosure: { ...affiliate.disclosure, th: event.target.value } } } })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-stone-700">中文按钮说明</label>
                  <textarea
                    className="min-h-24 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                    value={affiliate.disclosure.zh}
                    placeholder="此链接可能跳转到官网页面或带统计参数的目标页面。"
                    onChange={(event) => setConfig({ ...config, affiliateLinks: { ...config.affiliateLinks, [slug]: { ...affiliate, disclosure: { ...affiliate.disclosure, zh: event.target.value } } } })}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="rounded-full bg-brand-700 px-5 py-3 text-sm font-medium text-white">{saving ? '保存中...' : '保存交易所资料与跳转配置'}</button>
        {message ? <span className="text-sm text-stone-600">{message}</span> : null}
      </div>
    </div>
  );
}
