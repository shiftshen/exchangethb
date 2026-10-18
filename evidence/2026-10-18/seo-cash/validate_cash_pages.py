import html as H, json, re, sys, urllib.request
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:41750'
SITE = sys.argv[2] if len(sys.argv) > 2 else 'https://www.exchangethb.com'
UA = sys.argv[3] if len(sys.argv) > 3 else 'Mozilla/5.0 ExchangeTHB-cash-check'
DUMP = '/Volumes/M2USB/dev/exchangethb/evidence/2026-10-18/seo-cash/copy-dump.md'
ALL = ['en', 'th', 'zh', 'ja', 'ru', 'ko', 'fr', 'de', 'id', 'vi']
HUB = ['en', 'th', 'zh']
# expected copy comes from the proofread dump, which the unit tests tie to lib/cash-hub-seo.ts
exp = {}; cur = None
for line in open(DUMP, encoding='utf-8'):
    m = re.match(r'## (\w+)$', line.strip())
    if m: cur = m.group(1); exp[cur] = {'faq': []}; continue
    if not cur: continue
    if line.startswith('title: '): exp[cur]['title'] = line[7:].strip()
    elif line.startswith('description: '): exp[cur]['desc'] = line[13:].strip()
    elif re.match(r'\d+\. Q: ', line): exp[cur]['faq'].append([line.split('Q: ', 1)[1].strip(), None])
    elif line.startswith('   A: '): exp[cur]['faq'][-1][1] = line[6:].strip()
    elif line.startswith('H2: '): exp[cur].setdefault('h2', []).append(line[4:].strip())
def fetch(path):
    req = urllib.request.Request(BASE + path, headers={'User-Agent': UA})
    r = urllib.request.urlopen(req, timeout=40)
    return r.status, r.read().decode('utf-8')
def textof(h):
    h = re.sub(r'<script.*?</script>', ' ', h, flags=re.S); h = re.sub(r'<style.*?</style>', ' ', h, flags=re.S)
    return re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', h)))
res = {'base': BASE, 'ua': UA, 'pages': {}, 'errors': []}
def err(m): res['errors'].append(m)
for loc in ALL:
    path = f'/{loc}/cash'; rec = {}
    try: status, h = fetch(path)
    except Exception as e: err(f'{path}: fetch failed {e}'); continue
    rec['status'] = status
    if status != 200: err(f'{path}: status {status}')
    can = re.search(r'<link rel="canonical" href="([^"]+)"', h)
    rec['canonical'] = can.group(1) if can else None
    if rec['canonical'] != f'{SITE}{path}': err(f'{path}: canonical {rec["canonical"]}')
    if 'noindex' in h: err(f'{path}: noindex present')
    blocks = []
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
        try: blocks.append(json.loads(m.group(1)))
        except Exception as e: err(f'{path}: bad JSON-LD {e}')
    nodes = []
    for b in blocks: nodes.extend(b['@graph'] if isinstance(b, dict) and '@graph' in b else [b])
    types = [n.get('@type') for n in nodes]; rec['types'] = types
    for need, n in (('Organization', 1), ('BreadcrumbList', 1), ('FAQPage', 1 if loc in HUB else 0)):
        if types.count(need) != n: err(f'{path}: {need} count {types.count(need)} != {n}')
    org = next((n for n in nodes if n.get('@type') == 'Organization'), None)
    if org and org.get('@id') != f'{SITE}/#organization': err(f'{path}: org id {org.get("@id")}')
    if loc in HUB:
        e = exp[loc]; body = textof(h)
        t = re.search(r'<title>(.*?)</title>', h, re.S); title = H.unescape(t.group(1)) if t else ''
        rec['title'] = title
        if title != e['title']: err(f'{path}: title {title!r} != {e["title"]!r}')
        md = re.search(r'<meta name="description" content="([^"]*)"', h)
        if not md or H.unescape(md.group(1)) != e['desc']: err(f'{path}: meta description mismatch')
        langs = dict((m.group(1), m.group(2)) for m in re.finditer(r'<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"', h))
        for l in HUB:
            if langs.get(l) != f'{SITE}/{l}/cash': err(f'{path}: hreflang {l}={langs.get(l)}')
        if langs.get('x-default') != f'{SITE}/en/cash': err(f'{path}: x-default={langs.get("x-default")}')
        faq = next((n for n in nodes if n.get('@type') == 'FAQPage'), None)
        if faq:
            if faq.get('publisher') != {'@id': f'{SITE}/#organization'}: err(f'{path}: FAQ publisher')
            qs = faq['mainEntity']; rec['faq_count'] = len(qs)
            if len(qs) < 5: err(f'{path}: only {len(qs)} FAQ')
            if [(q['name'], q['acceptedAnswer']['text']) for q in qs] != [tuple(x) for x in e['faq']]: err(f'{path}: FAQ JSON-LD differs from proofread copy')
            for q in qs:
                if re.sub(r'\s+', ' ', q['name']) not in body: err(f'{path}: FAQ question not visible: {q["name"]}')
                if re.sub(r'\s+', ' ', q['acceptedAnswer']['text']) not in body: err(f'{path}: FAQ answer not visible: {q["name"]}')
        for q in e['h2']:
            if not re.search(r'<h2[^>]*>' + re.escape(H.escape(q, quote=False)).replace("'", "(?:'|&#x27;)") + r'</h2>', h) and q not in body: err(f'{path}: H2 missing {q}')
        h2s = re.findall(r'<h2[^>]*>([^<]*)</h2>', h)
        rec['h2'] = [H.unescape(x) for x in h2s]
        rec['currency_links'] = sorted(set(re.findall(rf'href="(/{loc}/cash\?currency=[A-Z]+)"', h)))
        if len(rec['currency_links']) != 4: err(f'{path}: currency links {rec["currency_links"]}')
    res['pages'][path] = rec
res['error_count'] = len(res['errors'])
print(json.dumps(res, ensure_ascii=False, indent=1))
sys.exit(1 if res['errors'] else 0)
