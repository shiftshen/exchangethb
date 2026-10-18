import { TrackAnchor } from '@/components/track-link';
import { secLicenseSourceUrl } from '@/lib/exchange-comparison';
import type { Locale } from '@/lib/types';

// SEO-39: /crypto's editorial layer. It only states facts that data/site.ts and the
// published SEC list support (how to read a licence, a fee, and a deposit note). It
// does not rank the exchanges and does not draw a conclusion the data cannot back.
const copy = {
  en: {
    title: 'How to compare Thai crypto exchanges',
    intro: 'Three facts are enough to start: the licence, the fee schedule, and what the data says about funding.',
    items: [
      ['Licence', 'Check that the exchange holds a Thai SEC digital asset exchange licence, and confirm it on the official operator list. A licence is not a promise about fees, service quality or eligibility.'],
      ['Fees', 'Compare the spot trading fee as a percentage, and read whether it is taken from the asset you receive. The THB withdrawal fee is separate, and an unpublished fee is not the same as free.'],
      ['Deposits', 'This site only states deposit support when the reviewed record lists it, and it does not list deposit channels, limits or fees. Open the official site before you fund an account.'],
    ],
    licenseLink: 'Thai SEC licensed digital asset operators',
  },
  th: {
    title: 'วิธีเปรียบเทียบแพลตฟอร์มคริปโตของไทย',
    intro: 'เริ่มจากสามข้อก็พอ ใบอนุญาต ตารางค่าธรรมเนียม และข้อมูลเรื่องการฝากเงิน',
    items: [
      ['ใบอนุญาต', 'ตรวจว่าแพลตฟอร์มถือใบอนุญาตศูนย์ซื้อขายสินทรัพย์ดิจิทัลจาก ก.ล.ต. ไทย และยืนยันจากรายชื่อผู้ได้รับใบอนุญาตอย่างเป็นทางการ ใบอนุญาตไม่ใช่การรับประกันค่าธรรมเนียม คุณภาพบริการ หรือสิทธิ์ใช้งาน'],
      ['ค่าธรรมเนียม', 'เทียบค่าธรรมเนียมเทรดเป็นเปอร์เซ็นต์ และดูว่าหักจากสินทรัพย์ที่ได้รับหรือไม่ ค่าถอนเงินบาทเป็นอีกส่วนหนึ่ง ค่าธรรมเนียมที่ยังไม่ประกาศไม่เท่ากับฟรี'],
      ['การฝากเงิน', 'เว็บนี้ระบุการรองรับการฝากเงินเฉพาะเมื่อข้อมูลที่ตรวจสอบบันทึกไว้ และไม่ได้ระบุช่องทาง วงเงิน หรือค่าธรรมเนียมการฝาก เปิดเว็บทางการก่อนโอนเงินเข้าบัญชี'],
    ],
    licenseLink: 'รายชื่อผู้ได้รับใบอนุญาตจาก ก.ล.ต.',
  },
  zh: {
    title: '如何比较泰国加密货币交易所',
    intro: '先看三件事就够：牌照、费率表，以及数据里关于充值的说明。',
    items: [
      ['牌照', '确认平台持有泰国 SEC 数字资产交易所牌照，并到官方名单核对。牌照不等于对费率、服务质量或使用资格的承诺。'],
      ['手续费', '比较现货交易费率的百分比，并看是否从收到的资产中扣除。泰铢提现费另算，未公开不等于免费。'],
      ['充值', '本站只在核对记录明确支持时标注充值支持，且不列出具体充值渠道、额度与费用。充值前请先打开官网确认。'],
    ],
    licenseLink: '泰国 SEC 持牌数字资产业务机构名单',
  },
} as const;

export function CryptoHowToCompare({ locale }: { locale: Locale }) {
  if (locale !== 'en' && locale !== 'th' && locale !== 'zh') return null;
  const c = copy[locale];
  return (
    <section className="seo-changers" aria-labelledby="crypto-how-to-compare-heading">
      <h2 id="crypto-how-to-compare-heading">{c.title}</h2>
      <p className="seo-changers-body">{c.intro}</p>
      <div className="seo-changers-list">
        {c.items.map(([heading, body]) => (
          <div key={heading} className="seo-changers-link">
            <span className="seo-changers-name">{heading}</span>
            <span className="seo-changers-meta">{body}</span>
          </div>
        ))}
      </div>
      <p className="seo-changers-body">
        <TrackAnchor href={secLicenseSourceUrl} target="_blank" rel="noreferrer" eventName="crypto_how_to_compare_license_click" eventParams={{ locale }} className="font-semibold text-[#087f91] underline underline-offset-4">{c.licenseLink}</TrackAnchor>
      </p>
    </section>
  );
}
