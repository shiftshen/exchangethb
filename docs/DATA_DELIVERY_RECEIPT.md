# ExchangeTHB 数据与运维开发交付

## 结果

当前分支 codex/mobile-simplification 完成手机简化、现金买卖及面额筛选、实时/参考隔离、现金采集失败保留原时间、订单簿排序/时效/数值校验、可选行情自动刷新、证据评比替代固定分、Google 分店口碑受控接口、公开数据状态页、后台证据编辑和 worker 降级处理。手续费缺证据时明确为估算，Google 未接入时明确状态，新增门店没有伪造经纬度或0公里距离。

流量接管使用用户指定的 fujane110@gmail.com / Profile16。Search Console 已完成域名所有权验证；Cloudflare 原自动统计生产接收已验证；GA4 账号/媒体资源/网站流已创建并收到预览测试事件，推广/官网跳转配置关键事件。每天09:00 Bangkok运维 heartbeat 已保存 ACTIVE，首次计划执行尚未验收。统计同意可撤回，精确金额/坐标/秘密查询参数不进入埋点，预先约定的渠道标签可以归因。

## 入口

预览：http://127.0.0.1:3104/zh
规划：DEVELOPMENT_PLAN.md
推广运维：PROMOTION_OPERATIONS_PLAN.md
平台实测：SITE_OPERATIONS_EVIDENCE.md、artifacts/ga4-realtime-test.json 与截图
手机证据：browser-layout-evidence.json、mobile-first-screen.png、desktop-preview.png
生产差异保护：PRODUCTION_VERSION_REVIEW.md、production-version-evidence.json

## 验证

- 21 个测试文件、63 项测试通过，含订单簿/时效、现金更新失败保真、买卖方向、面额过滤、Google 配置/身份/作者/原文校验、统计隐私及同意后初始事件队列。
- 类型检查与 lint 通过；生产构建成功，129 页生成。Docker 补齐 GA4 构建参数，避免只设置运行时环境却未写入客户端包。
- SEO 检查通过，sitemap 33 URL，旧路线跳转和 canonical 保留；数据状态页不索引，后台仍受认证。
- 360/390 宽度 × 中/英/泰 × 首页/现金/加密，18组无横向溢出，比较按钮首屏可见；后续16px语言输入、买外币/面额/渠道标签、未接入Google状态复验。
- 浏览器真实加密报价可用；无效或过期来源降为参考，巨额数量只显示可成交部分及未成交数量。现金本机没有生产缓存，展示种子参考，不能作为实时门店验收。
- GA4 实时报告实收 page_view、comparison_started、comparison_success；Cloudflare 生产 beacon 204 且面板有访问/页面浏览。测试流量与生产流量分别标注。
- 未登录后台配置接口401，未知provider404；发布回退脚本离线测试通过。

## 未验证及下一步

正式重构与 GA4 生产标签尚未切换；生产21项旧修改保持原状，需按已准备的制品和回退方案发布，不直接覆盖现场checkout。Vasu/Twelve 解析器及代表性fixture已完成，固定采集代理六容器当前 unhealthy/proxy_blocked，真实原文验收尚未完成。Google Places 缺经过授权的计费资源/key/分店身份验证，仅接口与合约测试完成，无真实评论。真实手机硬件和每日监控首次执行未验收。

不承诺实时准确最终成交、资金安全分数、推荐佣金或注册转化。开发、平台资产、正式发布、平台接收四个状态单独记录。事实已按SHA锁回写统一registry与DSH-HANDOFF，未复制凭据或生产数据。

## 发布制品额外验收

Docker 发布镜像 exchangethb:codex-20261001 已构建，129页、lint/type检查通过。镜像内 Node20/Linux 环境再次运行21文件63测试，全部通过。镜像 linux/arm64，仅用于本机预览；生产必须从同一源码制品按服务器架构重新构建，不能把本机架构验收当服务器发布完成。当前预览3104已切换为本任务测试镜像，无生产数据库/凭据挂载，启动时不做数据库迁移。

源码交付 artifacts/release/exchangethb-release-20261001.tar.gz 与 release-manifest.json；只包含源码/开发文档/锁文件，排除秘密、缓存、验收截图，不含生产DB。源码SHA与镜像记录供正式发布时核对。日报监测首次自动运行仍待验收。

## 2026-10-02 币种、自动筛选与三语声明更新

- 当前预览：127.0.0.1:3104，自有容器 exchangethb-codex-preview；镜像 exchangethb:codex-20261002（b71b773aa747de567b15b769812733b29fbb65133750c96dd0d3cb2a6be08162）。生产仍未切换。
- 现金15币种、加密15资产查询；额外资产无有效官方报价时空结果，无编造seed。选择变化自动查询，数字输入400ms防抖；筛选勾选立即生效。失败允许重试，无日常必点比较按钮。
- 三语说明/商业关系披露及完整第三方法律声明；修复核心页面SSR HTML语言标记（原force-static令headers丢失）和语言切换后document.lang。已回读zh/th/en的HTML lang和Content-Language一致。
- 67测试/22文件通过；类型、lint、Docker构建、SEO cluster通过。Ego 390x844手机实测SGD与2500金额自动调用API、勾选营业筛选、无横向溢出。三语言USDC自动选择测试使用明确标记的模拟API响应，仅证明交互，不证明平台上架/真实报价。证据 artifacts/automatic-comparison-20261002.json、mobile-auto-comparison-20261002.png（语言标记修复前浏览器证据保留历史，修复后SSR回读通过）。
- 当前固定采集代理仍proxy_blocked，不换出口；新增现金真实采集仍待验收。现金经营牌照须BOT按法人/网点核验；不得把未核验店铺称为已核验正规推荐。SEC官方当前目录确认四个既有交易所名称及官方域名。
- 官方返佣核验见 REFERRAL_VERIFICATION_2026-10-02.md：Orbix个人邀请最高200THB/人有条件；BinanceTH暂停；Bitkub调整中；Upbit/换汇店未确认公开佣金。
