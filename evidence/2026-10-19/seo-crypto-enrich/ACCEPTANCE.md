# SEO-39 验收（本地 · 2026-10-19 · 只开发）

## 结论：通过

本卡目标三项全部落地并通过本地门禁；分支已推送、未合 main、未发布（发布由发布卡执行）。

## 目标完成情况
1. **/en|th|zh/exchanges 并列对比表 + FAQPage schema + SEC 来源链接** — 通过。
   - 新增对比表（交易所｜牌照｜THB 交易对｜手续费｜充值｜关键特征），全部取自 data/site.ts，未编数字、未写「最好/推荐」。
   - 新增 `faqPageJsonLd`（问答与可见 FAQ 卡片同一来源 `exchangeIndexFaqs(locale)`）。
   - SEC 来源链接 `https://market.sec.or.th/LicenseCheck/views/DABusiness`（复用 `licenseLookup`，官方公开来源）。
2. **/en|th|zh/crypto「如何比较交易所」编辑段** — 通过。牌照/手续费/充值三件纯事实，未下无数据结论。
3. **/en|th|zh/routes/btc-to-thb 换算器 + 最后更新时间 + FAQ** — 通过。换算器沿用 SEO-30 `estimateBuyThb`（含快照时间戳），本卡补 2 条 FAQ 说明估算口径与无快照时的「暂无估算」。
4. **不改 URL/canonical/hreflang、不编数字、不写结论** — 通过（未触碰路由/索引策略，sitemap 仍 79 条）。

## 本地门禁实测
| 项 | 结果 |
|---|---|
| `tsc --noEmit` | 0 错误 |
| `eslint . --max-warnings=0` | 0 问题 |
| `vitest run`（只跑一次） | 55 文件 / 237 例全过 |
| `next build` | 成功 |
| `seo:cluster`（本地 41790） | 全过 |
| m390 截图（3 张） | 已取 + OCR 核验关键文案可见 |

## 新增测试（tests/crypto-enrich.test.ts · 11 例）
- 对比表行数 == exchanges 数量，且各列与 data/site.ts 逐值一致。
- 不编充值声明（仅 Bitkub `thbDepositSupported=true`）。
- 对比表渲染到 HTML：四所名 + SEC 来源 URL + 4 个 `data-exchange-comparison-row`。
- `exchangeIndexFaqs` en/th/zh 各 3 条非空；`faqPageJsonLd` 问题与 FAQ 源一致；页面源码把同一 FAQ 源接入可见卡片与 schema。
- `btc-to-thb` 路由 faqs 存在（en/th/zh 各 ≥2 条）；`estimateBuyThb([])` → null（无快照无数字）。

## 证据
- 截图：`evidence/2026-10-19/seo-crypto-enrich/screens/m390-en-{exchanges,crypto,routes-btc-to-thb}.png`
- 步骤：`evidence/2026-10-19/seo-crypto-enrich/steps.md`

## 未做（留给发布卡）
- 生产发布 / 镜像切换 / canary / GSC 提交——本卡 [只开发]，均未执行。
