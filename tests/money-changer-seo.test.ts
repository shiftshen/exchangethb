import { describe, expect, it } from 'vitest';
import { cashBranches } from '@/data/site';
import {
  buildMoneyChangerSeo,
  currencyExchangeJsonLd,
  formatOpeningHours,
  getMoneyChangerProfile,
  moneyChangerProfileSlugs,
  parseOpeningHours,
} from '@/lib/money-changer-seo';

const branch = (slug: string) => cashBranches.find((item) => item.providerSlug === slug)!;
const enWords = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
const cjk = (value: string) => (value.match(/[\u4e00-\u9fff]/g) || []).length;

describe('money changer opening hours parser', () => {
  it('parses every published profile schedule from data/site.ts', () => {
    expect(parseOpeningHours(branch('ratchada').hours)).toEqual([
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '09:00', closes: '20:30' },
    ]);
    expect(parseOpeningHours(branch('superrich-thailand').hours)).toEqual([
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '16:30' },
    ]);
    expect(parseOpeningHours(branch('twelve-victory').hours)).toEqual([
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:30', closes: '17:00' },
      { days: ['Saturday', 'Sunday'], opens: '09:00', closes: '16:00' },
    ]);
  });

  it('refuses to invent a schedule for an unverified hours note', () => {
    expect(parseOpeningHours('Branch hours vary by location; verify with provider before visiting')).toBeNull();
    expect(parseOpeningHours('')).toBeNull();
    expect(parseOpeningHours('Open daily when staffed')).toBeNull();
  });

  it('derives Sunday availability from the parsed schedule', () => {
    expect(getMoneyChangerProfile('ratchada')?.sundayOpen).toBe(true);
    expect(getMoneyChangerProfile('superrich-thailand')?.sundayOpen).toBe(false);
    expect(getMoneyChangerProfile('twelve-victory')?.sundayOpen).toBe(true);
  });
});

describe('money changer profile facts', () => {
  it('publishes a street address only when the branch record verified one', () => {
    expect(getMoneyChangerProfile('ratchada')?.streetAddress).toBe(branch('ratchada').address);
    // Twelve Victory's branch record is marked "reference" precision, so it keeps the address
    // as a visible note but does not publish it as a verified postal address.
    expect(getMoneyChangerProfile('twelve-victory')?.streetAddress).toBeNull();
    expect(getMoneyChangerProfile('twelve-victory')?.addressNote).toBe(branch('twelve-victory').address);
    // The SuperRich Thailand record is an area-level note, never a postal street address.
    expect(getMoneyChangerProfile('superrich-thailand')?.streetAddress).toBeNull();
    expect(getMoneyChangerProfile('superrich-thailand')?.addressNote).toBe(branch('superrich-thailand').address);
  });

  it('covers exactly the three public profiles', () => {
    expect(moneyChangerProfileSlugs).toEqual(['superrich-thailand', 'ratchada', 'twelve-victory']);
    expect(getMoneyChangerProfile('sia')).toBeNull();
  });
});

