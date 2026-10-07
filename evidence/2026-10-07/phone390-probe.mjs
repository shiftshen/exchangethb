// Real-device 390px-class regression via Chrome DevTools Protocol (no display mutation).
const DEVTOOLS = 'http://127.0.0.1:9222';
const RESULTS = [];
const SCREENSHOT_DIR = process.env.SHOT_DIR || '/tmp';

const PROBE = `(() => {
  const de = document.documentElement;
  const vw = de.clientWidth;
  const wide = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right > vw + 1 || r.left < -1) {
      wide.push({ tag: el.tagName, cls: String(el.className || '').slice(0, 70), right: Math.round(r.right), width: Math.round(r.width) });
      if (wide.length >= 8) break;
    }
  }
  const overflow = [...document.querySelectorAll('body *')].filter(el => el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0).length;
  return JSON.stringify({
    url: location.href,
    title: document.title,
    innerWidth: window.innerWidth,
    clientWidth: vw,
    scrollWidth: de.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    dpr: window.devicePixelRatio,
    horizontalOverflow: de.scrollWidth > vw + 1,
    offenders: wide,
    internalScrollables: overflow,
    tables: document.querySelectorAll('table').length,
    lang: de.lang,
  });
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
      let msg;
      try { msg = JSON.parse(ev.data); } catch { return; }
      if (msg.id !== id) return;
      ws.removeEventListener('message', onMsg);
      if (msg.error) reject(new Error(method + ': ' + JSON.stringify(msg.error)));
      else resolve(msg.result);
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const targets = await (await fetch(DEVTOOLS + '/json/list')).json();
const page = targets.find(t => t.type === 'page' && t.url.includes('exchangethb.com')) || targets.find(t => t.type === 'page');
if (!page) { console.log(JSON.stringify({ error: 'no page target' })); process.exit(1); }

const ws = await connect(page.webSocketDebuggerUrl);
let id = 1;

await rpc(ws, id++, 'Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
const urls = process.argv.slice(2);
for (const url of urls) {
  try {
    await rpc(ws, id++, 'Page.enable');
    await rpc(ws, id++, 'Page.navigate', { url });
    await sleep(6500);
    const res = await rpc(ws, id++, 'Runtime.evaluate', { expression: PROBE, returnByValue: true, awaitPromise: false });
    let parsed = null;
    try { parsed = JSON.parse(res.result.value); } catch { parsed = { raw: res.result.value, error: 'probe parse failed' }; }
    RESULTS.push(parsed);
    try {
      const shot = await rpc(ws, id++, 'Page.captureScreenshot', { format: 'png' });
      const name = url.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 90) + '.png';
      await (await import('node:fs/promises')).writeFile(`${SCREENSHOT_DIR}/${name}`, Buffer.from(shot.data, 'base64'));
      parsed.screenshot = `${SCREENSHOT_DIR}/${name}`;
    } catch (e) { parsed.screenshotError = String(e.message || e); }
  } catch (e) {
    RESULTS.push({ url, error: String(e.message || e) });
  }
}
await rpc(ws, id++, 'Emulation.clearDeviceMetricsOverride').catch(()=>{});
ws.close();
console.log(JSON.stringify({ device: 'HONOR BVL-N49 (A5CS024313004533)', ua: (await (await fetch(DEVTOOLS + '/json/version')).json()).Browser, results: RESULTS }, null, 2));
