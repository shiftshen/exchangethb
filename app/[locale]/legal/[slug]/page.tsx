import { additionalCopy, isAdditionalLocale } from '@/lib/additional-copy';
import { coreIndexLocales } from '@/lib/indexing-policy';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { japaneseLegalPages } from '@/lib/japanese-legal';
import { Metadata } from 'next';
import { TrackLink } from '@/components/track-link';
import { Locale } from '@/lib/types';
import { t } from '@/lib/i18n';
import { shouldIndexLegalPage } from '@/lib/indexing-policy';
import { metadataAlternatesForPolicy, robotsForPage, withLocalePath } from '@/lib/seo';
import { CopyGroup } from '@/lib/types';

const advertisingPrivacy: Record<Locale, string> = {
  en: 'We use Google AdSense and its consent manager. Google and its partners may process cookies and device identifiers for advertising. Where applicable, you can consent, decline or manage advertising choices in the Google message. Usage analytics has a separate choice in Analytics settings. AdSense approval and advertising revenue are not guaranteed.',
  zh: '本站接入 Google AdSense 及其同意管理工具。Google 和合作方可能为广告处理 Cookie 与设备标识。在适用地区，你可在 Google 提示中同意、拒绝或管理广告选择；访问统计另由“统计设置”控制。接入不代表审核通过或保证广告收入。',
  th: 'เว็บไซต์ใช้ Google AdSense และเครื่องมือจัดการความยินยอม Google และพันธมิตรอาจใช้คุกกี้และตัวระบุอุปกรณ์เพื่อโฆษณา ในพื้นที่ที่เกี่ยวข้อง คุณยอมรับ ปฏิเสธ หรือจัดการตัวเลือกโฆษณาได้ สถิติการใช้งานมีการตั้งค่าแยกต่างหาก การอนุมัติและรายได้ไม่รับประกัน',
  ja: 'Google AdSenseと同意管理ツールを使用します。Googleと提携先は広告のためにCookieや端末識別子を処理する場合があります。対象地域では同意、拒否、広告設定の管理ができます。利用統計は分析設定で別に選択できます。審査承認や広告収入は保証しません。',
  ko: 'Google AdSense와 동의 관리 도구를 사용합니다. Google과 파트너는 광고를 위해 쿠키와 기기 식별자를 처리할 수 있습니다. 해당 지역에서는 동의, 거부 또는 광고 설정 관리가 가능합니다. 이용 통계는 별도로 선택합니다. 승인과 수익은 보장되지 않습니다.',
  ru: 'Мы используем Google AdSense и управление согласием. Google и партнёры могут обрабатывать cookies и идентификаторы устройств для рекламы. В применимых регионах можно согласиться, отказаться или управлять выбором. Аналитика настраивается отдельно. Одобрение и доход не гарантированы.',
  fr: 'Nous utilisons Google AdSense et son gestionnaire de consentement. Google et ses partenaires peuvent traiter des cookies et identifiants pour la publicité. Dans les régions concernées, vous pouvez accepter, refuser ou gérer vos choix. Les statistiques se règlent séparément. Approbation et revenus ne sont pas garantis.',
  de: 'Wir verwenden Google AdSense und dessen Einwilligungsverwaltung. Google und Partner können Cookies und Gerätekennungen für Werbung verarbeiten. In den betreffenden Regionen können Sie zustimmen, ablehnen oder Einstellungen verwalten. Nutzungsstatistiken werden separat gesteuert. Zulassung und Einnahmen sind nicht garantiert.',
  id: 'Kami menggunakan Google AdSense dan pengelola persetujuannya. Google dan mitra dapat memproses cookie dan pengenal perangkat untuk iklan. Di wilayah terkait, Anda dapat menyetujui, menolak, atau mengelola pilihan. Statistik penggunaan diatur terpisah. Persetujuan akun dan pendapatan tidak dijamin.',
  vi: 'Chúng tôi sử dụng Google AdSense và công cụ quản lý đồng ý. Google và đối tác có thể xử lý cookie và mã nhận dạng thiết bị cho quảng cáo. Tại khu vực áp dụng, bạn có thể đồng ý, từ chối hoặc quản lý lựa chọn. Thống kê được chọn riêng. Không đảm bảo phê duyệt hoặc doanh thu.',
};

const travelpayoutsPrivacy = 'We use Travelpayouts Drive to identify eligible travel links and attribute referrals. Travelpayouts and its partners may process cookies, device and click information; we may earn a commission from qualifying bookings. See https://www.travelpayouts.com/privacy. Browser cookie controls also apply.';

