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
- Live public market depth from `Binance TH` and `Bitkub`, with reviewed fallback data for pending exchanges
- Live official cash scraping for `Vasu` and `Ratchada`, with fallback/review mode for `SuperRich 1965`, `SuperRich Thailand`, and `SIA`
- Worker that refreshes cash scrape cache and reports source health

## Quick start
1. Copy `.env.example` to `.env`
2. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`
3. Install dependencies with `npm install`
4. Refresh cached cash data with `npm run worker`
5. Start development with `npm run dev`
6. Or use `docker compose up`

## Production notes
- Replace file-backed config with PostgreSQL persistence when moving to multi-admin production.
- Keep `content/admin-config.json` and `content/cash-scrape-cache.json` in backups.
- Add Nginx, HTTPS, backups, and process monitoring on the VPS.
