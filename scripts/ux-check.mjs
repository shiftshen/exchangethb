import { chromium } from 'playwright';

const results = [];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(5000);

async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
  } catch (error) {
    results.push({ name, ok: false, error: String(error) });
  }
}

await check('home loads', async () => {
  await page.goto('http://127.0.0.1:3000/zh', { waitUntil: 'networkidle' });
  await page.locator('h1').waitFor();
});

await check('home quick routes and profile links are visible', async () => {
  await page.goto('http://127.0.0.1:3000/zh', { waitUntil: 'networkidle' });
  await page.locator('a[href="/zh/crypto?symbol=BTC&amount=0.01&side=buy"]').first().waitFor();
  await page.locator('a[href="/zh/exchanges/bitkub"]').waitFor();
});

await check('crypto accepts decimal and refreshes', async () => {
  await page.goto('http://127.0.0.1:3000/zh/crypto', { waitUntil: 'networkidle' });
  const amount = page.locator('input[name="amount"]');
  await amount.fill('0.01');
  await page.waitForTimeout(700);
  await page.getByText('当前最优选项').waitFor();
  await page.locator('input[name="amount"][value="0.01"]').waitFor();
});

await check('crypto rejects scientific notation with clear error', async () => {
  await page.goto('http://127.0.0.1:3000/zh/crypto?symbol=BTC&side=buy&amount=1e-8', { waitUntil: 'networkidle' });
  await page.getByText('请输入大于等于 0.00000001 的普通小数金额。').first().waitFor();
});

await check('cash accepts decimal and shows normal formatted THB', async () => {
  await page.goto('http://127.0.0.1:3000/zh/cash', { waitUntil: 'networkidle' });
  const amount = page.locator('input[name="amount"]');
  await amount.fill('1000.50');
  await page.waitForTimeout(700);
  await page.locator('input[name="amount"][value="1000.50"]').waitFor();
  await page.getByText(/THB/).first().waitFor();
});

await check('cash keeps distance as integer-only control', async () => {
  await page.goto('http://127.0.0.1:3000/zh/cash', { waitUntil: 'networkidle' });
  const distance = page.locator('input[name="maxDistanceKm"]');
  const type = await distance.getAttribute('type');
  if (type !== 'number') throw new Error(`Unexpected distance input type: ${type}`);
  await distance.fill('12');
  await page.waitForTimeout(700);
  const value = await distance.inputValue();
  if (value !== '12') throw new Error(`Unexpected distance value: ${value}`);
});

await check('cash can use real user location for distance sorting', async () => {
  const context = await browser.newContext({
    geolocation: { latitude: 13.751234, longitude: 100.546349 },
    permissions: ['geolocation'],
  });
  const locationPage = await context.newPage();
  locationPage.setDefaultTimeout(8000);
  await locationPage.goto('http://127.0.0.1:3000/zh/cash?currency=USD&amount=1000.50&maxDistanceKm=10', { waitUntil: 'networkidle' });
  await locationPage.getByRole('button', { name: '使用我的位置' }).click();
  await locationPage.waitForTimeout(1200);
  if (!locationPage.url().includes('userLat=13.751234')) {
    throw new Error(`Location params missing from URL: ${locationPage.url()}`);
  }
  await locationPage.getByText('当前按你的位置计算').waitFor();
  await locationPage.locator('p, span').filter({ hasText: '当前使用你的位置' }).first().waitFor();
  await context.close();
});

await check('localized admin route redirects to admin login', async () => {
  await page.goto('http://127.0.0.1:3000/zh/admin/login', { waitUntil: 'domcontentloaded' });
  if (!page.url().includes('/admin/login')) {
    throw new Error(`Unexpected URL: ${page.url()}`);
  }
});

await check('exchange detail page shows user-facing decision copy', async () => {
  await page.goto('http://127.0.0.1:3000/zh/exchanges/bitkub', { waitUntil: 'networkidle' });
  await page.getByText('跳转前更值得先看的信息').waitFor();
  await page.getByText('前往交易所').waitFor();
});

await check('money changer detail page distinguishes reference links', async () => {
  await page.goto('http://127.0.0.1:3000/zh/money-changers/superrich-thailand', { waitUntil: 'networkidle' });
  await page.getByText('抓取状态').waitFor();
  const actionText = await page.locator('a').filter({ hasText: /打开地图|打开参考页|打开位置 \/ 参考页/ }).first().textContent();
  if (!actionText) throw new Error('No location/reference action found');
});

console.log(JSON.stringify(results, null, 2));
await browser.close();
