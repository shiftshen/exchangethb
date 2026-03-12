import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Locale } from '@/lib/types';
import { t } from '@/lib/i18n';
import { localeAlternates, withLocalePath } from '@/lib/seo';

type LocalizedText = { th: string; en: string; zh: string };

type LegalSection = {
  heading: LocalizedText;
  body?: LocalizedText;
  bullets?: LocalizedText[];
};

const legalPages: Record<string, {
  title: LocalizedText;
  intro: LocalizedText;
  sections: LegalSection[];
}> = {
  methodology: {
    title: { th: 'วิธีการ', en: 'Methodology', zh: '方法论' },
    intro: {
      th: 'หน้านี้อธิบายว่า ExchangeTHB สร้างผลลัพธ์เปรียบเทียบอย่างไร ข้อมูลมาจากไหน และเหตุใดตัวเลขบนหน้าเว็บจึงเป็นค่าประมาณ ไม่ใช่ราคาที่รับประกันได้',
      en: 'This page explains how ExchangeTHB builds comparison results, where the data comes from, and why every number on the site is an estimate rather than a guaranteed execution price.',
      zh: '本页说明 ExchangeTHB 如何生成比较结果、数据来自哪里，以及为什么站内所有数字都属于估算值而非保证成交价格。',
    },
    sections: [
      {
        heading: { th: 'เราเป็นเว็บเปรียบเทียบ ไม่ใช่ผู้ให้บริการธุรกรรม', en: 'We are a comparison website, not the transaction provider', zh: '我们是比较网站，不是交易服务方' },
        bullets: [
          { th: 'เราไม่เป็นคู่สัญญาในการซื้อขายคริปโตหรือแลกเงินสด', en: 'We are not the counterparty for crypto or cash exchange transactions.', zh: '我们不是加密交易或现金换汇的实际交易对手。' },
          { th: 'เราไม่ถือครองทรัพย์สิน ลูกค้า เงินฝาก หรือเงินคงเหลือแทนผู้ใช้', en: 'We do not hold customer assets, balances, or deposits.', zh: '我们不代持用户资产、余额或存款。' },
          { th: 'ผลลัพธ์มีไว้เพื่อช่วยตัดสินใจเบื้องต้นก่อนที่คุณจะออกไปยังเว็บไซต์ทางการหรือหน้าติดต่อของผู้ให้บริการ', en: 'The outputs are meant to support pre-decision research before you leave for an official provider page.', zh: '这些结果仅用于帮助你在跳转到官方页面前做初步判断。' },
        ],
      },
      {
        heading: { th: 'วิธีเปรียบเทียบฝั่งคริปโต', en: 'How crypto comparisons are built', zh: '加密比较的生成方式' },
        bullets: [
          { th: 'โหมดซื้อคำนวณจากฝั่งขายของออร์เดอร์บุ๊ก และโหมดขายคำนวณจากฝั่งซื้อของออร์เดอร์บุ๊ก', en: 'Buy mode uses the ask side of the orderbook, and sell mode uses the bid side.', zh: '买入模式按订单簿卖盘计算，卖出模式按订单簿买盘计算。' },
          { th: 'ระบบรวมความลึกของออร์เดอร์บุ๊ก ค่าธรรมเนียมเทรด ค่าถอน และกฎการถอนเงินบาทก่อนจัดอันดับผลลัพธ์', en: 'The ranking incorporates orderbook depth, trading fees, withdrawal costs, and THB withdrawal rules before sorting outcomes.', zh: '排序时会综合订单簿深度、交易费、提币费以及泰铢提现规则。' },
          { th: 'หากข้อมูลสดบางแหล่งขาดหาย ระบบจะระบุว่าใช้ข้อมูล fallback หรือกฎตรวจทานเพิ่มเติมอย่างชัดเจน', en: 'When live data is incomplete, the interface clearly labels fallback or reviewed rule-based outputs.', zh: '当实时数据不完整时，页面会明确标注为备用数据或经审核规则补全的结果。' },
        ],
      },
      {
        heading: { th: 'วิธีเปรียบเทียบฝั่งเงินสด', en: 'How cash comparisons are built', zh: '现金比较的生成方式' },
        bullets: [
          { th: 'ระบบดึงอัตราจากหน้าเว็บหรือ API สาธารณะของผู้ให้บริการ แล้วรวมกับชุดข้อมูล fallback ที่ผ่านการทบทวนเมื่อจำเป็น', en: 'The system pulls rates from official public pages or APIs, then combines them with reviewed fallback data when needed.', zh: '系统优先抓取官方公开页面或 API 的汇率，必要时再结合经审核的备用数据。' },
          { th: 'หากคุณเปิดตำแหน่ง ระบบจะคำนวณระยะจริงจากตำแหน่งของคุณ มิฉะนั้นจะใช้จุดอ้างอิงกลางกรุงเทพ', en: 'If you enable location, distances use your real position; otherwise the site falls back to a central Bangkok reference point.', zh: '如果你开启定位，距离会按你当前位置计算；否则回退到曼谷中心参考点。' },
          { th: 'จุดบางจุดยังเป็น reference point หรือการประมาณจากที่อยู่ เพราะบางแบรนด์ไม่ได้เปิดเผยโครงสร้างสาขาแบบสมบูรณ์', en: 'Some locations are still address-based or reference points because not every brand publishes fully structured branch data.', zh: '由于部分品牌没有公开完整的门店结构，某些位置仍然是按地址估算或品牌参考点。' },
        ],
      },
      {
        heading: { th: 'ทำไมผลลัพธ์จึงอาจต่างจากราคาจริง', en: 'Why results can differ from the final transaction', zh: '为什么结果可能与最终成交不同' },
        bullets: [
          { th: 'ราคา ค่าธรรมเนียม สภาพคล่อง และกฎโปรโมชั่นอาจเปลี่ยนก่อนที่คุณจะไปถึงหน้าจริง', en: 'Prices, fees, liquidity, and campaign rules can change before you reach the official execution page.', zh: '价格、费用、流动性和活动规则都可能在你跳转前发生变化。' },
          { th: 'สาขาเงินสดอาจใช้อัตราตามเวลา คิวหน้าเคาน์เตอร์ หรือดุลยพินิจของพนักงานสาขา', en: 'Cash branches may vary rates by timing, queue conditions, or branch-level discretion.', zh: '现金门店可能会因时段、排队情况或门店判断而调整汇率。' },
          { th: 'ค่าประมาณของเรามีไว้เพื่อช่วยจัดลำดับตัวเลือก ไม่ใช่คำยืนยันว่าคุณจะได้ราคาสุดท้ายเท่ากับที่แสดง', en: 'Our estimates help rank options; they do not guarantee your final execution will match the displayed number.', zh: '我们的估算用于帮助排序，不保证你最终成交一定等于页面显示数字。' },
        ],
      },
    ],
  },
  disclaimer: {
    title: { th: 'ข้อจำกัดความรับผิดชอบ', en: 'Disclaimer', zh: '免责声明' },
    intro: {
      th: 'โปรดอ่านหน้านี้ก่อนใช้งาน ExchangeTHB เราเป็นเพียงเว็บไซต์เปรียบเทียบข้อมูล และไม่ใช่ผู้ให้บริการซื้อขายหรือแลกเงิน',
      en: 'Please read this page before using ExchangeTHB. We are an informational comparison website only, not the trading or money-changing provider.',
      zh: '使用 ExchangeTHB 前请先阅读本页。我们只是信息比较网站，不是实际交易或换汇服务方。',
    },
    sections: [
      {
        heading: { th: 'เราไม่เข้าร่วมธุรกรรมของคุณ', en: 'We do not participate in your transaction', zh: '我们不参与实际交易' },
        bullets: [
          { th: 'เราไม่เป็นตัวแทน นายหน้า เอเยนต์ หรือคู่สัญญาของธุรกรรมคริปโตหรือเงินสดใดๆ', en: 'We are not the broker, agent, or transaction counterparty for any crypto or cash exchange activity.', zh: '我们不是任何加密交易或现金换汇的经纪方、代理方或实际交易对手。' },
          { th: 'เราไม่รับฝาก ไม่ดูแล และไม่ควบคุมเงินหรือสินทรัพย์ของผู้ใช้', en: 'We do not receive, custody, or control user funds or assets.', zh: '我们不接收、不保管、也不控制用户资金或资产。' },
          { th: 'เมื่อคุณคลิกออกจากเว็บไซต์ การทำธุรกรรมทั้งหมดจะอยู่ภายใต้เงื่อนไขและความรับผิดชอบของผู้ให้บริการปลายทาง', en: 'Once you leave our site, the transaction is governed by the destination provider’s terms and responsibility.', zh: '当你离开本站后，后续交易完全受目标服务方条款和责任约束。' },
        ],
      },
      {
        heading: { th: 'ไม่ใช่คำแนะนำการลงทุนหรือคำแนะนำเฉพาะบุคคล', en: 'Not investment advice or personalized advice', zh: '不构成投资建议或个性化建议' },
        bullets: [
          { th: 'ข้อมูลบนเว็บไซต์นี้ไม่ใช่คำแนะนำการลงทุน การเทรด หรือการแลกเปลี่ยนเงินตราส่วนบุคคล', en: 'Nothing on this site is personal investment, trading, or foreign-exchange advice.', zh: '本站内容不构成个性化投资、交易或外汇建议。' },
          { th: 'คุณควรประเมินความเสี่ยง กฎของผู้ให้บริการ และความเหมาะสมกับสถานการณ์ของคุณเองก่อนตัดสินใจ', en: 'You should assess risk, provider rules, and suitability for your own situation before acting.', zh: '你应在操作前自行评估风险、平台规则以及是否适合你的实际情况。' },
        ],
      },
      {
        heading: { th: 'ผลลัพธ์และโปรโมชั่นอาจเปลี่ยนได้', en: 'Results and promotions can change', zh: '结果和活动可能随时变化' },
        bullets: [
          { th: 'อัตราแลกเปลี่ยน สเปรด ค่าธรรมเนียม สิทธิ์ใช้งาน และแคมเปญ referral อาจเปลี่ยนได้โดยไม่แจ้งล่วงหน้า', en: 'Rates, spreads, fees, eligibility, and referral campaigns can change without notice.', zh: '汇率、价差、费用、适用资格和返佣活动都可能随时变更。' },
          { th: 'คุณต้องตรวจสอบเงื่อนไขล่าสุดบนเว็บไซต์หรือหน้าร้านทางการก่อนทำรายการจริง', en: 'You must confirm the latest terms on the official website or branch before executing a real transaction.', zh: '在实际操作前，你必须以官方页面或门店的最新条件为准。' },
        ],
      },
    ],
  },
  'privacy-policy': {
    title: { th: 'นโยบายความเป็นส่วนตัว', en: 'Privacy Policy', zh: '隐私政策' },
    intro: {
      th: 'หน้านี้อธิบายว่าเราเก็บ ใช้ และปกป้องข้อมูลอะไรบ้างเมื่อคุณเข้าชมเว็บไซต์หรือใช้งานการเปรียบเทียบเส้นทางบน ExchangeTHB',
      en: 'This page explains what data we collect, how we use it, and how we protect it when you visit or use ExchangeTHB.',
      zh: '本页说明当你访问或使用 ExchangeTHB 时，我们会收集哪些数据、如何使用以及如何保护这些数据。',
    },
    sections: [
      {
        heading: { th: 'ข้อมูลที่เราเก็บ', en: 'What we collect', zh: '我们收集哪些信息' },
        bullets: [
          { th: 'ข้อมูลสถิติการใช้งานแบบภาพรวม เช่น เส้นทางที่ถูกเปิด ค่าที่ใช้กรอก และการคลิกออกไปยังผู้ให้บริการ', en: 'Aggregate usage analytics such as route views, entered comparison values, and outbound clicks to providers.', zh: '聚合层面的使用统计，例如查看了哪些路径、输入了哪些比较参数以及点击了哪些外链。' },
          { th: 'ข้อมูลทางเทคนิคเพื่อการวินิจฉัยระบบ เช่น log ข้อผิดพลาด เวลาใช้งาน และสถานะบริการ', en: 'Technical diagnostics such as error logs, request timing, and service health information.', zh: '用于诊断系统的技术信息，例如错误日志、请求耗时和服务状态。' },
          { th: 'ข้อมูลตำแหน่งจะถูกใช้เฉพาะเมื่อคุณกดอนุญาตในเบราว์เซอร์เพื่อคำนวณระยะทาง และจะไม่ถูกใช้ถ้าคุณไม่อนุญาต', en: 'Location is used only when you explicitly grant browser permission for distance calculation.', zh: '定位信息仅在你主动授权浏览器后用于计算距离；未授权时不会使用。' },
        ],
      },
      {
        heading: { th: 'สิ่งที่เราไม่ได้ทำ', en: 'What we do not do', zh: '我们不会做什么' },
        bullets: [
          { th: 'เราไม่มีระบบบัญชีผู้ใช้สาธารณะในเวอร์ชันนี้', en: 'We do not provide public user accounts in this version.', zh: '当前版本不提供公众用户账号系统。' },
          { th: 'เราไม่ขายข้อมูลส่วนบุคคลให้บุคคลที่สาม', en: 'We do not sell personal information to third parties.', zh: '我们不会向第三方出售个人信息。' },
          { th: 'เราไม่ขอเก็บเอกสารยืนยันตัวตน ข้อมูลบัญชีธนาคาร หรือข้อมูล KYC ของผู้ใช้ทั่วไป', en: 'We do not request identity documents, bank credentials, or public-user KYC data.', zh: '我们不会向普通用户索取身份证明、银行资料或 KYC 信息。' },
        ],
      },
      {
        heading: { th: 'คุกกี้และเครื่องมือวิเคราะห์', en: 'Cookies and analytics tools', zh: 'Cookie 与分析工具' },
        bullets: [
          { th: 'เว็บไซต์อาจใช้คุกกี้หรือเครื่องมือวิเคราะห์เพื่อวัดผลแบบรวมและปรับปรุงประสิทธิภาพ', en: 'The site may use cookies or analytics tools for aggregate measurement and performance improvement.', zh: '网站可能使用 Cookie 或分析工具进行聚合统计和性能优化。' },
          { th: 'คุณสามารถจัดการคุกกี้ผ่านการตั้งค่าเบราว์เซอร์ได้ตามความเหมาะสม', en: 'You can manage cookies through your browser settings where applicable.', zh: '你可以在浏览器设置中自行管理 Cookie。' },
        ],
      },
      {
        heading: { th: 'การเก็บรักษาและการเข้าถึงข้อมูล', en: 'Retention and access', zh: '保存期限与访问范围' },
        bullets: [
          { th: 'ข้อมูลหลังบ้านและ log การจัดการจำกัดการเข้าถึงเฉพาะผู้ดูแลที่ได้รับอนุญาต', en: 'Admin data and operational logs are restricted to authorized operators only.', zh: '后台数据与运维日志仅限授权管理员访问。' },
          { th: 'เราจะเก็บข้อมูลเท่าที่จำเป็นต่อการปฏิบัติงาน การตรวจสอบ และความปลอดภัยของระบบ', en: 'We retain data only as needed for operations, auditing, and system security.', zh: '我们仅在运维、审计和系统安全所需范围内保留数据。' },
        ],
      },
    ],
  },
};

