import html as H, json, re, sys, urllib.request
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:41740'
SITE = sys.argv[2] if len(sys.argv) > 2 else 'https://www.exchangethb.com'
DUMP = '/Volumes/M2USB/dev/exchangethb/evidence/2026-10-18/seo-exchanges/copy-dump.md'
UA = sys.argv[3] if len(sys.argv) > 3 else 'Mozilla/5.0 ExchangeTHB-exchange-check'
SLUGS = ['binance-th', 'bitkub', 'upbit-thailand', 'orbix']
LOCS = ['en', 'th', 'zh']
# expected titles come from the proofread copy dump, which the unit tests tie to lib/exchange-seo.ts
exp = {}
cur = None
for line in open(DUMP, encoding='utf-8'):
    m = re.match(r'## (\S+) / (\w+)', line)
    if m: cur = (m.group(1), m.group(2)); continue
    if cur and line.startswith('title: '): exp[cur] = line[7:].strip()
def fetch(path):
    req = urllib.request.Request(BASE + path, headers={'User-Agent': UA})
    r = urllib.request.urlopen(req, timeout=40)
    return r.status, r.read().decode('utf-8')
def textof(h):
    h = re.sub(r'<script.*?</script>', ' ', h, flags=re.S)
    h = re.sub(r'<style.*?</style>', ' ', h, flags=re.S)
    return H.unescape(re.sub(r'<[^>]+>', ' ', h))
res = {'base': BASE, 'ua': UA, 'pages': {}, 'errors': []}
def err(m): res['errors'].append(m)
for slug in SLUGS:
    for loc in LOCS:
        path = f'/{loc}/exchanges/{slug}'
        rec = {}
        try:
            status, h = fetch(path)
        except Exception as e:
            err(f'{path}: fetch failed {e}'); continue
        rec['status'] = status
        if status != 200: err(f'{path}: status {status}')
        t = re.search(r'<title>(.*?)</title>', h, re.S)
        title = H.unescape(t.group(1)) if t else ''
        rec['title'] = title
        if title != exp.get((slug, loc)): err(f'{path}: title {title!r} != {exp.get((slug, loc))!r}')
        if len(title) > 60: err(f'{path}: title length {len(title)}')
        can = re.search(r'<link rel="canonical" href="([^"]+)"', h)
        if not can or can.group(1) != f'{SITE}{path}': err(f'{path}: canonical {can.group(1) if can else None}')
        langs = dict((m.group(1), m.group(2)) for m in re.finditer(r'<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"', h))
        rec['hreflang'] = langs
        for l in LOCS: 
            if langs.get(l) != f'{SITE}/{l}/exchanges/{slug}': err(f'{path}: hreflang {l}={langs.get(l)}')
        if langs.get('x-default') != f'{SITE}/en/exchanges/{slug}': err(f'{path}: x-default={langs.get("x-default")}')
        if 'noindex' in h: err(f'{path}: noindex present')
        blocks = []
        for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
            try: blocks.append(json.loads(m.group(1)))
            except Exception as e: err(f'{path}: bad JSON-LD {e}')
        nodes = []
        for b in blocks: nodes.extend(b['@graph'] if isinstance(b, dict) and '@graph' in b else [b])
        types = [n.get('@type') for n in nodes]
        rec['types'] = types
        for need in ('Organization', 'BreadcrumbList', 'FinancialService', 'FAQPage'):
            if types.count(need) != 1: err(f'{path}: {need} count {types.count(need)}')
        org = next((n for n in nodes if n.get('@type') == 'Organization'), None)
        fs = next((n for n in nodes if n.get('@type') == 'FinancialService'), None)
        faq = next((n for n in nodes if n.get('@type') == 'FAQPage'), None)
        bc = next((n for n in nodes if n.get('@type') == 'BreadcrumbList'), None)
        if org and org.get('@id') != f'{SITE}/#organization': err(f'{path}: org id {org.get("@id")}')
        if fs:
            if fs.get('url') != f'{SITE}{path}' or not fs.get('name') or not fs.get('sameAs'): err(f'{path}: FinancialService fields')
        if faq:
            if faq.get('publisher') != {'@id': f'{SITE}/#organization'}: err(f'{path}: FAQ publisher')
            body = re.sub(r'\s+', ' ', textof(h))
            qs = [q['name'] for q in faq['mainEntity']]
            rec['faq_count'] = len(qs)
            if len(qs) < 5: err(f'{path}: only {len(qs)} FAQ')
            for q in faq['mainEntity']:
                if re.sub(r'\s+', ' ', q['name']) not in body: err(f'{path}: FAQ question not visible: {q["name"]}')
                if re.sub(r'\s+', ' ', q['acceptedAnswer']['text']) not in body: err(f'{path}: FAQ answer not visible: {q["name"]}')
        if bc:
            items = bc['itemListElement']
            if len(items) != 3 or items[-1]['item'] != f'{SITE}{path}': err(f'{path}: breadcrumb')
        res['pages'][path] = rec
res['error_count'] = len(res['errors'])
print(json.dumps(res, ensure_ascii=False, indent=1))
sys.exit(1 if res['errors'] else 0)
