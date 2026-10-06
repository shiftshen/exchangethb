# ExchangeTHB 简洁手机比较界面交付 · 2026-10-01

## 交付回执

- 结果：已完成本次首页、现金与加密比较界面的开发及本地测试。用户现在可在本机预览，正式网站尚未切换。
- 入口：http://127.0.0.1:3104/zh；分支 `codex/mobile-simplification`，基于 GitHub `873beb6`，当前修改尚未提交或推送。实施计划见 `IMPLEMENTATION_PLAN.md`，调研及后续完整路线见 `RECONSTRUCTION_PLAN_2026-10-01_CN.md`。
- 验证：受管 Node v26.10.0、Next.js 15.5.20。本轮最终构建生成 128 个页面成功；`tsc --noEmit`、`eslint . --max-warnings=0`、`git diff --check` 通过；Vitest 16 个文件、48 项测试全部通过。`bash tests/release-web-canary.test.sh` 使用模拟部署工具通过，未部署真实容器。
- 验证：Ego Lite 独立 TaskSpace 5，访问本机生产构建；360px/390px × 中英泰 × 首页/现金/加密共 18 组检查均无横向溢出、比较按钮在 844px 首屏内、主要选择和提交控件至少 44px。证据 `browser-layout-evidence.json`；390px 截图 `mobile-first-screen.png`、`mobile-preview.png`，1440px 截图 `desktop-preview.png`。这些是浏览器手机尺寸模拟，未在真实手机硬件测试。
- 验证：实际现金接口返回种子参考数据并明确显示“仅供参考”；实际 BTC 0.01 买入接口返回报价，Orbix、Binance TH、Upbit 为实时来源，Bitkub 当次备用数据独立列为参考。币种 EUR、小数 250.5、买卖切换、语言切换保留参数、零金额拦截、键盘 Tab 和距离排序通过浏览器操作验证。
- 验证：仅在 localhost 的浏览器内临时模拟 503、空结果、定位拒绝及故意忽略取消的慢请求；验证错误可重试、111 的慢响应不会覆盖 222 的新结果，空结果和定位失败有明确提示。浏览器模拟时钟前移 31 分钟后，现有现金报价在周期检查中降为参考，不再标最高。页面重新加载清除了所有模拟，测试空间已关闭。
- 验证：模拟 `gtag` 接收比较开始及成功事件，只记录金额区间，不发送精确金额或经纬度；这不代表 GA4 已收到事件。`scripts/check-seo-cluster.mjs http://127.0.0.1:3104` 的 9 个路由/索引检查通过，包含正式 canonical、sitemap 29 条及旧路线跳转。
- 未验证与剩余：没有正式生产发布、真实手机硬件验收、生产数据库接入或生产现金缓存验收；GA4/GSC 真正接收尚未验证；推广奖励账户资格和收益未验证。生产 21 个现场文件差异已逐文件比对记录，见 `PRODUCTION_VERSION_REVIEW.md`；正式切换前需重新检查并走 canary 验收。详情页沿用原有内容布局，不属于这次核心比较页简化范围。

## 已实现的行为

一个比较工具统一现金与加密入口；原生币种选择、数字键盘、买卖方向；主要结果最多先展示三条；距离、营业筛选、费用和来源按需展开。输入改变时立即收起上一组结果；请求取消和竞态保护；过期报价不推荐；位置参数不保留在分享地址里。修复现金接口 `openOnly=false` 被当成 true 的问题，以及推广有效期单边设置被错误判无效的问题。

## 复核命令

运行工具链前缀：`/Users/shift/.local/state/dsh-infrastructure/control/bin/agent-control runtime exec node --`。

- 类型：`node_modules/typescript/bin/tsc --noEmit`
- 测试：`node_modules/vitest/vitest.mjs run`
- 代码检查：`node_modules/eslint/bin/eslint.js . --max-warnings=0`
- 构建：`node_modules/next/dist/bin/next build`
- 本地预览：`node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3104`
- SEO：`scripts/check-seo-cluster.mjs http://127.0.0.1:3104`

浏览器流程使用 Ego Lite 既有登记环境与一个独立任务空间，未运行仓库旧版 Playwright 截图脚本。依赖安装提示 11 项已有审计问题，未自动升级整个依赖树；构建提示浏览器兼容数据库过旧，未影响上述检查。

## 2026-10-02 最终SEO与日文制品

核心首页、现金与加密流程支持英/泰/中/日；日文方法、声明、隐私、数据状态已翻译。四语搜索标题、使用问答、互指hreflang及38条新版sitemap；次级日文资料显式307转英文，避免将未翻译英文作为日文索引。日文手机390px无横向溢出，选择与输入自动比较，文字对比度问题修复。

最终依赖Next15.5.27、sharp0.35.5、postcss8.5.28。67项/22文件Vitest通过、类型/lint/diff检查通过、本机与1Panel均162页面生产构建成功；两环境SEO检查通过。生产依赖审计0，开发依赖另有7项，不冒充全依赖零漏洞。

1Panel测试容器exchangethb-web_canary-1镜像sha256:994ced8f8979ed92a7af893ce9ed3abead14dcd529cd3812f4cd832622d2049c。正式站仍为sha256:9e6e4e01bb76039c93210b7104924a59924830e3099c8624770b206041161519；21处现场文件改动未覆盖。源码制品/tmp/exchangethb-seo-final-20261002.tar.gz SHA256 c30b223304b0ef88dbd0c6790d2a656d2cd5ba80a272ca29a177e71a7d8a5590；服务器独立源目录/tmp/exchangethb-seo-release-20261002。compose.canary-seo.yml只指定测试镜像和PRISMA_PUSH_ON_BOOT=0，未启动worker、未迁移/写生产数据库。

真实数据库可读、测试服务healthy，但现金dataStatus=degraded，全部currentCount=0；SIA是reference，其余unavailable。不能称项目全部实时接通；Google Places评论真实接入也未验收。固定采集代理检查仍proxy_blocked，不绕过或切换出口。

GSC正式旧地图已成功重新提交（发现129，不等于索引129）；新38条地图仍只在测试制品内。AdSense所有权meta与ads.txt准备完成，正式未发布、站点仍需要审核、没有申请审核/获批/收入。返佣资格见REFERRAL_VERIFICATION_2026-10-02.md，现阶段不能承诺交易所返佣收益。

正式切换需要依据dev-deploy门禁的明确生产授权。批准后使用已核验镜像，仅更新web，保留worker/postgres；切换前再次校验旧镜像和现场差异，保留旧镜像回退。随后验证公开HTTPS、SEO、GA4数据接收、AdSense所有权与审核申请，重新提交新地图；不购买Google Ads流量。

## 2026-10-02 十语与币种默认值验收（替代此前四语制品）

主流程语言为en/th/zh/ja/ru/ko/fr/de/id/vi；新增六语涵盖比较控件、币种名称、来源/评论界面、更新状态、使用说明、统计同意、方法/免责/隐私页面。历史未完成翻译的详情页明确307到英文，不作为新增语言索引。

现金默认：zh CNY、ja JPY、ko KRW、fr/de EUR；en/ru/id/vi/th USD。当前不支持RUB/IDR/VND现金输入，THB为目标币。切换现金保留金额和方向，清除纸币面额；加密只切语言，保留symbol/amount/side；用户坐标不保存在切换URL。语言列表按2025全年国籍客源官方数据排列，英语以英国、中文以中国大陆为代表；泰语最后，不宣称语言人口或自动实时排序。

官方排序数据：中国4473992、俄罗斯1898837、韩国1555227、日本1091227、英国1083162、德国965898、法国816935、印尼787524、越南660386。印尼/越南由官方2025四季度数据加总。出处：https://www.nso.go.th/public/e-book/Bulletin-of-Statistics/bulletin-4-68/23/ 、https://www.nso.go.th/public/e-book/Bulletin-of-Statistics/bulletin-4-68/149/ 、https://thailand.prd.go.th/en/content/category/detail/id/2078/iid/466167 。

验证：23个测试文件72项全部通过；TypeScript无错误，lint零警告，git diff --check通过。本机和1Panel Docker构建成功；两环境十语SEO、六语免责声明、英文详情跳转、robots及68条sitemap检查通过。390px浏览器实测JPY→韩语KRW→法语EUR保留5000和buy，六个新增语言连续切换均保留SOL/2.5/buy、无横向溢出。额外验证韩语和印尼语原生币种名称。证据：artifacts/language-browser-evidence-20261002.json、french-mobile-languages-20261002.png、russian-crypto-mobile-20261002.png。浏览器Space20完成并关闭，未接管Google Play Space15或他人Space2。

1Panel测试镜像sha256:78cf6b514a5eb0a645778ca3721ba6681a2caa87b6c06913761597af9b47339e，healthy。归档/tmp/exchangethb-languages-20261002.tar.gz SHA256 03e62fddd214299e2b7aea832de0096fa839dae3b8d7640100a03a87e15ab3d2；独立源码/tmp/exchangethb-languages-release-20261002，测试覆盖compose.canary-languages.yml，PRISMA_PUSH_ON_BOOT=0，仅替换web_canary。正式web镜像仍sha256:9e6e4e01bb76039c93210b7104924a59924830e3099c8624770b206041161519，healthy。没有重启worker/postgres、没有数据库迁移或写入。

测试服务数据库可读，但现金所有currentCount=0，dataStatus仍degraded；本次语言验收不代表实时来源/真实Google评论已接通。新68条地图未正式发布提交；AdSense/GA4正式验证仍待正式发布，返佣没有新增已批准结论。目标工具仍保留原blocked状态；目标提示词已追加到DEVELOPMENT_PLAN.md，不将整体开发目标标为完成。

