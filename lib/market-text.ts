import { Locale } from '@/lib/types';

export function localizeMarketSource(label: string, locale: Locale) {
  if (label === 'Official API + rules engine') {
    return locale === 'th'
      ? 'ข้อมูลทางการแบบสดพร้อมกฎตรวจทาน'
      : locale === 'zh'
        ? '官方实时数据与审核规则'
        : 'Official live data with reviewed rules';
  }

  if (label === 'Reviewed fallback dataset') {
    return locale === 'th'
      ? 'ชุดข้อมูลสำรองที่ผ่านการทบทวน'
      : locale === 'zh'
        ? '经过审核的备用数据集'
        : 'Reviewed fallback dataset';
  }

  return label;
}

export function localizeMarketFreshness(label: string, locale: Locale) {
  if (label === 'Live orderbook (target 15s refresh)') {
    return locale === 'th'
      ? 'ออร์เดอร์บุ๊กสด (เป้าหมายรีเฟรชทุก 15 วินาที)'
      : locale === 'zh'
        ? '实时订单簿（目标每 15 秒刷新）'
        : 'Live orderbook (target 15s refresh)';
  }

  if (label === 'Fallback snapshot') {
    return locale === 'th'
      ? 'สแนปช็อตข้อมูลสำรอง'
      : locale === 'zh'
        ? '备用快照'
        : 'Fallback snapshot';
  }

  return label;
}

export function localizeMarketFallbackReason(reason: string, locale: Locale) {
  if (
    reason === 'Live endpoint unavailable or symbol not supported; using reviewed fallback snapshot.'
    || reason === 'Live source unavailable; fallback snapshot is shown.'
  ) {
    return locale === 'th'
      ? 'แหล่งข้อมูลสดไม่พร้อมใช้งานในขณะนี้ จึงแสดงสแนปช็อตข้อมูลสำรองที่ผ่านการทบทวน'
      : locale === 'zh'
        ? '当前实时接口不可用，因此改为展示经过审核的备用快照'
        : 'The live endpoint is unavailable right now, so a reviewed fallback snapshot is shown.';
  }

  if (reason === 'Live endpoint request failed') {
    return locale === 'th'
      ? 'คำขอข้อมูลสดล้มเหลว จึงใช้ข้อมูลสำรองที่ผ่านการทบทวนแทน'
      : locale === 'zh'
        ? '实时接口请求失败，因此改用经过审核的备用数据'
        : 'The live request failed, so a reviewed fallback snapshot is shown instead.';
  }

  if (reason.includes('timeout') || reason.includes('Timeout')) {
    return locale === 'th'
      ? 'แหล่งข้อมูลสดตอบกลับช้าเกินกำหนด จึงใช้ข้อมูลสำรองที่ผ่านการทบทวนแทน'
      : locale === 'zh'
        ? '实时接口响应超时，因此改用经过审核的备用数据'
        : 'The live endpoint timed out, so a reviewed fallback snapshot is shown instead.';
  }

  return reason;
}

export function localizeAdapterNote(note: string, locale: Locale) {
  if (note === 'Live market adapter responding.') {
    return locale === 'th'
      ? 'แหล่งข้อมูลตลาดสดตอบสนองตามปกติ'
      : locale === 'zh'
        ? '实时市场数据源连接正常'
        : 'The live market source is responding normally.';
  }

  if (note === 'Official live endpoint is unavailable; comparison currently uses reviewed fallback snapshots.') {
    return locale === 'th'
      ? 'แหล่งข้อมูลทางการแบบสดยังไม่พร้อม จึงใช้ข้อมูลสำรองที่ผ่านการทบทวนแทนในตอนนี้'
      : locale === 'zh'
        ? '当前官方实时接口不可用，因此暂时改用经过审核的备用快照'
        : 'The official live endpoint is unavailable right now, so reviewed fallback snapshots are being used.';
  }

  return note;
}
