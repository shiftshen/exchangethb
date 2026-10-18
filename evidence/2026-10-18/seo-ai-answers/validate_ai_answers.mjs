#!/usr/bin/env node
// SEO-19 readback: node validate_ai_answers.mjs <base> <label> [snapshot|check]
// snapshot: write canonical/hreflang baseline for the 7 pages; check: compare + validate answers.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const [base, label = 'run', mode = 'check'] = process.argv.slice(2);
const SITE = 'https://www.exchangethb.com';
const dir = new URL('.', import.meta.url).pathname;
const Q = [
  ['Q01', '/en/cash', 'best-place', 'Where can I exchange cash for Thai baht in Bangkok?'],
  ['Q02', '/en/money-changers/ratchada', 'ratchada-rate', 'What is the Ratchada Exchange rate today?'],
  ['Q03', '/en/money-changers/superrich-thailand', 'superrich-vs-ratchada', 'How do SuperRich Thailand and Ratchada Exchange compare today?'],
  ['Q04', '/en/cash', 'currency-USD', 'What is the best THB exchange rate in Bangkok today?'],
  ['Q05', '/en/crypto', 'cash-vs-crypto', null],
  ['Q06', '/th/cash', 'best-place', 'แลกเงินสดเป็นบาทที่ไหนในกรุงเทพฯ?'],
  ['Q07', '/th/cash', 'currency-USD', 'ราคาแลกเงินยูเอสดี วันนี้ กรุงเทพ เท่าไร?'],
  ['Q08', '/th/money-changers/ratchada', 'ratchada-rate', 'ร้านแลกเงินแถวรัชดา ที่ไหนเรทดี?'],
  ['Q09', '/zh/cash', 'best-place', '曼谷哪里可以把现金换成泰铢？'],
  ['Q10', '/zh/cash', 'currency-CNY', '泰国换钱：人民币兑泰铢汇率今天是多少（曼谷）？'],
];
const pages = [...new Set(Q.map((q) => q[1]))];
const errors = []; const err = (m) => errors.push(m);
const decode = (s) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
const textOf = (h) => decode(h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
const lang = (p) => p.split('/')[1];
const units = (t, l) => [...new Intl.Segmenter(l, { granularity: 'word' }).segment(t)].filter((s) => s.isWordLike).length;
const hidden = /(superrich[ -]?1965|sia money|vasu|sia-moneyexchange)/i;
async function get(path, ua = 'Mozilla/5.0 ExchangeTHB-ai-check') {
  const r = await fetch(base + path, { headers: { 'user-agent': ua }, redirect: 'manual' });
  return { status: r.status, body: await r.text() };
}
const out = { base, label, pages: {}, questions: {}, bots: {}, errors };
for (const p of pages) {
  const { status, body } = await get(p);
  const can = body.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? null;
  const alts = [...body.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map((m) => `${m[1]}=${m[2]}`).sort();
  out.pages[p] = { status, canonical: can, hreflang: alts };
  if (status !== 200) err(`${p}: status ${status}`);
  if (can !== SITE + p) err(`${p}: canonical ${can}`);
  if (/noindex/.test(body)) err(`${p}: noindex`);
}
const snapFile = dir + 'canonical-hreflang-baseline.json';
if (mode === 'snapshot') { writeFileSync(snapFile, JSON.stringify(out.pages, null, 1)); console.log('baseline written'); process.exit(0); }
if (existsSync(snapFile)) {
  const b = JSON.parse(readFileSync(snapFile, 'utf8'));
  for (const p of pages) if (JSON.stringify(b[p]?.hreflang) !== JSON.stringify(out.pages[p].hreflang) || b[p]?.canonical !== out.pages[p].canonical) err(`${p}: canonical/hreflang changed vs baseline`);
}
const cache = {};
for (const [id, p, marker, faqQ] of Q) {
  const { body } = (cache[p] ??= await get(p));
  const l = lang(p); const rec = { page: p, marker, faqQuestion: faqQ };
  const m = body.match(new RegExp(`data-ai-answer="${marker}"[^>]*>([\\s\\S]*?)</p>`));
  if (!m) { err(`${id} ${p}: answer block ${marker} missing`); out.questions[id] = rec; continue; }
  const ans = decode(m[1].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
  rec.answer = ans; rec.units = units(ans, l);
  if (rec.units < 40 || rec.units > 70) err(`${id}: ${rec.units} units out of 40-70`);
  if (!/20\d\d/.test(ans) || !/GMT\+7/.test(ans)) err(`${id}: no data time`);
  if (!/\d+\.\d{2}/.test(ans) && id !== 'Q03') err(`${id}: no rate`);
  if (hidden.test(ans)) err(`${id}: hidden provider mentioned`);
  if (/(best rate|cheapest|最佳汇率|最便宜|最划算|ดีที่สุด|ถูกที่สุด)/i.test(ans)) err(`${id}: superlative`);
  // FAQPage
  const blocks = [...body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((x) => { try { const j = JSON.parse(x[1]); return j['@graph'] ?? [j]; } catch (e) { err(`${p}: bad JSON-LD`); return []; } });
  const faqs = blocks.filter((n) => n['@type'] === 'FAQPage');
  const vis = textOf(body);
  if (faqQ) {
    if (faqs.length !== 1) err(`${id}: FAQPage count ${faqs.length}`);
    const ents = faqs[0]?.mainEntity ?? []; rec.faqCount = ents.length;
    const hit = ents.find((e) => e.name === faqQ);
    if (!hit) err(`${id}: FAQ question not in JSON-LD: ${faqQ}`);
    else if (marker !== 'best-place' && hit.acceptedAnswer?.text !== ans) err(`${id}: FAQ answer != visible answer`);
    const names = ents.map((e) => e.name); if (new Set(names).size !== names.length) err(`${p}: duplicate FAQ`);
    for (const e of ents) {
      if (e['@type'] !== 'Question' || !e.name || e.acceptedAnswer?.['@type'] !== 'Answer' || !e.acceptedAnswer?.text) err(`${p}: malformed FAQ entry`);
      else if (!vis.includes(e.name.replace(/\s+/g, ' ')) || !vis.includes(e.acceptedAnswer.text.replace(/\s+/g, ' '))) err(`${p}: FAQ not visible: ${e.name}`);
    }
    rec.faqValid = true;
  }
  if (hidden.test(vis.replace(/SuperRich 1965/g, ''))) rec.hiddenInPage = true;
  out.questions[id] = rec;
}
// llms.txt
const llms = await get('/llms.txt'); out.llms = { status: llms.status };
for (const [id, p] of Q.map((q) => [q[0], q[1]])) if (!llms.body.includes(`${SITE}${p} |`)) err(`llms: ${p} missing`);
const rows = llms.body.split('\n').filter((l) => /^\| .+ \| https:\/\/www\.exchangethb\.com\/.+ \|$/.test(l) && !l.includes('Question'));
out.llms.rows = rows.length; if (rows.length !== 10) err(`llms: ${rows.length} rows`);
if (hidden.test(rows.join('\n'))) err('llms: hidden provider');
// bots
for (const ua of ['Googlebot/2.1 (+http://www.google.com/bot.html)', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)']) {
  const res = [];
  for (const p of [...pages, '/llms.txt']) res.push([p, (await get(p, ua)).status]);
  out.bots[ua.split('/')[0].split(' ').pop()] = res; for (const [p, s] of res) if (s !== 200) err(`bot ${ua.slice(0, 12)} ${p}: ${s}`);
}
out.errorCount = errors.length;
writeFileSync(`${dir}validation-${label}.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify({ label, errorCount: errors.length, errors, units: Object.fromEntries(Object.entries(out.questions).map(([k, v]) => [k, v.units])) }, null, 1));
process.exit(errors.length ? 1 : 0);