共享基座rules SHA256 25a8679ba6ab76cbcbb6381b1b076bffc7c98b46784619915f164f4d97008799，Git bafc5d60a30063fd3a5ef6068be60bae12c3a423。

## 2026-10-02 定位与 Maps 配置核查

正式web USD/1000查询实际返回SIA、SuperRich Thailand、Ratchada三家记录；SIA时点2026-09-24，另外两家2026-03-10，均不是最新现金报价。Ratchada8.5km的distanceOrigin=reference，来源是曼谷中心13.7563/100.5018的直线距离，不是用户位置或道路距离。配置共有五家（另Vasu、Twelve Victory）；无报价不能填假当前价。

默认采集18888及其余五个登记代理均unhealthy；默认容器openvpn运行，最近日志脱敏计数显示重复connection/restart/warn，未把故障归因于网站。collect check未通过，停止公开原文抓取，不换出口、不直连；没有重启共享容器。已请求单独批准重启原nordvpn-th31-proxy。

定位代码：启用高精度、20秒超时、禁用旧定位缓存；入口移到默认可见；十语距离来源与直线估算说明、误差范围、超过1000米低精度提示。浏览器模拟2500米精度成功显示警告、无水平溢出，经纬度不进入页面URL。该证据不是实体手机GPS验收。截图artifacts/location-accuracy-mobile-20261002.png。

Google Cloud复用xmanx-site-operations/授权Profile16。现有结算账号01883F-52E4C7-D093A1当前可见、费用THB0、页面显示免费试用需预付款且付款账号有问题。点击启用Places API(New)后被导向创建Maps结算账号，已取消，没有创建第二账号、付款、同意付费、生成密钥或完成API启用。现有账号出现不等于项目结算/Maps有效。需要恢复结算，已向用户请求Maps用途的明确计费授权；真实支付/预付金额另行确认。官方资料：https://developers.google.com/maps/documentation/places/web-service/usage-and-billing 、https://developers.google.com/maps/billing-and-pricing/pricing 。当前reviews字段属于Enterprise+Atmosphere，免费1000/月，首档超额25美元/1000，不沿用旧200美元月额度说法。

代码请求限额从40/小时300/日改为10/小时25/日500/月（每进程），新增跨日月额度/次月恢复测试。73测试/24文件、TypeScript、lint通过，两主机Docker构建成功；制品exchangethb:codex-location-maps-20261002。应用计数重启/多实例可重置，不是硬费用上限，Cloud预算告警也不是停费保证。预览127.0.0.1:3104已更新。归档SHA256 2a7d707eb63662a1d740c29dcf58b48eaabcdd552b9131e057e1182d34875f11，服务器独立源码/tmp/exchangethb-location-maps-release-20261002。只替换web_canary、PRISMA_PUSH_ON_BOOT=0，不迁移/写生产DB、不重启worker/postgres、不切正式web。

新目标提示词已写入DEVELOPMENT_PLAN.md。目标工具旧goal仍blocked，create_goal以unfinished goal拒绝重启；不能为绕过门禁把未完成旧目标标完成。Cua自动控制Codex界面被安全规则拒绝，没有绕过。需要用户在应用恢复原目标。Google相关BrowserSpace21已完成关闭，未接管Space15。

本轮最终服务器验收：web_canary镜像sha256:5f7e8b6321e8fde7ed2a8f4f53f369d390922a6e96969082a685a2f8dae13b6a，healthy，十语SEO和68条地图检查通过，服务端HTML包含默认定位入口与直线估算说明；正式web仍9e6e4e01…且healthy。registry.maps_places_setup与seo_delivery已按当前SHA登记，未回写秘密。代理重启与Maps结算两个审批仍待用户答复，没有据等待时间视为批准。

## 2026-10-02 正式网页上线

用户明确要求完成项目上线，暂停手机Google账号恢复。仅正式web切换至已验收镜像sha256:5f7e8b6321e8fde7ed2a8f4f53f369d390922a6e96969082a685a2f8dae13b6a；旧镜像9e6e4e01…保留。覆盖文件/opt/exchangethb/compose.production-release-20261002.yml，PRISMA_PUSH_ON_BOOT=0，未覆盖现场源文件，未迁移数据库、未重启worker/postgres。执行up -d --no-deps --no-build web退出0，实际healthy、数据库可读。

本轮73测试/24文件、typecheck、lint、diff检查通过。正式HTTPS十语SEO、自动比较、免责声明、ads.txt、68条sitemap检查全部通过。既有GSC Domain资产再次提交正式sitemap，出现“已成功提交站点地图”；列表仍显示旧129发现数，不把它计作新版收录。既有Profile16网页可用，无需为网站切换Google Play账号。保留账号和Cloud页面交还用户。

仍未完成：现金currentCount全部0且degraded，固定采集代理unhealthy；未获共享代理重启单独授权，不绕过出口。Google Places实际评论/API未接通，Cloud1000THB预付款与Play无关且未支付。AdSense平台审核和正式GA4接收未完成，不声称已有广告或返佣收入。网站上线不代表全开发目标完成。

## SGD空结果核查与修正

实际正式SGD/1000/sell/20km接口all=[]，现金缓存2026-09-24，未发现当前SGD报价。Google项目凭证加载完成后确认无API key；原结算账号仍关联。共享代理日志重复Connection reset，公开采集仍停止。支付1000THB和原共享代理重启请求等待用户答复，没有将任务推进视为付款授权。

十语现金空结果说明现在明确报价缺失或筛选排除，并提供data-status链接，不将无报价说成无门店。73测试、类型、lint通过；服务器Docker构建退出0，正式web镜像d2b6fee072daddc48aaa9f6bae5058d28ec193c12c98e24aa8a2279757a4765b，保留before-empty覆盖文件和旧镜像；仅网页容器更新，仍未接通真实Google评论或现金当前价。

## 2026-10-02 公网版本不一致根因与修复

原反代exchangethb_pool实际同时使用172.30.0.10和172.30.0.13，所谓web_canary也是生产流量池成员。此前仅更新web导致公网混合版本，这是发布验收遗漏。原配置未改；本轮将web_canary更新为相同d2b6fee…镜像、PRISMA_PUSH_ON_BOOT=0；未迁移DB或重启worker/postgres。compose.pool-release-20261002.yml保存镜像覆盖。四次公网HTML脚本版本复核见本轮工具结果。

原VPN重启已获用户明确修复授权并执行，仍连接重置。原服务器列表日期2026-08-06，真实OpenVPN泰国服务器为th44至th59；容器命名th31不是固定服务器证据，配置也未固定hostname/IP。更新同提供商服务器列表超时，未采集新报价、不轮换代理。目标模式已成功创建，保持active。

## 固定代理真实恢复

2026-10-02：在原nordvpn-th31-proxy上将TCP改为UDP，保持同一VPN服务器IP、127.0.0.1:18888绑定和原凭据；不创建第二服务、不修其他五个代理。第一次自定义1194端口被NordVPN配置校验拒绝，随即恢复提供商默认端口，随后Initialization Sequence Completed与healthy。collect check通过；固定helper采集Ratchada官网HTTP200/28741bytes，原文artifacts/ratchada-recovered-20261002-0402.html。真实报价发布时间和解析尚待核验；这不是浏览器隐私或全来源采集验收。秘密仅在Docker运行配置内存复用，未写文件或输出。用户修复授权来自“那你修复啊”。

## 真实现金报价恢复第一批

固定helperRatchada原文已解析15币种31行，SGD100-2面额buy26.05/sell26.30，10000-1000面额29.50/29.90；官网发布时间2026-10-01T11:21:26Z，保留fetchedAt和published标志。extractRatchadaRates不再以当前时间伪装发布时间，无官方时间则拒绝。Twelve Victory已解析USD/EUR/GBP/CHF/HKD共5行，公布2026-10-02 04:02:18泰国时间（非SGD来源）。Vasu和SIA本轮请求transport failure，未重试/换出口，不造报价。

73测试、type/lint通过。使用现有cashScrapeCacheState/latest事务合并两家已核验结果、保留其他provider并写previousValue回退；未迁移表或修改用户数据。公开数据制品artifacts/verified-cash-import-20261002.json。自动更新链路和正式页面最终验证仍待完成，当前一次导入不是持续采集验收。

## 持续更新链路修复进行中

现有服务器worker运行旧58a3d80…镜像，heartbeat循环10分钟。它可能覆盖手工验证缓存，因此停止该worker以避免继续旧解析；网页和postgres不停止，未迁移。恢复worker是本目标的必需待办，不能把停止当完成。

新增scripts/collect-cash-private.ts复用localenv固定helper，串行三来源、2秒节流、无直连/轮换/重试，失败保留证据。真实运行退出0：Ratchada31行、Twelve5行、Vasu0失败；制品artifacts/cash-cycle-2026-10-01T21-06-05-990Z/results.json。typecheck/lint/diff通过。当前程序只有一次执行，没有持续运行部署，不宣称自动更新完成。需接入缓存合并和持续服务，并恢复新版worker。

## 自动采集服务与worker状态

采集脚本--publish已实际成功更新正式缓存，Ratchada31/Twelve5/Vasu失败；失败结果通过合并保留之前时间。import-cash-cache.cjs只接受已声明三个provider、published有效时间、正数买卖价，通过事务保存previousValue。lint与73测试通过。

