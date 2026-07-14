# ExchangeTHB 全面改版调研与实施规划

更新时间：2026-07-14
数据窗口：2026-06-14 至 2026-07-11（最近完整 28 天）
目标：把 ExchangeTHB 从“批量 SEO 路线页集合”重构为“泰铢兑换决策工具”，先建立真实产品价值，再恢复自然搜索增长。

## 1. 执行摘要

当前 SEO 表现差，不是一个标题或关键词问题，而是四个问题叠加：

1. 流量结构失衡：约 64% 的曝光来自 `Ratchada Exchange` 单一品牌页，核心业务词几乎没有进入前 20。
2. 页面规模超过站点权威度：sitemap 有 129 个 URL，但最近 28 天只有 26 个页面产生曝光，73 个页面正文不足 300 词。
3. 产品价值不够直观：首页和大量落地页先解释概念，真正的价格、净到手、门店距离、营业状态和下一步操作没有成为首屏主体。
4. SEO 执行偏模板化：72 个页面使用 FAQ schema，大量国家、区域、币种页共享相似结构，容易形成“为搜索引擎创建页面”而不是“解决不同用户问题”的信号。

结论：暂停继续扩充 route guide。先收缩索引面、重做首页和两个核心比较工具、建立可验证的转化事件，再选择少量有数据支撑的页面扩展。

## 2. 当前数据基线

### 2.1 Search Console

最近 28 天：

| 指标 | 当前周期 | 上一周期 | 结论 |
|---|---:|---:|---|
| 点击 | 6 | 1 | 绝对量仍非常低 |
| 曝光 | 1,570 | 431 | 增长主要由单一品牌词贡献 |
| CTR | 0.38% | 0.23% | 仍明显偏低 |
| 有曝光页面 | 26 | 24 | 129 个 sitemap URL 中只有少量获得曝光 |

主要页面：

| 页面 | 曝光 | 点击 | 平均排名 | 判断 |
|---|---:|---:|---:|---|
| `/en/money-changers/ratchada` | 1,003 | 4 | 7.38 | 唯一形成可见度的页面，但 CTR 仅 0.40% |
| `/en/cash` | 180 | 0 | 50.58 | 泛词竞争力不足 |
| `/en/routes/btc-to-thb` | 96 | 0 | 55.03 | 工具和权威度均不足 |
| `/` | 84 | 1 | 52.17 | 首页定位不清、关键词过宽 |
| `/en/money-changers/sia` | 44 | 0 | 12.16 | 有接近首页的机会 |
| `/en/exchanges` | 38 | 0 | 73.53 | 交易所 hub 缺少独特数据价值 |

主要查询：

| 查询 | 曝光 | 点击 | 平均排名 | 动作 |
|---|---:|---:|---:|---|
| `ratchada exchange` | 741 | 3 | 7.67 | 保留并强化品牌实体工具 |
| `ratchada exchange rate` | 44 | 0 | 5.80 | 首屏展示最新样本、更新时间和官方核验 |
| 泰文 Ratchada 拼写 | 46 | 0 | 8.74 | 泰文页面与泰文实体信息需强化 |
| `btc to thb` | 25 | 0 | 50.48 | 重构为真正的实时换算/交易路径工具 |
| `thailand crypto exchange` | 15 | 0 | 63.13 | 需要监管、费用、交易对和净到手对比 |
| `currency exchange bangkok` | 11 | 0 | 63.55 | 泛词不应作为短期主战场 |
| `sia money exchange bangkok` | 11 | 0 | 10.82 | 第二优先品牌页 |

国家与设备：

- 泰国贡献 814 次曝光，是当前最主要市场。
- 移动端贡献 997 次曝光，占约 64%，必须采用移动端决策优先设计。
- 桌面平均排名明显更差，说明广泛查询覆盖多但相关性弱。

### 2.2 索引与页面质量

