import { additionalCopy } from '@/lib/additional-copy';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale } from '@/lib/i18n';
import { readCashCache } from '@/lib/cash-cache-store';
import { summarizeCashSources } from '@/lib/data-status';
import { referenceRatesUrl } from '@/lib/provider-evidence';
import { localeMetadataAlternates } from '@/lib/seo';
import type { Locale } from '@/lib/types';

export const dynamic = 'force-dynamic';
const copy = {
 ru: additionalCopy.ru.status,
 ko: additionalCopy.ko.status,
 fr: additionalCopy.fr.status,
 de: additionalCopy.de.status,
 id: additionalCopy.id.status,
 vi: additionalCopy.vi.status,

 ja: {"title": "情報源と更新状況", "intro": "レートの情報源、最終取得時点、利用可能な状態を表示します。古いレートは参考情報です。", "current": "最近取得", "reference": "参考情報のみ", "unavailable": "利用できるレートなし", "attempt": "最終試行", "success": "最終成功", "quotes": "レートの時点", "official": "公式情報源", "unknown": "記録なし", "note": "取引所のレートは比較時に取得し、時点と注文板を検証します。手数料と免許は別々の根拠で確認し、固定の総合点は使いません。", "baseline": "タイ中央銀行の参考レート（店頭の約定レートではありません）"},
  zh:{title:'数据来源与更新状态',intro:'报价来源、最后采集与可用状态。过期报价只作参考。',current:'近期采集',reference:'仅供参考',unavailable:'暂无可用报价',attempt:'最后尝试',success:'最后成功',quotes:'报价时间',official:'官方来源',unknown:'尚无记录',note:'交易所报价在比较时请求；成功返回仍需通过时间与订单簿校验。费用与牌照逐项核验，不使用固定综合分。',baseline:'泰国央行参考汇率（不是柜台成交价）'},
  en:{title:'Sources and update status',intro:'Quote sources, last collection and availability. Old quotes are reference only.',current:'Recently collected',reference:'Reference only',unavailable:'No available quote',attempt:'Last attempt',success:'Last success',quotes:'Quote times',official:'Official source',unknown:'No record yet',note:'Exchange quotes are fetched when comparing and validated for time and depth. Fees and licenses need separate evidence, not a fixed total score.',baseline:'Bank of Thailand reference rates (not a counter quote)'},
  th:{title:'แหล่งข้อมูลและสถานะอัปเดต',intro:'แหล่งเรท เวลาที่เก็บ และสถานะ เรทเก่าใช้เพื่ออ้างอิง',current:'เก็บข้อมูลล่าสุด',reference:'อ้างอิงเท่านั้น',unavailable:'ไม่มีเรทที่ใช้ได้',attempt:'พยายามล่าสุด',success:'สำเร็จล่าสุด',quotes:'เวลาของเรท',official:'แหล่งทางการ',unknown:'ยังไม่มีข้อมูล',note:'ดึงเรทเทรดเมื่อเปรียบเทียบ ตรวจเวลาและออร์เดอร์บุ๊ก ค่าธรรมเนียมและใบอนุญาตต้องตรวจแยก ไม่มีคะแนนรวมตายตัว',baseline:'เรทอ้างอิงธนาคารแห่งประเทศไทย (ไม่ใช่เรทหน้าร้าน)'},
};
export default async function DataStatusPage({params}:{params:Promise<{locale:Locale}>}) {
  const {locale}=await params;if(!isLocale(locale))notFound();const c=copy[locale];const cache=await readCashCache();const rows=summarizeCashSources(cache);
  const date=(v:string|null)=>v?new Date(v).toLocaleString(locale==='ja'?'ja-JP':locale==='zh'?'zh-CN':locale==='th'?'th-TH':'en-GB',{timeZone:'Asia/Bangkok'}):c.unknown;
  return <div className="simple-page"><header className="simple-intro"><h1>{c.title}</h1><p>{c.intro}</p></header><div className="source-grid">{rows.map(r=><article className="quote-card" key={r.slug}><h2>{r.name}</h2><p>{c[r.status]}</p><dl><dt>{c.attempt}</dt><dd>{date(r.lastAttemptAt)}</dd><dt>{c.success}</dt><dd>{date(r.lastSuccessAt)}</dd><dt>{c.quotes}</dt><dd>{r.quoteTimes.length?r.quoteTimes.map(q=>date(q)).join(' · '):c.unknown}</dd></dl><a href={r.officialUrl} target="_blank" rel="noopener noreferrer">{c.official} ↗</a></article>)}</div><p>{c.note}</p><a href={referenceRatesUrl} target="_blank" rel="noopener noreferrer">{c.baseline} ↗</a></div>;
}
export async function generateMetadata({params}:{params:Promise<{locale:Locale}>}):Promise<Metadata>{const {locale}=await params;if(!isLocale(locale))return {};return {title:copy[locale].title,alternates:localeMetadataAlternates(locale,'/data-status'),robots:{index:false,follow:true}};}
