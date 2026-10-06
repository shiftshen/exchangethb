# ExchangeTHB 运维接管实测

2026-10-01，Ego TaskSpace 6，Profile 16，页面确认 Google 账号 fujane110@gmail.com。

- Search Console sc-domain:exchangethb.com 域名所有权验证成功。Cloudflare zone a28cae90fc75e24f5e0202025e1177bd，新增 TXT ID 46463d23ed812a46201165b2f762a40e，原两条 TXT 保留。
- 概述：图表约 2026-06-29 至 2026-09-21，23 次网页搜索点击；25 页已索引，162 页未索引。这是搜索统计，不是访问总量。
- 原 sitemap https://www.exchangethb.com/sitemap.xml，2026-07-11 提交，2026-09-22 上次读取，成功，发现 129 页。新源码 sitemap 数量需构建后独立验收。
- GA4 账号 410361296，媒体资源 557014525，流 ID 15934949405，ID G-HHPM4E9QGY，网站 www.exchangethb.com。账号与数据流已创建，尚未收到数据。关闭可选共享和增强型衡量，待受控埋点接入和实时验收。
- Cloudflare 已登记资产 e790e394b37047f3bde76d899eea81d5，Automatic setup。既有资产，尚需浏览器 beacon 与平台接收实测。
- 代理 nordvpn-th31-proxy running/unhealthy，18888 仅绑定 loopback；无切换出口、无直连重试、无重启。

仍需：核验 GA4 时区/币种保存值、部署标签与事件、关键事件配置、Cloudflare 接收、SEO未收录原因、代理恢复与真实源解析、共享登记受锁回写。正式重构版本尚未上线。

## 后续实测（同日）

GA4 设置已回读：泰国 / GMT+07:00，THB。预览地址用户同意后，实时报告出现 1 个测试活跃用户、page_view、comparison_started、comparison_success 各 1 次。截图 artifacts/ga4-realtime-test.png，脱敏结果 artifacts/ga4-realtime-test.json。生产 GA4 尚未部署；测试不计作真实营业流量。

关键事件 affiliate_click 与 official_click 已在平台关键事件列表回读，每会话一次、不设置默认货币价值。推广与官网点击不是注册成功或佣金收入。前端受控渠道标签使用 campaign_source/campaign_medium/campaign_name，不发送其他查询参数。

Cloudflare 面板已实读：最近24小时 / GMT+7 / excludeBots=Yes，13访问、22页面浏览；生产页面 beacon 自动注入，/cdn-cgi/rum 响应204。无重复 beacon。

Codex 每日09:00（Asia/Bangkok）heartbeat exchangethb 已创建且配置文件回读 ACTIVE；创建成功不等于首次计划执行已验收。

新统一路由 collect check 实测六个既有代理容器均 unhealthy，固定18888当前 proxy_blocked。此前503属于代理路径故障，未证明目标官网拒绝。无换出口、无直连重试。

最新治理复读：rules a16155a263e11d1c50310d1e22ad2986c2b7098d12ff1eca16901bf314d791c3；Git f40af363b03839c7dcc6e50a1704c84a2fd93f55。macOS/shift，ExchangeTHB；WebCodex Runner 在线兼容 v0.4.1，无活跃任务；本项目绑定仍受准许根目录限制，采用本地授权开发入口。受管 Python3.14.7 / Node26.10.0 / uv0.12.21 核验通过。资源未命中后已定向查原登记并复用，无重建。

GSC 网页索引（2026-09-21更新）回读：备用规范页23、重定向14、404为12、已抓取尚未索引32、已发现尚未索引81；合计162。主规则新增第13节已复读，最新规则SHA 6682918a5422b45b0a303cc7bda974047b18d026e4ed4e00ba4ef50b587aa241，Git f40af363b03839c7dcc6e50a1704c84a2fd93f55；飞鹅不属本任务范围。

## 2026-10-02 搜索实测与日文开发

Profile 16 / fujane110@gmail.com / Ego TaskSpace16，使用既有 sc-domain:exchangethb.com。正式 https://www.exchangethb.com/sitemap.xml 已重新提交，官方界面“已成功提交站点地图”，表格提交和读取2026-10-02、状态成功、已发现129。该数字属于旧生产站点，不冒充本地新版已收录。

效果报告选择既有近3个月网页搜索视图，图表范围2026-06-29至2026-09-28：点击23、展示6090、CTR0.4%、平均位置14.1。主要查询ratchada exchange（点击5、展示3684）。平均排名是该报告的聚合指标，不能称作所有关键词排名14。

