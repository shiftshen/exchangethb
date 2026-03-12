import { Locale } from '@/lib/types';

const textMap: Record<string, { th: string; en: string; zh: string }> = {
  'SuperRich 1965 Head Office': {
    th: 'SuperRich 1965 สำนักงานใหญ่',
    en: 'SuperRich 1965 Head Office',
    zh: 'SuperRich 1965 总部',
  },
  'SuperRich Thailand Pratunam Area Reference': {
    th: 'SuperRich Thailand จุดอ้างอิงย่านประตูน้ำ',
    en: 'SuperRich Thailand Pratunam Area Reference',
    zh: 'SuperRich Thailand 水门参考点',
  },
  'Vasu Exchange Nana Area Reference': {
    th: 'Vasu Exchange จุดอ้างอิงย่านนานา',
    en: 'Vasu Exchange Nana Area Reference',
    zh: 'Vasu Exchange Nana 参考点',
  },
  'SIA Money Exchange HQ': {
    th: 'SIA Money Exchange สำนักงานใหญ่',
    en: 'SIA Money Exchange HQ',
    zh: 'SIA Money Exchange 总部',
  },
  'Ratchada Exchange': {
    th: 'Ratchada Exchange',
    en: 'Ratchada Exchange',
    zh: 'Ratchada Exchange',
  },
  'Central Bangkok': {
    th: 'ใจกลางกรุงเทพ',
    en: 'Central Bangkok',
    zh: '曼谷中心区',
  },
  'Pratunam': {
    th: 'ประตูน้ำ',
    en: 'Pratunam',
    zh: '水门',
  },
  'Nana': {
    th: 'นานา',
    en: 'Nana',
    zh: 'Nana',
  },
  'Huai Khwang': {
    th: 'ห้วยขวาง',
    en: 'Huai Khwang',
    zh: '汇权',
  },
  'Official guest booking feed branch: Head Office (exact public walk-in address should be verified on the provider contact page).': {
    th: 'หน้า guest booking สาธารณะระบุสาขาเป็นสำนักงานใหญ่ และควรตรวจสอบที่อยู่หน้าร้านล่าสุดจากหน้าติดต่อของผู้ให้บริการก่อนเดินทาง',
    en: 'The public guest booking feed identifies this branch as Head Office. Verify the latest walk-in address on the provider contact page before visiting.',
    zh: '公开 guest booking feed 将该门店标为总部。到店前请以品牌联系页上的最新地址为准。',
  },
  'Official website identifies central Bangkok / Pratunam area operations; exact branch selection is loaded dynamically from the provider contact module.': {
    th: 'เว็บไซต์ทางการระบุการให้บริการในย่านประตูน้ำ/ใจกลางกรุงเทพ โดยรายละเอียดสาขาจริงโหลดแบบไดนามิกจากโมดูลติดต่อของผู้ให้บริการ',
    en: 'The official website shows central Bangkok / Pratunam coverage, while exact branch selection is loaded dynamically in the provider contact module.',
    zh: '官网确认其覆盖曼谷中心 / 水门一带，具体门店由官网联系模块动态加载。',
  },
  'Official contact page is image-based; walk-in address should be verified from the provider map/contact page before visiting.': {
    th: 'หน้าติดต่อทางการเป็นภาพ จึงควรตรวจสอบที่อยู่หน้าร้านล่าสุดจากหน้าติดต่อหรือหน้าแผนที่ของผู้ให้บริการก่อนเดินทาง',
    en: 'The official contact page is image-based, so verify the latest walk-in address on the provider contact or map page before visiting.',
    zh: '官网联系页是图片形式，到店前请到品牌联系页或地图页确认最新地址。',
  },
  '1091/156-7 Soi Phetchaburi 33, New Petchaburi Rd, Makkasan, Ratchathewi, Bangkok 10400': {
    th: '1091/156-7 ซอยเพชรบุรี 33 ถนนเพชรบุรีตัดใหม่ มักกะสัน ราชเทวี กรุงเทพฯ 10400',
    en: '1091/156-7 Soi Phetchaburi 33, New Petchaburi Rd, Makkasan, Ratchathewi, Bangkok 10400',
    zh: '1091/156-7 Soi Phetchaburi 33, New Petchaburi Rd, Makkasan, Ratchathewi, Bangkok 10400',
  },
  '78/13 Pracharat Bampen Rd., Huai Khwang, Bangkok 10310': {
    th: '78/13 ถ.ประชาราษฎร์บำเพ็ญ ห้วยขวาง กรุงเทพฯ 10310',
    en: '78/13 Pracharat Bampen Rd., Huai Khwang, Bangkok 10310',
    zh: '78/13 Pracharat Bampen Rd., Huai Khwang, Bangkok 10310',
  },
  'Branch hours vary by location; verify with provider before visiting': {
    th: 'เวลาเปิดทำการอาจต่างกันตามสาขา ควรตรวจสอบกับผู้ให้บริการก่อนเดินทาง',
    en: 'Branch hours vary by location. Verify with the provider before visiting.',
    zh: '营业时间可能因门店不同而变化，到店前请先向品牌确认。',
  },
  'Monday-Saturday 09:00-16:30': {
    th: 'จันทร์-เสาร์ 09:00-16:30',
    en: 'Monday-Saturday 09:00-16:30',
    zh: '周一至周六 09:00-16:30',
  },
  'Verify on provider contact page before visiting': {
    th: 'ควรตรวจสอบกับหน้าติดต่อของผู้ให้บริการก่อนเดินทาง',
    en: 'Verify on the provider contact page before visiting.',
    zh: '到店前请先查看品牌联系页确认。',
  },
  'Mon-Sat 09:00-18:00, Sun closed': {
    th: 'จันทร์-เสาร์ 09:00-18:00, วันอาทิตย์ปิด',
    en: 'Mon-Sat 09:00-18:00, Sun closed',
    zh: '周一至周六 09:00-18:00，周日休息',
  },
  'Verify on provider page before visiting': {
    th: 'ควรตรวจสอบกับหน้าเว็บของผู้ให้บริการก่อนเดินทาง',
    en: 'Verify on the provider page before visiting.',
    zh: '到店前请先查看品牌页面确认。',
  },
  'Official website scraping + manual review': {
    th: 'ดึงจากเว็บไซต์ทางการพร้อมการทบทวนเพิ่มเติม',
    en: 'Official website scraping with manual review',
    zh: '官网抓取并辅以人工复核',
  },
  'Official scraping with fallback completion': {
    th: 'ดึงจากแหล่งทางการและเติมเต็มด้วยข้อมูลสำรองที่ตรวจทานแล้ว',
    en: 'Official scraping with fallback completion',
    zh: '官方抓取并辅以已审核的备用补全',
  },
  'Stale live snapshot with fallback completion': {
    th: 'สแนปช็อตสดที่เริ่มเก่า พร้อมข้อมูลสำรองช่วยเติมเต็ม',
    en: 'Stale live snapshot with fallback completion',
    zh: '偏旧的实时快照，辅以备用数据补全',
  },
  'Reviewed fallback dataset': {
    th: 'ชุดข้อมูลสำรองที่ผ่านการทบทวน',
    en: 'Reviewed fallback dataset',
    zh: '经过审核的备用数据集',
  },
};

