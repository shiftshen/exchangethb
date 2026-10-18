# steps（SEO-12 /cash 承接页，2026-10-18 22:36–22:56 +07）
1. 从 seo/exchange-profiles-20261018（= 生产源 fa10fcf）建 worktree r5-wt，分支 seo/cash-hub-20261018，node_modules 软链共享缓存；共享工作区未碰。
2. lib/cash-hub-seo.ts：en/th/zh 手写 answer-first 段、USD/EUR/JPY/CNY 四段（问句 H2）、8 条 FAQ（问题答案全部可见）、FAQPage JSON-LD（publisher 引 #organization）；店名/区域/营业时间/币种数全部由 data/site.ts 派生，文案里无手写数字。components/cash-hub.tsx：每币种用 compareCashLive 读现有缓存渲染观测收购汇率+纸币条件+观测时间（固定店序、不排名），链接 /{locale}/cash?currency=XXX。app/[locale]/cash/page.tsx：en/th/zh 加三块并更新 title（加 CNY）/description；canonical、robots、其他 7 语不动。
3. 同模型子代理逐句校对 th/zh 一次：9 条 must-fix + 若干 polish，已全部采纳（th 列表逗号、th 币种语序、zh 顿号、zh 「官方标示」去掉等），copy-dump.md 重导。
4. tsc 干净、eslint 0、vitest 一组 48 文件/193 例（新增 tests/cash-hub-seo.test.ts 8 例：FAQ≥5 且可见、无硬编码数字、无「最佳/最便宜」、JSON-LD=可见文本、canonical 与他语不变）；npm run build ok；本地 41750 seo:cluster 通过 + validate_cash_pages.py 0 错误；390px 截图 en/th/zh（Chrome 无头 + 390px iframe）；本地服务已关。check-seo-cluster.mjs 新增 /en|th|zh/cash 断言。
5. 发布：1.83 tag exchangethb:rollback-before-seo-r5-20261018 → v0.1.6 save|load 到 2panel-happy → 覆盖构建（--network none，app/lib/components/middleware.ts，r5-ctx 与 r5-wt 逐目录 diff 一致）→ 镜像 v0.1.7-20261018-seo-cash save|load 回 1.83 → compose.seo-r5-20261018.yml → web_canary healthy 22:52 → 隧道 seo:cluster + validate_cash_pages 0 错误 → web healthy 22:54 → 公网 cluster / 10 语 /cash 200 / validate 0 错误 / Googlebot+GPTBot UA 10×200。
6. 只读核查 superrich-1965 / sia / vasu → hidden-providers.md（不改代码，不公开新店）。
7. GSC（Profile 16，一个 TaskSpace，脚本内 finish）：/th/cash 第一条即返回「出了点问题」（配额耗尽特征），en/zh 未再试；记录不算失败。
8. commit + push 分支 seo/cash-hub-20261018。
