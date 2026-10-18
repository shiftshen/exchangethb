import json, re, sys, urllib.request
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:41730'
SITE = sys.argv[2] if len(sys.argv) > 2 else 'https://www.exchangethb.com'
UA = {'User-Agent': 'Mozilla/5.0 ExchangeTHB-schema-check'}
LOCALES = ['th','en','zh','ja','ru','ko','fr','de','id','vi']
def fetch(p):
    return urllib.request.urlopen(urllib.request.Request(BASE+p, headers=UA), timeout=30).read().decode('utf-8')
def blocks(html):
    out = []
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
        out.append(json.loads(m.group(1)))
    return out
def nodes(blks):
    r = []
    for b in blks:
        r.extend(b['@graph'] if isinstance(b, dict) and '@graph' in b else [b])
    return r
res = {'base': BASE, 'errors': [], 'home': {}, 'about': {}}
def err(m): res['errors'].append(m)
for loc in LOCALES:
    html = fetch(f'/{loc}')
    blks = blocks(html)
    ns = nodes(blks)
    t = {n.get('@type'): n for n in ns}
    title = re.search(r'<title>(.*?)</title>', html).group(1)
    desc = re.search(r'<meta name="description" content="(.*?)"', html).group(1)
    rec = {'title': title, 'description': desc, 'blocks': len(blks), 'types': [n.get('@type') for n in ns]}
    if not title.startswith('ExchangeTHB – '): err(f'{loc}: title not brand-first')
    if 'ExchangeTHB' not in desc or 'exchangethb.com' not in desc: err(f'{loc}: description lacks brand/domain')
    if len(title) > 60: err(f'{loc}: title {len(title)} > 60')
    ws, org = t.get('WebSite'), t.get('Organization')
    if not ws or not org: err(f'{loc}: missing WebSite/Organization')
    else:
        if ws['@id'] != SITE + '/#website': err(f'{loc}: website @id {ws["@id"]}')
        if org['@id'] != SITE + '/#organization': err(f'{loc}: org @id {org["@id"]}')
        if ws['publisher'] != {'@id': org['@id']}: err(f'{loc}: publisher ref')
        for k in ('name','alternateName','url','logo','description'):
            if not org.get(k): err(f'{loc}: org missing {k}')
        if org.get('sameAs') != []: err(f'{loc}: sameAs not empty')
        if ws.get('inLanguage') != loc: err(f'{loc}: inLanguage')
    if sum(1 for n in ns if n.get('@type') == 'Organization') != 1: err(f'{loc}: Organization count != 1')
    bc, faq = t.get('BreadcrumbList'), t.get('FAQPage')
    if not bc or not faq: err(f'{loc}: missing breadcrumb/faq')
    else:
        qs = faq['mainEntity']
        visible = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', html))
        for q in qs:
            if re.sub(r'\s+', ' ', q['name']) not in visible: err(f'{loc}: FAQ question not visible')
        rec['faq_questions'] = len(qs)
    h1 = re.search(r'<p class="seo-answer">(.*?)</p>', html).group(1)
    if not h1.startswith('ExchangeTHB'): err(f'{loc}: seo-answer lacks brand lead')
    rec['seo_answer_lead'] = h1[:120]
    res['home'][loc] = rec
for loc in ['en','th','zh']:
    html = fetch(f'/{loc}/about')
    ns = nodes(blocks(html)); t = {n.get('@type'): n for n in ns}
    a = t.get('AboutPage')
    can = re.search(r'rel="canonical" href="([^"]+)"', html).group(1)
    hl = sorted(set(re.findall(r'hrefLang="([a-zA-Z-]+)"', html)))
    rec = {'canonical': can, 'hreflang': hl, 'types': [n.get('@type') for n in ns], 'noindex': 'noindex' in html}
    if can != f'{SITE}/{loc}/about': err(f'about {loc}: canonical {can}')
    if not a or a['about'] != {'@id': SITE + '/#organization'}: err(f'about {loc}: about ref')
    if sorted(set(hl)) != ['en','th','x-default','zh']: err(f'about {loc}: hreflang {hl}')
    if rec['noindex']: err(f'about {loc}: noindex')
    if t.get('Organization') is None: err(f'about {loc}: layout Organization missing')
    elif t['Organization']['@id'] != SITE + '/#organization': err(f'about {loc}: org id')
    res['about'][loc] = rec
sm = re.findall(r'<loc>([^<]+)</loc>', fetch('/sitemap.xml'))
res['sitemap'] = {'count': len(sm), 'about': [u for u in sm if u.endswith('/about')]}
if len(res['sitemap']['about']) != 3: err('sitemap about count')
# non-home page keeps the shared Organization @id (spot check)
cash = nodes(blocks(fetch('/en/cash')))
res['cash_org_id'] = [n.get('@id') for n in cash if n.get('@type') == 'Organization']
if res['cash_org_id'] != [SITE + '/#organization']: err('cash org id')
res['error_count'] = len(res['errors'])
print(json.dumps(res, ensure_ascii=False, indent=1))
sys.exit(1 if res['errors'] else 0)
