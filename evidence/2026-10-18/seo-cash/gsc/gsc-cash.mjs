const DIR = '/Volumes/M2USB/dev/exchangethb/evidence/2026-10-18/seo-cash/gsc';
const HOME = 'https://search.google.com/search-console?resource_id=sc-domain%3Aexchangethb.com';
const SEARCH = 'loc=css:input[aria-label="检查 exchangethb.com 中的任何网址"]';
const B = 'https://www.exchangethb.com';
const urls = [['th-cash', '/th/cash'], ['en-cash', '/en/cash'], ['zh-cash', '/zh/cash']];
const task = await taskSpace('exchangethb-seo-cash-gsc-20261018', { profileId: 'Profile 16' });
const page = task.page('p1');
const bodyText = () => page.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' '));
const out = { sitemap: '', requests: [] };
// 2. request indexing
let quota = false;
for (const [name, path] of urls) {
  const rec = { name, url: B + path, result: '', detail: '' };
  if (quota) { rec.result = 'skipped-quota'; out.requests.push(rec); continue; }
  try {
    await page.goto(HOME);
    await page.waitForTimeout(4000);
    await page.fill(SEARCH, B + path);
    await page.press(SEARCH, 'Enter');
    await page.waitForTimeout(7000);
    const before = await bodyText();
    rec.indexedBefore = before.includes('网址已收录到 Google') || before.includes('网页已编入索引');
    const button = await page.waitForSelector('loc=role:button[name*="请求编入索引"]', { state: 'visible', timeout: 25000 }).catch(() => null);
    if (!button) { rec.result = 'no-button'; rec.detail = before.slice(0, 250); }
    else {
      await page.click('loc=role:button[name*="请求编入索引"]', { label: 'request indexing' });
      let state = '';
      for (let i = 0; i < 30; i += 1) {
        await page.waitForTimeout(4000);
        state = await bodyText();
        if (state.includes('已请求编入索引')) { rec.result = 'requested'; break; }
        if (state.includes('配额')) { rec.result = 'quota'; quota = true; break; }
        if (state.includes('出了点问题')) { rec.result = 'gsc-error'; break; }
      }
      rec.detail = state.slice(-200);
      if (rec.result === 'gsc-error') quota = true; // first rejection is quota in practice; stop hammering
    }
    await page.screenshot({ path: DIR + '/' + name + '.png' });
  } catch (e) { rec.result = rec.result || 'exception'; rec.detail = String(e).slice(0, 200); }
  out.requests.push(rec);
  console.log(JSON.stringify(rec));
}
await task.finish({ keep: [] });
console.log(JSON.stringify(out, null, 1));