新增本业务LaunchAgent com.xmanx.exchangethb.cash-collector，10分钟循环，原固定helper与SSH到现有worker数据库；未使用新凭据/新代理。但launchd无法读取USB工作目录，实际getcwd Operation not permitted，后台验收失败。已bootout停止错误重启，plist保留，日志~/Library/Logs/ExchangeTHB。需要macOS允许后台程序访问可移动卷，未自动放宽系统权限。手动执行成功不证明后台运行。

服务器worker已恢复，镜像d2b6fee…、CASH_COLLECTION_MODE=external、PRISMA_PUSH_ON_BOOT=0；启动前复制当前worker/index.ts，使其读已有缓存而不采集现金。真实heartbeat更新，loop=true、10min、status=degraded，符合来源未全部恢复。运行层修改尚须构建进新镜像以保证重建持久性，此为下一步必需事项。没有数据库迁移；compose create观察postgresRunning/Healthy，没有重启postgres。

## 后台启动修复与首周期

此前USB权限结论过宽：launchd工作目录改为/Users/shift后，程序能读USB源码，但tsx初始配置发现基于主目录，导致MODULE_NOT_FOUND。显式--tsconfig项目tsconfig.json及--workspace原项目路径后，服务PID99592运行，首个后台周期artifacts/cash-cycle-2026-10-01T21-11-59-904Z/results.json成功采集发布31+5行。没有更改macOS权限。第二个10分钟自然周期尚待验证，不能仅用进程存在宣称持久更新验收。

新增Ratchada发布时间/无时间拒绝测试；75测试25文件、lint通过，typecheck通过。immutable恢复镜像Docker构建Session19602仍在生成页面，需按同一会话观察后部署，不重复构建。当前worker external临时修复仍有效。

Docker恢复镜像构建Session19602退出0，compose.recovered-data-20261002.yml将web/web_canary/worker一起更新为exchangethb:codex-recovered-data-20261002，全部PRISMA_PUSH_ON_BOOT=0，worker CASH_COLLECTION_MODE=external，未重启postgres或迁移DB。源码/tmp/exchangethb-location-maps-release-20261002。公网SEO验收Session99302；详情见本轮结果。此前运行层worker文件修改已构建固化。

### 2026-10-02 04:22 TH — SuperRich official table recovered
- Replaced the failed legacy endpoint in the fixed-proxy collector with the official homepage HTML table. Parsed 31 denomination-specific quotes across 15 supported currencies. Unsupported currency rowspans reset correctly; duplicate mobile tables are excluded.
- No publication timestamp identified in the official rate table: records explicitly use `timestampKind=collected`, never an inferred publication time.
- Production cache import succeeded for SuperRich 31, Ratchada 31 and Twelve Victory 5 rows. Vasu failed without direct fallback or proxy rotation.
- Public production SGD / 100-banknote / sell / 1000 request returned SuperRich 26.15 → 26150 THB, current=true, denomination 100–50; evidence artifacts/public-sgd-superrich-20261002.json and artifacts/cash-cycle-2026-10-01T21-20-44-509Z/results.json.
- Verification: 77 tests in 26 files passed; typecheck and focused lint passed. The collector restart proves one successful new cycle; the next natural ten-minute cycle remains to verify.
- UI distance-caption fix and provider-summary wording are local pending next coordinated release. Maps billing/Places review integration remain pending, not represented as complete.

### 2026-10-02 04:25 TH — cash matrix and UI release
- Production cash matrix: 15 currencies × buy/sell = 30 requests. All returned current best quotes; returned estimate arithmetic matched the chosen direction. Evidence artifacts/public-cash-matrix-20261002.json. This is API coverage, not a claim of every provider accepting every denomination.
- Built image a3c6215509867b0a8a6dd9978092070135a2ca60373e5e4448c7d6f7675ad6a4; deployed web/web_canary/worker together via compose.cash-ui-20261002.yml with no DB migration. Distance details now distinguish user coordinates from Bangkok reference; SuperRich description reflects actual official table.
- USDT live production probe: Binance TH current, Bitkub timeout, Upbit/Orbix fetch failure. Historical fallback rows remain explicitly labelled, but sort priority needs audit so references cannot precede usable live quotes. Evidence artifacts/public-usdt-20261002.json. Full crypto completion remains unproven.

### 2026-10-02 04:26 TH — Bitkub adapter repair in progress
- Official primary reference https://github.com/bitkub/bitkub-official-api-docs/blob/master/rest-v3.md documents GET /api/v3/market/depth, sym=usdt_thb, tuples [price,size]. Existing code used retired /api/market/books and legacy tuple indexes.
- Fixed-proxy real fetch returned HTTP200/error0, 100 asks and 100 bids; artifacts/bitkub-v3-depth-20261002.json. Adapter updated with a meaningful V3 symbol/tuple test; typecheck and focused lint passed.
- API crypto ordering now puts live rows before historical references, preserving liquidity and cost order inside each group. Website already partitions current/reference cards.
- Build session39709 live; image tag codex-market-v3-20261002 not yet deployed. Previous UI release services all healthy.
- Orbix primary reference https://docs.orbixtrade.com/ specifies public GET /api/v3/depth?symbol=usdt_thb. Fixed proxy returned HTTP200 with asks/bids [price,size], artifact artifacts/orbix-v3-depth-20261002.json. Local adapter updated and 2 V3 tests passed; typecheck passed. This additional Orbix change is not in the already-started Bitkub build39709; must copy and rebuild after observing that job, not assume deployed.

### 2026-10-02 04:28 TH — complete market build and ranking evidence
- Build39709 completed a68fc08… successfully; not deployed because Orbix additional change was absent. Copied updated market-data.ts only, started complete build60199 tag codex-market-v3-complete-20261002, still live.
- 81 tests / 28 files passed. Added buy/sell adversarial tests proving a historical but superficially cheaper quote ranks behind current data.
- Upbit official THB-USDT orderbook returned HTTP200 through fixed helper, artifacts/upbit-orderbook-20261002.json. Existing API format remains correct; production transport still needs investigation, not a reason to substitute foreign-market prices.
- Complete build60199 succeeded image a1ee3964032cb246d375647a439b3a63a4d7dc036b377acdbc5f9d7b7bc0b861. Deployment26479 exited0, all three services on compose.market-v3-20261002.yml. No DB migration or proxy change.
- Production post-release USDT sell probe now returns Orbix and Bitkub live=true/current orderbooks, ranked first; Upbit invalid_orderbook and Binance transient fetch failed remain labelled historical. Evidence artifacts/public-usdt-v3-20261002.json. Do not claim all exchanges live from one successful pair.
- Upbit raw evidence contains valid asks alongside trailing bid_price=0,bid_size=0 placeholders because bid/ask sides have unequal depth. Local adapter now drops only exact zero/zero placeholders per side, leaving malformed nonzero entries subject to strict quality rejection. New test passed; typecheck passed. This change is local, not yet deployed.

### 2026-10-02 04:31 TH — ten-language mobile verification
- Rendered the real production cash comparison in zh/en/th/ja/ru/ko/fr/de/id/vi at width390. Each showed both SuperRich and Ratchada, expected SGD100 denomination amount26150, and no horizontal overflow. Evidence artifacts/ten-language-mobile-20261002.json. This verifies the cash path; crypto and interactive language selection still require broader audit.
- Upbit build38251 exited0, image2d6f787b9ae13b001b44a2248b77d3c966e9d5cea33afab58525a8b0d3449d95, deploying via compose.upbit-depth-20261002.yml. No migration.
- Natural ten-minute background cycle verified without restart: 21:20:44 → 21:31:09 UTC, same service PID5620; second cycle SuperRich31/Ratchada31/Twelve5 imported successfully, Vasu failed transparently. Evidence artifacts/cash-cycle-2026-10-01T21-31-09-422Z/results.json and public-cash-natural-refresh-20261002.json. This confirms one natural scheduled update, not indefinite uptime.
- Post-Upbit-release production USDT sell probe: Binance TH, Orbix, Bitkub, Upbit Thailand all live=true with current orderbooks, evidence artifacts/public-usdt-upbit-20261002.json. Pair-level success, broader asset matrix still outstanding.

### 2026-10-02 — production GA4 receipt
- Used existing Profile16/TaskSpace23. On actual production /en page selected Allow analytics through UI; loaded measurement G-HHPM4E9QGY and emitted page_view with stripped page_location. Authenticated GA4 realtime for property557014525 showed 1 active synthetic user and matching production page title, first_visit/page_view/session_start. Evidence artifacts/ga4-production-realtime-20261002.txt. Not organic business traffic.
- Changed amount1200 through real UI; comparison_started/comparison_success appeared in dataLayer, backend receipt of these events still to confirm. Canonical registry ga4 updated using fresh SHA foundation patch.
- Crypto 15-symbol × two-side production matrix process2448 still live; no restart or claim of completed coverage yet.
- Authenticated GA4 realtime subsequently received comparison_started=1 and comparison_success=1 as well as page_view=1. Updated same evidence file. Selected Essential only via UI after testing and closed only own p8/p9 tabs, returned TaskSpace23 to user. Synthetic visits remain distinguishable from real traffic in this receipt.

### 2026-10-02 04:37 TH — complete crypto request matrix
- Production 15 symbols × buy/sell=30 requests completed exit0. All API responses ok and numeric outputs valid; no historical row precedes live rows. 28 combinations had at least one real-time provider, LTC buy/sell had none. Evidence artifacts/public-crypto-matrix-20261002.json. Successful validation is not universal listing or stable connectivity; counts vary by provider/pair/request.
- Current deployed image2d6f787… is identical and healthy on web/web_canary/worker. Explicit remaining gap: LTC availability/current empty state and interactive locale/location tests, full source recovery, Places billing/reviews.

