#!/usr/bin/env node

const baseUrl = (process.argv[2] || process.env.BASE_URL || 'https://www.exchangethb.com').replace(/\/+$/, '');
const maxTimeMs = Number(process.env.SEO_CLUSTER_TIMEOUT_MS || 15000);

const checks = [
  {
    path: '/',
    mustInclude: ['/en/crypto', '/en/cash', 'See what you actually get in THB'],
    mustMatch: [/Estimated net receive/, /Compare now/],
    mustNotInclude: ['/en/routes', 'Featured Thai exchanges', 'Featured Bangkok money changers'],
    canonical: '/en',
  },
  {
    path: '/en/crypto',
    mustInclude: ['/en/exchanges/', 'Compare the outcome, not the headline price.'],
    mustMatch: [/Market depth filled/, /Show fee and depth calculation/, /Open official exchange/],
    mustNotInclude: ['Related crypto route guides', 'English search questions this page answers'],
    canonical: '/en/crypto',
  },
  {
    path: '/en/cash',
    mustInclude: ['/en/money-changers/', 'Compare the rate and the trip.'],
    mustMatch: [/Use my location/, /Open now only/, /Verify official rate/],
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
    mustMatch: [/Latest data reference/, /@type":"WebPage"/],
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
    mustInclude: ['noindex, follow', '/en/exchanges/bitkub'],
    mustMatch: [/<link rel="alternate" hrefLang="en"/],
  },
  {
    path: '/robots.txt',
    mustInclude: ['/sitemap.xml'],
    mustMatch: [/Disallow: \/admin/, /Disallow: \/th\/admin/, /Disallow: \/en\/admin/, /Disallow: \/zh\/admin/],
  },
  {
    path: '/sitemap.xml',
    mustInclude: ['/en/exchanges/bitkub', '/en/money-changers/ratchada', '/en/routes/usd-cash-to-thb'],
    mustMatch: [/<priority>1<\/priority>/, /<priority>0\.95<\/priority>/, /<lastmod>/],
    mustNotInclude: ['/en/exchanges</loc>', '/en/money-changers</loc>', '/en/routes</loc>', '/en/routes/eth-to-thb', '/zh/legal/privacy-policy'],
    mustNotMatch: [/<loc>https?:\/\/[^<]+\/<\/loc>/],
    expectedLocCount: 29,
  },
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function canonicalUrl(path) {
  return `${baseUrl}${path}`;
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
      if (result.status !== check.expectedStatus || result.location !== check.expectedLocation) {
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
