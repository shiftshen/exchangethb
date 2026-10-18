# steps
1. r2-wt 建 r3-wt（分支 seo/brand-entity-20261018），node_modules 软链共享缓存。
2. lib/brand-entity.ts 集中品牌文案；lib/seo.ts 增 @id、WebSite/Organization 节点、AboutPage；首页 page.tsx 输出 @graph；app/layout.tsx 首页跳过自身 Organization（middleware 加 x-public-home 头）。
3. /[locale]/about、indexing-policy、sitemap、llms.txt、页脚、check-seo-cluster 同步（URL 71→74）。
4. 测试：tsc、eslint、vitest 全量一组；新增 tests/brand-entity.test.ts（8 例）；npm run build；本地 41730 跑 seo:cluster + 截图（发现 about 暗色样式，改 PublicMain 后重拍）。
5. 子代理校对 7 语言（修 3 处）。
6. 发布：docker tag rollback-before-seo-r3-20261018（=v0.1.4）→ 2panel-happy 构建 → save|load → compose.seo-r3-20261018.yml → canary（ssh 隧道跑 cluster+schema）→ web → 公网 cluster/schema/curl。
7. GSC（Profile 16，各一个 TaskSpace，用完 finish）：请求编入索引被配额拒；重交 sitemap 成功（74）。
8. 提交并推送分支。