### 2026-10-02 04:39 TH — interactive locale verification
- Real mobile UI language dropdown en→ja: crypto retained LTC amount1 side=sell; cash SGD100-banknote selection changed to JPY amount1000 side=sell, cleared denomination as intended. Width390 no overflow. Evidence artifacts/interactive-locale-switch-20261002.json.
- LTC real page showed empty state after settled response; previous wording suggested filters nonexistent in crypto flow. Added ten-language truthful asset/THB-market unavailable wording without assuming permanent delisting. Typecheck/focused lint passed; image codex-empty-state-20261002 build started, not yet deployed.

### 2026-10-02 — pool consistency audit
- Both live web containers report identical BUILD_ID XI69CzQXS90H18v-eyJ3Z and identical SGD100-banknote quote rows, fetched timestamps and current flags. Evidence artifacts/web-pool-consistency-20261002.jsonl. This is direct runtime evidence, not merely matching image tags.
- adb devices -l returned no attached phones. Actual phone GPS/browser-permission validation remains unavailable; no device reset, pairing or settings change performed.
- Empty-state build30784 completed image1b8fc9f69a592649d1ad3a85c41833824ce1b37d3203aaac5847a51be7481b81; production deployment started using compose.empty-state-20261002.yml.
- Deployment66234 exited0 and formal SEO cluster post-release52562 exited0; evidence artifacts/seo-after-empty-state-20261002.log. All previous multilingual canonical/main-flow checks retained.

### 2026-10-02 04:43 TH — production cache import hardening
- Same existing importer now validates exact official source URLs, supported currency set, positive/non-crossed spreads, declared timestamp kind, finite/fresh fetched and batch timestamps, no future publication, collected-time equality, no duplicate providers, consistency between ok and nonempty quotes. Rejects before Prisma transaction; previous data remains preserved.
- Exported pure validator for tests while CLI/eval path remains active only for direct execution. 2 meaningful invalid-payload tests passed; typecheck and focused lint passed. Evaluated Node module.parent=undefined confirms production node-e path still starts importer.
- Existing collector reads current importer on each --publish cycle. No service restart. Next natural-cycle cache write with this validator not yet observed; cannot claim runtime verification from tests alone.

### 2026-10-02 — crypto ten-language rendered mobile audit
- Browser job77161 completed: ten locales, width390, assetUSDT/amount1000 retained, no horizontal overflow. Cards separate references; provider availability varied between requests and is not claimed universal. Evidence artifacts/ten-language-crypto-mobile-20261002.json.
- Billing pagep1 still displays services require one-time THB1000 before enabling. No payment performed. Full current acceptance audit saved CURRENT_ACCEPTANCE_AUDIT.md; does not shrink original scope or claim completion.

### 2026-10-02 — Cloudflare platform receipt
- Existing registered site e790… automatic RUM enable radio checked. Authenticated Cloudflare Web Analytics site list reports last24h49 pageviews/41 visits for exchangethb.com. Evidence artifacts/cloudflare-production-analytics-20261002.json. Counts may include our tests; not unique users or organic Google clicks. No tracking configuration or DNS change.
- Closed only own p13 tab, handed back TaskSpace23. New importer natural cycle still pending; last saved cycle21:41 predates hardening at21:42.

### 2026-10-02 04:52 TH — hardened import natural runtime passed
- Confirmed same launchd PID5620 alive before waiting, no restart/parallel collection. Natural cycle21:51:59 completed SuperRich31/Ratchada31/Twelve5, Vasu failed.
- New strict validator actually executed in publish path; production best quote fetchedAt21:52:00.644Z/current=true confirms cache committed, artifact artifacts/import-guard-natural-cycle-20261002.json and artifacts/cash-cycle-2026-10-01T21-51-59-529Z/results.json. No new validation error logged.

### 2026-10-02 04:55 TH — exchange license evidence
- Read live primary SEC register https://market.sec.or.th/LicenseCheck/views/DABusiness: Digital Asset Exchange section lists GULF BINANCE/binance.th, UPBIT/th.upbit.com, BITKUB/bitkub.com, ORBIX TRADE/orbixtrade.com. Match is to licensed exchange entity and domain, not safety/fee/commission guarantee.
- Initial DB update stopped safely because no AdminConfigState row existed. Confirmed existing active content/admin-config.json; preserved its complete configuration and added license-only evidence into existing Prisma model, global key. No schema migration. Concurrent create would fail rather than overwrite.
- Saved four license evidence entries, 30-day expiry, unchanged fees/operations status. Public Binance context returned license verified/sourceSEC and fees/operations unknown. Artifacts sec-license-platform-update-20261002.json, public-license-context-20261002.json. All platform credentials untouched.

### 2026-10-02 — cash licensing evidence boundary
- Located BOT money-changer licensing page and official historical list MC10-01-listauthorized.pdf. PDF footer explicitly 20/3/2023; do not turn an old list into current 2026 verified license evidence. BOT current license search cannot be read by web tool; no bypass or invented license state.
- Cash brand/provider identity matching to current license remains incomplete. Exchange SEC evidence does not cover cash shops. Sources https://www.bot.or.th/th/our-roles/financial-markets/foreign-exchange-regulations/foreign-exchange-business/money-changer.html and its official PDF.

### 2026-10-02 remaining official cash sources
Vasu canonical HTTPS domain returns transport_or_io_failure through fixed18888; availability cannot be concluded. SIA official hyphenated domain matches existing HQ address (distinct from Siam Exchange), but returns HTTP403 through same fixed proxy. No retry, direct fallback, exit rotation or quote import performed. Evidence: artifacts/remaining-cash-source-verification-20261002.json. This source investigation does not resolve current cash licensing, Maps billing approval or absent USB phone.

### 2026-10-02 external collector ownership enforced
Fixed admin refresh bypass: external-mode cache refresh returns existing data without native requests/writes, authenticated manual scraping returns409 external_cash_collection, admin UI explains automatic ten-minute updates. All three deployed containers explicitly external mode and PRISMA_PUSH_ON_BOOT=0. Image97ce3df32acea75bfe76714051d4b25f861ef7d2ec209bbe951e33d341feadb3 via /opt/exchangethb/compose.external-guard-20261002.yml; previous empty-state image retained for rollback. 87 tests/30 files passed, typecheck and focused lint passed, build/deploy exited0. Both actual web instances returned authenticated409, verified with temporary in-memory test sessions, no secrets emitted or saved. Initial tsx probe had empty output and is NOT accepted proof; confirmed plain Node probe in artifacts/admin-external-guard-runtime-confirmed-20261002.json. All three containers healthy, public health checks passed, public cash quote retained after release. Four public provider contexts show SEC license verified, fees/operations unknown: artifacts/public-four-license-curl-20261002.json.

### 2026-10-02 remaining external conditions revalidated
ADB has no device. TaskSpace23 remains agentDelegatedToUser; no takeover/reload/payment. Production Places flag false and key absent, API unconfigured. BOT current licensing search page and public script fetched HTTP200 through fixed18888; result loads through POST with CSRF header, outside existing GET helper. Shell HTML is not license result and no current cash-shop verification claimed. No alternate browser/exit or shared helper modification. Evidence artifacts/remaining-external-conditions-20261002.json. Previous goal turn was substantive progress (external admin guard deployed); this investigation narrows next action but does not complete full goal.

### 2026-10-02 blocked audit
Full objective remains unachieved. Across at least three consecutive goal turns the same missing Maps payment authorization and absent USB device persisted; independent work continued until external admin guard deployment, source investigations and current licensing boundary were verified. Current recheck: adb no devices; TaskSpace23 delegated to user; no new payment authorization. No remaining safe action can supply real Places results or phone GPS without these external changes. Vasu transport failure/SIA403 and current cash licensing/commission eligibility also remain unverified, explicitly preserved in acceptance audit. Collector service remains live PID5620 with natural22:02 successful three-source cycle. Marking goal blocked stops autonomous goal turns, not the existing collection service.

