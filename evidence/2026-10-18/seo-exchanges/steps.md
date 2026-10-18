# steps
1. r3-wt 建 r4-wt（分支 seo/exchange-profiles-20261018），node_modules 软链共享缓存。
2. lib/exchange-seo.ts：事实全部由 data/site.ts 派生；en/th/zh 手写 meta、首段、3 条差异点、7 条 FAQ；FinancialService + FAQPage（publisher 引 #organization）+ 既有 BreadcrumbList。
3. exchanges/[slug]/page.tsx 渲染首段/差异点/FAQ/比较入口，THB 提现「未公开」展示；去掉重复的 strengths/cautions 卡；indexing-policy 放行 th；sitemap 74→78；llms.txt、check-seo-cluster 同步；/crypto 加 CryptoFeaturedExchanges 内链条（三语）。
4. 同模型子代理校对 12 份文案（th 重点，约 12 条 must-fix），全部改完后重导 copy-dump.md。
5. tsc、eslint、vitest 全量一组（185 例）、npm run build；本地 41740 跑 seo:cluster + validate_exchange_pages.py（0 错误）；390px 截图 bitkub 三语（发现重复卡后改页面再重拍）；本地服务已关。
6. 发布：1.83 tag rollback-before-seo-r4-20261018（=v0.1.5）→ v0.1.5 save|load 到 2panel-happy → 覆盖构建 --network none → save|load 回 1.83 → compose.seo-r4-20261018.yml → web_canary（ssh 隧道跑 cluster+校验，0 错误）→ web → 公网 cluster / 12 页校验 / bot UA。
7. GSC（Profile 16，单 TaskSpace，用完 finish）：站点地图重交成功；请求编入索引被配额挡住。
8. 提交并推送分支；lark-status.json 更新。
