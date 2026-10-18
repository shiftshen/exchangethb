#!/usr/bin/env node

const baseUrl = (process.argv[2] || process.env.BASE_URL || 'https://www.exchangethb.com').replace(/\/+$/, '');
// A local/canary fetch address must still advertise the public canonical URL.
const canonicalBaseUrl = (process.argv[3] || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.exchangethb.com').replace(/\/+$/, '');
const maxTimeMs = Number(process.env.SEO_CLUSTER_TIMEOUT_MS || 15000);

const checks = [
  ...['en', 'th', 'zh', 'ja', 'ru', 'ko', 'fr', 'de', 'id', 'vi'].flatMap(locale => ['', '/cash', '/crypto'].map(path => ({
    path: `/${locale}${path}`,
    canonical: `/${locale}${path}`,
    mustInclude: [`<html lang="${locale}"`, 'id="main-content" class="simple-main"', `hrefLang="ja"`, 'google-adsense-account', 'ca-pub-8386341379958173'],
    mustMatch: [/<section class="exchange-guide">/],
    mustNotInclude: ['noindex, follow'],
  }))),
  ...Object.entries({ru:'Обмен',ko:'바트',fr:'baht',de:'Baht',id:'baht',vi:'baht'}).flatMap(([locale, text]) => [
    {path:`/${locale}/cash`,canonical:`/${locale}/cash`,mustInclude:[text,`hrefLang="${locale}"`],mustMatch:[],mustNotInclude:['Where to exchange your cash?']},
    {path:`/${locale}/legal/disclaimer`,canonical:`/${locale}/legal/disclaimer`,mustInclude:[`<html lang="${locale}"`,'simple-main'],mustMatch:[],mustNotInclude:['noindex, follow']},
    {path:`/${locale}/exchanges/bitkub`,expectedStatus:307,expectedLocation:'/en/exchanges/bitkub',followRedirect:false},
  ]),
  { path: '/ja/legal/disclaimer', canonical: '/ja/legal/disclaimer', mustInclude: ['第三者サービス', '両替、暗号資産取引、入金受付', 'hrefLang="en"'], mustMatch: [], mustNotInclude: ['noindex, follow'] },
  { path: '/ja/cash', canonical: '/ja/cash', mustInclude: ['日本円からタイバーツ', '選択すると自動で比較', '日本語', '/en/money-changers/ratchada', '両替店の店舗ページ'], mustMatch: [/aria-label="通貨"/], mustNotInclude: ['Where to exchange your cash?', '/ja/money-changers/ratchada'] },
  { path: '/ja/exchanges/bitkub', expectedStatus: 307, expectedLocation: '/en/exchanges/bitkub', followRedirect: false },
  { path: '/change-lang/ja', expectedStatus: 308, expectedLocation: '/ja', followRedirect: false },
  { path: '/ads.txt', mustInclude: ['google.com, pub-8386341379958173, DIRECT, f08c47fec0942fa0'], mustMatch: [], mustNotInclude: ['<html'] },
  {
    path: '/',
    // Answer-first homepage: quick answer, question headings, two data-driven
    // tables, the priority landing-page hub and the FAQPage block.
    mustInclude: ['/en/crypto', '/en/cash', 'Thai baht. An easier choice.', 'FAQPage', 'seo-answer', 'seo-table', 'Ratchada Exchange'],
    mustMatch: [/aria-label="Currency"/, /inputMode="decimal"/, /Options update automatically as you choose/, /<h2[^>]*>[^<]*\?<\/h2>/],
    // Route *detail* links are allowed on the homepage; the noindex /en/routes hub must not be linked.
    mustNotInclude: ['/en/routes"', 'Featured Thai exchanges', 'Featured Bangkok money changers'],
    canonical: '/en',
  },
  {
    path: '/llms.txt',
    mustInclude: ['# ExchangeTHB', '/en/cash', '/en/routes/btc-to-thb', 'ai-input', 'Sitemap:'],
    mustMatch: [/ai-train: allowed/],
    mustNotInclude: ['permanently redirect to the primary English', '/en/routes/eth-to-thb', '/routes/us-to-thailand-money-exchange'],
  },
  {
    path: '/en/crypto',
    mustInclude: ['Buy or sell. See the final amount.', 'Buy with THB', 'Sell for THB'],
    mustMatch: [/aria-label="Asset"/, /inputMode="decimal"/, /Options update automatically as you choose/],
    mustNotInclude: ['Related crypto route guides', 'English search questions this page answers'],
    canonical: '/en/crypto',
  },
  {
    path: '/en/cash',
    // The profile strip is the internal link path into the money changer pages in every locale.
    mustInclude: ['Where to exchange your cash?', 'Currency', '/en/money-changers/ratchada', '/en/money-changers/superrich-thailand', '/en/money-changers/twelve-victory', 'Money changer profiles'],
    mustMatch: [/Use my location/, /Open now only/, /Options update automatically as you choose/],
    mustNotInclude: ['Related cash and country route guides', 'English search questions this page answers'],
    canonical: '/en/cash',
  },
  {
    path: '/en/routes',
    mustInclude: ['noindex, follow'],
    mustMatch: [/<link rel="canonical" href="[^"]+\/en\/routes"/],
    canonical: '/en/routes',
  },
  {
    path: '/en/routes/usd-cash-to-thb',
    mustInclude: ['/en/money-changers', '/en/cash?currency=USD'],
    // The "Latest data reference" block only renders when a cash cache exists, which a
    // degraded local checkout does not have. Accept the cash coverage block instead so the
    // assertion proves the cash branch rendered rather than depending on local data state.
    mustMatch: [/Latest data reference|Current live cash coverage/, /@type":"WebPage"/],
    canonical: '/en/routes/usd-cash-to-thb',
  },
  {
    path: '/en/routes/eth-to-thb',
    expectedStatus: 301,
    expectedLocation: '/en/crypto?symbol=ETH&side=sell',
    followRedirect: false,
  },
  {
    path: '/zh/exchanges/bitkub',
    canonical: '/zh/exchanges/bitkub',
    mustInclude: ['/en/exchanges/bitkub'],
    mustMatch: [/<link rel="alternate" hrefLang="en"/, /<link rel="alternate" hrefLang="zh"/],
    mustNotInclude: ['noindex, follow'],
  },
  {
    path: '/zh/money-changers/ratchada',
    canonical: '/zh/money-changers/ratchada',
    mustInclude: ['hrefLang="th"', 'hrefLang="en"', 'รัชดาเอ๊กซเชนจ์', '护照', '每天 09:00–20:30'],
    mustMatch: [/"@type":\["LocalBusiness","FinancialService"\]/, /"@type":"FAQPage"/],
    mustNotInclude: ['noindex, follow'],
  },
  {
    // Ratchada answers "where, when, rate, what to bring" above the fold and carries
    // LocalBusiness/FinancialService + FAQPage + BreadcrumbList markup from verified data.
    path: '/en/money-changers/ratchada',
    canonical: '/en/money-changers/ratchada',
    mustInclude: ['รัชดาเอ๊กซเชนจ์', 'Huai Khwang', '78/13 Prachatbamphen Rd', 'passport', 'Observed buy rate'],
    mustMatch: [/"@type":\["LocalBusiness","FinancialService"\]/, /"@type":"FAQPage"/, /"@type":"BreadcrumbList"/, /"dayOfWeek":\["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"\]/],
    mustNotInclude: ['noindex, follow'],
  },
  {
    // Chain profile: area-level location record must never become a postal street address.
    path: '/zh/money-changers/superrich-thailand',
    canonical: '/zh/money-changers/superrich-thailand',
    mustInclude: ['SuperRich Thailand', '周一至周六 09:00–16:30', '周日休息'],
    mustMatch: [/"@type":\["LocalBusiness","FinancialService"\]/],
    mustNotInclude: ['noindex, follow', '"streetAddress"'],
  },
  {
    path: '/zh/money-changers/twelve-victory',
    canonical: '/zh/money-changers/twelve-victory',
    mustInclude: ['Twelve Victory Exchange', '231 Pradipat Road', '周一至周五 08:30–17:00'],
    mustMatch: [/"@type":\["LocalBusiness","FinancialService"\]/],
    mustNotInclude: ['noindex, follow'],
  },
  {
    path: '/th/money-changers/ratchada',
    canonical: '/th/money-changers/ratchada',
    mustInclude: ['hrefLang="zh"', 'รัชดาเอ๊กซเชนจ์', 'ทุกวัน 09:00–20:30', 'หนังสือเดินทาง'],
    mustMatch: [/"@type":\["LocalBusiness","FinancialService"\]/, /"@type":"FAQPage"/],
    mustNotInclude: ['noindex, follow'],
  },
  {
    path: '/robots.txt',
    mustInclude: ['/sitemap.xml'],
    mustMatch: [/Disallow: \/admin/, /Disallow: \/th\/admin/, /Disallow: \/en\/admin/, /Disallow: \/zh\/admin/],
  },
  {
    path: '/sitemap.xml',
    mustInclude: ['/en/exchanges/bitkub', '/zh/exchanges/bitkub', '/en/money-changers/ratchada', '/zh/money-changers/ratchada', '/en/routes/usd-cash-to-thb'],
    mustMatch: [/<priority>1<\/priority>/, /<priority>0\.95<\/priority>/, /<lastmod>/],
    mustNotInclude: ['/en/exchanges</loc>', '/en/money-changers</loc>', '/en/routes</loc>', '/en/routes/eth-to-thb', '/zh/legal/privacy-policy'],
    mustNotMatch: [/<loc>https?:\/\/[^<]+\/<\/loc>/],
    expectedLocCount: 71,
  },
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function canonicalUrl(path) {
  return `${canonicalBaseUrl}${path}`;
}

async function fetchText(url, followRedirect = true) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), maxTimeMs);
  try {
    const response = await fetch(url, {
      redirect: followRedirect ? 'follow' : 'manual',
      signal: controller.signal,
      headers: {
        'user-agent': 'ExchangeTHB-SEO-Cluster-Check/1.0',
      },
    });
    const text = await response.text();
    return { ok: response.ok, status: response.status, text, location: response.headers.get('location') };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const failures = [];

  console.log(`Checking SEO cluster integrity for ${baseUrl}`);

  for (const check of checks) {
    const url = `${baseUrl}${check.path}`;
    const result = await fetchText(url, check.followRedirect !== false);

    if (check.expectedStatus !== undefined) {
      const location = result.location ? new URL(result.location, baseUrl) : null;
      const actualLocation = location ? `${location.pathname}${location.search}` : null;
      if (result.status !== check.expectedStatus || actualLocation !== check.expectedLocation) {
        failures.push(`${check.path}: expected status=${check.expectedStatus} location=${check.expectedLocation} but got status=${result.status} location=${result.location || '-'}`);
        console.log(`FAIL ${check.path} status=${result.status} location=${result.location || '-'}`);
      } else {
        console.log(`OK   ${check.path}`);
      }
      continue;
    }

    if (!result.ok) {
      failures.push(`${check.path}: expected 2xx but got ${result.status}`);
      console.log(`FAIL ${check.path} status=${result.status}`);
      continue;
    }

    const missingIncludes = check.mustInclude.filter((snippet) => !result.text.includes(snippet));
    const missingMatches = check.mustMatch.filter((pattern) => !pattern.test(result.text)).map((pattern) => pattern.toString());
    const unexpectedIncludes = (check.mustNotInclude || []).filter((snippet) => result.text.includes(snippet));
    const unexpectedMatches = (check.mustNotMatch || []).filter((pattern) => pattern.test(result.text)).map((pattern) => pattern.toString());
    const locCount = (result.text.match(/<loc>/g) || []).length;
    const wrongLocCount = check.expectedLocCount !== undefined && locCount !== check.expectedLocCount;
    const expectedCanonical = check.canonical ? canonicalUrl(check.canonical) : undefined;
    const canonicalPattern = expectedCanonical
      ? new RegExp(`<link[^>]+rel=["']canonical["'][^>]+href=["']${escapeRegex(expectedCanonical)}["']`, 'i')
      : undefined;
    const canonicalMissing = canonicalPattern ? !canonicalPattern.test(result.text) : false;

    if (missingIncludes.length || missingMatches.length || unexpectedIncludes.length || unexpectedMatches.length || wrongLocCount || canonicalMissing) {
      failures.push(`${check.path}: missing includes=${missingIncludes.join(', ') || '-'} missing patterns=${missingMatches.join(', ') || '-'} unexpected includes=${unexpectedIncludes.join(', ') || '-'} unexpected patterns=${unexpectedMatches.join(', ') || '-'} loc count=${locCount}${wrongLocCount ? ` expected=${check.expectedLocCount}` : ''} canonical=${canonicalMissing ? expectedCanonical : '-'}`);
      console.log(`FAIL ${check.path} includes=${missingIncludes.length} patterns=${missingMatches.length} unexpected=${unexpectedIncludes.length + unexpectedMatches.length} locs=${locCount} canonical=${canonicalMissing ? 'missing' : 'ok'}`);
      continue;
    }

    console.log(`OK   ${check.path}`);
  }

  if (failures.length) {
    console.error('\nSEO cluster check failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log('SEO cluster check passed.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