新版增加日文首页/现金/加密/方法/声明/隐私/数据状态。保留英泰中，四语语言选择与互指hreflang；日文默认JPY，未完整翻译的次级交易所/门店/路线转英文307，不伪造日文索引。核心三页补充四语常见使用说明及关键词标题。日文390px浏览器实测scrollWidth390，JPY默认；改USD/2000后URL和结果自动更新，不点击比较按钮。

目标提示词见DEVELOPMENT_PLAN.md最后一节。目标工具仍为旧blocked，create_goal因unfinished goal被拒绝；没有恢复/编辑工具，不能虚报目标已重启。

本轮共享规则SHA256 25a8679ba6ab76cbcbb6381b1b076bffc7c98b46784619915f164f4d97008799；基座Git bafc5d60a30063fd3a5ef6068be60bae12c3a423。平台事实用foundation锁/SHA写回原search_console章节。

补充：更新Next至锁定版本15.5.27及相关依赖补丁，生产依赖npm audit --omit=dev为0；开发依赖仍有7项审计结果，不将此写成全依赖零漏洞。67测试、类型检查、lint通过；本机和1Panel独立制品完成生产构建。构建的Mac额外元数据曾导致远端编译失败，现已排除；基础镜像采用已验证digest，解决不稳定标签解析且提高一致性。

1Panel canary已接入真实数据库只读核验，健康接口ok、storage databaseReachable=true，但dataStatus=degraded：SIA仅reference，其他四家unavailable，当前有效报价均0。不能声称数据全部实时接通。当前固定本机采集代理18888仍unhealthy，collect check=proxy_blocked；未切换代理或直连绕过。

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

## 2026-10-02 09:01–09:05 TH 每日只读核验
正式HTTPS/页面/robots/sitemap/health通过。三个容器healthy；worker01:59UTC仍degraded，现金SuperRich31/Ratchada31/Twelve5当前、Vasu unavailable、SIA reference。现金SGD接口两家live、缓存约10分钟；USDT卖出本次四家live。均是单次检查，不保证全资产持续成功。
本站对外链接均official_only，Orbix campaign_only已降级；固定代理官网探测Orbix/Upbit200、Binance200随后size_limit、Bitkub403，未把限制误判为网站关闭或可获佣金。
TaskSpace23仍agentDelegatedToUser，未接管。新GSC索引/搜索点击、GA4后台漏斗、Cloudflare访问和性能未验证，旧统计不能冒充本次结果。原始HTML未见beacon，不足以断定浏览器统计失效。未生成同意后的统计测试流量，无部署/付费/外发/重启/换出口。证据artifacts/heartbeat-20261002T0201/。

### 2026-10-02 alternate-account Maps and real phone verification
User explicitly authorized shiftshen521@gmail.com. Profile1 / TaskSpace74 verified owner login. New dedicated exchangethb-maps project was created but billing link hit Google project-count quota; no payment made. Existing paid vdamo-420503 already had Places API(New) enabled. Created separate ExchangeTHB Places Server key, stored only in restricted credential references, restricted to Places API(New) and Google-observed production caller IP. Other keys and services untouched. Six branch IDs matched real Google Details against provider websites/addresses; SuperRich1965 and SuperRichThailand were kept distinct. Initial public five branches available; Twelve first public attempt unavailable, direct source and isolated actual compiled Next route later returned available. These attempts are recorded separately; final public/browser acceptance still required.
Application now reserves requests under an existing Postgres state row/advisory transaction lock, with unchanged25/day and500/month limits across replicas/restarts; hourly allowance adjusted to25 for browsing multiple branches. This is an application guard, not a monetary cap for the shared project. Reviews/rating/author content are not persisted; valid coordinate cache expires after30days and successful Details refreshes coordinates atomically without overwriting concurrent branch identity edits. API is private/no-store and key is never returned to clients.
ADB initially had no devices although phone debug modes were enabled. Restarting the original daemon, with no devices attached, restored BOTH USB and wireless transports for the registered HONOR BVL-N49. No Mac security permissions were changed. User handled Chrome precise-location-once prompt. First location request timed out during permission wait; second succeeded with ±18m accuracy, Ratchada1.8km / SuperRich6.5km from the phone. Currency selection SGD updated quotes automatically, and native Google Maps opened the matched SuperRichThailand45Ratchadamri1 place. No personal coordinates are written to URL or evidence JSON. Evidence: artifacts/phone-location-verified-20261002.json and artifacts/google-maps-key-configuration-20261002.json.

