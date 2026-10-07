// Public read-back of the cash licence evidence after the 2026-10-07 write:
// expand the "Evidence and reviews" <details> on a money-changer detail page and capture what a
// real visitor sees. Runs on the real phone's Chrome over CDP (same wiring as phone390-probe.mjs).
const DEVTOOLS = 'http://127.0.0.1:9222';
const OUT = process.env.OUT_DIR || '/tmp';
const fs = await import('node:fs/promises');

const jobs = [
  { url: 'https://www.exchangethb.com/zh/money-changers/ratchada', name: 'licence-readback-zh-ratchada' },
  { url: 'https://www.exchangethb.com/th/money-changers/superrich-thailand', name: 'licence-readback-th-superrich-thailand' },
  { url: 'https://www.exchangethb.com/en/money-changers/twelve-victory', name: 'licence-readback-en-twelve-victory' },
];

const OPEN_AND_READ = `(async () => {
  const d = document.querySelector('details.provider-context');
  if (!d) return JSON.stringify({ ok: false, error: 'no details.provider-context' });
  if (!d.open) d.querySelector('summary').click();
  for (let i = 0; i < 30 && !document.querySelector('.evidence-row'); i++) await new Promise(r => setTimeout(r, 400));
  d.scrollIntoView({ block: 'start' });
  await new Promise(r => setTimeout(r, 600));
  const rows = [...document.querySelectorAll('.evidence-row')].map(r => r.innerText.replace(/\\n+/g, ' | ').slice(0, 300));
  return JSON.stringify({ ok: true, title: document.title, rows, open: d.open });
})()`;

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => resolve(ws);
    ws.onerror = (e) => reject(new Error('ws error ' + (e && e.message ? e.message : 'unknown')));
  });
}
function rpc(ws, id, method, params = {}) {
  return new Promise((resolve, reject) => {
    const onMsg = (ev) => {
      let msg; try { msg = JSON.parse(ev.data); } catch { return; }
      if (msg.id !== id) return;
      ws.removeEventListener('message', onMsg);
      if (msg.error) reject(new Error(method + ': ' + JSON.stringify(msg.error))); else resolve(msg.result);
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const targets = await (await fetch(DEVTOOLS + '/json/list')).json();
const page = targets.find(t => t.type === 'page' && t.url.includes('exchangethb.com')) || targets.find(t => t.type === 'page');
const ws = await connect(page.webSocketDebuggerUrl);
let id = 1;
const results = [];
await rpc(ws, id++, 'Emulation.setDeviceMetricsOverride', { width: 390, height: 900, deviceScaleFactor: 3, mobile: true });

for (const job of jobs) {
  try {
    await rpc(ws, id++, 'Page.enable');
    await rpc(ws, id++, 'Page.navigate', { url: job.url });
    await sleep(7000);
    const res = await rpc(ws, id++, 'Runtime.evaluate', { expression: OPEN_AND_READ, returnByValue: true, awaitPromise: true });
    const parsed = JSON.parse(res.result.value);
    const shot = await rpc(ws, id++, 'Page.captureScreenshot', { format: 'png' });
    const file = `${OUT}/${job.name}.png`;
    await fs.writeFile(file, Buffer.from(shot.data, 'base64'));
    results.push({ ...parsed, url: job.url, screenshot: file });
  } catch (error) {
    results.push({ url: job.url, ok: false, error: String(error.message || error) });
  }
}
await rpc(ws, id++, 'Emulation.clearDeviceMetricsOverride').catch(() => {});
ws.close();
console.log(JSON.stringify(results, null, 1));
