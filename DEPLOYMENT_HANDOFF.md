# ExchangeTHB Deployment Handoff

## What is already done
- Multilingual public site is implemented with Thai default and EN / 中文 switching.
- Crypto comparison now prefers live public market depth from Binance TH and Bitkub, with reviewed fallback data for other venues.
- Cash comparison, legal pages, exchange detail pages, and admin shell are implemented.
- Admin login is protected by email/password via secure cookie session.
- Docker, Prisma schema, worker scaffold, env template, and VPS-oriented deployment files are included.

## What you only need to provide at the end
- Domain DNS target for `exchangethb.com`
- Final VPS host/IP and SSH access path
- Final production values for `.env`
- Official recommendation / campaign links list
- Final admin password you want to use
- Optional GA4 measurement ID and Search Console ownership method

## Production env checklist
- `ADMIN_EMAIL=admin@exchangethb.com`
- `ADMIN_PASSWORD=<final password>`
- `ADMIN_SESSION_SECRET=<long random secret>`
- `DATABASE_URL=<postgres production url>`
- `REDIS_URL=<redis production url>`
- `NEXT_PUBLIC_SITE_URL=https://exchangethb.com`
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID=<optional>`

## Deploy steps
1. Copy project to VPS
2. Copy `.env.example` to `.env` and fill production values
3. Run `docker compose up -d --build`
4. Put Nginx in front of port `3000`
5. Issue HTTPS certificate for `exchangethb.com`
6. Verify `/api/admin/health`, `/th`, `/en`, `/zh`, `/admin/login`

## Immediate post-deploy tasks
- Replace fallback exchange adapters for Upbit Thailand / Orbix when confirmed official endpoints are available.
- Replace seed cash rates with official scrapers or reviewed manual ingestion.
- Load your final campaign / referral links into `content/admin-config.json` or the admin config API.