- sitemap URL：129。
- 最近 28 天有曝光页面：26。
- 正文不足 300 词页面：73。
- 带 FAQ schema 页面：72。
- 缺少服务端 `<h1>` 的核心页面：6，分别为三种语言的 `/crypto` 和 `/cash`。
- 核心英文首页、cash、crypto、BTC route 已被 Google 收录，问题不是“完全不收录”，而是“收录后不排名”。
- sitemap API 显示 submitted 129、indexed 0，但单 URL 检查显示核心页已收录。该聚合字段不能单独作为索引结论，应以 URL Inspection 和 GSC 页面报表交叉验证。

### 2.3 线上性能与缓存

- 首页压缩传输约 19KB，解压 HTML 约 130KB。
- 本次实测 TTFB 约 1.0 秒，总响应约 1.28 秒。
- HTML 响应为 `private, no-cache, no-store`，Cloudflare 状态为 `DYNAMIC`。
- 对公开、非个性化页面，这会浪费 CDN 缓存能力并增加服务器响应波动。
- PageSpeed API 在本次审计中配额耗尽，未取得新的实验室指标。历史日志中的移动 Performance 98、SEO 92 不能视为当前结果。

## 3. 根因分析

### 3.1 站点定位过宽

首页同时想覆盖：

- crypto to THB
- Thailand crypto exchange
- Bangkok money changer
- cash exchange
- traveler/expat
- 多国家、多机场、多商圈

新站没有足够权威度支撑这么多主题。Google 最终只在一个低竞争品牌实体词上给出了排名。

### 3.2 真实工具被内容模块淹没

当前首页首屏是品牌说明、CTA、可信度和覆盖范围。用户仍需点击后才能看到：

- 当前汇率或净到手
- 多平台差异
- 更新时间
- 数据是否实时
- 最近门店
- 今日是否营业

竞争页面通常把“答案”放在首屏，把解释放到后面。

### 3.3 Route guide 规模化过早

国家页、机场页、商圈页、币种页采用类似模板。很多页面只有 140–200 词，并使用相似 FAQ 和内链组件。对低权威新站，这会分散抓取、内链和外部信号。

### 3.4 缺少独特、可引用的数据资产

当前页面大多重新组织官方公开信息。缺少能让用户收藏、媒体引用或其他网站链接的资产：

- 历史价差趋势
- 不同金额下的净到手差异
- 更新时间和数据稳定性评分
- 营业状态与距离结合的“当前最佳路线”
- 机场兑换和市区兑换的可量化差异
- 泰国交易所 THB 市场深度、费用和滑点比较

### 3.5 缺少转化与学习闭环

有 GA4 基础事件，但规划中没有明确回答：

- 搜索用户是否修改金额？
- 是否点击官方平台或地图？
- 哪个比较结果最常被选择？
- 数据为 fallback 时是否导致退出？
- 哪个语言、国家、设备产生有效外跳？

没有这些数据，就无法判断页面是“排名差”还是“产品本身不值得点击”。

## 4. 竞品与 SERP 结论

### 4.1 BTC/THB

常见结果由 Coinbase、XE、CoinGecko、Binance 等占据。共同特征：

- 即时价格或换算器首屏可用。
- 支持用户直接输入数量。
- 显示时间范围或历史趋势。
- 品牌与数据可信度强。
- 页面标题准确匹配币对和价格意图。

ExchangeTHB 不应复制纯行情站，而应提供它们缺少的“泰国本地交易路径净到手”：

> 输入 BTC/USDT 数量后，比较在不同泰国平台卖出并提现 THB 的预计净到手、手续费、滑点、市场深度和数据时间。

### 4.2 Bangkok money exchange

常见结果由官方换汇品牌、银行、Wise/Revolut、地图/旅游内容占据。共同特征：

- 官方实时或最近汇率。
- 明确地点、营业时间和地图。
- 支持币种与面额说明。
- 品牌信任和本地实体证据。

ExchangeTHB 的差异化应是：

> 输入现金币种、金额、所在区域和可接受路程，返回“当前可去、净到手更高、信息更新更可靠”的门店路线。

### 4.3 品牌实体词

Ratchada 和 SIA 是当前最有机会的入口，但不能只做“第三方品牌介绍”。页面需要成为实用的品牌状态页：

