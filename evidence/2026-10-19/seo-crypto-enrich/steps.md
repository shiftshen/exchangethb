# steps（SEO-39 crypto 内容补强，2026-10-19 · 只开发，未发布）

本卡只做本地 worktree 改代码 + 本地验收；不连生产、不发布。发布方式照 SEO-24（`evidence/2026-10-19/seo-ratchada-rate/steps.md`），由发布卡执行。

## 分支与 worktree
- 基线：`03e3afc`（SEO-30，分支 `seo/crypto-cluster-20261019`，生产 v0.1.9 之后正在发布链上）。
- 新 worktree：`/Volumes/M2USB/_scratch/exchangethb/20261018/r9-wt`，分支 `seo/crypto-enrich-20261019`。
- 共享工作区 `/Volumes/M2USB/dev/exchangethb` 未动。

## 改动清单（相对 03e3afc）
1. **lib/exchange-comparison.ts（新增）**：`buildExchangeComparisonTableRows()`（并列对比表数据，全部取自 data/site.ts）、`exchangeIndexFaqs(locale)`（从页面内联 FAQ 抽出，供可见卡片与 FAQPage schema 共用）、`secLicenseSourceUrl`（复用 `lib/provider-evidence.ts` 的 `licenseLookup` = 泰国 SEC 持牌机构名单）。
2. **components/exchange-comparison-table.tsx（新增）**：同步展示组件，列＝交易所｜牌照｜THB 交易对｜手续费｜充值｜关键特征；表下注明「充值列只展示本站记录内容」「牌照来源→泰国 SEC」。
3. **components/crypto-how-to-compare.tsx（新增）**：/crypto 的「如何比较交易所」编辑段（牌照/手续费/充值三件纯事实，en/th/zh），含 SEC 名单外链。
4. **app/[locale]/exchanges/page.tsx**：新增 `ExchangeComparisonTable` 区块（放在 SEO-30 持牌所表之后）；FAQ 由内联改为 `exchangeIndexFaqs(locale)`；新增 `faqPageJsonLd(faqEntries)` 结构化数据（问答与可见卡片同一来源）。未动 URL/canonical/hreflang/索引策略。
5. **app/[locale]/crypto/page.tsx**：在 `CryptoFeaturedExchanges` 与 `ExchangeGuide` 之间加 `<CryptoHowToCompare locale={locale} />`（仅 en/th/zh 渲染）。未改标题/正文/`exchange-guide` 区块。
6. **lib/route-guides.ts**：为 `btc-to-thb` 补 `faqs`（en/th/zh 各 2 条：估算怎么算、为何有时无数字）。换算器本身（SEO-30 的「THB estimate」区块）未改。
7. **tests/crypto-enrich.test.ts（新增）**：11 例（见下）。

## 本地门禁（r9-wt，全部实测）
- `tsc --noEmit`：0 错误。
- `eslint . --max-warnings=0`：0 问题。
- `vitest run`：55 文件 / 237 例全过（含新增 crypto-enrich.test.ts 11 例）。
- `next build`：成功。
- `seo:cluster`（`node scripts/check-seo-cluster.mjs http://127.0.0.1:41790 https://www.exchangethb.com`）：全过。
- m390 截图 3 张（playwright 无头 Chromium，390px 视口，fullPage）：`en/exchanges`、`en/crypto`、`en/routes/btc-to-thb`，OCR 核验关键文案可见（对比表四所名 + SEC 来源、编辑段标题、btc-to-thb FAQ 问题）。

## 数据口径（不编数字）
- 对比表各列：交易所=name；牌照=license（本地化）；THB 交易对=pairs→`X/THB`；手续费=`tradingFeePct%`（`tradingFeeAsset==='received'` 时加注）；充值=仅 Bitkub 记录明确「支持泰铢充提」（`thbDepositSupported`），其余显示「未登记」；关键特征=第一条 strength。
- 「未登记」≠「不支持」：表下已注明充值渠道/额度/费用本站未逐所登记，请以官网为准。
- btc-to-thb 换算器沿用 SEO-30 `estimateBuyThb`（最低价完整成交的 ask 估算，未含手续费）；无盘口快照时显示「暂无估算」而非编数字。本卡只补 FAQ 说明。

## 发布方式（发布卡照 SEO-24 执行，本卡未执行）
- 构建机（2panel-happy）用 `FROM exchangethb:<当前生产tag>` 覆盖 `app/lib/components` 跑 `npm run build`，`docker save|load` 回 1.83，新增 `compose.seo-r9-20261019.yml` 接链尾；先 `web_canary` 再 `web`。
- 发布前 `docker tag <当前生产镜像> exchangethb:rollback-before-seo-r9-20261019` 钉回退。
- 发布后公网回读 seo:cluster + 结构校验（FAQ 与可见文字一致、对比表行数==4、canonical/hreflang 不变）。
