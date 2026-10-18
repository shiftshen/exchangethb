# ACCEPTANCE — SEO-19（结论：通过；GSC 请求编入索引因配额记录）
时间：2026-10-19 01:05 +07。生产：exchangethb:v0.1.9-20261019-seo-ai-answers（sha256:52dbb41f831b0b9b27d2efdf3a2a5479f0a17e052784118f1fd8ca23ad416b1b），回退标签 exchangethb:rollback-before-seo-r6-20261019（sha256:5eb4928a2bcb534ecb836ea71f6bf14fc06e295273f662b8ade1e5cf44fcab28）。

| 验收项 | 结果 | 证据 |
|---|---|---|
| 10 题对应页（各自语言）有答案段、40–70 词元、带时间戳与来源（本站采集各店） | 通过：单元数 66/53/55/66/69/65/70/65/68/58 | validation-prod.json、question-page-map.csv |
| FAQPage 0 错误；问答与可见文字一致 | 通过：validate_ai_answers + validate_cash_pages.py（/en,th,zh/cash 各 9 条 FAQ，前 8 条同校对稿）0 错误；Q1/Q6/Q9 已有 FAQ 第1条只记录 | validation-prod.json、schema-validation-prod.json |
| canonical / hreflang 不变 | 通过：与发布前生产基线逐页一致 | canonical-hreflang-baseline.json |
| Googlebot / GPTBot UA | 通过：7 页 + llms.txt 全 200 | validation-prod.json → bots |
| llms.txt 问题→网址表 | 通过：10 行 | validation-prod.json → llms |
| 门禁 tsc/eslint/vitest/build/seo:cluster | 本地：全过（vitest 一次 202 例，gates-local.log、build.log、seo-cluster-local.log）；canary：容器内 next build 通过 + 隧道 seo:cluster + 答案校验 0 错误（seo-cluster-canary.log、validation-canary.json）；生产：seo:cluster 通过 + 校验 0 错误（seo-cluster-prod.log、validation-prod.json）。tsc/eslint/vitest 为源码级，同一提交 c2005ad 只在本地跑一次，canary/生产不重复 | 同左 |
| rollback 标签与 digest | 已记 | rollback-tag.txt、steps.md |
| m390 截图 en/th/zh | 通过：已看，无版式问题 | screens/ |
| GSC | sitemap 已重交（成功，78 个）；请求编入索引首条即「超出了每日配额」，其余跳过，记录不算失败 | gsc/run.log |

## 红线核对
- 只用页面已有真实数据：答案数字全部来自同一缓存，无手写价格/排名/「最好」；Q4 明确「不指名单一赢家」。
- 对比竞品只做同一采集周期事实陈述：生产当前 Ratchada 取官网公布时间（17 Oct 17:00），与另两家不在同一周期，故 Q3 页面写「未在同一时间观测，不做直接比较」并各列各自时间——这是按规则的正确行为。
- 未提 superrich-1965 / sia / vasu：答案与 llms 表均无，验证脚本检查通过。

## 已知取舍
- 单元数口径为 Intl.Segmenter 词元（见 steps.md 第 4 条）；最长形态（3 家且时间不同）Q07=70，贴上限，未来若多一家店需再压缩（tests/ai-answers.test.ts 的「不同周期」用例会在 CI 报警）。
- Q5 加密侧只陈述比较维度与交易所数（4），没有加密实时价（该页行情由比较工具现算，不写进静态答案）。