### 2026-10-02 11:35 TH — Maps and actual mobile acceptance completed
- User-authorized alternate Google owner account shiftshen521@gmail.com / Profile1, TaskSpace74 (finished, no retained agent tabs). Existing paid vdamo-420503 / Places API(New) reused; separate ExchangeTHB Places Server key restricted to that API and Google-observed production caller IP. Key only in registered restricted local/server files; no key in repository or client responses. New exchangethb-maps billing attachment hit project-count quota; no new billing account/payment. Analytics assets remain Profile16.
- Six branch Place IDs matched actual names/official websites/addresses. SR1965 and SuperRichThailand separate. Real public responses collectively verify all six with5 attributed reviews. Initial failures preserved in artifacts; Docker EAI_AGAIN isolated with credential-free logging, bounded single same-target retry added (no route/DNS/proxy/TLS changes). Final previously failing SR1965 public API available; frontend Ratchada displays5 attributed reviews and Google Maps; phone SuperRich shows live stars/authors/review content in proper width. No fabricated review/cache ratings.
- Shared existing Postgres state/advisory lock limits25/hour,25/day,500/month across both replicas/restarts. Retry consumes allowance; HTTP403/ordinary failures are not retried. Hour allowance increased while day/month bounds unchanged. This does not cap other activity in the shared Cloud project or guarantee a monetary total. Valid coordinates expire at30days, refresh on real Details, and cannot overwrite a concurrent identity edit.
- USB and wireless both recovered on registered HONOR BVL-N49 after restarting the original empty ADB daemon. No system security permission changed; settings returned to the original page. User allowed Chrome precise location once. Second actual locate succeeded at±18m; distances Ratchada1.8km/SuperRich6.5km and coordinates absent from URL. SGD selected on phone updated comparison automatically; actual native Maps opened SuperRichThailand45Ratchadamri1. Browser returned to site; real phone review layout verified by screenshot (Chrome AX omitted painted web text, so screenshot used). SMS Auto background remains separately unverified/stale; no SMS codes read.
- Final image sha256:236ba9b944715e1f50981202faefe4c568c7181bc18a8f37aff873b9582fda33 / exchangethb:codex-places-dns-retry-20261002. Deploy /opt/exchangethb/compose.places-dns-retry-20261002.yml; web/web_canary/worker all healthy, all external collection/PRISMA_PUSH_ON_BOOT0. Previous97ce3df image retained. No Postgres restart/migration/DNS changes, fixed collector unchanged. 92 tests/32 files, typecheck/lint/build passed; formal ten-language SEO cluster check passed. Development/acceptance/registry facts updated using fresh SHA plans, preserving concurrent changes.
- Evidence: artifacts/google-maps-key-configuration-20261002.json, google-places-production-verified-20261002.json, google-places-final-acceptance-20261002.json, google-reviews-browser-20261002.json, phone-location-verified-20261002.json, phone-google-reviews-verified-20261002.png. Internal platform tests are synthetic, not organic/business traffic.
- Full original project is not declared complete: Vasu current rates unavailable, SIA only historical reference/official HTTPS403; current cash-shop licensing not all verified, referral income/eligibility and real search/business traffic not established. Maps/billing/mobile are no longer blockers. Source changes remain local as in the prior task; no blanket commit/push.
- Foundation version1.0.0, rules SHA2563fe0142baf7ef8e0ff5a5d31570edda44a0fcc0f68aa568ba36adebfb4a376c8, control Git68d5b8ec78e9b0e669c843bb635bdcb95aa300cf.


## 2026-10-02 手机比较布局优化

范围：只修改 exchange-picker 和 CSS，复用已授权正式站部署；共享 Runner 在线但 work_on_project 返回 path_outside_allowed_roots，使用原工作区终端。

长声明与直线距离说明移至结果后；手机币种与金额并排，选择币种后自动滚到结果（修改金额不跳转）。390×844 正式站浏览器测量结果起点从 906.86px 降至 637.19px，未出现横向溢出，截图见 artifacts/mobile-layout-before-20261002.png 和 mobile-layout-after-20261002.png。

验证：92/92测试通过；tsc --noEmit、组件eslint、生产Docker构建退出0。web与web_canary镜像 sha256:25ba2457874683e37549dff0f1db845b3c7c99e924a756b64d1f71cb587b8e42；worker保留236ba9版本，数据库不变。部署文件 /opt/exchangethb/compose.mobile-results-20261002.yml；回退使用 compose.places-dns-retry-20261002.yml。

本轮同18888代理复查：Vasu transport_or_io_failure；SIA HTTP403，均停止，不换出口。两家是现金换汇商，已有采集适配但当前报价不可取得。

基座规则SHA 3fe0142baf7ef8e0ff5a5d31570edda44a0fcc0f68aa568ba36adebfb4a376c8；Git 68d5b8ec78e9b0e669c843bb635bdcb95aa300cf；shift/macOS。

最终正式站验收：web/web_canary均healthy，worker仍healthy且镜像未变；选择USD后结果自动滚到距视口顶部59.69px，金额保留1000，无横向溢出。证据 artifacts/mobile-auto-scroll-20261002.json。


## 交付回执：2026-10-02 现金来源与牌照入口
- 结果：部分完成；SIA当前官网与历史报价来源分离，十语历史来源标签；现金商独立牌照状态为待核验，不借用SEC交易所入口，不用Google评分代替许可。
- 入口：https://www.exchangethb.com/zh/cash；web/web_canary镜像sha256:3ae2453aa3b169d0f2bdc00469da1ae29c5069ad8d13fca1b74eb710b39a7e19；/opt/exchangethb/compose.cash-evidence-20261002.yml。
- 验证：95测试/33文件通过；tsc --noEmit、相关eslint、git diff --check退出0；生产Docker构建退出0；两个网页容器healthy，worker仍236ba9镜像healthy，未重启worker/postgres。正式API现金牌照unknown且BOT来源；390px浏览器SIA当前官网https://www.sia-moneyexchange.com/、原历史来源http://www.siamoneyexchange.com/rate/，均标签正确；牌照待核验可见、无横向溢出。证据artifacts/cash-source-license-browser-20261002.json和cash-source-license-mobile-20261002.png；TaskSpace82结束。
- 未验证与剩余：央行实时查询HTTP200但正文维护中，未核验各店当前许可；SIA HTTPS403/Vasu传输失败，不绕过；静态示例价仍需清理，保留真实采集历史。详细审计artifacts/cash-license-source-audit-20261002.json。
- 回退：原25ba245镜像及compose.mobile-results-20261002.yml保留；首个canary探测曾因进程刚启动ECONNREFUSED，Ready后复测通过，未重复部署。
- 基座：规则SHA7b0b2bb57101d795b2f6f35635e3393d1594e5162bc26b2cc59427550c58959a；Git dc599b9ef01297fe442eb14fc0dfa730eb43a126；shift/macOS。

## 2026-10-02 12:26 TH — unverified comparison fallback removed locally
- Local source only, not deployed: lib/market-data.ts now returns validated official observations only; BTC/USDT/USDC API failures return no invented quote. lib/cash-live.ts no longer merges static cashRates into real collected rows; genuine historical cache retained and freshness/ranking unchanged.
- Validation: 95 tests/33 files exit0; tsc --noEmit exit0; focused eslint and git diff --check exit0. Tests now verify missing SIA/SuperRich observation remains missing rather than static completion.
- Still required before release: secondary directory/route pages and legacy cash comparison/scraper still reference static datasets; production remains 3ae245 cash-evidence release. Full goal active.

## 2026-10-02 12:27 TH — directories and scraper provenance cleanup locally
- Local, not yet deployed: money-changer directory quote counts/dates use actual cash cache, exchange directory USDT observations use validated APIs, route timestamps filter the route currency/symbol. These pages force dynamic rendering so build-time data cannot freeze pricing. No platform profile review date substituted as market time. Legacy compareCash delegates to compareCashLive.
- SuperRich1965 guest adapter no longer invents buy prices from static spreads and no longer assigns Date.now as missing published date. Only official positive two-sided rows with finite published timestamp accepted; sell-only fixture returns no quotes.
- 95 tests/33 files exit0; tsc exit0; focused lint and diff check exit0. Runtime data consumers have no static cashRates imports; marketSnapshots references are request-local official API observations. Production remains3ae245; build/deploy and rendered acceptance still required.

## 2026-10-02 12:31 TH — verified observations production release
{"date": "2026-10-02", "image": "sha256:88f2e6eba104af43d03c61d3bd3819ad589f78a835fc0333f9eed8737e96f8d6", "compose": "/opt/exchangethb/compose.verified-observations-20261002.yml", "web_instances": "both healthy", "worker_changed": false, "database_changed": false, "validation": "95 tests pass; tsc/lint pass; production Docker build exit0; production SEO cluster exit0; cash SGD and dynamic directories/routes HTTP200", "remaining": "Rendered mobile acceptance pending; Vasu/SIA current rates and current cash licensing/referral qualifications unresolved"}
Rollback retained: compose.cash-evidence-20261002.yml / 3ae245 image. SEO evidence artifacts/verified-observations-seo-20261002.log. All build/deploy/probe sessions exited0. No fake fallback quotes, inferred spread buy prices, or static timestamps remain in runtime pricing consumers. Full goal remains active.

## 2026-10-02 12:34 TH — production rendered mobile acceptance
- Ego Profile16 TaskSpace83 finished keep[]; 390x844 production SGD has two real providers, USD has three current plus SIA historical in reference-only section. Currency change auto-scroll result top20.1875, amount1000 retained, no horizontal overflow. Earlier immediate screenshot before smooth-scroll completion was superseded; final evidence artifacts/verified-observations-mobile-20261002.json/.png (image inspected).
- Cash directory actual counts31/8/31/0/5, SIA timestampSep24, Vasu0. Evidence artifacts/verified-observations-directory-20261002.json/.png. One exact-text summary click failed safely; DOM-grounded CSS summary click succeeded, no extra API collection.
- Discovered server directory timestamps rendered UTC rather than Bangkok and English headline denomination in Chinese UI. Fixed locally: Asia/Bangkok date formatter in three directories/routes; headline banknote label in all10locales while raw official denomination unchanged. 95 tests + tsc/lint/diff pass. These follow-up fixes not deployed yet; production image88f2e6 remains. Full goal active.

## 2026-10-02 曼谷时间与面额翻译发布
{"date": "2026-10-02", "image": "sha256:f210665b9fe37aac6dc292ed4dc6b31c39fde8f6c12a675835cf27040fd11d19", "compose": "/opt/exchangethb/compose.bangkok-display-20261002.yml", "worker_changed": false, "database_changed": false, "validation": "95 tests + typecheck/lint pass; Docker build exit0; canary health200; directory Bangkok12:30 verified; production390px headline label Chinese, no English marker, no overflow; TaskSpace84 finished", "remaining": "Vasu/SIA current quote access, cash licensing and referral qualifications unresolved"}
回退compose.verified-observations-20261002.yml /88f2e6保留。

