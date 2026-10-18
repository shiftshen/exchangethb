import type { ContentLocale } from '@/lib/types';

export const cashEmptyCopy: Record<ContentLocale, string> = {
  zh: '当前币种暂无可用报价，或门店被筛选条件排除。请查看数据状态，或到门店官网确认汇率；没有报价不代表没有换汇门店。',
  en: 'No available quote for this currency, or branches are excluded by your filters. Check data status or confirm rates on official provider sites. Missing quotes do not mean there are no exchange shops.',
  th: 'ยังไม่มีเรทสำหรับสกุลเงินนี้ หรือร้านถูกกรองออก โปรดดูสถานะข้อมูลหรือยืนยันเรทที่เว็บไซต์ทางการ การไม่มีเรทไม่ได้หมายความว่าไม่มีร้านแลกเงิน',
  ja: 'この通貨の利用可能なレートがないか、店舗が条件で除外されています。データ状況や公式サイトをご確認ください。レートがないことは両替店がないことを意味しません。',
  ru: 'Нет доступного курса этой валюты, либо отделения исключены фильтрами. Проверьте состояние данных или курс на официальном сайте. Отсутствие курса не означает отсутствие обменных пунктов.',
  ko: '이 통화의 이용 가능한 환율이 없거나 필터로 지점이 제외되었습니다. 데이터 상태 또는 공식 사이트를 확인하세요. 환율이 없다고 환전소가 없는 것은 아닙니다.',
  fr: 'Aucun taux disponible pour cette devise, ou les agences sont exclues par les filtres. Consultez les données ou les sites officiels. Un taux absent ne signifie pas qu’il n’existe aucun bureau de change.',
  de: 'Kein verfügbarer Kurs für diese Währung, oder Filialen sind durch Filter ausgeschlossen. Prüfen Sie den Datenstatus oder die offiziellen Websites. Fehlende Kurse bedeuten nicht, dass es keine Wechselstuben gibt.',
  id: 'Kurs mata uang ini belum tersedia, atau cabang tersaring. Periksa status data atau situs resmi. Tidak adanya kurs bukan berarti tidak ada tempat penukaran.',
  vi: 'Chưa có tỷ giá khả dụng cho tiền tệ này, hoặc bộ lọc đã loại các chi nhánh. Kiểm tra trạng thái dữ liệu hoặc trang chính thức. Thiếu tỷ giá không có nghĩa là không có cửa hàng đổi tiền.',
};