export default async function LegalPage({ params }: { params: Promise<{ locale: Locale; slug: keyof typeof legalPages }> }) {
  const { locale, slug } = await params;
  const page = legalPages[slug];
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-5xl space-y-10">
      <header className="space-y-4 rounded-[2rem] border border-surface-700 bg-gradient-to-br from-surface-900 via-surface-850 to-surface-900 p-8 shadow-glow">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-400">
          {t({ th: 'กฎหมายและการเปิดเผยข้อมูล', en: 'Legal and Disclosure', zh: '法务与披露' }, locale)}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white">{t(page.title, locale)}</h1>
        <p className="max-w-4xl text-lg text-stone-300">{t(page.intro, locale)}</p>
      </header>

      <div className="grid gap-6">
        {page.sections.map((section) => (
          <section key={section.heading.en} className="rounded-[2rem] border border-surface-700 bg-surface-900/85 p-8 shadow-soft">
            <h2 className="text-2xl font-semibold tracking-tight text-white">{t(section.heading, locale)}</h2>
            {section.body ? <p className="mt-4 text-stone-300">{t(section.body, locale)}</p> : null}
            {section.bullets?.length ? (
              <ul className="mt-5 space-y-3 text-stone-300">
                {section.bullets.map((bullet) => (
                  <li key={bullet.en} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500 shadow-[0_0_18px_rgba(240,185,11,0.45)]" />
                    <span>{t(bullet, locale)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: keyof typeof legalPages }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = legalPages[slug];
  if (!page) return {};
  const title = t(page.title, locale);
  const description = t(page.intro, locale);
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
