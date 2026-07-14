# ExchangeTHB URL 处置矩阵

更新时间：2026-07-14
目标索引规模：29 个 URL

## 保留索引

### 核心工具（9）

- `/en`、`/th`、`/zh`
- `/en/cash`、`/th/cash`、`/zh/cash`
- `/en/crypto`、`/th/crypto`、`/zh/crypto`

### 法务与方法（6）

- 三种语言的 `/legal/methodology`
- 三种语言的 `/legal/disclaimer`

### 英文交易所实体（4）

- Binance TH
- Bitkub
- Upbit Thailand
- Orbix

### 英文与泰文换汇商实体（6）

- Ratchada Exchange
- SIA Money Exchange
- SuperRich Thailand

### 暂时保留的英文路线页（4）

- `btc-to-thb`
- `usdt-to-thb`
- `usd-cash-to-thb`
- `bangkok-airport-money-exchange-guide`

保留原因：已有查询或点击信号，且能直接导向核心比较工具。第二阶段应将这些页面改为工具预设入口，而不是继续维持文章模板。

## 保留访问但 noindex,follow

- `/[locale]/routes`
- `/[locale]/exchanges`
- `/[locale]/money-changers`
- 除上述 4 个英文路线外的全部 route guide
- 中文交易所详情
- 泰文交易所详情
- 中文换汇商详情
- `/legal/privacy-policy`

这些 URL 暂不删除，避免破坏已有链接和用户访问；它们从 sitemap 移除，并通过页面 metadata 输出 `noindex,follow`。

## 已实施的合并与永久重定向

| 旧页面类型 | 目标页面 |
|---|---|
| Germany / Europe money exchange | `/[locale]/cash?currency=EUR` |
| Japan money exchange | `/[locale]/cash?currency=JPY` |
| US money exchange | `/[locale]/cash?currency=USD` |
| UK money exchange | `/[locale]/cash?currency=GBP` |
| EUR / JPY / CNY / GBP cash route | 对应 Cash 工具 preset |
| ETH / XRP / DOGE / SOL route | 对应 Crypto 工具 preset |
| Nana / Asok / Silom / Sukhumvit | `/[locale]/cash` |
| Pratunam / Central / near-me | `/[locale]/cash` |
| Suvarnabhumi / Don Mueang | `/[locale]/cash` |

以上路径由 middleware 返回单跳 `301`，保留原语言并清理旧 query，再写入工具所需 preset。

继续保留索引且不重定向：

- BTC to THB
- USDT to THB
- USD cash to THB
- Bangkok airport money exchange guide

后续新增 301 的执行条件：

1. 目标工具支持同等或更强的用户任务。
2. GSC 确认旧 URL 没有独立高价值查询。
3. 保存旧 URL 到新 URL 的单跳映射。
4. sitemap、canonical、hreflang 同步更新。

## 删除条件

只有同时满足以下条件才返回 410 或删除：

- 28–90 天无点击、无曝光或曝光无关。
- 无外链、无收藏、无业务入口。
- 无法映射到任何真实用户任务。
- 不需要作为历史重定向入口。

当前阶段不直接删除 URL，先观察 noindex 和 sitemap 收缩效果。