## 2026-10-02 正式现金矩阵与返佣边界复核
30/30现金买卖接口200、金额算术0错误、30组合有current来源，两实例cacheGeneratedAt相同。原采集自然05:30周期已写入05:31缓存。没有再抓被403拒绝来源、没有换出口或服务重启。返佣报告澄清Orbix没有追踪URL导致官网回退，非证明活动过期；账户资格和公开网站推广许可未证实，不承诺点击收入。完整原目标仍active；外部来源/当前现金许可/账户推广资格待完成。

## 2026-10-02 AdSense审核正式提交
已授权Profile16/发布商pub-8386341379958173实际平台回读：本站所有权已验证、ads.txt已授权，但初始需要审核。点击申请审核后显示已请求审核/正在准备，未获批。CMP提示待处理：快捷配置会覆盖未来网站，本轮未选，未购买广告/付款/开启全局广告。EgoTaskSpace85完成keep[]；证据artifacts/adsense-review-requested-20261002.json。后续站点限定CMP配置和最终审核结果仍待完成，不将发布商ID或请求提交当获批/收益。

## 2026-10-02 本站限定CMP草稿已保存
Profile16/EgoTaskSpace86（仍active供同一CMP任务继续）：欧洲法规消息ExchangeTHB EU consent只绑定exchangethb.com，名称ExchangeTHB及现有英语隐私政策URL已保存；不同意按钮在全部适用地区开启，自动优化关闭。平台列表实际回读草稿/en/本站，不声称发布或真实弹窗完成。待补支持语言、网站配置验证、发布和实际同意/拒绝联动验收。证据artifacts/adsense-cmp-draft-20261002.json。旧ref点击因重绘/新dialog拦截失败均未强制操作；按新快照处理后保存成功。未改未来网站或账号级配置。

## 2026-10-02 CMP六语消息发布
继续同一TaskSpace86。Google支持列表实际选入en/zh-CN/ja/ru/fr/de，th/ko/id/vi未提供。复用现有brand-logo.svg用sharp无改动栅格化成PNG24956字节，Google上传后尚需从上传列表选中才真正关联；复查确认缺徽标警告消失。不同意/管理/同意预览可见、自动优化关闭、仅本站绑定。发布确认后平台列表实际回读已发布，最多1小时传播提示。actualWebsitePopup未验证，AdSense仍审核中；TaskSpace86保留进行同一任务后续页面验收。证据artifacts/adsense-cmp-published-20261002.json。未重复上传/未改账号全局设置，源码和生产容器无变化。

## 2026-10-02 CMP加载缺口确认与本地修复
同一TaskSpace86/p2正式网站DOM未加载adsbygoogle/fundingchoices且__tcfapi undefined；仅meta和ads.txt不能加载已发布CMP。依据Google官方https://support.google.com/adsense/answer/9274516及平台发布确认对话框（通过AdSense代码自动发布），本地root head新增本站发布商官方async脚本，middleware覆盖x-public-adsense仅公开根/locale允许，admin不加载。97测试/34文件、tsc/eslint/diff通过；新增两例检验公开页允许与admin伪造头拒绝。尚未部署脚本，当前生产仍f210665。广告审核和真实CMP弹出均未完成。TaskSpace86仍保留用于同任务后续验收，无新Profile或付费。Google另一帮助页web工具跳转sorry，不重试/不绕过。

## 2026-10-02 AdSense加载及隐私说明构建
原adsense-loader构建session89731退出0，尚未部署。核对现有隐私页缺少明确广告说明，已在同一页面两种locale渲染路径补齐十语：Google/合作方cookies与设备标识、适用地区广告同意/拒绝/管理、统计选择独立、无审核或收入保证。tsc/eslint/diff通过。已复制至原隔离构建目录，新adsense-privacy构建session36551，观察日志/tmp/exchangethb-adsense-privacy-build-20261002.log；禁止重复构建或切生产前未验。正式仍f210665。TaskSpace86/p2保留同一CMP验收。

## 2026-10-02 AdSense与隐私说明正式发布
{"date": "2026-10-02", "image": "sha256:f6090bcd260d323e6b09fc343c980fea01007c9d8654cbd0ab6caabc52274e6d", "compose": "/opt/exchangethb/compose.adsense-privacy-20261002.yml", "web_instances": "both healthy", "worker_changed": false, "database_changed": false, "validation": "97 tests; build0; canary health/public/private200; AdSense public script network200; admin script absent; ten-language privacy paragraphs added", "cmp_runtime": "__tcfapi undefined after20s; official test parameters used; no popup verified; Google publication propagation up to1hour", "ga_runtime": "GA4 not loaded under existing declined choice"}
证据artifacts/adsense-loader-production-20261002.json。回退compose.bangkok-display-20261002.yml/f210665保留。TaskSpace86/p2同一测试页面保留，待传播条件变化核查，未清cookie或切出口。官方测试来源https://support.google.com/adsense/answer/10924669?hl=pt-BR。网站审核仍未完成，实际CMP未验证，不声称收入/法律合规全完成。

## 2026-10-02 13:01 TH 采集诊断运行验收

仅重载本站专属 launchd 采集进程，新周期2026-10-02T05:59:49.288Z成功导入SR31/Ratchada31/Twelve5报价；Vasu failure=transport_or_io_failure/httpStatus=null，未证明具体根因。未重启代理/生产容器、未换出口。正式SGD比较接口HTTP200并读取05:59新采集记录，SR买入29.7、Ratchada29.5；不将缺失源作为实时数据。新增诊断字段只保留允许的错误码和HTTP状态，不保存stderr/URL/凭据。全套99测试/35文件通过，类型检查及聚焦lint通过。证据：artifacts/collection-diagnostics-live-20261002.json、artifacts/collection-post-reload-production-20261002.json。

## 2026-10-02 13:40 TH 用户指定来源移除正式发布

按用户明确范围变更，移除Vasu/SIA公开内容和采集任务，保留原历史缓存。正式镜像f52eebee…；compose.active-sources-20261002.yml；旧adsense-privacy版保留回退。99测试通过；补充历史缓存存在时也不返回两家的比较测试通过，类型检查/lint通过。首次构建因漏同步superrich-page模块失败，补齐后构建0。两实例发布；正式目录只显示3家、USD比较HTTP200只返回3家，两家详情404且sitemap不含它们。采集已只运行3家。Maps仍为既有shiftshen521/vdamo-420503，待用户确认新1000THB付款所属项目再切换；AdSense仍正在准备，不声称点击有收益。证据active-sources-production-20261002.json。

## 2026-10-02 13:52 TH Maps迁移110账号

用户确认1000THB已付款并要求今后项目默认110账号。Google平台实查xmanx-site-operations/原结算账号已有THB10078试用赠金、PlacesNew启用；未执行任何新付款或升级。创建本站受限密钥，只允许PlacesNew和Google回报的生产服务器IP。Google限制传播后服务器IDsOnly200；canary/正式站真实5条评论available、private/no-store。两个网页实例配置改为google-places-fujane.env，原shiftshen521密钥/配置保留回退，worker/数据库未切换。证据fujane-places-production-20261002.json。Google账号安全页可访问、恢复邮箱未验证，两步验证近期启用；已触发恢复邮箱码，读取通道失败，待用户提供此次验证码。手机Android16，Play商店和GooglePlay服务存在；未清数据、未退出账号、未改密或关闭两步验证。


## 2026-10-02 17:02 TH 公开资料接口收尾发布

新正式镜像sha256:18844edd401dc47a400e30e9f5be3e9d48755f8719bbac84e492b87cd7c3956f，compose.public-provider-guard-20261002.yml。构建session59412退出0，测试实例health200/两家旧API404/保留资料API200/SGD200后发布主实例，两web实际healthy；worker及数据库没有切换。回退compose.fujane-maps-20261002.yml及f52eebee镜像保留。

101测试/35文件、类型检查/聚焦lint通过。新正式实例十语SEO集群退出0，sitemap64。实际域名health及SGD接口200、被移除两家详情/API404。手机390px选择SGD自动比较且结果顶部20.1875px、金额1000保留、无横向溢出。证据public-provider-guard-production-20261002.json和public-provider-guard-seo-20261002.log。

当前现金30买卖组合都有current来源、金额算术0错误；原采集自动更新09:49UTC，未重启采集或代理。BOT当前查牌照200仍是maintenance页，三个保留店铺当前许可仍未证实；显示unknown，不以Google口碑代替许可。AdSense实查仍正在准备，CMP真实弹窗未验证。目标保持active，旧Vasu/SIA恢复不再是范围内任务，Google Play当前并行任务不由本站任务覆盖。


## 2026-10-02 17:09 TH 当前版本行情和十语验收

上一轮是实际开发/上线进展。本轮生产交易所15资产×2方向完整30响应200，其中28组合有live来源，LTC买卖均无报价，未补模拟价格。金额按订单簿平均价/成交数量/配置费用重新计算0错误，但费用本身均仍unknown，不把算术正确当官方费用已核实。USDT买卖来源数量出现3/2差异，BTC/ETH等可返回4家，保留实际可用来源不补齐。原浏览器整批evaluate观察超过15秒后仍继续，确认30请求结束后才用正式实例持续进程捕获完整payload；原首个观察超时证据保留，第二进程session12883退出0。

十语现金页面390px逐一真实渲染，无横向溢出或被移除来源。中文CNY/日文JPY/韩文KRW/法德EUR，其余不支持本币时USD，符合用户回退要求。session15776退出0。自动采集09:59UTC又成功SR31/Ratchada31/Twelve5，health200/状态current，未重启进程。证据crypto-current-full-matrix-20261002.json、crypto-current-math-audit-20261002.json、ten-language-current-mobile-20261002.json。