export function localizeCashText(value: string, locale: Locale) {
  return textMap[value]?.[locale] || value;
}

export function localizeScrapeNote(note: string, locale: Locale) {
  let match = note.match(/^Parsed (\d+) rate rows from official page\.$/i);
  if (match) {
    const count = match[1];
    if (locale === 'th') return `ดึงข้อมูลเรทจากหน้าทางการได้ ${count} รายการ`;
    if (locale === 'zh') return `已从官网汇率页解析出 ${count} 条汇率记录`;
    return `Parsed ${count} rates from the official page`;
  }

  match = note.match(/^Parsed (\d+) structured rate rows from official API\.$/i);
  if (match) {
    const count = match[1];
    if (locale === 'th') return `ดึงข้อมูลเรทแบบโครงสร้างจาก API ทางการได้ ${count} รายการ`;
    if (locale === 'zh') return `已从官方 API 解析出 ${count} 条结构化汇率记录`;
    return `Parsed ${count} structured rates from the official API`;
  }

  match = note.match(/^Parsed (\d+) rate rows from official rate page over HTTP\.$/i);
  if (match) {
    const count = match[1];
    if (locale === 'th') return `ดึงข้อมูลเรทจากหน้าอัตราทางการผ่าน HTTP ได้ ${count} รายการ`;
    if (locale === 'zh') return `已通过 HTTP 从官方汇率页解析出 ${count} 条记录`;
    return `Parsed ${count} rates from the official rate page over HTTP`;
  }

  match = note.match(/^Parsed (\d+) hybrid rows from official guest booking feed\.$/i);
  if (match) {
    const count = match[1];
    if (locale === 'th') return `ดึงข้อมูลแบบผสมจาก guest booking feed ทางการได้ ${count} รายการ`;
    if (locale === 'zh') return `已从官方 guest booking feed 解析出 ${count} 条混合记录`;
    return `Parsed ${count} hybrid rows from the official guest booking feed`;
  }

  return localizeCashText(note, locale);
}

export function localizeProviderHealthReason(reason: string, locale: Locale) {
  if (reason === 'live_fresh') {
    return locale === 'th' ? 'ข้อมูลสดล่าสุดพร้อมใช้งาน' : locale === 'zh' ? '实时数据新鲜可用' : 'Fresh live data available';
  }
  if (reason === 'live_stale') {
    return locale === 'th' ? 'มีข้อมูลสด แต่แคชเริ่มเก่า' : locale === 'zh' ? '有实时数据，但缓存偏旧' : 'Live data is available but the cache is aging';
  }
  if (reason === 'hybrid_feed') {
    return locale === 'th' ? 'ใช้ข้อมูลทางการผสมกับการเติมเต็มที่ผ่านการทบทวน' : locale === 'zh' ? '使用官方数据与审核补全的混合结果' : 'Using a hybrid of official data and reviewed completion';
  }
  if (reason === 'fallback_dataset') {
    return locale === 'th' ? 'กำลังใช้ชุดข้อมูลสำรองที่ผ่านการทบทวน' : locale === 'zh' ? '当前使用已审核的备用数据集' : 'Using the reviewed fallback dataset';
  }
  if (reason === 'missing') {
    return locale === 'th' ? 'ยังไม่มีข้อมูลที่ใช้เปรียบเทียบได้' : locale === 'zh' ? '暂时没有可比数据' : 'No comparison data available yet';
  }
  return reason;
}
