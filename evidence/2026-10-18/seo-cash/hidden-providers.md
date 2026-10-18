# 未公开换汇店核查（只读，不改代码）— superrich-1965 / sia / vasu

核查时间：2026-10-18 22:4x +07。依据均在 `/Volumes/M2USB/dev/exchangethb`（以下相对路径）；采集统计取 `artifacts/cash-cycle-*/results.json` 共 2310 轮（2026-10-01 21:06 UTC 至 2026-10-18 15:35 UTC）。

## 总览

| slug | 在 publicCashProviderSlugs | 能否公开 | 结论 |
|---|---|---|---|
| sia | 否（曾在，2026-10-02 被老板下线） | 暂不能 | 老板明确决定删除；官网 HTTPS 403，无任何成功采集，无牌照核对 |
| vasu | 否（从未在） | 暂不能 | 采集 100% 失败后已退出采集器；无报价、无坐标、无牌照核对 |
| superrich-1965 | 否（从未在） | 暂不能（待老板定品牌口径） | 抓取代码在，但外部采集器不跑它；最近 18 天零采集记录；与 SuperRich Thailand 是否同一品牌/是否重复公开未定 |

## sia（SIA Money Exchange）

- 历史：`git show 9c78511 -- data/site.ts`（2026-03-13）首版 `publicCashProviderSlugs = ['superrich-thailand','sia','ratchada']`，即 SIA 曾公开。
- 决定记录：`DEVELOPMENT_PLAN.md` 「2026-10-02 用户明确调整来源范围」（第 154–156 行）：「用户决定删除无法采集的 Vasu、SIA 站点内容。公开目录、比较、状态页和索引只保留 SuperRich Thailand、Ratchada、Twelve Victory；旧来源历史缓存保留但不展示、不参与比较，即使启用 includeUnstableProviders 也不恢复两家。」同文件第 161、174 行重申「Vasu/SIA 已按用户指示退出公开来源，旧恢复不再是范围内任务」。
- 技术原因：`DEVELOPMENT_PLAN.md` 第 152 行「SIA 当前 HTTPS 403 未恢复」；`SITE_OPERATIONS_EVIDENCE.md` 第 86 行：SIA 只有 2026-09-24 一条非最新报价；`lib/scrapers/cash.ts` 的 SIA 抓取器仍在文件里，但 `runCashScrapers()`（同文件 311–313 行）与外部采集器 `scripts/collect-cash-private.ts`（第 16–18 行）都不再调用它；`artifacts/cash-cycle-*` 2310 轮里 SIA 零记录。
- 代码硬排除：`lib/cash-live.ts` 第 79、100 行 `!['sia','vasu'].includes(...)`；`tests/cash-live.test.ts` 第 64、80 行断言 sia 不出现；`tests/indexing-policy.test.ts` 第 29–30 行 sia 资料页不索引。
- 牌照：`evidence/2026-10-07/bot-money-changer-licence-20260831.json` 的 `not_matched_on_purpose` 写明 sia/vasu 未做 BOT 名录核对（只核了三家公开店）。
- 能否公开：暂不能。缺：①官网可采集（现 403，需合规的固定采集路径）；②当前一手报价和时间戳；③BOT 授权名录核对；④老板撤销 2026-10-02 的下线决定。数据里已有的资料（总店 Pratunam、`1091/156-7 Soi Petchaburi 33…`、`Mon-Sat 09:00-18:00, Sun closed`、`locationPrecision: address`）足够做资料页，但没有报价就不能进比较。

## vasu（Vasu Exchange）