仍需完成官方费用核验、当前现金许可与AdSense/CMP最终验收；目标active，本轮无生产改动或新付款。


## 2026-10-02 17:17 TH 币安费用币种修复正式上线
构建1427退出0，镜像59d78fceacb359394afa1d29d4237498387f4cd1b0df1f4aa915f875e3c9f497；compose.fee-basis-20261002.yml，回退compose.public-provider-guard-20261002.yml/18844edd保留。测试实例真实BTC费0.0025BTC、不重复加THB成本、净币量验证通过。正式首个BTC200但缺Binance行，证据标未验证且未覆盖；独立ETH实际报价验证新扣费公式通过，不能据一次结果声称所有行情来源永不缺失。两web实际healthy，worker和数据库不变。
全套102测试曾通过，新增公平单位净币成本排序聚焦4测试通过，类型检查/lint通过；新正式十语SEO退出0。证据fee-basis-canary-20261002.json、fee-basis-production-20261002.json、fee-basis-production-eth-20261002.json、fee-basis-seo-20261002.log。下一必要工作：收到币计费在费用详情显示实际币单位；Bitkub银行/金额提现范围及Binance大额提现范围；动态提币费无当前网络依据不能当已验证。目标active，现金许可维护及AdSense审核/CMP仍未解决。


## 2026-10-02 17:24 TH 提币费真实边界发布
已移除四平台没有实时网络依据的固定示例提币费，未知时networkFee内部占位0但withdrawalFeeKnown=false，UI显示—并明确金额不包含未知费用，仍保留管理员配置费用覆盖。费用明细支持实际扣币单位及THB等值。104测试/35文件、类型检查/聚焦lint通过；build20567退出0。正式镜像d96591c3a7c614a530007f74c7a7b8b727732cf72051f69486197e545ed2f0f3，compose.fee-disclosure-20261002.yml，回退fee-basis/59d78f保留；两webhealthy、worker/数据库不变。Canary真实3平台未知提币状态通过，正式390px未知提示与—通过无溢出，但该次BTC没有Binance行，actual asset-unit rendering尚未证明。SEO新实例通过。
手机展开明细同时发现旧通用文案仍声称买入包括资产提币；本地已修复未知时改费用未核验说明，typecheck/lint通过，但该小修尚未同步/构建/上线。当前生产仍存在这条通用文案矛盾，不能把费用展示验收全部算完成。下一次与银行/金额提现费完善一并部署并实际验收。证据fee-disclosure-canary-20261002.json、fee-disclosure-production-mobile-20261002.json、fee-disclosure-seo-20261002.log。目标active。


## 2026-10-02 17:31 TH 提现范围与费用显示正式验收
原构建61982退出0，新正式dd9f8415ea1c4afc5440fa40f93f9c089657fe0556902ce450bbfb6544e41f47/compose.fiat-fee-range-20261002.yml，回退fee-disclosure/d96591保留。测试实例Bitkub真实卖出0.1BTC：提现20–75，到手端点差55通过。正式390px同样显示到手范围和费用20–75，无溢出。真实Binance买入0.1BTC展开明细实际0.00025BTC约724.07THB、净0.09975BTC、未知提币费—且旧声称买入含未知提币文字消失。feeStatus仍unknown，不宣称全部费用已核实或提款超银行限制可执行；不自动付款。
两webhealthy，worker/Postgres未切换。106测试/36文件此前通过；新增范围集成后聚焦8测试通过，typecheck/lint通过；新正式SEO通过。证据fiat-fee-range-canary-20261002.json、fiat-fee-range-production-mobile-20261002.json、fiat-fee-range-production-buy-20261002.json、fiat-fee-range-seo-20261002.log。下一待办：提现上下限及收款银行适用范围明确处理、Upbit/Orbix当前数值费率独立验证、Google广告审核/CMP、现金牌照仍未完成。目标active。


## 2026-10-02 17:45 TH 已发布官方费率默认值但BTC覆盖仍待修
build51797退出0，正式a3c138e7448b621234fa856cf46034e4a02300753990f7a28640edf3054e3201/compose.official-standard-fees-20261002.yml；回退fiat-fee-range/dd9f8415保留。测试实例真实ETH Orbix0.25/Upbit0.15正确；未知THB提现fee0仅内部占位，UI十语明确未计入，显示—，不能叫免费。正式手机390px未知提示/nooverflow、两webhealthy、worker/Postgres不变、SEO通过。
重要首败：正式BTC回读Upbit实际0.25而非0.15，未算费率通过。定向只读AdminConfigState(global)发现feeOverrides仍有orbix:BTC:tradingFeePct=0.2、upbit-thailand:BTC:tradingFeePct=0.25、Binance/BitkubBTC0.25；feeEvidence为空。配置updatedAt2026-10-02T06:52:31.466Z，旧覆盖优先导致默认值不生效。未直接写DB/覆盖配置；下一轮查已授权后台配置API，保留其他字段和用户在途修改，仅修正两个有官方普通费依据的过时值并真实BTC复测。不得再声称四家费率全生效。证据official-standard-fees-canary-20261002.json、official-standard-fees-production-20261002.json、official-standard-fees-seo-20261002.log。目标active，本轮是发布+发现真实残留覆盖的进展。


## 2026-10-02 17:52 TH BTC过时费用覆盖已修正
通过现有认证后台配置API更新orbix:BTC:tradingFeePct 0.2→0.25、upbit-thailand:BTC:tradingFeePct 0.25→0.15；使用容器内短时内存服务会话，秘密不输出/不保存，未改密码，未直接SQL写DB。写前二次读取检查并发，POST200，后台回读两个值正确，其他feeOverrides逐项一致。其他配置整体JSON字符串比较返回false，未保存初始全配置，故不能据此声称所有其他字段已逐项验证不变；提交仅包含feeOverrides，API实现按当前配置合并其他字段。
正式卖出BTC0.1 HTTP200，Orbix实际0.25、Binance/Bitkub0.25，Upbit该次缺行保留。随后买入实际四家live均返回，Upbit0.15/Orbix0.25/币安和Bitkub0.25，真实费用/订单簿金额比值复算正确。未知资产提现费仍false，不能认定免费或全部费用已核验。证据artifacts/btc-fee-override-production-20261002.json、btc-fee-override-buy-production-20261002.json。无镜像切换、采集/代理/worker重启或新付款；正式仍a3c138e。目标active，AdSense/CMP真实弹出及现金当前许可仍未验收。


## 2026-10-02 17:55 TH 自动更新和worker版本一致性修复
固定18888仍healthy，现有现金collector launchd实际running；自然10:50UTC周期三源全部成功31/31/5，正式health10:53UTC cash=current且SGD真实报价采集/官网时间相符，数据库可达。证据current-freshness-cache-20261002.json。
发现旧worker 236ba9仍把已移除SIA/Vasu纳入heartbeat，引入假来源降级。核对已验证正式镜像a3c138e包含publicCashProviders，仅切换worker为该镜像；compose.worker-source-sync-20261002.yml，回退worker用compose.official-standard-fees-20261002.yml（原worker places-dns-retry）。六项聚焦测试通过。10:54:14UTC新心跳实际完成且仅三保留源，全部current；market Orbix=false仍真实degraded，不假称全绿。新worker配置external/PRISMA_PUSH_ON_BOOT0，未启动服务器原生现金采集，未迁移DB；web/web_canary/Postgres身份和镜像未改变且healthy，worker Docker health最初starting。证据worker-source-sync-heartbeat-20261002.json。目标active，本轮实际部署与状态验收进展。

随后同一新worker实际Docker health=healthy；业务heartbeat Orbix=false仍degraded，两状态分别记录，不将容器健康当全部行情可用。


## 2026-10-02 18:01 TH 行情诊断开发与官方平台复查
上一轮是worker版本正式修复，非等待或无进展。本轮只读Orbix真实worker端点200/100x100订单簿，随后实际校验也通过；同环境整批BTC又缺Orbix/Bitkub，不能把一次端点成功视为持续全可用。源码新增getMarketSnapshotReport和脱敏sourceChecks，只保留source_http状态/timeout/dns/invalid/crossed/stale等原因，不返回上游异常URL或私密文本；现有报价仍必须通过严格校验且不加入备用价格。111测试/37文件、tsc、聚焦lint、diff通过。已同步原隔离构建上下文，构建tag codex-market-diagnostics-20261002，活动session1542，日志/tmp/exchangethb-market-diagnostics-build-20261002.log；尚未发布，正式仍a3c138e。下一轮先观察同一构建，不能重复启动。
AdSense既有Profile16/TaskSpace86/p2官方站点仍正在准备；隐私消息实际ExchangeTHB EU consent、仅exchangethb.com、6语、已发布，平台展示0/同意0%。未修改账号全局设置、未重发消息。平台已发布不替代CMP运行验证；下一步同一p2回正式预览检查。证据adsense-cmp-published-current-20261002.txt、orbix-worker-endpoint-diagnostic-20261002.json；TSX stdin导入首败保留说明，改用现有-e执行成功，无网络出口变化。目标active，本轮开发、测试及新诊断证据属于进展。


