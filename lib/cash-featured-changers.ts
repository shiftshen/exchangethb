import type { Locale } from '@/lib/types';

// Labels for the money changer profile strip on /cash. Ten locales: en/th/zh are the profile
// locales that render directly, the other seven point at the English profile (middleware would
// otherwise bounce them through a 307), so no link on this strip hits a redirect.
export interface FeaturedChangerCopy {
  title: string;
  body: string;
  cta: string;
  open: string;
  closed: string;
}

export const featuredChangerCopy: Record<Locale, FeaturedChangerCopy> = {
  en: {
    title: 'Money changer profiles: rates, hours and maps',
    body: 'Before you compare, check the published hours and the latest observed rate for the three Bangkok changers profiled on this site.',
    cta: 'Open profile',
    open: 'Open now',
    closed: 'Closed now',
  },
  th: {
    title: 'หน้าร้านแลกเงิน: เรท เวลาเปิด และแผนที่',
    body: 'ก่อนเทียบเรท ดูเวลาเปิดที่ประกาศไว้และเรทที่สังเกตล่าสุดของสามร้านแลกเงินในกรุงเทพฯ ที่เว็บนี้เก็บโปรไฟล์ไว้',
    cta: 'ดูโปรไฟล์ร้าน',
    open: 'เปิดตอนนี้',
    closed: 'ปิดตอนนี้',
  },
  zh: {
    title: '换汇店实体页：汇率、营业时间与地图',
    body: '比较之前，先看本站收录的三家曼谷换汇店公布的营业时间与最新观测汇率。',
    cta: '查看门店页',
    open: '营业中',
    closed: '已打烊',
  },
  ja: {
    title: '両替店の店舗ページ：レート・営業時間・地図',
    body: '比較の前に、このサイトが掲載するバンコク3店舗の営業時間と最新の参考レートを確認できます。',
    cta: '店舗ページを見る',
    open: '営業中',
    closed: '営業時間外',
  },
  ru: {
    title: 'Страницы обменных пунктов: курс, часы работы, карта',
    body: 'Перед сравнением проверьте опубликованные часы работы и последний зафиксированный курс трёх обменников Бангкока, которые есть на сайте.',
    cta: 'Открыть страницу',
    open: 'Открыто',
    closed: 'Закрыто',
  },
  ko: {
    title: '환전소 상세 페이지: 환율·영업시간·지도',
    body: '비교하기 전에 이 사이트에 등록된 방콕 환전소 3곳의 영업시간과 최근 관측 환율을 확인하세요.',
    cta: '상세 페이지 열기',
    open: '영업 중',
    closed: '영업 종료',
  },
  fr: {
    title: 'Fiches des bureaux de change : taux, horaires, carte',
    body: 'Avant de comparer, vérifiez les horaires publiés et le dernier taux observé des trois bureaux de change de Bangkok présentés sur ce site.',
    cta: 'Voir la fiche',
    open: 'Ouvert',
    closed: 'Fermé',
  },
  de: {
    title: 'Wechselstuben-Profile: Kurs, Öffnungszeiten, Karte',
    body: 'Vor dem Vergleich: Öffnungszeiten und zuletzt beobachteter Kurs der drei Wechselstuben in Bangkok, die diese Seite führt.',
    cta: 'Profil öffnen',
    open: 'Geöffnet',
    closed: 'Geschlossen',
  },
  id: {
    title: 'Profil penukar uang: kurs, jam buka, peta',
    body: 'Sebelum membandingkan, cek jam buka yang diumumkan dan kurs terakhir tiga penukar uang Bangkok yang ada di situs ini.',
    cta: 'Buka profil',
    open: 'Buka sekarang',
    closed: 'Tutup',
  },
  vi: {
    title: 'Trang điểm đổi tiền: tỷ giá, giờ mở cửa, bản đồ',
    body: 'Trước khi so sánh, hãy xem giờ mở cửa đã công bố và tỷ giá gần nhất của ba điểm đổi tiền ở Bangkok có trên trang này.',
    cta: 'Xem trang',
    open: 'Đang mở',
    closed: 'Đã đóng',
  },
};