- 历史：`git log -G"publicCashProviderSlugs = "` 只有 9c78511 与后续改动，Vasu 从未出现在公开列表里；它在 `data/site.ts` 里由 `cashProviders.push(['vasu','twelve-victory'])` 与 `cashBranches.push(...)` 追加（总店 Sukhumvit 7/1，`Mon-Fri 09:00-18:00, Sat 09:00-17:00, Sun closed`，无经纬度，`locationPrecision: reference`，`isOpen:false`）。
- 采集记录：`artifacts/cash-cycle-*`：Vasu 共出现 58 轮，成功 0、失败 58，备注均为 `Collection failed; no retry, direct fallback or exit rotation.`；最后一次 2026-10-02 06:30 UTC，之后采集器（`scripts/collect-cash-private.ts` 第 16–18 行）只剩三家，Vasu 被移除。`SITE_OPERATIONS_EVIDENCE.md` 第 99 行同样写「Vasu unavailable」。解析器 `lib/scrapers/additional-cash.ts` 的 `parseAdditionalCash` 支持 vasu，但从未在真实页面上验收成功（`DEVELOPMENT_PLAN.md` 第 72、101 行：Vasu/Twelve 原文解析验收依赖恢复固定采集路径）。
- 决定记录：与 SIA 同一条（`DEVELOPMENT_PLAN.md` 第 154–156 行，2026-10-02）。
- 牌照：未做 BOT 名录核对（同上 JSON）。
- 能否公开：暂不能。缺：①一次真实成功采集并解析（至少一条带时间戳的现金报价）；②经纬度或确认总店地址的地图点；③BOT 名录核对；④老板撤销下线决定。

## superrich-1965（SuperRich 1965）

- 历史：`git log -S"superrich-1965"` 最早 7ac3b0a（2026-03-08 初版），0575b6e / 8ab0429（2026-03-10）加了 guest feed 探测和混合抓取；它从未进入 `publicCashProviderSlugs`（首版就只有 superrich-thailand、sia、ratchada）。
- 现状：抓取器 `scrapeSuperrich1965()`（`lib/scrapers/cash.ts` 第 178 行起）走 `superrichrate2.ztidev.com` 的 guest token / booking feed，`runCashScrapers()` 仍调用它；但生产实际使用外部采集（`CASH_COLLECTION_MODE=external`，`lib/cash-live.ts` 第 28 行），采集器 `scripts/collect-cash-private.ts` 不含它。`artifacts/cash-cycle-*` 2310 轮里 superrich-1965 零记录，也就是最近 18 天没有任何成功采集证据。静态种子 `data/site.ts` 的 `cashRates` 里只有 2026-03-10 的 USD 100 示例（31.91/32.07），已不能当现价（`DEVELOPMENT_PLAN.md` 第 152 行：「已移除生产路径中的示例报价补位和推算买价」）。
- 公开口径：`lib/cash-live.ts` 里 `includeUnstableProviders` 才会看到它（`tests/cash-live.test.ts` 第 62、79、83 行：默认不含，打开后标 degraded）；牌照 JSON 写明「superrich-1965: separate brand, not in the site's public cash provider set」。分店只有 `Official guest booking feed branch: Head Office` 一个，且数据里明说「exact public walk-in address should be verified」，`hours` 是「Branch hours vary by location; verify with provider before visiting」，`locationPrecision: reference`，坐标是参考点。
- 能否公开：暂不能。缺：①把它加入外部采集器并连续成功（含时间戳）；②确认它与 SuperRich Thailand 是两个独立品牌/不同店面，避免页面里出现两个近似名称的重复条目（会影响实体识别）；③真实门店地址与营业时间（当前是 head-office 参考点）；④BOT 名录核对；⑤老板确认公开范围。

## 要公开其中任何一家，需要的最小动作（本卡不做）

1. 老板书面撤销或修改 2026-10-02 的来源范围决定（sia/vasu），或确认 superrich-1965 的品牌口径。
2. 采集器加入该来源并连续多轮成功，`npm run health:cash` 通过。
3. 取得 BOT 名录核对结果，补 `data/site.ts` 的 `locationPrecision: 'address'` 与经纬度。
4. 再改 `publicCashProviderSlugs` 并同步 `lib/cash-live.ts` 里 `['sia','vasu']` 硬排除、`lib/indexing-policy.ts`、sitemap 条数、`scripts/check-seo-cluster.mjs`。
