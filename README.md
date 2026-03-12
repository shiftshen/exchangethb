# ExchangeTHB

ExchangeTHB is a launch-ready multilingual comparison site for finding better paths into Thai baht through crypto exchanges and Bangkok money changers.

## Stack
- `Next.js` + `TypeScript` + `Tailwind CSS`
- PostgreSQL-ready persistence via `Prisma`, with local file fallback for single-node operation
- Self-hostable with `Docker Compose`
- `GA4` analytics and Google Maps jump-outs

## Included
- Public pages for home, crypto compare, cash compare, exchange detail, money changer detail, methodology, disclaimer, privacy policy
- Admin login + dashboard for affiliate links, fee overrides, and cash scraper refresh
- API routes for crypto compare, cash compare, admin health, admin config, admin auth, admin cash scraping
- Live public market depth from `Binance TH`, `Bitkub`, `Upbit Thailand`, and `Orbix`, with reviewed fallback safety
- Live official cash scraping for `Ratchada`, `SuperRich Thailand`, and `SIA`
- One-shot worker command for manual refresh, plus an optional long-running worker mode for production cache refresh

## Quick start
1. Copy `.env.example` to `.env`
2. Set `ADMIN_EMAIL`, `ADMIN_SESSION_SECRET`, and either `ADMIN_PASSWORD_HASH` (recommended) or `ADMIN_PASSWORD`
3. Install dependencies with `npm install`
4. Generate Prisma client with `npm run prisma:generate`
5. Refresh cached cash data with `npm run worker`
6. Start development with `npm run dev`
7. Or use `docker compose up`
8. Production Docker now starts both `web` and a long-running `worker` service; manual refresh remains available through `npm run worker`

## Persistence modes
- If `DATABASE_URL` is reachable, admin config, audit logs, and cash cache use database-backed persistence.
- If the database is unavailable, the app falls back to `content/*.json` so the site remains operational on a single node.
- Check `/api/health` or `/api/admin/health` to see whether the current runtime is using `database` or `file_fallback`.

## Production notes
- Keep `content/admin-config.json` and `content/cash-scrape-cache.json` in backups.
- Run `npm run prisma:push` against the production database before first boot if you want database-backed persistence active.
- `/api/health` and `/api/admin/health` now expose `configWarnings`; treat any non-empty warning list as a pre-launch blocker.
- Add Nginx, HTTPS, backups, and process monitoring on the VPS.
- Public health endpoint is `/api/health`; admin diagnostics endpoint is `/api/admin/health` (requires admin session).
- API JSON contract is `{ ok: boolean, traceId: string, data?: T, error?: string, detail?: unknown }`.

## International SEO
- English is now the default landing locale at `/en`; the root route redirects there.
- Locale pages emit `hreflang` for `th`, `en`, `zh`, plus `x-default`.
- The sitemap includes alternate language links for public landing, legal, and detail pages.
- Structured data now includes `Organization`, `WebSite`, and page-level `BreadcrumbList`.
- The rollout plan for future markets lives in [GO_LIVE_CHECKLIST_CN.md](./GO_LIVE_CHECKLIST_CN.md) and [INTERNATIONAL_SEO_PLAN.md](./INTERNATIONAL_SEO_PLAN.md).
