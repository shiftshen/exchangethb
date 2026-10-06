# ExchangeTHB 当前完整交付验收矩阵

核对时间：2026-10-02T11:22:55.765Z；正式镜像97f0619c，完整目标保持不变。历史失败和后续修复分别保留，不把未核验项视为完成。

|要求|状态与验证范围|权威证据|
|---|---|---|
|固定代理真实现金采集及自动更新|三保留来源31/31/5自然循环成功；原launchd/18888；失败不换出口、不补价|现金collector日志、current-freshness-cache-20261002.json|
|现金15币种×买卖2方向|最新正式实例30组合200、有current、算术0错误、无Vasu/SIA|final-cash-matrix-20261002.json|
|加密15资产×2方向|最新正式镜像完整30组合200、28有live；LTC双向无有效报价如实空；所有返回报价的新鲜度/普通交易费/买卖金额复算0错误|final-crypto-matrix-20261002.json；market-diagnostics-guard-worker-20261002.json|
|费用/排序/来源时效|113项全套测试通过；BTC旧覆盖修正真实4家0.25/0.25/0.15/0.25；未知提币/部分THB提款不能称免费；银行提款范围明确|btc-fee-override-buy-production-20261002.json；fee与ranking测试|
|十语手机与语言币种|10语390px现金/加密此前实渲染；最新中文SGD390无溢出；语言偏好、金额/方向和加密资产保持测试已过；不支持本币默认USD|ten-language-current-mobile-20261002.json；ten-language-crypto-mobile-20261002.json；market-diagnostics-guard-production-mobile-20261002.json|
|真实手机定位/导航|HONOR真机精确位置一次授权，误差18m、真实距离与原生地图已验；不是电脑定位或模拟位置代替|phone-location-verified-20261002.json|
|Maps/Places实接入|110账号专用受限服务端key真实评论成功，最多5条且带归属；共享计数限额，不持久缓存评论；不能保证金钱硬上限|current-maps-state-20261002.json；google-places-final-acceptance-20261002.json；Google额度测试|
|十语SEO/索引|最新镜像SEO集群退出0、sitemap64；GSC提交与搜索回读已有实证；不是保证收录/排名|market-diagnostics-guard-seo-20261002.log；site operations evidence|
|统计与漏斗|GA4真实生产测试事件已接收；Cloudflare24小时指标含测试流量；拒绝同意不加载GA；未把测试当获客、PV/会话/搜索点击不相加|ga4-realtime-current-20261002.json；cloudflare-current-20261002.json|
|正规第三方/返佣|四交易所SEC法人域名已匹配；现金当前资质尚unknown，BOT PDF日期2023不能升格；当前外链official_only，个人推荐活动不等于本站资格或点击收入|cash-license-history-audit-20261002.json；REFERRAL_VERIFICATION_2026-10-02.md|
|AdSense及同意流程|所有权和审核请求完成，仍正在准备；站点限定CMP6语已发布但实际__tcfapi undefined/dialog0/unfilled；未完成收入资格及实际弹窗|adsense-cmp-published-current-20261002.txt；adsense-cmp-runtime-current-20261002.json|
|运维/版本/备份|web/canary/worker同97f0619c健康，Postgres不变；认证401/外部健康只读缓存；受限数据库快照、完整归档解码及隔离真实恢复通过；七应用表记录数一致，旧费用修正亦已恢复，测试容器已清理；未配置自动备份|market-diagnostics-guard-production-admin-20261002.json；current-database-backup-20261002.json|

当前不能标全目标complete：现金当前资质、广告最终审核/实际CMP仍需分别核对。自动备份尚未部署，不把一次受限备份称为长期自动保护。真实付款与Google Play另行记录，不把手机登录或Cloud API可用视为商店已发布。

证据目录：/Volumes/M2USB/Projects/exchangethb.com/artifacts；完整演变见CURRENT_ACCEPTANCE_AUDIT.md和DELIVERY_RECEIPT.md。
