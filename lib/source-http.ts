// Keep cancellation active while consuming the body, not only until headers arrive.
export async function sourceJson(url: string, timeoutMs = 8000, init: RequestInit = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error(`source_http_${response.status}`);
    return await response.json();
  } finally { clearTimeout(timer); }
}

export async function sourceText(url: string, timeoutMs = 15_000, init: RequestInit = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error(`source_http_${response.status}`);
    return await response.text();
  } finally { clearTimeout(timer); }
}
