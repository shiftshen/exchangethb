# ExchangeTHB

ExchangeTHB is a launch-ready multilingual comparison site for finding better paths into Thai baht through crypto exchanges and Bangkok money changers.

## Stack
- `Next.js` + `TypeScript` + `Tailwind CSS`
- File-backed admin config and scrape cache, with `Prisma` schema scaffold for PostgreSQL migration
- Self-hostable with `Docker Compose`
- `GA4` analytics and Google Maps jump-outs

## Included
- Public pages for home, crypto compare, cash compare, exchange detail, money changer detail, methodology, disclaimer, privacy policy
- Admin login + dashboard for affiliate links, fee overrides, and cash scraper refresh
- API routes for crypto compare, cash compare, admin health, admin config, admin auth, admin cash scraping
- Live public market depth from `Binance TH`, `Bitkub`, `Upbit Thailand`, and `Orbix`, with reviewed fallback safety
- Live official cash scraping for `Vasu` and `Ratchada`, with fallback/review mode for `SuperRich 1965`, `SuperRich Thailand`, and `SIA`
- One-shot worker command that refreshes cash scrape cache and reports source health

## Quick start
1. Copy `.env.example` to `.env`
2. Set `ADMIN_EMAIL`, `ADMIN_SESSION_SECRET`, and either `ADMIN_PASSWORD_HASH` (recommended) or `ADMIN_PASSWORD`
3. Install dependencies with `npm install`
4. Refresh cached cash data with `npm run worker`
5. Start development with `npm run dev`
6. Or use `docker compose up`
7. For one-shot cache refresh in Docker, run `docker compose --profile worker run --rm worker`

## Production notes
- Replace file-backed config with PostgreSQL persistence when moving to multi-admin production.
- Keep `content/admin-config.json` and `content/cash-scrape-cache.json` in backups.
- Add Nginx, HTTPS, backups, and process monitoring on the VPS.
- Public health endpoint is `/api/health`; admin diagnostics endpoint is `/api/admin/health` (requires admin session).
- API JSON contract is `{ ok: boolean, traceId: string, data?: T, error?: string, detail?: unknown }`.
