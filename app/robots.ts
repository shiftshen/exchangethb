import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const adminDisallow = ['/admin', '/th/admin', '/en/admin', '/zh/admin'];
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: adminDisallow,
      },
      {
        // Explicitly allow common AI/search crawlers to read public pages.
        // This takes effect as long as upstream CDN/firewall policies do not override it.
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'CCBot',
          'Google-Extended',
          'PerplexityBot',
          'Bytespider',
          'Amazonbot',
          'Applebot-Extended',
          'meta-externalagent',
        ],
        allow: '/',
        disallow: adminDisallow,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
