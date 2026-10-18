import type { ContentLocale } from '@/lib/types';

export type HomeSeoSection = { question: string; answer: string };

export type HomeSeoCopy = {
  quickAnswer: string;
  updated: string;
  sections: HomeSeoSection[];
  exchangeTable: { title: string; head: { name: string; licence: string; fee: string; withdraw: string; pairs: string } };
  cashTable: { title: string; head: { provider: string; area: string; hours: string } };
  unknownMark: string;
  sourceNote: string;
  links: {
    cash: string;
    crypto: string;
    ratchada: string;
    superrich: string;
    twelve: string;
    usdCash: string;
    btc: string;
    airport: string;
    methodology: string;
  };
  faqHeading: string;
  faq: HomeSeoSection[];
};

/**
 * Answer-first copy for the homepage. Every heading is a full question and every
 * body starts with the conclusion, because that is the shape AI answer engines
 * extract and cite. Numbers are never written here: the fee and hours columns are
 * rendered from data/site.ts so no rate, fee or spread can drift or be invented.
 */
export const homeSeoCopy: Record<ContentLocale, HomeSeoCopy> = {
  en: {
    quickAnswer: 'Quick answer: in Bangkok, city money changers usually cost less than airport counters, and a Thai exchange only wins if you already hold crypto. Compare the THB you actually receive, not the posted rate.',
    updated: 'Reviewed 2026-10-18',
    sections: [
      {
        question: 'Where do you get more baht for the same money?',
        answer: 'Start with the route you can actually finish. Cash is the simpler route for travellers; a Thai exchange only wins when you can sell, withdraw THB and receive it in a bank account. Use the comparison above to see the estimated THB for your amount, then check the fee fields below before you decide.',
      },
      {
        question: 'Which Bangkok money changer should you visit?',
        answer: 'Pick the branch, not the brand. Rates and opening hours differ by branch, and a head-office quote may not apply at an airport counter or another shop. The table below lists the branches this site publishes, with the hours we can verify.',
      },
      {
        question: 'What does the exchange actually cost you?',
        answer: 'Two costs matter: the spread between the quoted rate and the mid-market rate, and the explicit fees. This site shows only the fee fields it can verify from the platform or provider; anything it cannot verify is marked as unknown instead of estimated.',
      },
      {
        question: 'What should you check before you hand over money?',
        answer: 'Confirm the final rate at the counter, the banknote condition and denomination, and the ID requirement. Licensed money changers in Thailand record identification for exchange transactions, so bring your passport.',
      },
      {
        question: 'Which page should you open next?',
        answer: 'Open the page that matches your trip: the cash comparison if you carry foreign cash, the crypto comparison if you hold USDT or BTC, a money changer profile if you already know the shop, or the route guide if you are deciding by area or by airport.',
      },
    ],
    exchangeTable: {
      title: 'Thai exchanges compared on the fee fields this site can verify',
      head: { name: 'Exchange', licence: 'Licence', fee: 'Trading fee', withdraw: 'THB withdrawal', pairs: 'Pairs' },
    },
    cashTable: {
      title: 'Bangkok money changers: branch, area and published hours',
      head: { provider: 'Provider', area: 'Area', hours: 'Hours' },
    },
    unknownMark: 'not verified',
    sourceNote: 'Fee and hours values come from the provider data configured on this site. Amounts in the comparison tool are estimates; confirm the final rate with the provider or platform.',
    links: {
      cash: 'Cash to THB comparison',
      crypto: 'Crypto to THB comparison',
      ratchada: 'Ratchada Exchange profile',
      superrich: 'SuperRich Thailand profile',
      twelve: 'Twelve Victory profile',
      usdCash: 'USD cash route',
      btc: 'BTC to THB route',
      airport: 'Airport money exchange guide',
      methodology: 'How this site compares',
    },
    faqHeading: 'What do people ask before exchanging THB?',
    faq: [
      {
        question: 'Is it cheaper to exchange cash in Bangkok or at the airport?',
        answer: 'City branches are generally cheaper than airport counters. Compare the estimated THB you receive for the same amount before you decide, and remember that airport hours and branch hours are not the same.',
      },
      {
        question: 'Can you exchange USDT or BTC for baht in Thailand?',
        answer: 'Yes, through the Thai SEC-licensed exchanges listed on this site. You need a verified account and a THB withdrawal to a bank account; the comparison includes trading fees and THB withdrawal fees where they are known.',
      },
      {
        question: 'Do you need a passport to exchange money in Thailand?',
        answer: 'Bring your passport. Licensed money changers record identification for exchange transactions, and larger amounts are checked more carefully.',
      },
      {
        question: 'Why does this site show an estimated amount instead of a final rate?',
        answer: 'The rates are observations from public sources, not a guaranteed counter quote. Every amount is an estimate, and the final rate is set by the provider when you exchange.',
      },
      {
        question: 'How often does the data update?',
        answer: 'Crypto prices refresh about every 30 seconds while the public feed is healthy. Cash rate references are collected on a scheduled 10-minute cycle and labelled live, hybrid or fallback so you can see how current they are.',
      },
    ],
  },

  th: {
    quickAnswer: 'สรุปสั้น: ร้านแลกเงินในกรุงเทพฯ มักถูกกว่าตู้ที่สนามบิน และแพลตฟอร์มคริปโตจะคุ้มกว่าก็ต่อเมื่อคุณมีคริปโตอยู่แล้ว ควรเทียบยอดบาทที่ได้รับจริง ไม่ใช่ดูแค่เรทบนป้าย',
    updated: 'ตรวจข้อมูลล่าสุด 2026-10-18',
    sections: [
      {
        question: 'แลกเงินแบบไหนได้บาทมากกว่ากัน?',
        answer: 'เริ่มจากเส้นทางที่คุณทำได้จริง เงินสดเหมาะกับนักเดินทาง ส่วนแพลตฟอร์มไทยจะคุ้มกว่าก็ต่อเมื่อคุณขาย ถอนเป็นบาท และรับเงินเข้าบัญชีธนาคารได้ครบ ใช้เครื่องมือด้านบนดูยอดบาทโดยประมาณของจำนวนที่คุณกรอก แล้วตรวจค่าธรรมเนียมด้านล่างก่อนตัดสินใจ',
      },
      {
        question: 'ควรไปร้านแลกเงินกรุงเทพฯ ร้านไหน?',
        answer: 'เลือกที่สาขา ไม่ใช่แค่แบรนด์ เพราะเรทและเวลาเปิดของแต่ละสาขาไม่เหมือนกัน และเรทสำนักงานใหญ่ไม่ได้ใช้กับสนามบินหรือสาขาอื่นเสมอ ตารางด้านล่างคือสาขาที่เว็บนี้เผยแพร่ พร้อมเวลาเปิดที่ตรวจสอบได้',
      },
      {
        question: 'การแลกเงินมีต้นทุนอะไรบ้าง?',
        answer: 'มีสองส่วนคือส่วนต่างระหว่างเรทที่เสนอกับเรทกลางตลาด และค่าธรรมเนียมที่ระบุชัดเจน เว็บนี้แสดงเฉพาะค่าธรรมเนียมที่ตรวจสอบได้จากแพลตฟอร์มหรือผู้ให้บริการ ส่วนที่ยังยืนยันไม่ได้จะแสดงว่าไม่ทราบ ไม่เดาตัวเลข',
      },
      {
        question: 'ก่อนแลกเงินควรตรวจอะไรบ้าง?',
        answer: 'ยืนยันเรทสุดท้ายที่เคาน์เตอร์ สภาพและชนิดธนบัตร และเอกสารที่ต้องใช้ ร้านแลกเงินที่ได้รับใบอนุญาตในไทยบันทึกข้อมูลผู้แลกทุกครั้ง โปรดพาหนังสือเดินทางไปด้วย',
      },
      {
        question: 'ควรเปิดหน้าไหนต่อ?',
        answer: 'เลือกหน้าตามทริปของคุณ ถ้าแลกเงินสดให้เปิดหน้าเปรียบเทียบเงินสด ถ้าถือ USDT หรือ BTC ให้เปิดหน้าเปรียบเทียบคริปโต ถ้ารู้ร้านแล้วให้เปิดโปรไฟล์ร้าน หรือถ้ายังเลือกพื้นที่หรือสนามบินให้เปิดคู่มือเส้นทาง',
      },
    ],
    exchangeTable: {
      title: 'แพลตฟอร์มไทย เทียบเฉพาะค่าธรรมเนียมที่เว็บนี้ตรวจสอบได้',
      head: { name: 'แพลตฟอร์ม', licence: 'ใบอนุญาต', fee: 'ค่าธรรมเนียมเทรด', withdraw: 'ค่าถอนบาท', pairs: 'คู่เทรด' },
    },
    cashTable: {
      title: 'ร้านแลกเงินกรุงเทพฯ: สาขา ย่าน และเวลาเปิดที่เผยแพร่',
      head: { provider: 'ร้าน', area: 'ย่าน', hours: 'เวลาเปิด' },
    },
    unknownMark: 'ยังไม่ตรวจสอบ',
    sourceNote: 'ค่าธรรมเนียมและเวลาเปิดมาจากข้อมูลผู้ให้บริการที่ตั้งไว้ในเว็บนี้ ยอดในเครื่องมือเปรียบเทียบเป็นประมาณการ โปรดยืนยันเรทสุดท้ายกับผู้ให้บริการหรือแพลตฟอร์ม',
    links: {
      cash: 'เปรียบเทียบเงินสดเป็นบาท',
      crypto: 'เปรียบเทียบคริปโตเป็นบาท',
      ratchada: 'โปรไฟล์ Ratchada Exchange',
      superrich: 'โปรไฟล์ SuperRich Thailand',
      twelve: 'โปรไฟล์ Twelve Victory',
      usdCash: 'เส้นทางเงินสด USD',
      btc: 'เส้นทาง BTC เป็นบาท',
      airport: 'คู่มือแลกเงินสนามบิน',
      methodology: 'วิธีการเปรียบเทียบของเว็บนี้',
    },
    faqHeading: 'คนส่วนใหญ่ถามอะไรก่อนแลกเงินบาท?',
    faq: [
      {
        question: 'แลกเงินสดในกรุงเทพฯ ถูกกว่าที่สนามบินไหม?',
        answer: 'โดยทั่วไปสาขาในเมืองถูกกว่าตู้ที่สนามบิน แต่ควรเทียบยอดบาทที่ได้รับจริงจากจำนวนเดียวกันก่อนตัดสินใจ และเวลาเปิดของสนามบินกับสาขาก็ไม่เหมือนกัน',
      },
      {
        question: 'แลก USDT หรือ BTC เป็นบาทในไทยได้ไหม?',
        answer: 'ได้ ผ่านแพลตฟอร์มที่ได้รับใบอนุญาต ก.ล.ต. ไทยซึ่งแสดงในเว็บนี้ ต้องมีบัญชีที่ยืนยันตัวตนแล้วและถอนเป็นบาทเข้าบัญชีธนาคาร การเปรียบเทียบรวมค่าธรรมเนียมเทรดและค่าถอนบาทเท่าที่ทราบ',
      },
      {
        question: 'ต้องใช้หนังสือเดินทางไหมในการแลกเงิน?',
        answer: 'ควรพาไป เพราะร้านแลกเงินที่ได้รับใบอนุญาตบันทึกข้อมูลผู้แลกทุกครั้ง และจำนวนเงินมากจะถูกตรวจละเอียดกว่า',
      },
      {
        question: 'ทำไมเว็บแสดงยอดประมาณ ไม่ใช่เรทสุดท้าย?',
        answer: 'เรทเป็นค่าที่สังเกตจากแหล่งสาธารณะ ไม่ใช่เรทหน้าร้านที่รับประกัน ทุกยอดเป็นประมาณการ และเรทสุดท้ายผู้ให้บริการเป็นผู้กำหนดตอนแลกจริง',
      },
      {
        question: 'ข้อมูลอัปเดตบ่อยแค่ไหน?',
        answer: 'ราคาคริปโตอัปเดตประมาณทุก 30 วินาทีเมื่อฟีดสาธารณะปกติ ส่วนเรทเงินสดเก็บตามรอบตั้งเวลา 10 นาที และติดป้ายสด ผสม หรือสำรอง เพื่อให้เห็นว่าข้อมูลใหม่แค่ไหน',
      },
    ],
  },

  zh: {
    quickAnswer: '直接回答：曼谷市区换汇店通常比机场柜台便宜；只有当你已经持有加密资产时，泰国交易所才可能更划算。请比较实际到手的泰铢，而不是挂牌汇率。',
    updated: '数据核对：2026-10-18',
    sections: [
      {
        question: '同样一笔钱，哪种方式换到的泰铢更多？',
        answer: '先看你能走通哪条路。游客用现金最简单；泰国交易所只有在你能完成卖出、提取泰铢并到账银行时才更省。用上面的工具看你输入金额的预计泰铢，再对照下面的费用字段决定。',
      },
      {
        question: '曼谷换汇店应该选哪一家？',
        answer: '先选分店，不要只认品牌。不同分店的汇率和营业时间不一样，总店报价不一定适用于机场或其他门店。下表是本站公开的分店，以及我们能核实的营业时间。',
      },
      {
        question: '换汇到底贵在哪里？',
        answer: '两笔成本：报价与中间价之间的价差，以及明确列出的手续费。本站只展示能从平台或服务商核实的费用字段；核实不到的会标注“未核验”，不猜数字。',
      },
      {
        question: '交钱之前要核对什么？',
        answer: '在柜台确认最终汇率、纸币新旧与面额，以及证件要求。泰国持牌换汇店会登记换汇人身份，请随身携带护照。',
      },
      {
        question: '接下来该打开哪一页？',
        answer: '按行程选：带外币现金就打开现金对比，持有 USDT 或 BTC 就打开加密对比；已经知道店铺就打开门店页；还在选区域或机场就看路线指南。',
      },
    ],
    exchangeTable: {
      title: '泰国交易所：只对比本站能核实的费用字段',
      head: { name: '平台', licence: '牌照', fee: '交易费', withdraw: '泰铢提现', pairs: '交易对' },
    },
    cashTable: {
      title: '曼谷换汇店：分店、区域与公开营业时间',
      head: { provider: '换汇店', area: '区域', hours: '营业时间' },
    },
    unknownMark: '未核验',
    sourceNote: '费用与营业时间来自本站配置的服务商数据。比较工具中的金额为估算，最终汇率请向门店或平台确认。',
    links: {
      cash: '现金换泰铢对比',
      crypto: '加密换泰铢对比',
      ratchada: 'Ratchada Exchange 门店页',
      superrich: 'SuperRich Thailand 门店页',
      twelve: 'Twelve Victory 门店页',
      usdCash: '美元现金路线',
      btc: 'BTC 换泰铢路线',
      airport: '机场换汇指南',
      methodology: '本站如何比较',
    },
    faqHeading: '换泰铢之前，大家最常问什么？',
    faq: [
      {
        question: '在曼谷换现金比在机场便宜吗？',
        answer: '一般来说市区门店比机场柜台便宜，但请用同一金额比较实际到手泰铢再决定；机场和门店的营业时间也不相同。',
      },
      {
        question: '在泰国可以把 USDT 或 BTC 换成泰铢吗？',
        answer: '可以，通过本站列出的泰国 SEC 持牌交易所。需要已实名的账户，并把泰铢提现到银行账户；对比结果包含交易费与已知的泰铢提现费。',
      },
      {
        question: '在泰国换钱需要护照吗？',
        answer: '需要携带。持牌换汇店会登记换汇人身份，金额较大时核验更仔细。',
      },
      {
        question: '为什么页面显示预计金额，而不是最终汇率？',
        answer: '汇率来自公开来源的观测值，不等于柜台保证成交价。所有金额都是估算，最终汇率由服务商在你实际换汇时决定。',
      },
      {
        question: '数据多久更新一次？',
        answer: '公开行情正常时，加密价格约每 30 秒刷新；现金汇率按 10 分钟定时采集，并标注实时、混合或备用，方便你判断数据新鲜度。',
      },
    ],
  },

  ja: {
    quickAnswer: '結論：バンコク市内の両替店は空港カウンターより有利なことが多く、タイの取引所が有利になるのは暗号資産をすでに持っている場合です。表示レートではなく、実際に受け取るTHBで比較してください。',
    updated: 'データ確認 2026-10-18',
    sections: [
      {
        question: '同じ金額でより多くのバーツを受け取れるのはどの方法ですか？',
        answer: 'まず自分が最後まで実行できる経路で選びます。旅行者には現金が最も簡単で、タイの取引所は売却・THB出金・銀行着金まで完了できる場合に有利です。上のツールで入力金額の概算THBを確認し、下の手数料欄と合わせて判断してください。',
      },
      {
        question: 'バンコクの両替店はどこを選べばいいですか？',
        answer: 'ブランドではなく支店で選びます。レートも営業時間も支店ごとに違い、本店のレートが空港や別支店に適用されるとは限りません。下の表は当サイトが公開している支店と、確認できた営業時間です。',
      },
      {
        question: '両替のコストは何ですか？',
        answer: 'コストは表示レートと仲値のスプレッド、そして明示された手数料の2つです。当サイトは取引所や提供元から確認できた手数料項目のみ表示し、確認できない項目は推測せず「未確認」と表示します。',
      },
      {
        question: '両替前に何を確認すべきですか？',
        answer: 'カウンターで最終レート、紙幣の状態と額面、本人確認の条件を確認してください。タイの許可を受けた両替店は両替時に身元を記録するため、パスポートを持参してください。',
      },
      {
        question: '次にどのページを開くべきですか？',
        answer: '旅行に合うページを選んでください。外貨現金なら現金比較、USDTやBTCなら暗号資産比較、店舗が決まっているなら店舗ページ、エリアや空港で選ぶならルートガイドです。',
      },
    ],
    exchangeTable: {
      title: 'タイの取引所：当サイトで確認できる手数料項目のみ比較',
      head: { name: '取引所', licence: 'ライセンス', fee: '取引手数料', withdraw: 'THB出金', pairs: '取引ペア' },
    },
    cashTable: {
      title: 'バンコクの両替店：支店・エリア・公開営業時間',
      head: { provider: '店舗', area: 'エリア', hours: '営業時間' },
    },
    unknownMark: '未確認',
    sourceNote: '手数料と営業時間は当サイトに設定された提供元データです。比較ツールの金額は概算で、最終レートは提供元・取引所に確認してください。',
    links: {
      cash: '現金→THB比較',
      crypto: '暗号資産→THB比較',
      ratchada: 'Ratchada Exchange 店舗ページ',
      superrich: 'SuperRich Thailand 店舗ページ',
      twelve: 'Twelve Victory 店舗ページ',
      usdCash: 'USD現金ルート',
      btc: 'BTC→THBルート',
      airport: '空港両替ガイド',
      methodology: '比較の方法',
    },
    faqHeading: '両替前に、みんなは何を確認していますか？',
    faq: [
      {
        question: '現金両替は市内と空港のどちらが安いですか？',
        answer: '一般に市内支店のほうが空港カウンターより有利ですが、同じ金額で受け取るTHBを比較して判断してください。空港と支店では営業時間も異なります。',
      },
      {
        question: 'タイでUSDTやBTCをバーツにできますか？',
        answer: 'できます。当サイトに掲載するタイSEC認可の取引所を利用します。本人確認済みの口座とTHBの銀行出金が必要で、比較には取引手数料と判明しているTHB出金手数料が含まれます。',
      },
      {
        question: '両替にパスポートは必要ですか？',
        answer: '持参してください。許可を受けた両替店は両替時に本人確認情報を記録し、高額の場合はより詳しく確認されます。',
      },
      {
        question: 'なぜ最終レートではなく概算が表示されるのですか？',
        answer: 'レートは公開情報の観測値で、店頭の確定レートではありません。金額はすべて概算で、最終レートは実際の両替時に提供元が決めます。',
      },
      {
        question: 'データはどのくらいの頻度で更新されますか？',
        answer: '公開フィードが正常なとき、暗号資産価格は約30秒ごとに更新されます。現金レートは10分間隔の定期収集で、ライブ・ハイブリッド・フォールバックの表示が付きます。',
      },
    ],
  },

  ru: {
    quickAnswer: 'Короткий ответ: обменники в центре Бангкока обычно выгоднее стоек в аэропорту, а тайская биржа выигрывает только если у вас уже есть криптовалюта. Сравнивайте сумму THB к получению, а не курс на вывеске.',
    updated: 'Данные проверены 2026-10-18',
    sections: [
      {
        question: 'Где вы получите больше бат за ту же сумму?',
        answer: 'Начните с маршрута, который вы действительно можете завершить. Путешественнику проще наличные; тайская биржа выигрывает, когда вы можете продать актив, вывести THB и получить деньги на банковский счёт. Посмотрите примерную сумму выше и проверьте поля комиссий ниже.',
      },
      {
        question: 'Какой обменник в Бангкоке выбрать?',
        answer: 'Выбирайте отделение, а не бренд. Курс и часы работы различаются по отделениям, а курс головного офиса не всегда действует в аэропорту или другой точке. В таблице ниже — отделения, которые публикует сайт, и подтверждённые часы.',
      },
      {
        question: 'Из чего складывается стоимость обмена?',
        answer: 'Из двух частей: спреда между предложенным курсом и рыночной серединой, и явных комиссий. Сайт показывает только те поля комиссий, которые можно проверить у платформы или провайдера; непроверенные помечаются как неизвестные, без выдуманных чисел.',
      },
      {
        question: 'Что проверить перед обменом?',
        answer: 'Уточните итоговый курс у стойки, состояние и номинал банкнот, а также требования к документам. Лицензированные обменники Таиланда фиксируют данные клиента при обмене, поэтому возьмите паспорт.',
      },
      {
        question: 'Какую страницу открыть дальше?',
        answer: 'Выберите страницу под свою поездку: сравнение наличных, если везёте валюту; сравнение криптовалют, если держите USDT или BTC; карточку обменника, если точка уже выбрана; гид по маршруту, если решаете по району или аэропорту.',
      },
    ],
    exchangeTable: {
      title: 'Тайские биржи: только проверяемые поля комиссий',
      head: { name: 'Биржа', licence: 'Лицензия', fee: 'Комиссия', withdraw: 'Вывод THB', pairs: 'Пары' },
    },
    cashTable: {
      title: 'Обменники Бангкока: отделение, район и опубликованные часы',
      head: { provider: 'Обменник', area: 'Район', hours: 'Часы' },
    },
    unknownMark: 'не проверено',
    sourceNote: 'Комиссии и часы взяты из данных провайдеров, настроенных на сайте. Суммы в сравнении примерные; итоговый курс подтверждайте у провайдера или на платформе.',
    links: {
      cash: 'Сравнение наличных в THB',
      crypto: 'Сравнение крипто в THB',
      ratchada: 'Карточка Ratchada Exchange',
      superrich: 'Карточка SuperRich Thailand',
      twelve: 'Карточка Twelve Victory',
      usdCash: 'Маршрут USD наличными',
      btc: 'Маршрут BTC в THB',
      airport: 'Гид по обмену в аэропорту',
      methodology: 'Как сайт сравнивает',
    },
    faqHeading: 'О чём чаще всего спрашивают перед обменом бат?',
    faq: [
      {
        question: 'Обмен наличных в городе дешевле, чем в аэропорту?',
        answer: 'Отделения в городе, как правило, выгоднее стоек в аэропорту, но сравните фактическую сумму THB за одинаковую сумму. Часы работы в аэропорту и в отделениях тоже различаются.',
      },
      {
        question: 'Можно ли обменять USDT или BTC на баты в Таиланде?',
        answer: 'Да, через лицензированные SEC Таиланда биржи с этого сайта. Нужен верифицированный аккаунт и вывод THB на банковский счёт; сравнение учитывает торговую комиссию и известные комиссии за вывод.',
      },
      {
        question: 'Нужен ли паспорт для обмена денег?',
        answer: 'Да, возьмите его. Лицензированные обменники фиксируют данные клиента при обмене, а крупные суммы проверяют внимательнее.',
      },
      {
        question: 'Почему показана примерная сумма, а не итоговый курс?',
        answer: 'Курсы — это наблюдения из публичных источников, а не гарантированный курс у стойки. Все суммы примерные, итоговый курс определяет провайдер при обмене.',
      },
      {
        question: 'Как часто обновляются данные?',
        answer: 'Рыночные цены криптовалют обновляются примерно каждые 30 секунд при доступном публичном потоке. Курсы наличных собираются по расписанию каждые 10 минут с метками live, hybrid или fallback.',
      },
    ],
  },

  ko: {
    quickAnswer: '결론: 방콕 시내 환전소가 공항 카운터보다 대체로 유리하고, 태국 거래소는 이미 암호화폐를 보유한 경우에만 유리합니다. 게시된 환율이 아니라 실제로 받는 THB를 비교하세요.',
    updated: '데이터 확인 2026-10-18',
    sections: [
      {
        question: '같은 금액으로 THB를 더 받으려면 어떤 방법이 좋나요?',
        answer: '먼저 실제로 끝까지 진행할 수 있는 경로를 고르세요. 여행자에게는 현금이 가장 간단하고, 태국 거래소는 매도·THB 출금·은행 입금까지 완료할 수 있을 때 유리합니다. 위 도구에서 예상 THB를 확인하고 아래 수수료 항목과 함께 판단하세요.',
      },
      {
        question: '방콕 환전소는 어디를 골라야 하나요?',
        answer: '브랜드보다 지점을 고르세요. 환율과 영업시간이 지점마다 다르고, 본점 환율이 공항이나 다른 지점에 적용되지 않을 수 있습니다. 아래 표는 이 사이트가 공개하는 지점과 확인된 영업시간입니다.',
      },
      {
        question: '환전 비용은 무엇으로 구성되나요?',
        answer: '제시 환율과 시장 중간가의 스프레드, 그리고 명시된 수수료 두 가지입니다. 이 사이트는 거래소나 제공자에게서 확인한 수수료 항목만 표시하고, 확인되지 않은 값은 추측하지 않고 미확인으로 표시합니다.',
      },
      {
        question: '환전 전에 무엇을 확인해야 하나요?',
        answer: '카운터에서 최종 환율, 지폐 상태와 권종, 신분증 요구사항을 확인하세요. 태국 허가 환전소는 환전 시 신원을 기록하므로 여권을 지참하세요.',
      },
      {
        question: '다음에 어떤 페이지를 열어야 하나요?',
        answer: '여행에 맞는 페이지를 고르세요. 외화 현금이면 현금 비교, USDT나 BTC면 암호화폐 비교, 매장이 정해졌으면 매장 페이지, 지역이나 공항으로 고른다면 경로 가이드입니다.',
      },
    ],
    exchangeTable: {
      title: '태국 거래소: 이 사이트가 확인할 수 있는 수수료 항목만 비교',
      head: { name: '거래소', licence: '라이선스', fee: '거래 수수료', withdraw: 'THB 출금', pairs: '거래쌍' },
    },
    cashTable: {
      title: '방콕 환전소: 지점, 지역, 공개 영업시간',
      head: { provider: '환전소', area: '지역', hours: '영업시간' },
    },
    unknownMark: '미확인',
    sourceNote: '수수료와 영업시간은 이 사이트에 설정된 제공자 데이터입니다. 비교 도구의 금액은 추정치이며 최종 환율은 제공자나 거래소에 확인하세요.',
    links: {
      cash: '현금→THB 비교',
      crypto: '암호화폐→THB 비교',
      ratchada: 'Ratchada Exchange 매장 페이지',
      superrich: 'SuperRich Thailand 매장 페이지',
      twelve: 'Twelve Victory 매장 페이지',
      usdCash: 'USD 현금 경로',
      btc: 'BTC→THB 경로',
      airport: '공항 환전 가이드',
      methodology: '비교 방법',
    },
    faqHeading: '환전 전에 사람들이 가장 많이 묻는 것은?',
    faq: [
      {
        question: '시내 현금 환전이 공항보다 싼가요?',
        answer: '일반적으로 시내 지점이 공항 카운터보다 유리하지만, 같은 금액으로 실제 받는 THB를 비교해 판단하세요. 공항과 지점의 영업시간도 다릅니다.',
      },
      {
        question: '태국에서 USDT나 BTC를 바트로 바꿀 수 있나요?',
        answer: '가능합니다. 이 사이트에 소개된 태국 SEC 허가 거래소를 이용하며, 본인인증 계정과 THB 은행 출금이 필요합니다. 비교에는 거래 수수료와 확인된 THB 출금 수수료가 포함됩니다.',
      },
      {
        question: '환전에 여권이 필요한가요?',
        answer: '지참하세요. 허가 환전소는 환전 시 신원 정보를 기록하고, 고액은 더 자세히 확인합니다.',
      },
      {
        question: '왜 최종 환율이 아니라 예상 금액이 표시되나요?',
        answer: '환율은 공개 출처의 관측값이며 카운터 확정 환율이 아닙니다. 모든 금액은 추정치이고 최종 환율은 실제 환전 시 제공자가 정합니다.',
      },
      {
        question: '데이터는 얼마나 자주 갱신되나요?',
        answer: '공개 피드가 정상일 때 암호화폐 가격은 약 30초마다 갱신됩니다. 현금 환율은 10분 주기로 수집되고 실시간·혼합·대체 표시가 붙습니다.',
      },
    ],
  },

  fr: {
    quickAnswer: "Réponse courte : à Bangkok, les bureaux de change en ville sont généralement plus avantageux que les comptoirs de l'aéroport, et une plateforme thaïlandaise ne l'emporte que si vous détenez déjà des cryptos. Comparez les THB réellement reçus, pas le taux affiché.",
    updated: 'Données vérifiées le 2026-10-18',
    sections: [
      {
        question: "Où obtient-on plus de bahts pour la même somme ?",
        answer: "Partez du parcours que vous pouvez réellement terminer. Pour un voyageur, l'espèce est le plus simple ; une plateforme thaïlandaise n'est avantageuse que si vous pouvez vendre, retirer en THB et recevoir les fonds sur un compte bancaire. Vérifiez le montant estimé ci-dessus, puis les frais ci-dessous.",
      },
      {
        question: 'Quel bureau de change choisir à Bangkok ?',
        answer: "Choisissez une agence, pas une marque. Les taux et les horaires varient selon l'agence, et le taux du siège ne s'applique pas forcément à l'aéroport ou à une autre boutique. Le tableau ci-dessous liste les agences publiées par le site et les horaires vérifiés.",
      },
      {
        question: 'Combien coûte réellement un change ?',
        answer: "Deux coûts : l'écart entre le taux proposé et le taux de marché, et les frais explicites. Le site n'affiche que les frais qu'il peut vérifier auprès de la plateforme ou du prestataire ; le reste est marqué comme non vérifié, sans chiffres inventés.",
      },
      {
        question: 'Que vérifier avant de payer ?',
        answer: "Confirmez le taux final au comptoir, l'état et la coupure des billets, et les pièces demandées. Les bureaux agréés en Thaïlande enregistrent l'identité du client : prenez votre passeport.",
      },
      {
        question: 'Quelle page ouvrir ensuite ?',
        answer: 'Choisissez la page qui correspond à votre voyage : comparaison des espèces, comparaison crypto, fiche du bureau, ou guide de itinéraire si vous choisissez par quartier ou par aéroport.',
      },
    ],
    exchangeTable: {
      title: 'Plateformes thaïlandaises : uniquement les frais vérifiables',
      head: { name: 'Plateforme', licence: 'Licence', fee: 'Frais', withdraw: 'Retrait THB', pairs: 'Paires' },
    },
    cashTable: {
      title: 'Bureaux de change de Bangkok : agence, quartier et horaires publiés',
      head: { provider: 'Bureau', area: 'Quartier', hours: 'Horaires' },
    },
    unknownMark: 'non vérifié',
    sourceNote: 'Les frais et horaires proviennent des données prestataires configurées sur ce site. Les montants du comparateur sont estimatifs ; confirmez le taux final auprès du prestataire.',
    links: {
      cash: 'Comparer les espèces en THB',
      crypto: 'Comparer la crypto en THB',
      ratchada: 'Fiche Ratchada Exchange',
      superrich: 'Fiche SuperRich Thailand',
      twelve: 'Fiche Twelve Victory',
      usdCash: 'Parcours USD espèces',
      btc: 'Parcours BTC en THB',
      airport: 'Guide des changes à l’aéroport',
      methodology: 'Notre méthode de comparaison',
    },
    faqHeading: 'Que demande-t-on le plus souvent avant de changer des bahts ?',
    faq: [
      {
        question: "Les espèces sont-elles moins chères en ville qu'à l'aéroport ?",
        answer: "En général, les agences en ville sont plus avantageuses que les comptoirs de l'aéroport, mais comparez les THB reçus pour une même somme. Les horaires diffèrent aussi entre l'aéroport et les agences.",
      },
      {
        question: 'Peut-on changer des USDT ou des BTC en bahts en Thaïlande ?',
        answer: "Oui, via les plateformes agréées par la SEC thaïlandaise listées ici. Il faut un compte vérifié et un retrait en THB vers un compte bancaire ; la comparaison inclut les frais de transaction et les frais de retrait connus.",
      },
      {
        question: "Faut-il un passeport pour changer de l'argent ?",
        answer: "Oui, emportez-le. Les bureaux agréés enregistrent l'identité lors de l'opération, et les montants élevés sont vérifiés plus attentivement.",
      },
      {
        question: 'Pourquoi afficher un montant estimé et non le taux final ?',
        answer: "Les taux sont des observations de sources publiques, pas un taux garanti au comptoir. Tous les montants sont estimés et le taux final est fixé par le prestataire au moment de l'opération.",
      },
      {
        question: 'À quelle fréquence les données sont-elles mises à jour ?',
        answer: "Les prix crypto se rafraîchissent environ toutes les 30 secondes lorsque le flux public fonctionne. Les taux en espèces sont collectés toutes les 10 minutes et étiquetés live, hybride ou secours.",
      },
    ],
  },

  de: {
    quickAnswer: 'Kurzantwort: Wechselstuben in der Innenstadt von Bangkok sind meist günstiger als Schalter am Flughafen, und eine thailändische Börse lohnt nur, wenn Sie bereits Krypto besitzen. Vergleichen Sie die tatsächlich erhaltenen THB, nicht den ausgehängten Kurs.',
    updated: 'Daten geprüft am 2026-10-18',
    sections: [
      {
        question: 'Wo bekommt man für dasselbe Geld mehr Baht?',
        answer: 'Beginnen Sie mit dem Weg, den Sie wirklich abschließen können. Für Reisende ist Bargeld am einfachsten; eine thailändische Börse lohnt nur, wenn Verkauf, THB-Auszahlung und Bankgutschrift funktionieren. Prüfen Sie den geschätzten Betrag oben und die Gebührenfelder unten.',
      },
      {
        question: 'Welche Wechselstube in Bangkok sollte man wählen?',
        answer: 'Wählen Sie die Filiale, nicht die Marke. Kurse und Öffnungszeiten unterscheiden sich je Filiale, und der Kurs der Zentrale gilt nicht zwingend am Flughafen oder in einer anderen Filiale. Die Tabelle unten zeigt die veröffentlichten Filialen und geprüfte Zeiten.',
      },
      {
        question: 'Was kostet der Umtausch wirklich?',
        answer: 'Zwei Kosten: die Spanne zwischen angebotenem Kurs und Mittelkurs sowie ausgewiesene Gebühren. Die Seite zeigt nur Gebührenfelder, die sich bei Plattform oder Anbieter prüfen lassen; nicht geprüfte Werte werden als unbekannt markiert statt geschätzt.',
      },
      {
        question: 'Was sollte man vor dem Umtausch prüfen?',
        answer: 'Bestätigen Sie den Endkurs am Schalter, Zustand und Stückelung der Banknoten sowie die Ausweispflicht. Lizenzierte Wechselstuben in Thailand erfassen die Identität; nehmen Sie den Reisepass mit.',
      },
      {
        question: 'Welche Seite sollte man als Nächstes öffnen?',
        answer: 'Wählen Sie die Seite passend zur Reise: Bargeldvergleich, Krypto-Vergleich, Filialseite oder Routen-Leitfaden, wenn Sie nach Gegend oder Flughafen entscheiden.',
      },
    ],
    exchangeTable: {
      title: 'Thailändische Börsen: nur prüfbare Gebührenfelder',
      head: { name: 'Börse', licence: 'Lizenz', fee: 'Gebühr', withdraw: 'THB-Auszahlung', pairs: 'Paare' },
    },
    cashTable: {
      title: 'Wechselstuben in Bangkok: Filiale, Gegend und veröffentlichte Zeiten',
      head: { provider: 'Wechselstube', area: 'Gegend', hours: 'Öffnungszeiten' },
    },
    unknownMark: 'nicht geprüft',
    sourceNote: 'Gebühren und Zeiten stammen aus den auf dieser Seite konfigurierten Anbieterdaten. Beträge im Vergleich sind Schätzungen; bestätigen Sie den Endkurs beim Anbieter.',
    links: {
      cash: 'Bargeld-THB-Vergleich',
      crypto: 'Krypto-THB-Vergleich',
      ratchada: 'Ratchada Exchange Filiale',
      superrich: 'SuperRich Thailand Filiale',
      twelve: 'Twelve Victory Filiale',
      usdCash: 'USD-Bargeld-Route',
      btc: 'BTC-THB-Route',
      airport: 'Leitfaden Flughafenwechsel',
      methodology: 'So vergleicht die Seite',
    },
    faqHeading: 'Was fragen die meisten vor dem Umtausch in Baht?',
    faq: [
      {
        question: 'Ist Bargeldtausch in der Stadt günstiger als am Flughafen?',
        answer: 'In der Regel sind Filialen in der Stadt günstiger als Flughafenschalter; vergleichen Sie aber die tatsächlich erhaltenen THB für denselben Betrag. Auch die Öffnungszeiten unterscheiden sich.',
      },
      {
        question: 'Kann man USDT oder BTC in Thailand in Baht tauschen?',
        answer: 'Ja, über die hier gelisteten, von der thailändischen SEC lizenzierten Börsen. Nötig sind ein verifiziertes Konto und eine THB-Auszahlung auf ein Bankkonto; der Vergleich enthält Handelsgebühren und bekannte Auszahlungsgebühren.',
      },
      {
        question: 'Braucht man einen Reisepass zum Geldwechseln?',
        answer: 'Ja, nehmen Sie ihn mit. Lizenzierte Wechselstuben erfassen die Identität bei der Transaktion, größere Beträge werden genauer geprüft.',
      },
      {
        question: 'Warum wird ein geschätzter Betrag statt des Endkurses gezeigt?',
        answer: 'Kurse sind Beobachtungen aus öffentlichen Quellen, kein garantierter Schalterkurs. Alle Beträge sind Schätzungen; den Endkurs legt der Anbieter beim Umtausch fest.',
      },
      {
        question: 'Wie oft werden die Daten aktualisiert?',
        answer: 'Krypto-Kurse aktualisieren etwa alle 30 Sekunden, solange der öffentliche Feed verfügbar ist. Bargeldkurse werden im 10-Minuten-Takt erfasst und als live, hybrid oder Ersatz gekennzeichnet.',
      },
    ],
  },

  id: {
    quickAnswer: 'Jawaban singkat: penukaran tunai di pusat kota Bangkok umumnya lebih murah daripada loket bandara, dan bursa Thailand hanya lebih untung jika Anda sudah punya kripto. Bandingkan THB yang benar-benar diterima, bukan kurs di papan.',
    updated: 'Data ditinjau 2026-10-18',
    sections: [
      {
        question: 'Di mana Anda mendapat lebih banyak baht untuk uang yang sama?',
        answer: 'Mulai dari jalur yang benar-benar bisa Anda selesaikan. Bagi pelancong, tunai paling sederhana; bursa Thailand baru unggul bila penjualan, penarikan THB, dan transfer ke bank bisa diselesaikan. Cek perkiraan THB di atas, lalu bandingkan kolom biaya di bawah.',
      },
      {
        question: 'Money changer Bangkok mana yang sebaiknya dipilih?',
        answer: 'Pilih cabangnya, bukan mereknya. Kurs dan jam buka berbeda per cabang, dan kurs kantor pusat belum tentu berlaku di bandara atau cabang lain. Tabel di bawah memuat cabang yang dipublikasikan situs ini beserta jam yang terverifikasi.',
      },
      {
        question: 'Berapa biaya penukaran sebenarnya?',
        answer: 'Dua biaya: selisih antara kurs yang ditawarkan dan kurs tengah pasar, serta biaya layanan yang tercantum. Situs hanya menampilkan kolom biaya yang bisa diverifikasi dari platform atau penyedia; yang belum terverifikasi ditandai tidak diketahui, bukan ditebak.',
      },
      {
        question: 'Apa yang harus dicek sebelum menukar uang?',
        answer: 'Pastikan kurs akhir di loket, kondisi dan pecahan uang, serta syarat identitas. Money changer berlisensi di Thailand mencatat identitas penukar, jadi bawa paspor.',
      },
      {
        question: 'Halaman mana yang sebaiknya dibuka berikutnya?',
        answer: 'Pilih halaman sesuai perjalanan Anda: perbandingan tunai, perbandingan kripto, profil money changer, atau panduan rute bila memilih berdasarkan area atau bandara.',
      },
    ],
    exchangeTable: {
      title: 'Bursa Thailand: hanya kolom biaya yang bisa diverifikasi',
      head: { name: 'Bursa', licence: 'Lisensi', fee: 'Biaya trading', withdraw: 'Penarikan THB', pairs: 'Pair' },
    },
    cashTable: {
      title: 'Money changer Bangkok: cabang, area, dan jam buka yang dipublikasikan',
      head: { provider: 'Penyedia', area: 'Area', hours: 'Jam buka' },
    },
    unknownMark: 'belum diverifikasi',
    sourceNote: 'Biaya dan jam buka berasal dari data penyedia yang dikonfigurasi di situs ini. Nominal di alat perbandingan adalah perkiraan; konfirmasikan kurs akhir ke penyedia atau platform.',
    links: {
      cash: 'Bandingkan tunai ke THB',
      crypto: 'Bandingkan kripto ke THB',
      ratchada: 'Profil Ratchada Exchange',
      superrich: 'Profil SuperRich Thailand',
      twelve: 'Profil Twelve Victory',
      usdCash: 'Rute USD tunai',
      btc: 'Rute BTC ke THB',
      airport: 'Panduan penukaran di bandara',
      methodology: 'Cara situs ini membandingkan',
    },
    faqHeading: 'Apa yang paling sering ditanyakan sebelum menukar baht?',
    faq: [
      {
        question: 'Apakah tukar tunai di kota lebih murah daripada di bandara?',
        answer: 'Umumnya cabang di kota lebih murah daripada loket bandara, tetapi bandingkan THB yang diterima untuk jumlah yang sama. Jam buka bandara dan cabang juga berbeda.',
      },
      {
        question: 'Bisakah USDT atau BTC ditukar ke baht di Thailand?',
        answer: 'Bisa, melalui bursa berlisensi SEC Thailand yang tercantum di situs ini. Diperlukan akun terverifikasi dan penarikan THB ke rekening bank; perbandingan mencakup biaya trading dan biaya penarikan THB yang diketahui.',
      },
      {
        question: 'Apakah perlu paspor untuk menukar uang?',
        answer: 'Ya, bawa paspor. Money changer berlisensi mencatat identitas saat transaksi, dan nominal besar diperiksa lebih teliti.',
      },
      {
        question: 'Mengapa yang ditampilkan perkiraan, bukan kurs akhir?',
        answer: 'Kurs adalah hasil pengamatan sumber publik, bukan kurs loket yang dijamin. Semua nominal adalah perkiraan dan kurs akhir ditetapkan penyedia saat penukaran.',
      },
      {
        question: 'Seberapa sering data diperbarui?',
        answer: 'Harga kripto diperbarui sekitar setiap 30 detik bila feed publik sehat. Kurs tunai dikumpulkan tiap 10 menit dan diberi label live, hybrid, atau cadangan.',
      },
    ],
  },

  vi: {
    quickAnswer: 'Trả lời ngắn: đổi tiền mặt ở trung tâm Bangkok thường rẻ hơn quầy sân bay, và sàn Thái Lan chỉ có lợi nếu bạn đã có crypto. Hãy so số THB thực nhận, không so tỷ giá treo bảng.',
    updated: 'Dữ liệu rà soát 2026-10-18',
    sections: [
      {
        question: 'Cùng một số tiền, đổi cách nào nhận nhiều baht hơn?',
        answer: 'Bắt đầu từ cách bạn thực sự làm được. Với khách du lịch, tiền mặt là đơn giản nhất; sàn Thái Lan chỉ có lợi khi bạn hoàn tất được bán, rút THB và nhận tiền vào ngân hàng. Xem số THB ước tính ở trên rồi đối chiếu phí bên dưới.',
      },
      {
        question: 'Nên chọn cửa hàng đổi tiền nào ở Bangkok?',
        answer: 'Chọn chi nhánh, không chỉ chọn thương hiệu. Tỷ giá và giờ mở cửa khác nhau theo chi nhánh, và giá của trụ sở không luôn áp dụng ở sân bay hay chi nhánh khác. Bảng dưới là các chi nhánh trang công bố và giờ đã kiểm chứng.',
      },
      {
        question: 'Đổi tiền tốn những khoản nào?',
        answer: 'Hai khoản: chênh lệch giữa tỷ giá chào và tỷ giá giữa thị trường, và phí được ghi rõ. Trang chỉ hiển thị các trường phí kiểm chứng được từ nền tảng hoặc đơn vị cung cấp; phần chưa kiểm chứng được ghi là chưa rõ, không đoán số.',
      },
      {
        question: 'Cần kiểm tra gì trước khi đổi tiền?',
        answer: 'Xác nhận tỷ giá cuối tại quầy, tình trạng và mệnh giá tiền, yêu cầu giấy tờ. Cửa hàng được cấp phép tại Thái Lan ghi nhận danh tính người đổi, nên hãy mang hộ chiếu.',
      },
      {
        question: 'Nên mở trang nào tiếp theo?',
        answer: 'Chọn trang phù hợp chuyến đi: so sánh tiền mặt, so sánh crypto, trang cửa hàng, hoặc hướng dẫn lộ trình nếu bạn chọn theo khu vực hay sân bay.',
      },
    ],
    exchangeTable: {
      title: 'Sàn Thái Lan: chỉ so các trường phí kiểm chứng được',
      head: { name: 'Sàn', licence: 'Giấy phép', fee: 'Phí giao dịch', withdraw: 'Rút THB', pairs: 'Cặp' },
    },
    cashTable: {
      title: 'Cửa hàng đổi tiền Bangkok: chi nhánh, khu vực và giờ công bố',
      head: { provider: 'Cửa hàng', area: 'Khu vực', hours: 'Giờ mở' },
    },
    unknownMark: 'chưa kiểm chứng',
    sourceNote: 'Phí và giờ mở lấy từ dữ liệu đơn vị cung cấp được cấu hình trên trang. Số tiền trong công cụ so sánh là ước tính; hãy xác nhận tỷ giá cuối với đơn vị cung cấp.',
    links: {
      cash: 'So sánh tiền mặt sang THB',
      crypto: 'So sánh crypto sang THB',
      ratchada: 'Trang Ratchada Exchange',
      superrich: 'Trang SuperRich Thailand',
      twelve: 'Trang Twelve Victory',
      usdCash: 'Lộ trình USD tiền mặt',
      btc: 'Lộ trình BTC sang THB',
      airport: 'Hướng dẫn đổi tiền sân bay',
      methodology: 'Cách trang so sánh',
    },
    faqHeading: 'Người ta thường hỏi gì trước khi đổi baht?',
    faq: [
      {
        question: 'Đổi tiền mặt trong thành phố có rẻ hơn sân bay?',
        answer: 'Nhìn chung chi nhánh trong thành phố rẻ hơn quầy sân bay, nhưng hãy so số THB thực nhận với cùng một số tiền. Giờ mở cửa ở sân bay và chi nhánh cũng khác nhau.',
      },
      {
        question: 'Có thể đổi USDT hoặc BTC sang baht ở Thái Lan?',
        answer: 'Có, qua các sàn được SEC Thái Lan cấp phép nêu trên trang. Cần tài khoản đã xác minh và rút THB về ngân hàng; phần so sánh gồm phí giao dịch và phí rút THB đã biết.',
      },
      {
        question: 'Đổi tiền có cần hộ chiếu?',
        answer: 'Có, hãy mang theo. Cửa hàng được cấp phép ghi nhận danh tính khi đổi tiền, số tiền lớn được kiểm tra kỹ hơn.',
      },
      {
        question: 'Vì sao hiển thị số tiền ước tính thay vì tỷ giá cuối?',
        answer: 'Tỷ giá là quan sát từ nguồn công khai, không phải giá tại quầy được bảo đảm. Mọi số tiền là ước tính và tỷ giá cuối do đơn vị cung cấp quyết định khi đổi.',
      },
      {
        question: 'Dữ liệu cập nhật bao lâu một lần?',
        answer: 'Giá crypto cập nhật khoảng 30 giây một lần khi nguồn công khai hoạt động. Tỷ giá tiền mặt được thu thập mỗi 10 phút và gắn nhãn trực tiếp, kết hợp hoặc dự phòng.',
      },
    ],
  },
};
