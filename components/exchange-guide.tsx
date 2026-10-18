import { additionalCopy } from '@/lib/additional-copy';
import type { ContentLocale } from '@/lib/types';

const guides = {
 ru: additionalCopy.ru.guide,
 ko: additionalCopy.ko.guide,
 fr: additionalCopy.fr.guide,
 de: additionalCopy.de.guide,
 id: additionalCopy.id.guide,
 vi: additionalCopy.vi.guide,

  en: { heading: 'Exchanging money in Thailand', items: [
    ['How do I compare USD, JPY or EUR to Thai baht?', 'Select cash exchange, the currency and the foreign amount. Sell means exchanging foreign cash for THB; buy means spending THB to obtain the foreign amount. Compare the estimated total, not just the displayed rate.'],
    ['Which Bangkok money changer should I choose?', 'Check the specific branch, opening hours, banknote denomination and quote time. A head-office quote may not apply to an airport or another branch. Confirm the final rate and identification requirements with the provider before visiting.'],
    ['Can I compare USDT or BTC to THB?', 'Select crypto and the quantity to buy or sell. The estimate uses available order-book depth and stated fee assumptions. A quote does not guarantee a fill; check eligibility, fees and withdrawal rules on the official exchange site.'],
  ] },
  th: { heading: 'เลือกวิธีแลกเป็นเงินบาท', items: [
    ['เปรียบเทียบเรท USD, JPY หรือ EUR เป็นบาทอย่างไร?', 'เลือกแลกเงินสด สกุลเงิน และจำนวนเงินต่างประเทศ ขายคือขายเงินต่างประเทศเพื่อรับบาท ซื้อคือจ่ายบาทเพื่อรับจำนวนเงินต่างประเทศที่กรอก เปรียบเทียบยอดรวมโดยประมาณ ไม่ใช่ดูเรทอย่างเดียว'],
    ['เลือกร้านแลกเงินในกรุงเทพอย่างไร?', 'ตรวจสาขา เวลาเปิด ชนิดธนบัตร และเวลาเรท เรทสำนักงานใหญ่ไม่จำเป็นต้องใช้กับสนามบินหรือสาขาอื่น ยืนยันเรทสุดท้ายและเอกสารที่ต้องใช้กับร้านก่อนเดินทาง'],
    ['เปรียบเทียบ USDT หรือ BTC เป็นบาทได้หรือไม่?', 'เลือกคริปโตและจำนวนที่ต้องการซื้อหรือขาย ยอดประมาณอิงความลึกออร์เดอร์บุ๊กและค่าธรรมเนียมที่ระบุ ไม่รับประกันการซื้อขายครบ โปรดตรวจสิทธิ์ใช้งาน ค่าธรรมเนียม และการถอนกับเว็บไซต์ทางการ'],
  ] },
  ja: { heading: 'タイバーツへの両替で確認すること', items: [
    ['日本円からタイバーツへの両替レートはどう比較しますか？', '現金両替でJPYと日本円の金額を選びます。「売却」は日本円を渡してTHBを受け取る方向です。「購入」は入力した外貨の金額をTHBで買う方向です。レートだけでなく、概算の受取総額や支払総額を確認してください。'],
    ['バンコクの両替店を選ぶときの注意点は？', '対象支店、営業時間、紙幣の額面とレートの時点を確認しましょう。本店のレートが空港や他の支店にも適用されるとは限りません。訪問前に最終レートと本人確認の条件を公式サイトや店舗で確認してください。'],
    ['USDTやBTCからタイバーツへの交換も比較できますか？', '暗号資産と売買数量を選ぶと、注文板の数量と明示した手数料の前提から概算します。全量の約定は保証しません。居住国などの利用資格、手数料、出金条件は取引所の公式サイトで確認してください。'],
  ] },
  zh: { heading: '换泰铢前需要确认什么？', items: [
    ['美元、日元或欧元换泰铢怎样比较？', '选择现金换汇、外币和金额。卖出是交付外币获得泰铢；买入是用泰铢购买输入的外币金额。请比较预计总金额，而不仅是显示的汇率。'],
    ['曼谷换汇店怎样选择？', '检查具体分店、营业时间、纸币面额和报价时点。总店报价不一定适用于机场或其他分店，到店前向第三方确认最终汇率和证件要求。'],
    ['可以比较USDT或BTC换泰铢吗？', '选择加密资产与买卖数量，按照可用订单簿深度及费用假设计价。报价不保证全量成交，资格、费用和提现条件请以交易所官网为准。'],
  ] },
};
export function ExchangeGuide({ locale }: { locale: ContentLocale }) {
  const guide = guides[locale];
  return <section className="exchange-guide"><h2>{guide.heading}</h2>{guide.items.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>;
}