- 最新观测汇率及时间。
- 与其他品牌的同币种差值。
- 今日营业状态。
- 地址、地图、交通区域。
- 官方网站核验入口。
- 数据源连续性和异常提示。

## 5. 新产品定位

建议定位：

> ExchangeTHB helps you choose the best practical route into Thai baht right now.

中文：

> 根据金额、费用、滑点、营业状态和位置，选择当前更实际的泰铢兑换路径。

只保留两个一级任务：

1. Crypto → THB：比较泰国交易所卖出/买入路径的预计净结果。
2. Cash → THB：比较曼谷换汇门店的预计到手和实际出行成本。

品牌页、路线页、内容页全部服务于这两个工具，不再独立扩张主题。

## 6. 新信息架构

### 6.1 一级导航

- Compare Crypto
- Compare Cash
- Rates & Locations
- How It Works

移除一级导航中的大规模 Routes、Exchanges、Money Changers 目录感。它们可作为工具内筛选、结果详情和页脚入口。

### 6.2 建议索引层

第一阶段只保留约 20–30 个高质量索引 URL：

核心：

- `/en`
- `/en/crypto`
- `/en/cash`
- `/en/methodology`

高价值币种：

- `/en/crypto/btc-to-thb`
- `/en/crypto/usdt-to-thb`
- `/en/crypto/eth-to-thb`

高价值现金币种：

- `/en/cash/usd-to-thb`
- `/en/cash/eur-to-thb`
- `/en/cash/jpy-to-thb`
- `/en/cash/cny-to-thb`

实体：

- Binance TH
- Bitkub
- Orbix
- Upbit Thailand
- Ratchada Exchange
- SIA Money Exchange
- SuperRich Thailand

本地场景只保留有真实门店数据支持的少量页面：

- Bangkok airport vs city exchange
- Pratunam money exchange
- Huai Khwang money exchange

泰文保留核心工具与有本地需求的实体页。中文先保留核心工具和少量已验证页面，不复制全部长尾结构。

### 6.3 合并、noindex 与删除原则

合并：

- 国家来源页合并到对应现金币种页，例如 Germany/Europe → EUR to THB。
- Nana、Asok、Silom、Sukhumvit 等无真实门店覆盖差异的页面合并到 Bangkok location guide。
- BTC route 与 crypto 工具中的 BTC 预设合并为一个强页面。

暂时 noindex：

- 没有曝光、没有独特数据、正文模板化的 route guide。
- 非核心语言的薄内容页。
- 无法提供真实位置或实时信息的区域页。

删除并 301：

- 内容意图完全重复且没有历史点击/外链的页面。
- 旧语言或旧路径只保留单跳 301，不保留多层重定向。

## 7. 页面改版方案

### 7.1 首页

首屏必须直接可操作：

1. 切换：Crypto / Cash。
2. 输入：资产或现金币种、金额。
3. 可选：位置或目标区域。
4. 显示 2–3 条即时结果预览。
5. 明确显示更新时间和 live/fallback 状态。
6. 主 CTA：See full comparison。

首屏之后：

- 今日最明显差价。
- 数据覆盖与更新时间。
- 热门币对/现金币种。
- 三个核心品牌状态。
- 方法论和风险说明。

删除首页大面积“为什么存在”“高意图页面列表”“SEO route guide 列表”等面向搜索引擎的模块。

### 7.2 Crypto 比较工具

首屏组件：

- Buy/Sell 方向。
- Asset。
- Amount。
- 输出币种固定 THB。
- 数据更新时间。

结果表：

- Exchange。
- Gross THB。
- Trading fee。
- Estimated slippage。
- Withdrawal/transfer cost。
- Net THB。
- Market depth confidence。
- Data state。
- Official action。

必须增加：

- 金额变化后即时重排。
- “为什么排名第一”解释。
- 数据异常或 fallback 提示。
- 费用和滑点计算方法。
- 交易所监管/身份要求说明。

### 7.3 Cash 比较工具

首屏组件：