type LocalizedText = CopyGroup;

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
        heading: {th:'เวลาและหลักฐาน',en:'Time and evidence',zh:'时间与核验依据'},
        bullets: [
          {th:'แยกเวลาเก็บข้อมูลกับเวลาประกาศ เรทเก่าหรือคำนวณผสมไม่ใช่เรทแนะนำล่าสุด',en:'Collection time and provider publication time are distinct. Old and inferred quotes are reference only.',zh:'采集时间与官网发布时间分开。过期或混合推算报价仅供参考，不进入当前推荐。'},
          {th:'ค่าธรรมเนียมที่ยังไม่ได้ตรวจเป็นสมมติฐาน ไม่มีคะแนนรวมตายตัว ค่าคอมมิชชันไม่เปลี่ยนการจัดอันดับ',en:'Unverified fees are assumptions. There is no fixed total rating. Referral commission does not affect ranking.',zh:'未核验费用是计算假设，不使用固定综合分；推广佣金不影响排序。'},
          {th:'รีวิวของ Google ผูกกับสาขาที่ตรวจแล้ว สูงสุด5รีวิวที่เกี่ยวข้อง ไม่ใช่รีวิวทั้งหมดหรือคะแนนความปลอดภัย',en:'Google reviews belong to a verified branch and include up to five relevant reviews, not all reviews or a financial safety rating.',zh:'Google 口碑绑定已核验的具体分店，只展示最多5条相关评论，并非全部评论或金融安全评级。'},
        ],
      },
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
          { th: 'ระบบดึงอัตราจากหน้าเว็บหรือ API สาธารณะของผู้ให้บริการที่เปิดใช้งานอยู่ แล้วรวมกับชุดข้อมูล fallback ที่ผ่านการทบทวนเมื่อจำเป็น', en: 'The system pulls rates from official public pages or APIs for the currently enabled providers, then combines them with reviewed fallback data when needed.', zh: '系统优先抓取当前启用品牌的官方公开页面或 API 汇率，必要时再结合经审核的备用数据。', ja: 'システムは現在有効化されているブランドの公式公開ページまたは API からレートを取得し、必要な場合のみレビュー済み fallback データを組み合わせます。', ko: '시스템은 현재 활성화된 브랜드의 공식 공개 페이지나 API에서 환율을 가져오고, 필요한 경우에만 검토된 fallback 데이터를 결합합니다.', de: 'Das System zieht Kurse von offiziellen öffentlichen Seiten oder APIs der aktuell aktivierten Anbieter und kombiniert sie nur bei Bedarf mit geprüftem Fallback-Material.' },
          { th: 'หากคุณเปิดตำแหน่ง ระบบจะคำนวณระยะจริงจากตำแหน่งของคุณ มิฉะนั้นจะใช้จุดอ้างอิงกลางกรุงเทพ', en: 'If you enable location, distances use your real position; otherwise the site falls back to a central Bangkok reference point.', zh: '如果你开启定位，距离会按你当前位置计算；否则回退到曼谷中心参考点。', ja: '位置情報を許可すると距離は実際の現在地から計算され、許可しない場合はバンコク中心の参照点にフォールバックします。', ko: '위치 권한을 주면 거리 계산은 실제 현재 위치를 사용하고, 그렇지 않으면 방콕 중심 참조점으로 돌아갑니다.', de: 'Wenn du den Standort freigibst, werden Distanzen von deiner realen Position aus berechnet; andernfalls fällt die Seite auf einen Referenzpunkt im Zentrum von Bangkok zurück.' },
          { th: 'จุดบางจุดยังเป็น reference point หรือการประมาณจากที่อยู่ เพราะบางแบรนด์ไม่ได้เปิดเผยโครงสร้างสาขาแบบสมบูรณ์', en: 'Some locations are still address-based or reference points because not every brand publishes fully structured branch data.', zh: '由于部分品牌没有公开完整的门店结构，某些位置仍然是按地址估算或品牌参考点。', ja: '一部のブランドは支店データを完全には公開していないため、住所ベースまたはブランド参照点の場所が残っています。', ko: '일부 브랜드는 지점 데이터를 완전히 공개하지 않기 때문에, 몇몇 위치는 주소 기반 또는 브랜드 참조점으로 남아 있습니다.', de: 'Einige Marken veröffentlichen ihre Filialstruktur nicht vollständig, deshalb bleiben manche Standorte adressbasiert oder als Marken-Referenzpunkte markiert.' },
        ],
      },
      {
        heading: { th: 'ภาษาและสกุลเงินที่รองรับไม่ได้เท่ากันเสมอไป', en: 'Language coverage does not mean every currency is supported live', zh: '语言覆盖并不等于每种货币都已接入实时支持', ja: '言語対応と通貨のライブ対応は同じ意味ではありません', ko: '언어 지원이 모든 통화의 실시간 지원을 뜻하지는 않습니다', de: 'Sprachabdeckung bedeutet nicht, dass jede Währung live unterstützt wird' },
        bullets: [
          { th: 'เว็บไซต์มีหลายภาษาเพื่อรองรับผู้ใช้จากหลายประเทศ แต่ชุดเปรียบเทียบเงินจริงจะขึ้นอยู่กับผู้ให้บริการที่เชื่อมอยู่ในขณะนั้น', en: 'The site supports multiple languages for international users, but the real compare set only covers currencies and routes that are currently connected.', zh: '网站提供多语言是为了服务不同国家用户，但真实比较集只覆盖当前已接入的币种和路线。', ja: 'サイトは国際ユーザー向けに多言語対応していますが、実際の比較対象は現在接続されている通貨とルートに限られます。', ko: '사이트는 국제 사용자를 위해 여러 언어를 지원하지만, 실제 비교 세트는 현재 연결된 통화와 경로에만 한정됩니다.', de: 'Die Seite unterstützt mehrere Sprachen für internationale Nutzer, aber der echte Vergleichssatz umfasst nur die aktuell angebundenen Währungen und Routen.' },
          { th: 'ชุดเงินสดที่รองรับสดในตอนนี้คือ USD, CNY, EUR, JPY และ GBP ส่วนหน้าประเทศอย่าง Korea to Thailand จะเป็นหน้าช่วยตัดสินใจการเดินทาง ไม่ใช่หน้าราคา KRW สด', en: 'The current live cash set covers USD, CNY, EUR, JPY, and GBP. Country pages such as Korea to Thailand are travel decision pages, not live KRW pricing pages.', zh: '当前接入的实时现金币种是 USD、CNY、EUR、JPY 和 GBP。像 Korea to Thailand 这类国家页属于旅行换汇决策页，不是假装提供 KRW 实时行情的页面。', ja: '現在のライブ現金比較セットは USD、CNY、EUR、JPY、GBP です。Korea to Thailand のような国別ページは旅行時の両替判断ページであり、KRW のライブ価格ページではありません。', ko: '현재 라이브 현금 비교 세트는 USD, CNY, EUR, JPY, GBP입니다. Korea to Thailand 같은 국가 페이지는 여행 환전 의사결정 페이지이지 KRW 실시간 가격 페이지가 아닙니다.', de: 'Der aktuelle Live-Cash-Satz umfasst USD, CNY, EUR, JPY und GBP. Länderseiten wie Korea to Thailand sind Reise-Entscheidungsseiten und keine Live-KRW-Preis-Seiten.' },
          { th: 'หากหน้าใดเป็นเพียง route guide หรือ travel-intent page เราจะพยายามระบุให้ชัดว่าเป็นหน้าช่วยตัดสินใจ ไม่ใช่การันตีว่ามีแถวข้อมูลสดของสกุลนั้น', en: 'When a page is only a route guide or travel-intent page, it should be treated as decision support rather than proof that the site has live rows for that currency.', zh: '如果某个页面只是路线指南或旅行意图页，它应该被理解为决策辅助，而不是证明站点已经有该币种的实时行。', ja: 'ページがルートガイドや旅行意図ページである場合、それは判断支援であって、その通貨のライブ行が存在する証明ではありません。', ko: '페이지가 경로 가이드나 여행 의도 페이지라면, 그것은 의사결정 지원일 뿐 해당 통화의 실시간 행이 존재한다는 뜻은 아닙니다.', de: 'Wenn eine Seite nur als Routen- oder Reise-Intent-Seite dient, sollte sie als Entscheidungshilfe verstanden werden und nicht als Beweis, dass für diese Währung Live-Zeilen vorhanden sind.' },
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
          { th: 'ข้อมูลอาจล่าช้าหรือผิดพลาด เราไม่รับประกันราคา ผลตอบแทน หรือความปลอดภัยของผู้ให้บริการ ข้อความนี้ไม่ตัดสิทธิหรือความรับผิดที่กฎหมายไม่อนุญาตให้ยกเว้น', en: 'Data may be delayed or inaccurate. We do not guarantee prices, returns or provider safety. This notice does not exclude rights or liabilities that cannot lawfully be excluded.', zh: '数据可能延迟或有误；本站不保证成交价格、收益或第三方资金安全。本声明不排除法律规定不得免除的责任或用户法定权利。' },
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
        heading:{th:'ข้อมูล Google Maps',en:'Google Maps content',zh:'Google Maps 内容'},
        body:{th:'เมื่อเปิดรีวิวสาขา เซิร์ฟเวอร์อาจเรียก Google Places รูปผู้เขียนโหลดจาก Google โดยตรง รีวิวไม่ถูกบันทึกถาวร การใช้บริการอยู่ภายใต้ Google Terms of Service และ Google Privacy Policy',en:'Opening branch reviews may request Google Places through our server. Author images load directly from Google. We do not persist review content. Use is subject to Google Terms of Service and Google Privacy Policy.',zh:'展开分店评论时，服务器可能请求 Google Places；作者头像由浏览器直接从 Google 加载。评论内容不作持久保存。相关服务适用 Google 服务条款与隐私政策。'},
      },
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
  if (locale === 'ja' || isAdditionalLocale(locale)) {
    const pages = locale === 'ja' ? japaneseLegalPages : additionalCopy[locale].legal;
    const page = pages[slug as keyof typeof pages];
    if (!page) notFound();
    return <article className="simple-page"><header className="simple-intro"><h1>{page.title}</h1><p>{page.intro}</p></header>{page.sections.map(section=><section className="quote-card" key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}<p><Link href={`/${locale}/cash`}>{isAdditionalLocale(locale) ? additionalCopy[locale].words.cash : '現金両替を比較'}</Link> · <Link href={`/${locale}/crypto`}>{isAdditionalLocale(locale) ? additionalCopy[locale].words.crypto : '暗号資産を比較'}</Link></p>{slug === 'privacy-policy' && <><p>{advertisingPrivacy[locale]} </p><p>{travelpayoutsPrivacy}</p></>}{slug === 'privacy-policy' && <p><a href="https://policies.google.com/privacy">Google プライバシー ポリシー</a> · <a href="https://maps.google.com/help/terms_maps/">Google Maps 利用規約</a></p>}</article>;
  }
  const page = legalPages[slug];
  if (!page) notFound();
  const continueTitle = locale === 'th'
    ? 'หน้าหลักที่ควรอ่านต่อ'
    : locale === 'zh'
      ? '建议继续查看的主页面'
      : 'Core pages to continue with';
  const continueDescription = locale === 'th'
    ? 'หลังจากอ่านกฎหมายและวิธีการแล้ว คุณสามารถกลับไปยังหน้าหลักของการเปรียบเทียบหรือหน้ารวมแบรนด์เพื่อเข้าสู่ flow ที่ใช้งานจริง'
    : locale === 'zh'
      ? '读完方法论和披露信息后，可以继续进入比较页或品牌总览页，回到真实决策流程。'
      : 'After reading the legal and methodology layer, continue into the comparison and entity pages that users actually use for THB decisions.';
  const continueLinks = [
    {
      href: `/${locale}/crypto`,
      label: locale === 'th' ? 'คริปโตเป็นบาท' : locale === 'zh' ? '加密换泰铢' : 'Crypto to THB',
      body: locale === 'th' ? 'ดูเส้นทางซื้อหรือขายคริปโตเป็น THB พร้อมค่าธรรมเนียมและสภาพคล่อง' : locale === 'zh' ? '查看买入或卖出加密换 THB 的比较结果、费用和深度。' : 'Compare coin-to-THB routes with fees, liquidity, and source state.',
    },
    {
      href: `/${locale}/cash`,
      label: locale === 'th' ? 'เงินสดเป็นบาท' : locale === 'zh' ? '现金换泰铢' : 'Cash to THB',
      body: locale === 'th' ? 'เปรียบเทียบร้านแลกเงินกรุงเทพตามเรต เวลาเปิด และระยะอ้างอิง' : locale === 'zh' ? '比较曼谷换汇品牌的汇率、营业时间和参考距离。' : 'Compare Bangkok money changers by rate, hours, and reference distance.',
    },
    {
      href: `/${locale}/routes`,
      label: locale === 'th' ? 'เส้นทาง THB' : locale === 'zh' ? '路线页' : 'Route Guides',
      body: locale === 'th' ? 'เปิดหน้ารวมคำค้นหลัก เช่น BTC to THB หรือ USD cash to THB' : locale === 'zh' ? '进入 BTC to THB、USD cash to THB 等高意图路线页总览。' : 'Browse high-intent route guides such as BTC to THB or USD cash to THB.',
    },
    {
      href: `/${locale}/exchanges`,
      label: locale === 'th' ? 'หน้ารวมแพลตฟอร์ม' : locale === 'zh' ? '交易所总览' : 'Exchange Hub',
      body: locale === 'th' ? 'ดูหน้ารวม exchange ไทยและหน้าโปรไฟล์รายตัว' : locale === 'zh' ? '查看泰国交易所总览与各实体详情页。' : 'Review the Thai exchange hub and individual profile pages.',
    },
    {
      href: `/${locale}/money-changers`,
      label: locale === 'th' ? 'หน้ารวมร้านแลกเงิน' : locale === 'zh' ? '换汇品牌总览' : 'Money Changer Hub',
      body: locale === 'th' ? 'ดูหน้ารวมแบรนด์อย่าง Ratchada และ SuperRich ก่อนเทียบเส้นทางจริง' : locale === 'zh' ? '先查看 Ratchada、SuperRich 等品牌总览，再进入真实比较。' : 'Start from the money changer hub before comparing specific Bangkok cash routes.',
    },
  ];

  return (
    <article className="mx-auto max-w-5xl space-y-10">
      <header className="space-y-4 rounded-[2rem] border border-surface-700 bg-gradient-to-br from-surface-900 via-surface-850 to-surface-900 p-8 shadow-glow">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-400">
          {t({ th: 'กฎหมายและการเปิดเผยข้อมูล', en: 'Legal and Disclosure', zh: '法务与披露', ja: '法務と開示', ko: '법률 및 공개', de: 'Rechtliches und Offenlegung' }, locale)}
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

      <section className="space-y-6 rounded-[2rem] border border-surface-700 bg-surface-900/85 p-8 shadow-soft">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-white">{continueTitle}</h2>
          <p className="max-w-4xl text-stone-300">{continueDescription}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {continueLinks.map((item) => (
            <TrackLink key={item.href} href={item.href} eventName="legal_continue_click" eventParams={{ slug, target: item.href }} className="rounded-[1.5rem] border border-surface-700 bg-surface-850/80 p-5 transition hover:border-brand-500/40 hover:bg-surface-850">
              <h3 className="text-lg font-semibold text-white">{item.label}</h3>
              <p className="mt-3 text-sm text-stone-400">{item.body}</p>
            </TrackLink>
          ))}
        </div>
      </section>
      {slug==='privacy-policy'&&<><p>{advertisingPrivacy[locale]}</p><p>{travelpayoutsPrivacy}</p></>}{slug==='privacy-policy'&&<p className="text-sm text-stone-300"><a href="https://www.google.com/policies/privacy/" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a> · <a href="https://maps.google.com/help/terms_maps/" target="_blank" rel="noopener noreferrer">Google Maps Terms</a></p>}
    </article>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: keyof typeof legalPages }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale === 'ja' || isAdditionalLocale(locale)) {
    const pages = locale === 'ja' ? japaneseLegalPages : additionalCopy[locale].legal;
    const page = pages[slug as keyof typeof pages];
    if (!page) return {};
    return { title: page.title, description: page.intro, alternates: metadataAlternatesForPolicy(locale, `/legal/${slug}`, shouldIndexLegalPage(locale, slug) ? coreIndexLocales : []), robots: robotsForPage(locale, shouldIndexLegalPage(locale, slug)) };
  }
  const page = legalPages[slug];
  if (!page) return {};
  const title = t(page.title, locale);
  const description = t(page.intro, locale);
  return {
    title,
    description,
    alternates: metadataAlternatesForPolicy(
      locale,
      `/legal/${slug}`,
      shouldIndexLegalPage(locale, slug) ? coreIndexLocales : [],
    ),
    robots: robotsForPage(locale, shouldIndexLegalPage(locale, slug)),
    openGraph: {
      title,
      description,
      url: withLocalePath(locale, `/legal/${slug}`),
    },
    twitter: {
      title,
      description,
    },
  };
}