Final11:35TH: DNS retry release236ba9… all three containers healthy;92tests/32files plus typecheck/lint/build and formal ten-language SEO passed. Public SR1965 previously failed, now available5reviews; remaining five had real public available responses, Ratchada desktop5reviews and SuperRich phone attribution/rating/review layout verified. TaskSpace74 finished. Raw failures remain separately recorded. Full-source/affiliate/current-license gaps remain; no full-project completion claim. Current receipt DELIVERY_RECEIPT.md supersedes earlier Maps/mobile blockers.


## 2026-10-02 恢复目标后的平台实际接收验收

当期GSC、GA4、Cloudflare和自然采集周期证据已补齐，详见CURRENT_ACCEPTANCE_AUDIT.md的12:16TH节及五份current-20261002平台证据。GSC站点地图成功发现68页，搜索21点击/6060展现（2026-06-30至09-29）；GA4本轮合成测试5事件已实际接收，official_click关键事件；CF最近24小时77浏览/56访问，包含开发测试。三种统计不可相加。目标active，未完整完成。已恢复浏览器原declined统计选择，TaskSpace80结束。

## 2026-10-04 09:02 TH 每日只读核验
正式www HTTPS health、SGD现金/USDT加密比较均200；四容器healthy，仍69a9d682。现金三来源31/31/5自然循环当前，Ratchada一次失败已恢复，报价时间仍明确为10月3日10:05UTC；加密DNS/超时间歇状态继续，不以进程健康代表所有行情可用。Space86仍交还，未接管：本轮GSC/GA4后台、Cloudflare面板、AdSense审核/CMP、推广活动及现金许可新状态未验证，旧数据不冒充本次结果。未切版本、付款、重启、换出口或外发。证据artifacts/heartbeat-audit-20261004.json及三份公开接口原文。

## 2026-10-05 09:03 TH 每日只读核验
正式www HTTPS健康、SGD现金及USDT卖出接口均200；四容器healthy。现金三来源31/31/5均当前且报价时间今日01:59UTC。worker仍有行情DNS/超时间歇降级，未将进程健康当全部行情正常。原Space86当前列表不再存在，未另建替代或接管其他任务；AdSense新审核、CMP运行、GSC/GA4/CF面板、推广条件与现金当前许可本轮未验证。无新可行动变化，不重复通知。未切版本、付费、重启、换出口或外发。证据artifacts/heartbeat-audit-20261005.json及三份接口原文。规则SHA4713e6139f17fac2f4b82db34fc354a2fd5539480a39bfecb6adca98b56e72bc，基座Gitbc18b73d362045a54ee7fe0c2c46b7c402bc7f46。

## 2026-10-06 09:02 TH 每日只读核验（发布后 8 小时稳定性复核）

10-06 01:04 发布的新镜像 exchangethb:codex-tenlang-20261006 运行 8 小时无重启：四容器 healthy（web/web_canary/worker + postgres）。正式站 health:prod passed；/api/health status=ok、storage=database/databaseReachable=true、dataStatus=current；现金三来源 current 31/31/5，报价时间 2026-10-06T01:55–01:56Z；sitemap 64 条；/ads.txt 已上线。本地采集器探针 exit 0，最近一轮 01:56:17Z（检查前 4 分钟）。公开接口现金 SGD、加密 USDT 卖出、BTC 买入均 200 且有报价。worker 最新轮次 status=ok、四家交易所 BTC current、fallbackOnly=false；USDT 源检查仍 unavailable（发布前既有行为：生产旧镜像内 worker 代码与本次发布逐字节相同，公开 USDT 接口仍返回报价）。GA4 衡量 ID G-HHPM4E9QGY 已在生产 layout chunk 中实测存在（构建期注入生效），HTML 内不出现属预期（同意后才加载）；平台侧接收本轮未验证。AdSense：ads.txt 已上线，页面存在 adsbygoogle.js loader（client=ca-pub-8386341379958173），无 ad slot；审核状态本轮未读（Google 流量已按老板决定交 fujane 统一管理）。CMP 运行时仍未见 tcf/__tcfapi 标记，未验收。BOT 牌照查询页仍返回 maintenance，现金店当前资质仍只能记 unknown（状态未变）。GSC/GA4/Cloudflare 面板、推广链接有效期与真机 390px 本轮未验证，不冒充已验结果。无新可行动故障；未切版本、付款、重启、换出口或外发。证据 artifacts/heartbeat-audit-20261006.json。规则SHA c5ad3c6980e3ac645ef4f0da0b703dfd88bcc1e0aedd69d3d16202e36d0dc364，基座Git 4ba3580aeb57d7b216ce2b03a4b5a9d062ababb8。