- Currency。
- Cash amount。
- Denomination。
- Current area / BTS / MRT。
- Max travel distance。
- Open now。

结果卡：

- Estimated THB received。
- Difference from best。
- Open/closed。
- Travel distance/time。
- Rate observation time。
- Denomination restriction。
- Map。
- Official confirmation。

核心价值不是“最高汇率”，而是：

> 汇率收益减去出行成本和营业风险后的实际选择。

### 7.4 实体页

每个实体页都需要独特字段，不再只替换品牌名称：

- 当前观测状态。
- 支持币种/交易对。
- 最近更新时间。
- 历史数据稳定性。
- 地址与营业时间。
- 费用或面额条件。
- 与同类服务对比。
- 适合谁、不适合谁。
- 官方核验入口。

### 7.5 内容页

内容页只在满足以下条件时创建：

- 有真实查询数据。
- 有独特工具预设或数据切片。
- 用户问题不能由现有页面完整回答。
- 可提供至少一项独特本地信息。
- 有明确的内部转化路径。

## 8. 视觉与交互方向

当前深色卡片布局信息块过多、层级相似。建议采用“金融终端 + 旅行决策”混合风格：

- 浅色或暖灰主背景，提高白天移动端可读性。
- THB 绿色作为结果与正向差值色，不使用大面积霓虹渐变。
- 首屏以输入和结果为视觉中心。
- 价格、净到手和差值使用大号数字。
- 数据状态、更新时间、来源保持紧邻结果。
- 地图在 cash 工具中成为一级视图，而非外链附属项。
- 移动端采用底部固定 Compare/Map 切换和筛选抽屉。

## 9. 技术 SEO 改造

P0：

- 为 `/crypto`、`/cash` 补充服务端唯一 `<h1>`。
- 收缩 sitemap，只提交可索引高质量 URL。
- 清理批量 FAQ schema，仅保留正文真实维护且有价值的页面。
- 为公开静态/半静态页面设计可缓存策略，避免全站 `private, no-store`。
- 保证 canonical、hreflang、sitemap 三者使用同一 URL 集。
- 所有 noindex 页面从 sitemap 移除。

P1：

- 将核心工具页的默认状态 SSR 输出，确保 Google 能看到真实示例结果。
- 为价格/汇率数据增加 `dateModified`、来源和观测时间。
- 实体页使用与正文一致的 Organization/FinancialService 数据。
- 检查分页、参数 URL、query preset 的 canonical。
- 建立 404、重定向链、5xx、抓取异常自动监控。

P2：

- Core Web Vitals 按真实用户数据优化。
- 对公开结果使用短 TTL + stale-while-revalidate。
- 减少首页 JSON-LD 数量，保留必要 WebSite、Breadcrumb 和少量实体结构。
- 控制 HTML 体积和重复文本组件。

## 10. 数据与分析方案

核心漏斗：

1. Organic landing。
2. Input started。
3. Comparison generated。
4. Result expanded。
5. Official exchange click / map click。
6. Return visit。

必须记录：

- landing page
- query preset
- locale
- device
- currency/asset
- amount bucket
- data state
- selected provider
- result rank
- outbound type

核心 KPI：

产品：

- Comparison generated rate。
- Result-to-outbound CTR。
- Map/official click rate。
- 7 日回访率。

SEO：

- 非品牌曝光占比。
- 前 20 查询数量。
- 核心工具页点击。
- 品牌页 CTR。
- 有曝光页面占 sitemap 比例。

质量：

- Live data coverage。
- Fallback rate。
- 数据更新时间延迟。
- 5xx/抓取错误。
- 移动端 LCP/INP/CLS。

## 11. 12 周实施路线图

### Phase 0：测量与减量（第 1–2 周）

- 冻结新 route guide。
- 导出全部 URL 的 GSC 点击、曝光、索引、外链和更新时间。
- 完成保留/合并/noindex/删除矩阵。
- 补齐 GA4 漏斗事件。
- 修复 H1、缓存、schema 和 sitemap。
- 建立当前转化与性能基线。

验收：