describe('money changer profile copy', () => {
  const locales = ['en', 'th', 'zh'] as const;

  it('starts every title and description with the brand name', () => {
    for (const slug of moneyChangerProfileSlugs) {
      const profile = getMoneyChangerProfile(slug)!;
      for (const locale of locales) {
        const seo = buildMoneyChangerSeo(slug, locale)!;
        // SEO-24: the Thai Ratchada title leads with the spelling users actually search (GSC).
        const brand = locale === 'th' && slug === 'ratchada'
          ? 'รัชดาเอกเช้น'
          : locale === 'th' && profile.brandThai ? profile.brandThai : profile.name;
        expect(seo.content.metaTitle.startsWith(brand), `${slug}/${locale} title: ${seo.content.metaTitle}`).toBe(true);
        expect(seo.content.metaDescription.startsWith(brand), `${slug}/${locale} description`).toBe(true);
      }
    }
  });

  it('carries the Thai brand name on all three Ratchada locales', () => {
    for (const locale of locales) {
      const seo = buildMoneyChangerSeo('ratchada', locale)!;
      expect(seo.content.metaDescription).toContain('รัชดาเอ๊กซเชนจ์');
    }
  });

  it('answers where, when, how and what to bring in the lead paragraph', () => {
    for (const slug of moneyChangerProfileSlugs) {
      const profile = getMoneyChangerProfile(slug)!;
      const en = buildMoneyChangerSeo(slug, 'en')!;
      expect(enWords(en.content.answer), `${slug} answer words`).toBeGreaterThanOrEqual(40);
      expect(enWords(en.content.answer), `${slug} answer words`).toBeLessThanOrEqual(60);
      expect(en.content.answer).toContain(profile.area);
      expect(en.content.answer).toContain('passport');
      const zh = buildMoneyChangerSeo(slug, 'zh')!;
      expect(cjk(zh.content.answer), `${slug} zh answer`).toBeGreaterThanOrEqual(40);
      expect(cjk(zh.content.answer), `${slug} zh answer`).toBeLessThanOrEqual(80);
      expect(zh.content.answer).toContain('护照');
      const th = buildMoneyChangerSeo(slug, 'th')!;
      expect(th.content.answer).toContain('หนังสือเดินทาง');
    }
  });

  it('does not ship the same answer text on two provider pages', () => {
    for (const locale of locales) {
      const answers = moneyChangerProfileSlugs.map((slug) => buildMoneyChangerSeo(slug, locale)!.content.answer);
      expect(new Set(answers).size).toBe(answers.length);
      const positioning = moneyChangerProfileSlugs.map((slug) => buildMoneyChangerSeo(slug, locale)!.positioning);
      expect(new Set(positioning).size).toBe(positioning.length);
    }
  });

  it('gives every profile a visible FAQ set with unique questions', () => {
    for (const slug of moneyChangerProfileSlugs) {
      for (const locale of locales) {
        const { content } = buildMoneyChangerSeo(slug, locale)!;
        expect(content.faqs.length).toBeGreaterThanOrEqual(6);
        expect(new Set(content.faqs.map((item) => item.question)).size).toBe(content.faqs.length);
        for (const item of content.faqs) {
          expect(item.question.length).toBeGreaterThan(4);
          expect(item.answer.length).toBeGreaterThan(20);
        }
      }
    }
  });

  it('states the real published hours in the FAQ answer, localized', () => {
    for (const slug of moneyChangerProfileSlugs) {
      const hours = parseOpeningHours(branch(slug).hours)!;
      const en = buildMoneyChangerSeo(slug, 'en')!;
      const enAnswer = en.content.faqs.find((item) => /opening hours/i.test(item.question))!;
      expect(enAnswer.answer).toContain(en.content.hoursDisplay);
      for (const rule of hours) {
        expect(en.content.hoursDisplay).toContain(rule.opens);
        expect(en.content.hoursDisplay).toContain(rule.closes);
      }
      // Thai and Chinese must not splice the English source schedule into their prose.
      const th = buildMoneyChangerSeo(slug, 'th')!;
      const zh = buildMoneyChangerSeo(slug, 'zh')!;
      for (const seo of [th, zh]) {
        const answer = seo.content.faqs.find((item) => /เปิดกี่โมง|几点开门/.test(item.question))!;
        expect(answer.answer).not.toContain(branch(slug).hours);
        expect(answer.answer).toContain(seo.content.hoursDisplay);
      }
      expect(th.content.hoursDisplay).toMatch(/ทุกวัน|จ\.|อ\.|ส\./);
      expect(zh.content.hoursDisplay).toMatch(/每天|周[一二三四五六日]|至/);
    }
  });

  it('formats published hours per locale without guessing', () => {
    expect(formatOpeningHours(parseOpeningHours('Open daily 09:00-20:30')!, 'Open daily 09:00-20:30', 'en')).toBe('Daily 09:00–20:30');
    expect(formatOpeningHours(parseOpeningHours('Open daily 09:00-20:30')!, '', 'zh')).toBe('每天 09:00–20:30');
    expect(formatOpeningHours(parseOpeningHours('Monday-Saturday 09:00-16:30')!, '', 'zh')).toBe('周一至周六 09:00–16:30');
    expect(formatOpeningHours(parseOpeningHours('Mon-Fri 08:30-17:00, Sat-Sun 09:00-16:00')!, '', 'th')).toBe('จ.–ศ. 08:30–17:00, ส.–อา. 09:00–16:00');
    expect(formatOpeningHours(null, 'verify with provider', 'en')).toBe('verify with provider');
  });
});

describe('money changer structured data', () => {
  const serialize = (value: unknown) => JSON.parse(JSON.stringify(value));

  it('marks a real counter as LocalBusiness + FinancialService with verified facts', () => {
    const profile = getMoneyChangerProfile('ratchada')!;
    const json = serialize(currencyExchangeJsonLd({
      name: profile.name,
      url: 'https://www.exchangethb.com/en/money-changers/ratchada',
      officialUrl: profile.officialUrl,
      area: profile.area,
      streetAddress: profile.streetAddress,
      hoursSpec: profile.hoursSpec,
      geo: profile.geo,
      mapUrl: profile.mapUrl,
    }));
    expect(json['@type']).toEqual(['LocalBusiness', 'FinancialService']);
    expect(json.address).toMatchObject({ '@type': 'PostalAddress', streetAddress: branch('ratchada').address, addressCountry: 'TH' });
    expect(json.geo).toMatchObject({ '@type': 'GeoCoordinates', latitude: branch('ratchada').latitude });
    expect(json.openingHoursSpecification).toEqual([
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '09:00', closes: '20:30' },
    ]);
    expect(json.currenciesAccepted).toContain('THB');
    expect(JSON.stringify(json)).not.toContain('priceRange');
  });

  it('omits a postal address when the branch record has no street address', () => {
    const profile = getMoneyChangerProfile('superrich-thailand')!;
    const json = serialize(currencyExchangeJsonLd({
      name: profile.name,
      url: 'https://www.exchangethb.com/en/money-changers/superrich-thailand',
      officialUrl: profile.officialUrl,
      area: profile.area,
      streetAddress: profile.streetAddress,
      hoursSpec: profile.hoursSpec,
      geo: profile.geo,
      mapUrl: profile.mapUrl,
    }));
    expect(json.address).toBeUndefined();
    expect(JSON.stringify(json)).not.toContain('Pratunam area operations');
    expect(json.openingHoursSpecification[0].dayOfWeek).not.toContain('Sunday');
  });
});
