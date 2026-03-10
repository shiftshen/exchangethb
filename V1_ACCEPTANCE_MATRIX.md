# ExchangeTHB V1 Acceptance Matrix

## 1. Product Scope Freeze
- Crypto exchanges fixed to: Binance TH, Bitkub, Upbit Thailand, Orbix.
- Crypto symbols fixed to: BTC, ETH, USDT, XRP, DOGE, SOL.
- Cash providers fixed to Bangkok launch set: SuperRich 1965, SuperRich Thailand, Vasu, SIA, Ratchada.
- Cash currencies fixed to: USD, CNY, EUR, JPY, GBP.

## 2. Frontend Information Architecture
- Home page: implemented.
- Crypto compare page: implemented with estimated labels and freshness/source metadata.
- Cash compare page: implemented with provider health and fallback quality metadata.
- Exchange detail page: implemented with affiliate routing, score summary, profile override panel.
- Money changer detail page: implemented with branch list, scrape status, review mode/note.
- Methodology / Disclaimer pages: implemented via legal routes.

## 3. Backend / Admin P0
- Data source monitor: implemented in dashboard with per-provider status table.
- Rules and fees: implemented in config editor.
- Exchange profile management: implemented at `/admin/exchange-profiles`.
- Branch manager: implemented at `/admin/branch-manager`.
- Scrape review: implemented at `/admin/scrape-review`.
- Scrape rollback: implemented API `POST /api/admin/scrape-cash/rollback`.
- Audit logs: dashboard section + full page `/admin/audit` + API `GET /api/admin/audit-logs`.

## 4. Data Source and Reliability
- Official/fallback source labeling implemented in crypto and cash pipelines.
- Cache stale detection and min scrape interval implemented.
- Scrape failure non-destructive behavior implemented (keep previous valid cache).
- Hidden alert review list and provider force mode (`auto/force_fallback/force_live`) implemented.

## 5. SEO / i18n
- Localized routes: `th/en/zh` implemented.
- Sitemap/robots/manifest implemented.
- Canonical and language alternates implemented in page metadata.

## 6. Verification Executed
- Typecheck: `npm run typecheck` passed.
- Unit tests: `npm run test` passed.
- Runtime probe: admin routes and APIs return expected auth behavior under anonymous access.

## 7. Remaining External Go-Live Inputs
- Production domain + DNS + HTTPS certificates.
- Final production `.env` values (secrets/password hash/session secret).
- Final legal copy sign-off.
- Analytics/Search Console property binding and ownership verification.
- Operational backup/restore execution record in production environment.

## 8. Operations Docs Delivered
- Deployment handoff: `DEPLOYMENT_HANDOFF.md`
- Chinese production runbook: `RELEASE_RUNBOOK_CN.md`
- Chinese operations SOP: `OPS_SOP_CN.md`
