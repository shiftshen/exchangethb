import type { ContentLocale } from '@/lib/types';
export const unknownFiatWithdrawal: Record<ContentLocale, string> = {
  zh: '泰铢提现费尚未核验；显示金额未包含该费用。',
  en: 'THB withdrawal fee is unverified; the shown amount excludes it.',
  th: 'ยังไม่ได้ยืนยันค่าถอนเงินบาท ยอดที่แสดงยังไม่รวมค่าธรรมเนียมนี้',
  ja: 'THB出金手数料は未確認です。表示金額には含まれていません。',
  ru: 'Комиссия за вывод THB не подтверждена и не включена в сумму.',
  ko: 'THB 출금 수수료는 확인되지 않았으며 표시 금액에 포함되지 않습니다.',
  fr: 'Les frais de retrait THB ne sont pas vérifiés et sont exclus du montant affiché.',
  de: 'Die THB-Auszahlungsgebühr ist ungeprüft und im angezeigten Betrag nicht enthalten.',
  id: 'Biaya penarikan THB belum diverifikasi dan tidak termasuk dalam jumlah yang ditampilkan.',
  vi: 'Phí rút THB chưa được xác minh và chưa được tính vào số tiền hiển thị.',
};
