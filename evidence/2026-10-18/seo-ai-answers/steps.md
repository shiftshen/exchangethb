# steps（SEO-19 AI 直接答案，2026-10-19 00:41–01:05 +07）
1. 从 5db2a2f 建 worktree r6-wt（分支 seo/ai-answers-20261018，node_modules 软链共享缓存）；共享工作区未动。
2. lib/ai-answers.ts：10 题的答案全部由页面同源缓存（compareCashLive 行：buyRate/denomination/observedAt）现算，文案里无手写数字；店序固定、不排名；48 小时以上的报价不用；同一采集周期（≤15 分钟）内才做并列陈述，否则各列各自时间且声明不作比较。lib/question-pages.ts + app/llms.txt/route.ts 加「## Question to page」表（10 行）。
3. 落地：/{en,th,zh}/cash（首答案段放比较工具之上＋USD/CNY 板块答案段＋FAQ 追加 1 问）、/en|th/money-changers/ratchada（答案段＋FAQ 追加）、/en/money-changers/superrich-thailand（vs 答案＋FAQ 追加）、/en/crypto（cash-vs-crypto 答案段，无 FAQPage 不追加）。canonical/hreflang/其他语言未动。
4. 计数口径：40–70 按 Intl.Segmenter 词元（英文单词、泰文/中文按 ICU 分词，品牌名与数字各算一个）；测试覆盖「同周期」与「不同周期（每家带各自时间）」两种最长形态——首轮 canary 在生产真实数据（Ratchada 取的是官网公布时间，落在 17 Oct）下 6 题超 70，已压缩文案后重发。
5. 本地门禁（r6-wt c2005ad）：tsc 0、eslint 0、vitest 一次 49 文件/202 例、next build ok、本地 41760（含 3 家混合时间的夹具缓存，用后已删）seo:cluster 通过 + validate_ai_answers 0 错误；服务已关。
6. 发布（01:00–01:02）：
   - 1.83：`docker tag exchangethb:v0.1.7-20261018-seo-cash exchangethb:rollback-before-seo-r6-20261019`，digest sha256:5eb4928a2bcb534ecb836ea71f6bf14fc06e295273f662b8ade1e5cf44fcab28（见 rollback-tag.txt）。
   - v0.1.7 save|load 到 2panel-happy → 覆盖构建 `--network none`（app/lib/components/middleware.ts，r6-ctx 与 r6-wt 逐目录 diff 一致）→ 镜像 exchangethb:v0.1.9-20261019-seo-ai-answers（sha256:52dbb41f…16b1b）save|load 回 1.83。（v0.1.8 是第一版，仅上过 canary，被 v0.1.9 取代。）
   - /opt/exchangethb/compose.seo-r6-20261019.yml 追加到链尾（链：docker-compose.yml, release-20261007b, drive-r2-20261016, seo-20261018, seo-r5-20261018, seo-r6-20261019）；`up -d --no-deps web_canary` → healthy → ssh 隧道 seo:cluster + validate 0 错误 → `up -d --no-deps web` healthy 01:01。worker 未动。
7. 公网回读：validate_ai_answers（10 题 0 错误）、seo:cluster 通过、validate_cash_pages.py 扩展（前 8 条 FAQ 与校对稿一致、至多追加 1 条）/en|th|zh/cash 0 错误；Googlebot 与 GPTBot UA 对 7 页 + llms.txt 全 200。
8. GSC（Profile 16，一个 TaskSpace，脚本内 finish）：sitemap 已重交（状态「成功」，已发现 78）；第一条 /en/cash 请求编入索引即「超出了每日配额」，其余跳过——记录不算失败。
9. m390 截图（Chrome 无头 + 390px iframe）：en/cash、th/ratchada、zh/cash、en/crypto 顶部，已看过，答案段在首屏、无溢出/重叠。

## 回退命令（未执行、未需要）
```
ssh 1panel-happy 'cd /opt/exchangethb && C="-f docker-compose.yml -f compose.release-20261007b.yml -f compose.drive-r2-20261016.yml -f compose.seo-20261018.yml -f compose.seo-r5-20261018.yml -f compose.rollback-seo-r6-20261019.yml" && docker compose $C up -d --no-deps web_canary web'
```
compose.rollback-seo-r6-20261019.yml 需先生成：`sed "s/rollback-before-seo-20261018/rollback-before-seo-r6-20261019/" compose.rollback-seo-r5-20261018.yml > compose.rollback-seo-r6-20261019.yml`（镜像 exchangethb:rollback-before-seo-r6-20261019 已在 1.83）。
