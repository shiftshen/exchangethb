import { t } from '@/lib/i18n';
import { localizeExchangeLicense } from '@/lib/exchange-text';
import { buildExchangeComparisonTableRows, secLicenseSourceUrl } from '@/lib/exchange-comparison';
import { TrackAnchor } from '@/components/track-link';
import type { ContentLocale } from '@/lib/types';

const copy = {
  en: {
    title: 'Side-by-side exchange comparison',
    description: 'Licence, THB pairs, trading fee, deposit support and key feature for every exchange we track, all read from data/site.ts.',
    nameLabel: 'Exchange',
    licenseLabel: 'License',
    pairsLabel: 'THB pairs',
    feeLabel: 'Trading fee',
    feeOnReceived: ' (from the asset you receive)',
    depositLabel: 'Deposit',
    depositSupported: 'THB deposits recorded',
    depositUnknown: 'Not listed',
    keyFeatureLabel: 'Key feature',
    depositNote: 'The deposit column only states what our data records. A “not listed” row does not mean the exchange cannot take deposits; it means we have not listed the deposit channel, limits or fees. Check the official site before you fund an account.',
    licenseSourceNote: 'License source:',
    licenseSourceLink: 'Thai SEC licensed digital asset operators',
  },
  th: {
    title: 'ตารางเปรียบเทียบแพลตฟอร์มเคียงข้างกัน',
    description: 'ใบอนุญาต คู่เทรด THB ค่าธรรมเนียมเทรด การรองรับการฝากเงิน และจุดเด่นของแต่ละแพลตฟอร์มที่เราติดตาม ทั้งหมดมาจาก data/site.ts',
    nameLabel: 'แพลตฟอร์ม',
    licenseLabel: 'ใบอนุญาต',
    pairsLabel: 'คู่เทรด THB',
    feeLabel: 'ค่าธรรมเนียมเทรด',
    feeOnReceived: ' (หักจากสินทรัพย์ที่ได้รับ)',
    depositLabel: 'การฝากเงิน',
    depositSupported: 'มีข้อมูลรองรับการฝากเงินบาท',
    depositUnknown: 'ยังไม่มีข้อมูล',
    keyFeatureLabel: 'จุดเด่น',
    depositNote: 'คอลัมน์การฝากเงินแสดงเฉพาะสิ่งที่ข้อมูลของเราบันทึกไว้ แถว “ยังไม่มีข้อมูล” ไม่ได้หมายความว่าแพลตฟอร์มรับฝากเงินไม่ได้ แต่หมายความว่าเราไม่ได้ระบุช่องทาง วงเงิน หรือค่าธรรมเนียมการฝาก โปรดตรวจสอบกับเว็บทางการก่อนโอนเงิน',
    licenseSourceNote: 'แหล่งที่มาของใบอนุญาต:',
    licenseSourceLink: 'รายชื่อผู้ได้รับใบอนุญาตจาก ก.ล.ต.',
  },
  zh: {
    title: '交易所并列对比表',
    description: '我们追踪的每家交易所的牌照、THB 交易对、交易手续费、充值支持与关键特征，全部来自 data/site.ts。',
    nameLabel: '交易所',
    licenseLabel: '牌照',
    pairsLabel: 'THB 交易对',
    feeLabel: '交易手续费',
    feeOnReceived: '（从收到的资产中扣除）',
    depositLabel: '充值',
    depositSupported: '记录支持泰铢充值',
    depositUnknown: '未登记',
    keyFeatureLabel: '关键特征',
    depositNote: '充值列只展示本站数据里记录的内容。「未登记」不代表该交易所不能充值，只表示本站没有列出其具体充值渠道、额度与费用。充值前请以交易所官网为准。',
    licenseSourceNote: '牌照来源：',
    licenseSourceLink: '泰国 SEC 持牌数字资产业务机构名单',
  },
} as const;

export function ExchangeComparisonTable({ locale }: { locale: ContentLocale }) {
  const c = copy[locale === 'th' || locale === 'zh' ? locale : 'en'];
  const rows = buildExchangeComparisonTableRows();
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="section-title">{c.title}</h2>
        <p className="max-w-3xl text-stone-400">{c.description}</p>
      </div>
      <div className="overflow-x-auto rounded-[28px] border border-white/10 bg-[#151a18]">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm" data-exchange-comparison-table="side-by-side">
          <thead>
            <tr className="text-xs uppercase tracking-[0.08em] text-stone-500">
              <th scope="col" className="px-4 py-3 font-medium sm:px-6">{c.nameLabel}</th>
              <th scope="col" className="px-3 py-3 font-medium">{c.licenseLabel}</th>
              <th scope="col" className="px-3 py-3 font-medium">{c.pairsLabel}</th>
              <th scope="col" className="px-3 py-3 font-medium">{c.feeLabel}</th>
              <th scope="col" className="px-3 py-3 font-medium">{c.depositLabel}</th>
              <th scope="col" className="px-4 py-3 font-medium sm:px-6">{c.keyFeatureLabel}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.slug} data-exchange-comparison-row={row.slug} className="border-t border-white/5 text-stone-300">
                <th scope="row" className="px-4 py-4 text-left align-top font-semibold text-white sm:px-6">{row.name}</th>
                <td className="px-3 py-4 align-top text-xs leading-5" data-exchange-license>{localizeExchangeLicense(row.license, locale)}</td>
                <td className="px-3 py-4 align-top text-xs leading-5">{row.thbPairs.join(', ')}</td>
                <td className="px-3 py-4 align-top text-xs leading-5">{row.tradingFeePct}%{row.feeOnReceived ? c.feeOnReceived : ''}</td>
                <td className="px-3 py-4 align-top text-xs leading-5">{row.thbDepositSupported ? c.depositSupported : c.depositUnknown}</td>
                <td className="px-4 py-4 align-top text-xs leading-5 sm:px-6">{t(row.keyFeature, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-stone-400">{c.depositNote}</p>
      <p className="text-sm text-stone-400">
        {c.licenseSourceNote}{' '}
        <TrackAnchor href={secLicenseSourceUrl} target="_blank" rel="noreferrer" eventName="exchange_comparison_license_source_click" eventParams={{ locale }} className="font-medium text-brand-300 underline underline-offset-4">{c.licenseSourceLink}</TrackAnchor>
      </p>
    </section>
  );
}
