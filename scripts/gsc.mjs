#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output, stderr } from 'node:process';
import { spawn } from 'node:child_process';

const DEFAULT_SCOPE = 'https://www.googleapis.com/auth/webmasters';
const DEFAULT_CLIENT_FILE = process.env.GSC_OAUTH_CLIENT_FILE || '/Users/shift/Downloads/client_secret_2_1037442300148-48g8f6neapthbc977e7bm0qgkicltubo.apps.googleusercontent.com.json';
const DEFAULT_TOKEN_FILE = process.env.GSC_OAUTH_TOKEN_FILE || '.secrets/gsc-token.json';
const DEFAULT_PROPERTY = process.env.GSC_PROPERTY || 'sc-domain:exchangethb.com';

function printUsage() {
  console.log(`Google Search Console helper

Usage:
  node scripts/gsc.mjs authorize [--client FILE] [--token FILE] [--open]
  node scripts/gsc.mjs sites [--client FILE] [--token FILE]
  node scripts/gsc.mjs search-analytics --property PROPERTY [--client FILE] [--token FILE] [--start YYYY-MM-DD] [--end YYYY-MM-DD] [--dimensions page,query,country] [--row-limit 25]
  node scripts/gsc.mjs sitemaps --property PROPERTY [--client FILE] [--token FILE]
  node scripts/gsc.mjs sitemaps --property PROPERTY --submit SITEMAP_URL [--client FILE] [--token FILE]
  node scripts/gsc.mjs inspect-url --property PROPERTY --url PAGE_URL [--language zh-CN] [--client FILE] [--token FILE]

Defaults:
  client file: ${DEFAULT_CLIENT_FILE}
  token file:  ${DEFAULT_TOKEN_FILE}
  property:    ${DEFAULT_PROPERTY}
`);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (!current.startsWith('--')) {
      args._.push(current);
      continue;
    }

    const key = current.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    i += 1;
  }
  return args;
}

function parseInstalledClient(raw) {
  const parsed = JSON.parse(raw);
  const installed = parsed.installed || parsed.web;
  if (!installed) {
    throw new Error('Unsupported OAuth client JSON. Expected an "installed" or "web" client.');
  }
  if (!installed.client_id || !installed.client_secret || !installed.auth_uri || !installed.token_uri) {
    throw new Error('OAuth client JSON is missing required fields.');
  }
  const redirectUri = Array.isArray(installed.redirect_uris) && installed.redirect_uris.length > 0
    ? installed.redirect_uris[0]
    : 'http://localhost';
  return {
    clientId: installed.client_id,
    clientSecret: installed.client_secret,
    authUri: installed.auth_uri,
    tokenUri: installed.token_uri,
    redirectUri,
  };
}

async function loadClient(clientFile) {
  const filePath = resolve(clientFile || DEFAULT_CLIENT_FILE);
  const raw = await readFile(filePath, 'utf8');
  return { filePath, ...parseInstalledClient(raw) };
}

async function loadToken(tokenFile) {
  const filePath = resolve(tokenFile || DEFAULT_TOKEN_FILE);
  const raw = await readFile(filePath, 'utf8');
  return { filePath, token: JSON.parse(raw) };
}

async function saveToken(tokenFile, token) {
  const filePath = resolve(tokenFile || DEFAULT_TOKEN_FILE);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(token, null, 2)}\n`, 'utf8');
  return filePath;
}

function buildAuthUrl(client, scope) {
  const params = new URLSearchParams({
    client_id: client.clientId,
    redirect_uri: client.redirectUri,
    response_type: 'code',
    scope,
    access_type: 'offline',
    prompt: 'consent',
  });
  return `${client.authUri}?${params.toString()}`;
}

function maybeOpenBrowser(url) {
  const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  const child = spawn(opener, [url], {
    detached: true,
    stdio: 'ignore',
    shell: process.platform === 'win32',
  });
  child.unref();
}

function extractCode(value) {
  if (!value) {
    throw new Error('No redirect URL or code was provided.');
  }
  const trimmed = value.trim();
  if (!trimmed.includes('://') && !trimmed.includes('code=')) {
    return trimmed;
  }
  const url = new URL(trimmed);
  const error = url.searchParams.get('error');
  if (error) {
    throw new Error(`Google OAuth returned an error: ${error}`);
  }
  const code = url.searchParams.get('code');
  if (!code) {
    throw new Error('Could not find an authorization code in the pasted URL.');
  }
  return code;
}

async function tokenRequest(tokenUri, body) {
  const response = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Token request failed (${response.status}): ${JSON.stringify(payload)}`);
  }
  return payload;
}

