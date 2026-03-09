import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Locale } from '@/lib/types';
import { t } from '@/lib/i18n';
import { localeAlternates, withLocalePath } from '@/lib/seo';

const legalPages = {
  methodology: {
    title: { th: 'วิธีการ', en: 'Methodology', zh: '方法论' },
    sections: [
      {
        th: 'อันดับฝั่งคริปโตคำนวณจากความลึกของออร์เดอร์บุ๊ก ค่าธรรมเนียมการเทรด กฎการถอน และผลลัพธ์ estimated receive ที่เป็นมาตรฐานเดียวกัน',
        en: 'Crypto rankings use orderbook depth, trading fees, withdrawal rules, and standardized estimated receive outputs.',
        zh: '加密比较基于订单簿深度、交易费、提现规则和统一的预计到手模型。',
      },
      {
        th: 'อันดับฝั่งเงินสดใช้เรตจากหน้าเว็บทางการ ระยะทางสาขา เวลาเปิดทำการ เงื่อนไขธนบัตร และการทบทวนค่าผิดปกติแบบ manual',
        en: 'Cash rankings use official public rates, branch distance, opening hours, denomination conditions, and manual anomaly review.',
        zh: '现金比较综合官方公开汇率、门店距离、营业时间、面额条件与人工异常审核。',
      },
      {
        th: 'ทุกผลลัพธ์ถูกระบุว่าเป็นค่าประมาณ และอาจต่างจากการทำรายการจริงตามเวลา สภาพคล่อง คิวหน้าเคาน์เตอร์ หรือการอัปเดตกฎของผู้ให้บริการ',
        en: 'Every output is labeled estimated and can differ from final execution due to timing, liquidity, queue position, branch discretion, or provider updates.',
        zh: '所有结果均为估算值，可能因时间、流动性、排队顺序、门店判断或平台规则更新而与最终执行不同。',
      },
    ],
  },
  disclaimer: {
    title: { th: 'ข้อจำกัดความรับผิดชอบ', en: 'Disclaimer', zh: '免责声明' },
    sections: [
      {
        th: 'ExchangeTHB เป็นเว็บไซต์เปรียบเทียบข้อมูลเท่านั้น และไม่ดำเนินการเทรด ไม่รับฝากทรัพย์สิน และไม่ให้บริการนายหน้า',
        en: 'ExchangeTHB is an informational comparison website only and does not execute trades, hold customer assets, or provide brokerage services.',
        zh: 'ExchangeTHB 仅提供信息比较，不执行交易、不托管用户资产，也不提供经纪服务。',
      },
      {
        th: 'ข้อมูลทั้งหมดไม่ใช่คำแนะนำการลงทุนหรือคำแนะนำอัตราแลกเปลี่ยนส่วนบุคคล และไม่รับประกันว่าจะได้เรตสุดท้ายที่ดีที่สุด',
        en: 'Nothing on this website is personal investment advice, foreign exchange advice, or a promise of the best final rate.',
        zh: '本站内容不构成投资建议或个性化外汇建议，也不承诺最终获得最低汇率。',
      },
      {
        th: 'กฎ ค่าธรรมเนียม คุณสมบัติ และแคมเปญของผู้ให้บริการอาจเปลี่ยนได้โดยไม่แจ้งล่วงหน้า โปรดตรวจสอบเงื่อนไขล่าสุดบนเว็บไซต์ทางการก่อนตัดสินใจ',
        en: 'Platform rules, fees, eligibility, and campaigns can change without notice. Always verify final terms on the official provider website before acting.',
        zh: '平台规则、费用、资格与活动可能随时变更，请在操作前以官方页面最新条款为准。',
      },
    ],
  },
  'privacy-policy': {
    title: { th: 'นโยบายความเป็นส่วนตัว', en: 'Privacy Policy', zh: '隐私政策' },
    sections: [
      {
        th: 'เราเก็บข้อมูลวิเคราะห์และการคลิกในขอบเขตจำกัดเพื่อเข้าใจความสนใจของผู้ใช้ ปรับปรุง UX และติดตามคุณภาพการให้บริการ',
        en: 'We collect limited analytics and click-tracking data to understand route interest, improve UX, and monitor performance.',
        zh: '我们仅收集有限的统计与点击数据，用于了解需求、优化体验与监控性能。',
      },
      {
        th: 'เวอร์ชันแรกยังไม่มีระบบบัญชีผู้ใช้สาธารณะ และเราไม่ขายข้อมูลส่วนบุคคล การเข้าถึงหลังบ้านจำกัดเฉพาะผู้ดูแลที่ได้รับอนุญาต',
        en: 'We do not provide public user accounts in V1 and do not sell personal information. Admin access is restricted to authorized operators.',
        zh: '首发版本不提供公众账号系统，也不会出售个人信息；后台仅限授权人员访问。',
      },
      {
        th: 'อาจมีการใช้คุกกี้และเครื่องมือวิเคราะห์เพื่อการวัดผลแบบภาพรวมและการวินิจฉัยระบบ คุณสามารถจัดการได้ผ่านการตั้งค่าเบราว์เซอร์ตามความเหมาะสม',
        en: 'Cookies and analytics tools may be used for aggregate measurement and operational diagnostics. You can control them through your browser settings where applicable.',
        zh: '我们可能使用 Cookie 与分析工具进行聚合统计和运维诊断，你可在浏览器中自行管理相关设置。',
      },
    ],
  },
  'affiliate-disclosure': {
    title: { th: 'การเปิดเผยลิงก์แนะนำ', en: 'Affiliate Disclosure', zh: '联盟披露' },
    sections: [
      {
        th: 'ลิงก์ออกบางรายการอาจเป็นลิงก์แคมเปญทางการหรือลิงก์แนะนำแบบติดตามผล ภายใต้เงื่อนไขที่แพลตฟอร์มอนุญาต',
        en: 'Some outbound links may be official campaign links or tracked recommendation links where allowed by the platform.',
        zh: '部分外链可能为官方活动链接或可追踪推荐链接，具体取决于平台允许范围。',
      },
      {
        th: 'หากสถานะรางวัลหรือแคมเปญไม่ชัดเจน ระบบจะตั้งค่าเป็น official-only โดยอัตโนมัติ',
        en: 'If a reward or campaign is uncertain, ExchangeTHB defaults the listing to official-only presentation.',
        zh: '当返佣或活动状态不明确时，系统默认仅展示官方链接。',
      },
      {
        th: 'สิทธิประโยชน์ทั้งหมดขึ้นอยู่กับผู้ให้บริการ และอาจเริ่ม หยุด หรือเปลี่ยนแปลงได้ทุกเวลา ตามเงื่อนไขล่าสุดของผู้ให้บริการ',
        en: 'Any incentive availability is controlled by the provider and can start, stop, or change at any time under the provider’s latest terms.',
        zh: '所有激励均由服务方控制，可能随时开始、暂停或调整，请以服务方最新条款为准。',
      },
    ],
  },
} as const;

export default async function LegalPage({ params }: { params: Promise<{ locale: Locale; slug: keyof typeof legalPages }> }) {
  const { locale, slug } = await params;
  const page = legalPages[slug];
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">{t({ th: 'กฎหมายและการเปิดเผยข้อมูล', en: 'Legal and Disclosure', zh: '法务与披露' }, locale)}</p>
        <h1 className="text-4xl font-semibold tracking-tight">{t(page.title, locale)}</h1>
      </div>
      <div className="space-y-4 text-lg text-stone-600">
        {page.sections.map((section) => <p key={section.en}>{t(section, locale)}</p>)}
      </div>
    </article>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: keyof typeof legalPages }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = legalPages[slug];
  if (!page) return {};
  const title = t(page.title, locale);
  const description = t(page.sections[0], locale);
  return {
    title,
    description,
    alternates: {
      canonical: withLocalePath(locale, `/legal/${slug}`),
      languages: localeAlternates(`/legal/${slug}`),
    },
    openGraph: {
      title,
      description,
      url: withLocalePath(locale, `/legal/${slug}`),
    },
  };
}
