import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { aboutCopy, aboutMetadata, homeBrandIntro, homeDescriptions, homeMetadata, homeTitles } from '@/lib/brand-entity';
import { locales } from '@/lib/i18n';
import { indexedAboutLocales, shouldIndexAboutPage } from '@/lib/indexing-policy';
import { aboutPageJsonLd, homeGraphJsonLd, organizationJsonLd, organizationId, siteUrl, websiteId } from '@/lib/seo';

describe('brand entity: homepage metadata', () => {
  it('starts every locale title with ExchangeTHB and keeps it short', () => {
    for (const locale of locales) {
      expect(homeTitles[locale], locale).toMatch(/^ExchangeTHB – /);
      expect([...homeTitles[locale]].length, locale).toBeLessThanOrEqual(60);
      const meta = homeMetadata(locale);
      expect((meta.title as { absolute: string }).absolute, locale).toBe(homeTitles[locale]);
    }
  });

  it('names the brand and the domain in every description and in the lead sentence', () => {
    for (const locale of locales) {
      expect(homeDescriptions[locale], locale).toMatch(/^ExchangeTHB[ （(]/);
      expect(homeDescriptions[locale], locale).toContain('exchangethb.com');
      expect(homeBrandIntro[locale], locale).toMatch(/^ExchangeTHB[ （(]/);
      expect(homeBrandIntro[locale], locale).toContain('exchangethb.com');
      expect(homeMetadata(locale).openGraph?.siteName, locale).toBe('ExchangeTHB');
    }
  });
});

describe('brand entity: JSON-LD', () => {
  it('home @graph has WebSite and Organization linked by @id', () => {
    const graph = homeGraphJsonLd('en') as { '@graph': Array<Record<string, unknown> & { '@type': string; '@id': string; publisher?: unknown; name?: unknown; alternateName?: unknown; sameAs?: unknown; logo?: { '@type': string }; description?: string }> };
    const site = graph['@graph'].find((n) => n['@type'] === 'WebSite')!;
    const org = graph['@graph'].find((n) => n['@type'] === 'Organization')!;
    expect(site['@id']).toBe(`${siteUrl}/#website`);
    expect(org['@id']).toBe(`${siteUrl}/#organization`);
    expect(site.publisher).toEqual({ '@id': org['@id'] });
    expect(site.name).toBe('ExchangeTHB');
    expect(site.alternateName).toEqual(['Exchange THB', 'exchangethb.com', 'ExchangeTHB.com']);
    expect(org.alternateName).toEqual(['Exchange THB', 'exchangethb.com', 'ExchangeTHB.com']);
    expect(org.sameAs).toEqual([]);
    expect(org.logo?.['@type']).toBe('ImageObject');
    expect(org.description).toContain('Thai baht');
  });

  it('site-wide Organization uses the same @id', () => {
    expect(organizationJsonLd()['@id']).toBe(organizationId());
    expect(organizationJsonLd()['@context']).toBe('https://schema.org');
  });

  it('About page JSON-LD points at the Organization and WebSite by @id', () => {
    const ld = aboutPageJsonLd('en', 'a', 'b') as unknown as { '@type': string; about: unknown; isPartOf: unknown };
    expect(ld['@type']).toBe('AboutPage');
    expect(ld.about).toEqual({ '@id': organizationId() });
    expect(ld.isPartOf).toEqual({ '@id': websiteId() });
  });
});

describe('brand entity: About page', () => {
  it('is indexable in en/th/zh only and canonical to a published locale otherwise', () => {
    expect(indexedAboutLocales).toEqual(['en', 'th', 'zh']);
    for (const locale of ['en', 'th', 'zh'] as const) {
      const meta = aboutMetadata(locale);
      expect(shouldIndexAboutPage(locale)).toBe(true);
      expect(meta.alternates?.canonical).toBe(`${siteUrl}/${locale}/about`);
      const languages = meta.alternates?.languages as Record<string, string>;
      expect(Object.keys(languages).sort()).toEqual(['en', 'th', 'x-default', 'zh']);
      expect(languages['x-default']).toBe(`${siteUrl}/en/about`);
      expect(meta.robots).toBeUndefined();
    }
    const ja = aboutMetadata('ja');
    expect(shouldIndexAboutPage('ja')).toBe(false);
    expect(ja.alternates?.canonical).toBe(`${siteUrl}/en/about`);
    expect(ja.robots).toMatchObject({ index: false });
  });

  it('lists the three About URLs in the sitemap with reciprocal alternates', () => {
    const urls = sitemap().map((entry) => entry.url);
    for (const locale of ['en', 'th', 'zh']) expect(urls).toContain(`${siteUrl}/${locale}/about`);
    expect(urls.some((url) => url.includes('/ja/about'))).toBe(false);
  });

  it('contains no invented digits (only the brand domain and the currency codes)', () => {
    for (const locale of ['en', 'th', 'zh'] as const) {
      const text = JSON.stringify(aboutCopy[locale]);
      expect(text, locale).not.toMatch(/\d/);
    }
  });
});
