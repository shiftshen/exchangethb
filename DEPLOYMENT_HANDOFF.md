# ExchangeTHB Deployment Handoff

## What is already done
- Multilingual public site is implemented with Thai default and EN / 中文 switching.
- Crypto comparison now reads live public market depth from Binance TH, Bitkub, Upbit Thailand, and Orbix, then falls back to reviewed snapshots if any source is unavailable.
- Cash comparison, legal pages, exchange detail pages, money changer pages, and admin shell are implemented.
- Admin login is protected by email/password via secure cookie session and signed session token.
- Docker, Prisma schema, worker scaffold, env template, and VPS-oriented deployment files are included.
- SEO baseline includes locale alternates, Open Graph/Twitter metadata, robots.txt, sitemap.xml, and web manifest.

## What you only need to provide at the end
- Domain DNS target for `exchangethb.com`
- Final VPS host/IP and SSH access path
- Final production values for `.env`
- Official recommendation / campaign links list
- Final admin password you want to use
- Optional GA4 measurement ID and Search Console ownership method

## Production env checklist
- `ADMIN_EMAIL=admin@exchangethb.com`
- `ADMIN_PASSWORD_HASH=<recommended scrypt hash>` or `ADMIN_PASSWORD=<fallback plain password>`
- `ADMIN_SESSION_SECRET=<long random secret>`
- `DATABASE_URL=<postgres production url>`
- `REDIS_URL=<redis production url>`
- `NEXT_PUBLIC_SITE_URL=https://exchangethb.com`
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID=<optional>`

## Deploy steps
1. Copy project to VPS
2. Copy `.env.example` to `.env` and fill production values
3. Run `docker compose down --remove-orphans`
4. Run `docker compose up -d --build`
5. Run `docker compose ps` and confirm `web`, `postgres`, `redis` are running
6. Run worker once with `docker compose --profile worker run --rm worker` if initial cache is empty
7. Put Nginx in front of port `3000`
8. Issue HTTPS certificate for `exchangethb.com`
9. Verify `/api/health`, `/th`, `/en`, `/zh`, `/admin/login`, `/sitemap.xml`, `/robots.txt`

## Nginx and HTTPS notes
- Reverse proxy traffic from `443` to `http://127.0.0.1:3000`.
- Force redirect from `http://` to `https://`.
- Set `client_max_body_size` to a practical value for admin payloads.
- Enable gzip/brotli and cache headers for static assets.
- Use Let's Encrypt auto-renewal and monitor certificate expiry.

## Backup and recovery
- Back up `content/admin-config.json`, `content/cash-scrape-cache.json`, and `content/admin-audit-log.json` at least daily.
- Back up PostgreSQL and Redis volumes if enabled in production.
- Keep at least one off-host backup copy.
- Recovery order: restore `.env` → restore content JSON files → restore DB/Redis volumes → restart compose stack.

## Health check and monitoring
- Public checks: `/th`, `/en`, `/zh`, `/api/health`, `/api/compare/crypto`, `/api/compare/cash`.
- Admin checks: `/admin/login`, `/api/admin/health` (authenticated session required).
- Add process monitoring and restart policy for Docker services.
- Set alerts for repeated scraper failures and fallback-only adapter state.

## Go-live checklist
- Confirm `ADMIN_EMAIL=admin@exchangethb.com`.
- Rotate `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
- Validate GA4 events and language switching.
- Validate live/fallback/freshness labels on crypto and cash flows.
- Confirm legal pages in all three locales.
- Confirm sitemap/robots are publicly reachable.
- Capture final screenshots for home, crypto, cash, exchange detail, money changer detail, admin login.

## Immediate post-deploy tasks
- Load your final campaign / referral links into `content/admin-config.json` or the admin config API.
- Review fallback reasons in admin health and keep reviewed snapshots fresh.
- Keep SIA in fallback/manual review mode until stable official source reliability is confirmed.
- Schedule recurring worker execution for cache refresh.
- If your worker runtime does not preinstall devDependencies, run it through `npx -y tsx worker/index.ts` to avoid interactive prompts.