async function ensureAccessToken(client, tokenFile) {
  const { filePath, token } = await loadToken(tokenFile);
  const expiresAt = token.expires_at || 0;
  const hasFreshToken = token.access_token && Date.now() < expiresAt - 60_000;
  if (hasFreshToken) {
    return token.access_token;
  }
  if (!token.refresh_token) {
    throw new Error(`Token file ${filePath} does not have a refresh_token. Run authorize again.`);
  }

  const refreshed = await tokenRequest(client.tokenUri, {
    client_id: client.clientId,
    client_secret: client.clientSecret,
    refresh_token: token.refresh_token,
    grant_type: 'refresh_token',
  });

  const nextToken = {
    ...token,
    ...refreshed,
    refresh_token: refreshed.refresh_token || token.refresh_token,
    expires_at: Date.now() + ((refreshed.expires_in || 3600) * 1000),
    updated_at: new Date().toISOString(),
  };
  await saveToken(filePath, nextToken);
  return nextToken.access_token;
}

async function googleApi(client, tokenFile, url, init = {}) {
  const accessToken = await ensureAccessToken(client, tokenFile);
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(`Google API request failed (${response.status}): ${JSON.stringify(payload)}`);
  }
  return payload;
}

function requireValue(args, key, fallback) {
  const value = args[key] || fallback;
  if (!value) {
    throw new Error(`Missing required option --${key}`);
  }
  return value;
}

function endDateToday() {
  return new Date().toISOString().slice(0, 10);
}

function startDateDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

async function runAuthorize(args) {
  const client = await loadClient(args.client);
  const tokenFile = args.token || DEFAULT_TOKEN_FILE;
  const scope = args.scope || DEFAULT_SCOPE;
  const authUrl = buildAuthUrl(client, scope);

  console.log('Open this URL and approve access to Search Console:');
  console.log(authUrl);

  if (args.open) {
    maybeOpenBrowser(authUrl);
    console.log('\nBrowser opened for you.');
  }

  console.log('\nAfter Google redirects, copy the full URL from the browser address bar and paste it below.');
  const rl = createInterface({ input, output });
  const pasted = await rl.question('Redirect URL or code: ');
  rl.close();

  const code = extractCode(pasted);
  const payload = await tokenRequest(client.tokenUri, {
    client_id: client.clientId,
    client_secret: client.clientSecret,
    code,
    redirect_uri: client.redirectUri,
    grant_type: 'authorization_code',
  });

  const token = {
    ...payload,
    scope,
    expires_at: Date.now() + ((payload.expires_in || 3600) * 1000),
    created_at: new Date().toISOString(),
  };
  const savedTo = await saveToken(tokenFile, token);
  console.log(`\nOAuth token saved to ${savedTo}`);
}

async function runSites(args) {
  const client = await loadClient(args.client);
  const payload = await googleApi(client, args.token, 'https://www.googleapis.com/webmasters/v3/sites');
  console.log(JSON.stringify(payload, null, 2));
}

async function runSearchAnalytics(args) {
  const client = await loadClient(args.client);
  const property = requireValue(args, 'property', DEFAULT_PROPERTY);
  const startDate = args.start || startDateDaysAgo(28);
  const endDate = args.end || endDateToday();
  const dimensions = typeof args.dimensions === 'string' && args.dimensions.length > 0
    ? args.dimensions.split(',').map((value) => value.trim()).filter(Boolean)
    : ['query', 'page'];
  const rowLimit = Number(args['row-limit'] || 25);
  const aggregationType = args.aggregation || 'auto';
  const dataState = args['data-state'] || 'final';

  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`;
  const payload = await googleApi(client, args.token, url, {
    method: 'POST',
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions,
      rowLimit,
      aggregationType,
      dataState,
    }),
  });
  console.log(JSON.stringify(payload, null, 2));
}

async function runSitemaps(args) {
  const client = await loadClient(args.client);
  const property = requireValue(args, 'property', DEFAULT_PROPERTY);
  const encodedProperty = encodeURIComponent(property);

  if (typeof args.submit === 'string' && args.submit.length > 0) {
    const submitUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodedProperty}/sitemaps/${encodeURIComponent(args.submit)}`;
    await googleApi(client, args.token, submitUrl, { method: 'PUT', headers: { 'Content-Length': '0' } });
    console.log(JSON.stringify({ ok: true, submitted: args.submit }, null, 2));
    return;
  }

  const listUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodedProperty}/sitemaps`;
  const payload = await googleApi(client, args.token, listUrl);
  console.log(JSON.stringify(payload, null, 2));
}

async function runInspectUrl(args) {
  const client = await loadClient(args.client);
  const property = requireValue(args, 'property', DEFAULT_PROPERTY);
  const inspectionUrl = requireValue(args, 'url');
  const languageCode = args.language || 'en-US';
  const payload = await googleApi(client, args.token, 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    body: JSON.stringify({
      inspectionUrl,
      siteUrl: property,
      languageCode,
    }),
  });
  console.log(JSON.stringify(payload, null, 2));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];

  if (!command || command === 'help' || command === '--help') {
    printUsage();
    return;
  }

  if (command === 'authorize') {
    await runAuthorize(args);
    return;
  }
  if (command === 'sites') {
    await runSites(args);
    return;
  }
  if (command === 'search-analytics') {
    await runSearchAnalytics(args);
    return;
  }
  if (command === 'sitemaps') {
    await runSitemaps(args);
    return;
  }
  if (command === 'inspect-url') {
    await runInspectUrl(args);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
