import { TrackLink } from '@/components/track-link';
import { featuredChangerCopy } from '@/lib/cash-featured-changers';
import { formatOpeningHours, getMoneyChangerProfile, moneyChangerProfileSlugs } from '@/lib/money-changer-seo';
import { getBangkokOpenState } from '@/lib/opening-hours';
import type { Locale } from '@/lib/types';

const profileLocales = ['en', 'th', 'zh'];

// Internal links from /cash (indexed in every locale) to the three money changer profiles.
// The profile pages are otherwise reachable only from the noindex hub, the route guides and
// the sitemap, so this strip is the main internal link path into the Ratchada cluster.
export function CashFeaturedChangers({ locale }: { locale: Locale }) {
  const copy = featuredChangerCopy[locale];
  const targetLocale = profileLocales.includes(locale) ? locale : 'en';
  const rows = moneyChangerProfileSlugs
    .map((slug) => getMoneyChangerProfile(slug))
    .filter((profile): profile is NonNullable<typeof profile> => Boolean(profile))
    .map((profile) => ({
      profile,
      hours: formatOpeningHours(profile.hoursSpec, profile.hours, locale),
      open: getBangkokOpenState(profile.hours),
    }));
  if (!rows.length) return null;

  return (
    <section className="seo-changers" aria-labelledby="featured-changers-heading">
      <h2 id="featured-changers-heading">{copy.title}</h2>
      <p className="seo-changers-body">{copy.body}</p>
      <ul className="seo-changers-list">
        {rows.map(({ profile, hours, open }) => (
          <li key={profile.slug}>
            <TrackLink
              href={`/${targetLocale}/money-changers/${profile.slug}`}
              eventName="cash_featured_changer_click"
              eventParams={{ locale, provider: profile.slug }}
              className="seo-changers-link"
            >
              <span className="seo-changers-name">{profile.name}</span>
              <span className="seo-changers-meta">{profile.area} · {hours}</span>
              {open === null ? null : <span className={`seo-changers-state ${open ? 'is-open' : 'is-closed'}`}>{open ? copy.open : copy.closed}</span>}
            </TrackLink>
          </li>
        ))}
      </ul>
      <TrackLink
        href={`/${targetLocale}/money-changers`}
        eventName="cash_featured_changers_hub_click"
        eventParams={{ locale }}
        className="seo-changers-more"
      >
        {copy.cta}
      </TrackLink>
    </section>
  );
}
