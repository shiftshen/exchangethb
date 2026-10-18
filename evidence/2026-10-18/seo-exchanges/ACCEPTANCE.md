# SEO-7 验收（交易所页 4×3，2026-10-18 21:2x +07）

结论：硬验收 1–4 全部通过；GSC（软）请求编入索引被配额挡住，站点地图已重交。

| # | 验收项 | 结果 | 证据 |
|---|---|---|---|
| 1 | 公网 12 个交易所页 200、新 title、自 canonical、hreflang en/th/zh/x-default | 通过（GPTBot / Googlebot UA 同为 12×200，无 noindex） | public-readback-titles.txt、public-readback-bots.txt |
| 2 | 结构校验 0 错误、FAQ 问题全部页面可见、无 data/site.ts 以外的数字 | 通过：每页 Organization+Breadcrumb+FinancialService+FAQPage，7 条 FAQ，问题与答案均在可见文本中；单测逐个数字比对 data | schema-validation-prod.json（error_count 0）、tests/exchange-seo.test.ts |
| 3 | 测试/构建/seo:cluster（canary+prod）、回退标签与 digest | 通过：tsc 干净、eslint 0、vitest 47 文件 185 例、build ok；cluster 本地/canary/prod 均过（sitemap 78） | seo-cluster-*.log、SUMMARY.json |
| 4 | 3 张 390px 截图无错乱 | 通过（en/th/zh bitkub 已逐张查看） | screens/ |

发布：v0.1.5 → v0.1.6-20261018-seo-exchanges（sha256:f79ec3b8…）。回退标签 exchangethb:rollback-before-seo-r4-20261018 = v0.1.5，digest sha256:aa2c1ba9…（与 v0.1.5 一致）。canary 21:11 healthy → web 21:12 healthy；worker 未动。回退命令已备好未执行，见 SUMMARY.json。

内容：title 交易所名开头（en Fees / th ค่าธรรมเนียมเทรด / zh 手续费），均 ≤60 字符；首段直接给出手续费、THB 提现费、牌照；每家 3 条差异点；7 条 FAQ（费率、提现、怎么入金、牌照、资产、费率对比、示例是否实时）。事实只来自 data/site.ts：Upbit/Orbix 的 THB 提现费数据里是「未公开」，页面写「未公开」，不写数字也不写免费；入金步骤/额度数据里没有，FAQ 如实说明并指向官网（D1）。th 版本放行索引，sitemap 74→78，/crypto 三语加 4 个交易所内链，llms.txt 同步。同模型子代理逐句校对（th 为重点）后已全部修正。

GSC（Profile 16，一个 TaskSpace，已 finish）：站点地图重交成功；请求编入索引第一条即返回「出了点问题」（配额耗尽特征），其余 11 条未再试。待下个重置后按 SUMMARY.json 的优先级重试。

未做/注意：Ratchada 页未动（D4）；非 en/th/zh 的 7 个语种没有交易所详情页，故 /crypto 内链条只在三语出现；结果指标（交易所页展示量、crypto 类查询均位）留 11-01 复盘。分支 seo/exchange-profiles-20261018，未合并 main。
