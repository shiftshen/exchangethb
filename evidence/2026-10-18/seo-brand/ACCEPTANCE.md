# SEO 品牌实体卡 验收（2026-10-18）

**结论：硬验收 1–5 全部通过；软项 GSC 请求编入索引被每日配额挡住，站点地图已重交。**

| # | 验收 | 结果 | 证据 |
|---|---|---|---|
| 1 | 公网 10 语言首页 title 以 ExchangeTHB 开头 | 通过 | public-readback-titles.txt（curl 原文） |
| 2 | 首页 JSON-LD 有 WebSite+Organization，@id 互相引用，校验 0 错误 | 通过 | schema-validation-prod.json（error_count 0；首页只有一个 Organization） |
| 3 | /en /th /zh about 200、自 canonical、在 sitemap、无编造数字 | 通过 | public-readback-about-ua.txt；单测断言正文无数字；sitemap 74 条含 3 条 about |
| 4 | 测试/构建/seo:cluster（canary+prod）、回退标签与 digest | 通过 | tsc 干净、eslint 0、vitest 46 文件/174 例；seo-cluster-canary.log / seo-cluster-prod.log；回退 exchangethb:rollback-before-seo-r3-20261018 = sha256:ee44f09f…（v0.1.4）；新镜像 v0.1.5-20261018-seo-brand = sha256:aa2c1ba9… |
| 5 | 6 张 390px 截图无错乱 | 通过 | screens/m390-{en,th,zh}-{home,about}.png（首拍 about 是暗色旧样式，已把 /about 加入 PublicMain 简洁页白名单，发布前重拍并复核，截图即最终版） |

## 改动
- 首页 title 改「ExchangeTHB – …」（≤60 字符，10 语言），description 首句「ExchangeTHB (exchangethb.com) …」，openGraph siteName，seo-answer 段首句加品牌定义。
- JSON-LD：首页 @graph = WebSite + Organization + Breadcrumb + FAQ；Organization 增加 @id、alternateName、description、logo(ImageObject)；其他页面的 Organization 同 @id。
- 新页 /{en,th,zh}/about（AboutPage JSON-LD，about→#organization）；其余语言 noindex、canonical 回 /en/about；页脚、llms.txt、sitemap（71→74）、check-seo-cluster 同步。
- 7 种语言的新增句由同模型子代理校对，采纳 3 处修正（ja 描述、ru/de 标题）。

## 发布
v0.1.4 → v0.1.5：先 web_canary（healthy，cluster+schema 通过）再 web（healthy）；worker 未动。回退命令见 SUMMARY.json，未执行、未需要。

## GSC
请求编入索引：/en、/th、/en/about、/th/money-changers/ratchada、/en/money-changers/superrich-thailand、/en/money-changers/twelve-victory、/th/cash 均被配额拒绝（不算失败，次日重试）。站点地图重交成功，GSC 显示已提交 74 个网址。

## 未做 / 两周后看
/zh/about 请求编入索引；GSC 出现含 exchangethb 的查询、搜 exchangethb 首页进前 10 由 SEO 负责人两周后看。sameAs 按 D2 保持空。