## 2026-10-02 18:06 TH 诊断测试发现后台健康采集旁路并修复
原构建1542退出0，镜像4a488f652cd394ecf649b3efbc60f44dcc43f735158b15a350dbf14f55f25be0，仅测试实例已部署healthy。真实认证admin health200/sourceChecks8条成功给出BitkubBTC DNS failure及USDT部分timeout、OrbixBTC current，现金缓存三源current。但原健康路由仍直接runCashScrapers忽略external，触发服务器原生抓取并给出全cash false；未写缓存或迁移DB，不能算完整验收。首败保存market-diagnostics-first-canary-20261002.json，原session69549退出0。
本地修复admin health external分支只读readCashCache并过滤publicCashProviders；未认证先401不读缓存/不发市场请求。113测试/38文件、tsc/聚焦lint/diff通过。已同步原隔离上下文，启动新tag codex-market-diagnostics-guard-20261002，活动session74981，日志/tmp/exchangethb-market-diagnostics-guard-build-20261002.log；尚未发布，下一轮必须先观察同一构建。正式web和worker仍a3c138e且healthy，canary为4a488f测试制品，Postgres不变。
CMP正式官方测试URL当前仍__tcfapi undefined、dialog0、fundingresources0、广告unfilled，无收入/同意弹窗已可用声明；adsense-cmp-runtime-current-20261002.json保存。Google官方帮助web工具timeout一次后不重试/不绕过；平台已发布和等待审核保持独立。目标active，本轮实际构建和漏洞修复进展。


## 2026-10-02 18:10 TH 行情诊断与后台采集门禁正式发布
原guard构建74981退出0，97f0619c3d8956660a2a89de1fc111e963d96f2ec8adad30272c9999358ba33a，compose.market-diagnostics-guard-20261002.yml。测试实例真实admin200/匿名401/external/3源ok/sourceChecks8项通过，才切正式web与worker；两web+worker实际healthy，Postgres原108b27不变，collector/固定代理未重启，不迁移DB。回退compose.worker-source-sync-20261002.yml/a3c138e。
正式认证admin实际200/external、仅三保留源且ok；公开SGD1000卖出390px实渲染29,700、无横溢出/移除来源，dataStatus=current；结果初始标题637px，不能据此声称本次又测过选择自动滚动，原独立选择验证仍保留。新worker11:08:21UTC statusok，各交易所至少一个BTC或USDT有效；BitkubBTC dns failure/OrbixUSDT timeout仍记录，不能称8个市场全可用。113测试/38文件、tsc/聚焦lint通过，新正式十语SEO94821退出0。证据market-diagnostics-guard-canary-20261002.json、market-diagnostics-guard-production-admin-20261002.json、market-diagnostics-guard-production-mobile-20261002.json、market-diagnostics-guard-worker-20261002.json和SEOlog。
广告审核/真实CMP及现金许可仍未完成；既有信息按未知/等待显示，不将API请求或一般跳转当收入。目标active，本轮实际发布与验收进展。


## 2026-10-02 18:14 TH 完整审计与受限备份
上一轮是实际正式发布进展。本轮逐项整理FINAL_ACCEPTANCE_MATRIX.md，最新正式cash30组合再次真实回读全200/current、算术0错误/无被移除来源，final-cash-matrix-20261002.json。官方BOT PDF159页实际页脚20/3/2023，历史实体记录不能证明2026当前许可证，不更新verified；cash-license-history-audit-20261002.json。
项目路径定向查备份：远端rg未安装，改find，仅该项目未见现有dump，不声称整个1Panel无备份。为当前DB制作一致custom pg_dump，/opt/exchangethb/runtime/backups/exchangethb-20261002-1813.dump，0600/目录0700，14159bytes、sha4645c1f3d2bb3d67a14b49301e5b57787107a8f8e27771ba41596cf520e9316f。pg_restore list29entries及完整解码到/dev/null退出0。未实际恢复生产/未孤立恢复演练/未自动备份，不进本地源码或Git。证据current-database-backup-20261002.json。目标active；下一步最新版加密30组合与恢复演练，不重复构建已完成74981/94821。


## 2026-10-02 最新全加密矩阵与真实恢复验证
上一轮是受限备份及当前现金30组合审计进展。本轮正式97f0619c加密15资产x2方向30响应全200，其中28有live、LTC两方向实际无有效报价（不补造历史价）。逐条现行普通费用、收到资产扣费、提现估计和净到手复算0错误，所有返回报价官方来源/120秒新鲜度通过。session59051退出0，完整payload证据final-crypto-matrix-20261002.json。来源数随当次可用性变化，未保证每平台支持每资产或所有请求永不失败。
受限备份在自己的临时Postgres16容器8d2c6b73…、networknone、无port、配置tmpfs内存数据路径中真实pg_restore single transaction exit0；七应用表精确counts与生产只读counts一致（AdminAuditLog17/ConfigState2/CashCacheState1，其余0），BTC费用Orbix0.25/Upbit0.15读取正确。没写生产DB，没调用地图重置额度或读原始用户记录。已stop同一自建容器，--rm实际清理，生产postgres原108b27 healthy不变；受限dump保留。证据database-backup-*-counts/config-check和current-database-backup-20261002.json。自动备份未配置，不能称长期自动保护。验收矩阵更新；仍待现金当前许可与AdSense审核/CMP真实运行，目标active。


## 2026-10-02 完整目标外部阻塞审计
上一轮是完整加密矩阵与真实恢复的实际进展。当前全部已授权且可独立执行的开发/测试/发布验收已落证据，仍不能标全目标complete：AdSense实际官方18:28TH回读仍正在准备/已请求审核；站点限定CMP已发布但实际弹窗未证明，原因不能无证断定为审核；现金店当前资质官方页面仍未可匹配，2023历史PDF不能升格。上述同一外部条件在完整备份审计、全加密与隔离恢复、当前平台复查至少三连续目标轮均未解除；现无新的安全独立开发动作能替代官方审批和当前许可证据。阻塞审计满足，准备将goal标blocked，不虚报complete、不暂停网站服务。
复用原exchangethb每日09:00 heartbeat，仅更新提示词加入FINAL_ACCEPTANCE_MATRIX、AdSense审核及CMP、现金当前资质的实质变化检查，API回读ACTIVE，rrule/target不变；正常或仍待审核/许可未验变化不通知。不新建调度、不切生产、不重复申请审核/重新发布CMP、不买广告。证据remaining-external-blockers-final-20261002.json。Google官方帮助核对：7584263说明广告需站点批准，10959060自动撤回同意链接仅获批且安装AdSense代码站点；这些并不能证明本次CMP未弹出的唯一根因。后台/用户状态保留unknown。
当前正式97f0619c，113测试通过，现金30/30当前和加密28/30live（LTC空）严格验证，十语SEO、手机/GPS、110 Maps评论、生产统计接收和隔离恢复证据详见FINAL_ACCEPTANCE_MATRIX；时间范围、测试流量、失败与未知分别保留。自动备份尚未配置，不把一次备份称长期自动保护。

## 2026-10-03 Four exchange company backgrounds

User requested company background and best official introduction link. Added verified operator/background, one official introduction link and checked date to comparison quote details, exchange hub and profiles;10-language content. Binance TH Gulf Edge/BinanceJV, Bitkub local operator/foundation, Upbit Thai operator/technology relationship (no unproven ownership), Orbix KBank group/distinct Invest business.113existing tests/38files, typecheck/lint/diff passed; final remote buildexit0. Exact deployed image6df736c6734280a9131d01801fc88be1660f0c9a29f0cbec4701f8483be50ee8; rollback previousmarket-diagnostics-guard compose; no migration/config/affiliate changes. Public390px hub4backgrounds verified. Evidence artifacts/company-background-release-20261003.json and company-background-mobile-20261003.json. Existing ad/license blockers remain separate; no whole-goal completion claim.

## 2026-10-03 Visible quote costs

User requested cost comparison easier to see. Trading percent/amount, THB withdrawal and buy net assets now visible without opening details. Existing calculation/fee sources preserved; unknown network/fiat fees are not free. Twelve fee/execution tests passed; typecheck/lint/build exit0. Public390px buy and sell verified (2 and3 live quotes respectively), cost rows outside details and no overflow. Final image69a9d682; previous6df736c rollback retained. No bank/network selector or net-target inverse solver delivered; prioritized in SERVICE_VALUE_PLAN.md. Evidence artifacts/visible-costs-release-20261003.json, visible-costs-buy-mobile-20261003.json, visible-costs-sell-mobile-20261003.json.

## 2026-10-03 Non-server cost policy

User explicitly prioritizes minimizing all expenses beyond existing server. Embedded Google Places reviews now disabled (GOOGLE_PLACES_ENABLED0 in protected server runtime and latest compose overlay); no changes to secret, project, billing, other sites or shared proxy. Official monthly free tier for review field SKU1000 events, then25USD/1000 first tier; usage aggregated by billing account, not assumed private to this site. Existing application cap500/month was not monetary hard cap. API provider200 returns not_configured before budget/upstream request; cash comparison and outbound Google Maps links remain working. Phone browser location does not require our Places call. No persistent review cache introduced (Google restrictions); historical actual bills unverified. Default do not re-enable paid API consumption without specific cost authorization. Evidence artifacts/google-cost-saving-20261003.json.

## 2026-10-03 User restores Google reviews with original bounded queries

User corrected previous disable choice: restore Google store information/reviews, limit usage. Enabled original protected runtime/latest compose; no new key/project or cache. Original shared DB budget25/hour25/day500/month applies across two replicas and restarts, counted retries fail closed. Live Ratchada provider returned200/available5reviews; monthly attempts24→25, not asserted billable calls. Three budget tests passed. Limit is application requests, not global billing hardcap; Google free1000/month SKU aggregated across billing account. No background polling, no persisted reviews. Previous disabled-mode entry is historical superseded by this user instruction. Evidence artifacts/google-reviews-restored-budget-20261003.json.
