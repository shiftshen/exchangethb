#!/usr/bin/env node

const baseUrl = (process.argv[2] || process.env.BASE_URL || 'https://www.exchangethb.com').replace(/\/+$/, '');
const maxTimeMs = Number(process.env.SEO_CLUSTER_TIMEOUT_MS || 15000);

const checks = [
  {
    path: '/',
    mustInclude: ['/en/crypto', '/en/cash', '/en/routes', '/en/exchanges', '/en/money-changers'],
    mustMatch: [/@type":"CollectionPage"/, /Featured Thai exchanges/, /Featured Bangkok money changers/],
  },
  {
    path: '/en/crypto',
    mustInclude: ['/en/exchanges', '/en/exchanges/binance-th', '/en/routes'],
    mustMatch: [/Related exchange profiles/, /Browse exchange hub/, /@type":"ItemList".*Related Thai exchange profiles/],
  },
  {
    path: '/en/cash',
    mustInclude: ['/en/money-changers', '/en/money-changers/sia', '/en/routes'],
    mustMatch: [/Browse money changer hub/, /@type":"ItemList".*Related Bangkok money changer profiles/],
  },
  {
    path: '/en/routes',
    mustInclude: ['/en/routes/btc-to-thb', '/en/routes/usd-cash-to-thb'],
    mustMatch: [/All THB route guides in one crawlable index/, /@type":"ItemList"/],
  },
  {
    path: '/en/routes/usd-cash-to-thb',
    mustInclude: ['/en/money-changers', '/en/cash?currency=USD'],
    mustMatch: [/Latest data reference/, /@type":"WebPage"/],
  },
  {
    path: '/en/exchanges',
    mustInclude: ['/en/exchanges/binance-th', '/en/exchanges/bitkub'],
    mustMatch: [/All Thai exchanges tracked for THB comparison/, /@type":"CollectionPage"/, /@type":"ItemList"/],
  },
  {
    path: '/en/money-changers',
    mustInclude: ['/en/money-changers/sia', '/en/money-changers/superrich-thailand'],
    mustMatch: [/Bangkok money changers tracked for THB decisions/, /@type":"CollectionPage"/, /@type":"ItemList"/],
  },
  {
    path: '/robots.txt',
    mustInclude: ['/sitemap.xml'],
    mustMatch: [/Disallow: \/admin/, /Disallow: \/th\/admin/, /Disallow: \/en\/admin/, /Disallow: \/zh\/admin/],
  },
  {
    path: '/sitemap.xml',
    mustInclude: ['/en/exchanges', '/en/money-changers', '/en/routes/usd-cash-to-thb'],
    mustMatch: [/<priority>0\.84<\/priority>/, /<priority>0\.86<\/priority>/, /<lastmod>/],
  },
];

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), maxTimeMs);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'ExchangeTHB-SEO-Cluster-Check/1.0',
      },
    });
    const text = await response.text();
    return { ok: response.ok, status: response.status, text };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const failures = [];

  console.log(`Checking SEO cluster integrity for ${baseUrl}`);

  for (const check of checks) {
    const url = `${baseUrl}${check.path}`;
    const result = await fetchText(url);

    if (!result.ok) {
      failures.push(`${check.path}: expected 2xx but got ${result.status}`);
      console.log(`FAIL ${check.path} status=${result.status}`);
      continue;
    }

    const missingIncludes = check.mustInclude.filter((snippet) => !result.text.includes(snippet));
    const missingMatches = check.mustMatch.filter((pattern) => !pattern.test(result.text)).map((pattern) => pattern.toString());

    if (missingIncludes.length || missingMatches.length) {
      failures.push(`${check.path}: missing includes=${missingIncludes.join(', ') || '-'} missing patterns=${missingMatches.join(', ') || '-'}`);
      console.log(`FAIL ${check.path} includes=${missingIncludes.length} patterns=${missingMatches.length}`);
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
