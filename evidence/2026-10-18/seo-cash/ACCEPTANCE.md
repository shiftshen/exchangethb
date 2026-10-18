# SEO-12 验收（/cash 承接页，2026-10-18 22:5x +07）

结论：硬验收 1–4 全部通过；GSC（软）请求编入索引被配额挡住。

| # | 验收项 | 结果 | 证据 |
|---|---|---|---|
| 1 | 公网 /th|en|zh/cash 新段落与 FAQ 在线，结构校验 0 错误，canonical 不变 | 通过：每页 answer-first 段 + 4 个币种问句 H2 + 8 条可见 FAQ + FAQPage（publisher 引 #organization，问答文本均在页面可见文本中）；canonical 自指未变，hreflang en/th/zh/x-default；10 语 /cash 200；Googlebot/GPTBot UA 10×200 | schema-validation-prod.json（error_count 0）、seo-cluster-prod.log、public-readback-bots.txt |
| 2 | 测试/构建/seo:cluster（canary+prod）、回退标签与 digest | 通过：tsc 干净、eslint 0、vitest 48 文件 193 例（新增 8 例）、build ok；cluster 本地/canary/prod 均过 | seo-cluster-*.log、build.log、SUMMARY.json |
| 3 | hidden-providers.md 每家有结论和依据路径 | 通过：sia / vasu / superrich-1965 均「暂不能公开」，各写明缺什么、依据文件与行 | hidden-providers.md |
| 4 | 3 张 390px 截图无错乱 | 通过（en/th/zh 全页逐张查看） | screens/m390-{en,th,zh}-cash.png |

发布：v0.1.6-20261018-seo-exchanges → v0.1.7-20261018-seo-cash（sha256:5eb4928a…）。回退标签 exchangethb:rollback-before-seo-r5-20261018 = v0.1.6，digest sha256:f79ec3b8…（与 v0.1.6 一致，已在 1.83 实测）。canary 22:52 healthy → web 22:54 healthy；worker 未动。回退命令已备（compose.rollback-seo-r5-20261018.yml），未执行、不需要。

内容：数据派生——店名/区域/营业时间/币种数全部来自 data/site.ts，每币种的收购汇率、纸币条件、观测时间来自现有现金缓存（与比较工具同源），文案无手写数字，无「最佳/最便宜」（单测强制）。币种段固定店序、不排名，链接 /{locale}/cash?currency=XXX；无报价的店单独说明。title 三语加入 CNY；其余 7 语未动；canonical/query 规则未动；未碰 Ratchada 与交易所页、汇率逻辑、联盟链接。th/zh 经同模型子代理逐句校对（9 条 must-fix 全采纳）。

GSC：Profile 16 一个 TaskSpace（已 finish）；/th/cash 第一条即返回「出了点问题」（配额耗尽特征），en/zh 未再试，下个重置后按 th→en→zh 重试。

未做/注意：结果指标（/cash 各语言展示与均位）留 11-01 复盘；lark-status.json 本卡未更新；会话输出里曾出现一次 docker compose config 的 worker 管理员会话密钥与密码哈希（未写入任何文件），建议择机轮换 ADMIN_SESSION_SECRET。分支 seo/cash-hub-20261018，未合并 main。
