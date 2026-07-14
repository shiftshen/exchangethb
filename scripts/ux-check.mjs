import { chromium } from 'playwright';

const results = [];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(15000);
page.setDefaultNavigationTimeout(30000);

async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
  } catch (error) {
    results.push({ name, ok: false, error: String(error) });
  }
}

await check('home loads', async () => {
  await page.goto('http://127.0.0.1:3000/zh', { waitUntil: 'domcontentloaded' });
  await page.locator('h1').waitFor();
});

await check('home decision tool switches modes and refreshes results', async () => {
  await page.goto('http://127.0.0.1:3000/zh', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: '现金换 THB' }).waitFor();
  await page.getByRole('button', { name: '加密资产换 THB' }).click();
  await page.locator('input[type="number"]').fill('500');
  await page.getByRole('button', { name: '立即比较' }).click();
  await page.getByText('预计净到手').waitFor();
  await page.getByRole('link', { name: '打开完整加密比较' }).waitFor();
});

await check('crypto accepts decimal and refreshes', async () => {
  await page.goto('http://127.0.0.1:3000/zh/crypto', { waitUntil: 'domcontentloaded' });
  const amount = page.getByLabel('资产数量');
  await amount.fill('0.01');
  await page.getByRole('button', { name: '更新比较' }).click();
  await page.getByText('预计净到手 THB').first().waitFor();
  if (await amount.inputValue() !== '0.01') throw new Error('Crypto amount did not persist');
});

await check('crypto shows fee and market-depth evidence', async () => {
  await page.goto('http://127.0.0.1:3000/zh/crypto?symbol=BTC&side=buy&amount=0.01', { waitUntil: 'domcontentloaded' });
  await page.getByText('订单簿成交率').first().waitFor();
  await page.waitForTimeout(2500);
  await page.getByText('展开费用与深度计算').first().click();
  await page.getByText('流动性缺口').first().waitFor();
  await page.getByRole('link', { name: '打开官方交易所' }).first().waitFor();
});

await check('cash accepts decimal and shows normal formatted THB', async () => {
  await page.goto('http://127.0.0.1:3000/zh/cash', { waitUntil: 'domcontentloaded' });
  const amount = page.getByLabel('金额');
  await amount.fill('1000.50');
  await page.getByRole('button', { name: '更新比较' }).click();
  await page.getByText('预计到手').first().waitFor();
  if (await amount.inputValue() !== '1000.50') throw new Error('Cash amount did not persist');
});

await check('cash keeps distance as integer-only control', async () => {
  await page.goto('http://127.0.0.1:3000/zh/cash', { waitUntil: 'domcontentloaded' });
  const distance = page.getByLabel('最大距离');
  const type = await distance.getAttribute('type');
  if (type !== 'number') throw new Error(`Unexpected distance input type: ${type}`);
  await distance.fill('12');
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
  await locationPage.goto('http://127.0.0.1:3000/zh/cash?currency=USD&amount=1000.50&maxDistanceKm=10', { waitUntil: 'domcontentloaded' });
  await locationPage.getByRole('button', { name: '使用我的位置' }).click();
  await locationPage.getByText('正在使用你的真实位置').waitFor();
  await locationPage.getByText(/km/).first().waitFor();
  await context.close();
});

await check('localized admin route redirects to admin login', async () => {
  await page.goto('http://127.0.0.1:3000/zh/admin/login', { waitUntil: 'domcontentloaded' });
  if (!page.url().includes('/admin/login')) {
    throw new Error(`Unexpected URL: ${page.url()}`);
  }
});

await check('exchange detail page shows user-facing decision copy', async () => {
  await page.goto('http://127.0.0.1:3000/zh/exchanges/bitkub', { waitUntil: 'domcontentloaded' });
  await page.getByText('当前 USDT → THB 示例').waitFor();
  await page.getByRole('link', { name: '打开官方交易所' }).waitFor();
  await page.getByText('订单簿成交率').waitFor();
});

await check('money changer detail page distinguishes reference links', async () => {
  await page.goto('http://127.0.0.1:3000/zh/money-changers/superrich-thailand', { waitUntil: 'domcontentloaded' });
  await page.getByText('当前实际状态').waitFor();
  await page.getByRole('link', { name: '打开地图' }).waitFor();
  await page.getByRole('link', { name: '前往官网确认' }).waitFor();
});

console.log(JSON.stringify(results, null, 2));
await browser.close();