- sitemap 收缩到约 20–30 个高质量 URL。
- noindex 与 sitemap 无冲突。
- 核心工具漏斗事件可验证。
- 生产健康与回滚脚本通过。

### Phase 1：核心工具改版（第 3–6 周）

- 重做首页首屏。
- 重做 Crypto 比较工具。
- 重做 Cash 比较工具。
- 移动端优先完成。
- 增加结果解释、更新时间、状态、外跳。

验收：

- 5 秒内可完成首次比较。
- 移动端无需滚动即可看到输入和首条结果。
- Comparison generated rate ≥ 25%。
- Result-to-outbound CTR ≥ 8%。
- 核心页面无 fallback 伪装为 live。

### Phase 2：实体与高价值页（第 7–9 周）

- 重做 Ratchada、SIA、SuperRich。
- 重做 Binance TH、Bitkub、Orbix、Upbit。
- 重做 BTC、USDT、USD、EUR、JPY 核心落地页。
- 所有页面嵌入工具预设，而不是静态文章。

验收：

- 每页有独特数据字段和决策结论。
- 品牌页 CTR 提升到 1.5% 以上作为首阶段目标。
- 至少 5 个非品牌查询进入前 30。

### Phase 3：权威度与增长（第 10–12 周）

- 发布可引用的数据报告，例如“Bangkok cash rate spread weekly”。
- 建立本地商家数据更新/纠错入口。
- 寻找泰国旅行、expat、crypto 社区的真实引用。
- 只基于 GSC 新增 2–4 个有证据的页面。

验收：

- 非品牌曝光占比持续上升。
- 获得首批相关域名引用。
- sitemap 中有曝光页面比例 ≥ 50%。
- 28 天自然点击达到 50+，再决定是否扩页。

## 12. 发布、灰度与回滚

发布策略：

- 保持现有 web/web_canary 双容器。
- 每个 phase 独立镜像和备份。
- 先 canary 检查页面、API、数据库、canonical、schema、事件，再切正式 web。
- 大规模 URL 收缩前保存完整 sitemap 和重定向映射。

回滚条件：

- 核心工具不可用。
- 线上数据异常或净到手计算错误。
- GSC 出现新增 canonical/重定向错误。
- 5xx 持续超过阈值。
- GA4 核心事件中断。

回滚内容：

- 镜像回滚。
- sitemap 回滚。
- redirect map 回滚。
- 数据库/缓存不随前端改版删除。

## 13. 立即执行的前 10 项

1. 冻结所有新 SEO 路线页。
2. 建立 129 URL 的保留/合并/noindex/删除表。
3. 将 sitemap 收缩到高质量索引层。
4. 为六个核心比较页补 SSR `<h1>`。
5. 删除无必要的批量 FAQ schema。
6. 修复公开页面缓存策略。
7. 补齐 GA4 比较漏斗和外跳事件。
8. 输出首页、Crypto、Cash 三个移动端线框。
9. 先实现一个统一 Comparison Result 组件。
10. 用 canary 发布首页 + Cash 工具 MVP，再观察 14 天。

## 14. 不建议继续做的事情

- 不继续批量生成国家、机场、商圈、币种页面。
- 不把 meta keywords 当成排名手段。
- 不用增加字数替代真实数据价值。
- 不在大量薄页上挂 FAQ schema。
- 不同时扩展更多语言。
- 不以“已收录”作为成功指标。
- 不在没有转化数据的情况下继续频繁改标题。

## 15. 决策结论

建议批准“产品型改版”，而不是继续做一轮传统 SEO 文案优化。

第一优先级是 Cash 比较工具，因为当前已有 Ratchada/SIA 品牌可见度、线下位置和营业信息，也更容易形成 ExchangeTHB 独有的“汇率 + 路程 + 营业状态”决策价值。

第二优先级是 Crypto → THB 净到手工具。它必须和普通行情换算器区分，突出泰国本地交易所、费用、滑点、深度和提现后的最终 THB。

只有当核心工具产生真实使用和外跳后，SEO 内容扩展才有可复制的基础。
