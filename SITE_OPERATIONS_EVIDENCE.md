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

10-06 01:04 发布的新镜像 exchangethb:codex-tenlang-20261006 运行 8 小时无重启：四容器 healthy（web/web_canary/worker + postgres）。正式站 health:prod passed；/api/health status=ok、storage=database/databaseReachable=true、dataStatus=current；现金三来源 current 31/31/5，报价时间 2026-10-06T01:55–01:56Z；sitemap 64 条；/ads.txt 已上线。本地采集器探针 exit 0，最近一轮 01:56:17Z（检查前 4 分钟）。公开接口现金 SGD、加密 USDT 卖出、BTC 买入均 200 且有报价。worker 最新轮次 status=ok、四家交易所 BTC current、fallbackOnly=false；USDT 源检查仍 unavailable（发布前既有行为：生产旧镜像内 worker 代码与本次发布逐字节相同，公开 USDT 接口仍返回报价）。GA4 衡量 ID G-HHPM4E9QGY 已在生产 layout chunk 中实测存在（构建期注入生效），HTML 内不出现属预期（同意后才加载）；平台侧接收本轮未验证。AdSense：ads.txt 已上线，页面存在 adsbygoogle.js loader（client=ca-pub-8386341379958173），无 ad slot；审核状态本轮未读（Google 流量已按老板决定交 fujane 统一管理）。CMP 运行时仍未见 tcf/__tcfapi 标记，未验收。BOT 牌照查询页仍返回 maintenance，现金店当前资质仍只能记 unknown（状态未变）。GSC/GA4/Cloudflare 面板、推广链接有效期与真机 390px 本轮未验证，不冒充已验结果。无新可行动故障；未切版本、付款、重启、换出口或外发。证据 evidence/2026-10-06/heartbeat-audit-20261006.json。规则SHA c5ad3c6980e3ac645ef4f0da0b703dfd88bcc1e0aedd69d3d16202e36d0dc364，基座Git 4ba3580aeb57d7b216ce2b03a4b5a9d062ababb8。

## 2026-10-06 生产发布记录（正文并入本文件；原 RELEASE_2026-10-06.md 已按文档纪律归档）

- 范围与制品：目标 https://www.exchangethb.com（主机 `1panel-happy` / 192.168.1.83，目录 `/opt/exchangethb`）；发布源码 = 工作区 @`cbc153f`（分支 codex/mobile-simplification）；新镜像 `exchangethb:codex-tenlang-20261006` = `sha256:f6ccf3d2e0689751c440795b6c28ef7feb1b80f2b1c2bb8a0571067e858f3bac`；构建源 `/opt/exchangethb/release-20261006`，构建日志 `runtime/backups/build-20261006.log`（BUILD_EXIT=0）；compose = `docker-compose.yml` + `compose.release-20261006.yml`；切换 2026-10-06 01:04–01:05 +07，无 DB schema 变更。
- 发布前门禁：127 tests / 39 files 通过、tsc 干净、eslint 0 问题（修 `artifacts/**` 误入 lint，提交 `cbc153f`）、next build exit 0、health:prod passed；GA4 `G-HHPM4E9QGY` 构建期注入（镜像 bundle 26 处，与旧镜像一致）。
- 备份与回滚：DB 快照 `runtime/backups/exchangethb-20261006-0105.dump`（sha256 `60b1e21b9c5640ddbfe436777c6440023cb4e651f075646edd55203f23459f0d`）；源码+compose 归档 `runtime/backups/opt-exchangethb-source-20261006-0105.tgz`（sha256 `505579e19dc78e64843d96a22ed28d914b0a11801d59277abff685a941e0ce0e`）；回退镜像 `sha256:69a9d68213bf18b51bd4a5ff74cfcadd5c8f65a7b7e581e58833acfd6ccf0fe0`（`exchangethb:codex-visible-costs-20261003`，记录于 `rollback-image-20261006-0105.txt`）。回滚命令：`cd /opt/exchangethb && docker compose -f docker-compose.yml -f compose.visible-costs-20261003.yml up -d --no-build web web_canary worker`。生产 `.env`、`content/*.json`、33 个历史 compose 覆盖均原样保留。
- 验证：预发布用独立 canary 容器（+SSH 隧道，未影响线上）——`/api/health` ok、十语 200、`compare/cash` 200、SEO 集群脚本 exit 0（含 `/ads.txt` 与重定向）；切换后公网 health:prod passed、`/en /th /zh /ja /ru` 200、`/ads.txt` 200（本次新增上线）、`compare/cash` 与 `compare/crypto` 200、容器 `restarts=0` healthy。
- 发布前现场核对：`/opt/exchangethb`（当时 HEAD `ae40915`，21 个 modified + 33 个 compose 覆盖）逐项 diff 未发现工作区缺失的独有修复（`lib/seo.ts`、`middleware.ts` 工作区为超集；`sitemap.ts` 的 `/en` 规范已含；首页即时对比改为客户端组件 `components/home-comparison.tsx`；门店 FAQ 改为按 provider 动态生成）；发布后 live 源码目录同步为 `cbc153f`（rsync 不带 `--delete`）。
- 遗留（不标完成）：worker 首轮 `degraded` 已定性为容器重启后 DNS 预热（第二轮 `status=ok`、四家交易所 BTC `current`；USDT 源 `unavailable` 属发布前既有行为，旧镜像内 worker 代码与本次逐字节相同）；手机真机 390px、GA4 平台侧接收、AdSense 审核/CMP、现金店当前牌照未验收。发布不等于 AdSense 获批或排名变化。
- 证据原件：`evidence/2026-10-06/heartbeat-audit-20261006.json`；原 `RELEASE_2026-10-06.md` 归档到 `/Volumes/M2USB/archive/exchangethb-docs-20261006/`。

## 2026-10-07 00:37-00:46 TH 两项线上优化（老板批准「优化掉」）

**① 漏洞扫描防护（生产 nginx）**：`/www/sites/exchangethb.com/proxy/root.conf` 的 `location ^~ /` 内加入两条 `if ($request_uri ~* ...) { return 403; }`（扩展名族与探测目录族；必须写在 location 内，因为 `^~ /` 会跳过正则 location 求值 —— 既有 .env/.git 正则规则此前实际从未生效）。备份 `root.conf.bak.20261007-probe-block`。上线依据：10-06 当天 3,199 请求中 2,502 为 404（78%），其中 .php 结尾 1,621 个，每个打 Next 渲染 11.7KB。上线后实测 200=170、403=10（全为探测路径）、404=1。合法路径（/en /zh/cash /th /robots.txt /sitemap.xml /ads.txt /llms.txt /api/health /admin/login /google*.html）全部 200，`/.well-known/acme-challenge` 未被拦（证书续期不受影响）。注意：1Panel 面板若重新保存该站点反代会覆盖此规则。

**② 中文详情页纳入索引（发布 codex-zh-detail-20261007）**：zh 的门店/交易所详情页此前被 noindex（页面本身已有完整中文文案：CJK 278-298 字），而 th 门店详情已可索引。现按 th 先例开放 zh：`lib/indexing-policy.ts` 增加 indexedExchangeLocales=['en','zh']、indexedMoneyChangerLocales=['en','th','zh']；两处页面 alternates 扩为 en/zh 与 en/th/zh；sitemap 增加 7 条中文详情 URL（64→71）并互指 hreflang；SEO 集群脚本与新增 tests/indexing-policy.test.ts 同步。门禁：134 tests/40 files、tsc 干净、eslint 0、next build 0、canary SEO 脚本 exit 0。发布：镜像 sha256:80fe5f014aab…，web/web_canary/worker 同版本 restarts=0、health:prod passed；回退镜像 sha256:f6ccf3d2e068…（compose.release-20261006.yml）。未改数据库。证据 evidence/2026-10-07/。

## 2026-10-07 09:00 TH 每日只读核验（生产事故 + 现金牌照突破）

核验窗口 2026-10-07 09:00–09:20 +07（02:00–02:20Z），生产版本 `exchangethb:v0.1.0-20261007-market-retry`（`45ea920c4f3f`）。

**站点与数据（正常）**：`health:prod` passed（`/` 308→`/en`、`/en`、`/robots.txt`、`/sitemap.xml`、`/api/health` 全 200）；`/api/health` status=ok、`storage=database`、`databaseReachable=true`、`dataStatus=current`；现金三源 SuperRich Thailand 31 / Ratchada 31 / Twelve Victory 5 全 current（最后尝试 01:53:5xZ）；现金比较 SGD1000 = 200，三家 `providerHealth` 均 `live_fresh`、`fallback 0`、bestRate 33.58/33.64；加密 USDT 卖出 200（10.6s，Orbix 为本次实时盘口）。sitemap **71** 条；`/ads.txt` 200；探测拦截仍生效（`/.env`、`/wp-login.php`、`/sites/default/`、`/phpmyadmin/`、`/xmlrpc.php`、`/adminer.php` 全 403，`/en /th /zh /sitemap.xml /robots.txt /ads.txt /api/health /admin/login /llms.txt` 全 200）。GA4 `G-HHPM4E9QGY` 在线上 chunk `/_next/static/chunks/app/[locale]/layout-9d1c3195447f65d6.js` 实测存在；页面有 adsbygoogle loader（`ca-pub-8386341379958173`）无 ad slot；HTML 仍无 `__tcfapi`/同意标记。

**①生产事故：宿主磁盘写满，worker 停机 5 小时 10 分（未修复）**
- 宿主 `1panel-happy`（192.168.1.83）根分区在 **2026-10-07 03:30–03:56 +07** 写满：该窗口 journal 38.8 万行，其中 25.3 万行 `no space left on device`，最后一条 03:56:24（rsyslogd 写 /var/log/syslog 失败），04:00 之后 0 条。
- dockerd 报 `write /var/lib/docker/containers/<id>/.tmp-config.v2.json: no space left on device event=exit` —— 退出事件没能落盘，因此 `docker ps` 仍显示 `Up 6 hours (unhealthy)`，而 `docker inspect` 为 `exited / Running=false`，`docker top` 与宿主进程检查均证实**已停**。`docker system df`：镜像 23.69GB（10.17GB 可回收）、容器 1.928GB（699.7MB）、卷 27.13GB（1.221GB）、构建缓存 0B。现况 117G 总 / 94G 用 / **17G 可用（85%）**，inode 15%。
- exchangethb-worker 容器（`5d2d6e01214e…`）`StartedAt 2026-10-06T20:30:40.997Z`、`FinishedAt 2026-10-06T20:51:33.599Z`、`ExitCode 1`、`RestartCount 1`、重启策略 `unless-stopped/0`；最后成功周期 20:40:59Z `status=ok`；崩溃为 `ENOSPC`，位置 `worker/index.ts:17 writeHeartbeat`。因 03:51 之后再未拉起，检查时停机约 5 小时 10 分。
- 同宿主邻近项目容器同期退出（`vdamo-cloud-app/queue/scheduler/mysql/nginx`、`aiclient2api`），说明这是**宿主级共享问题**而非本项目回归。本会话未定位到压满磁盘的单一写入者（无 sudo），rsyslog/journald 刷屏是症状不是已证实根因；现存的 12GB 余量不是本会话释放的。
- **影响面**：仅后台行情健康周期与心跳文件；站点、现金数据导入与按请求实时行情均不受影响。**未执行任何重启**（属生产变更）。
- 恢复方案（已备好、等批准，不改镜像不改库）：`docker compose -f docker-compose.yml -f compose.release-20261007c.yml up -d --force-recreate --no-build worker`；若因状态不一致仍报 already running，先 `docker rm -f exchangethb-worker-1`。

**②现金牌照：BOT 查询页恢复，三家公开现金商与当期官方法人+网点匹配（未写入站点）**
- BOT 英文查询页（站点 `cashLicenseLookup` 指向的页）已 200，标题 `Authorized Money Changers`，**不再是 maintenance**；泰文页给出当期名录 `listauthorized.pdf`：`รายชื่อและสถานที่ตั้งสำนักงานใหญ่ของบุคคลรับอนุญาต ณ 31 สิงหาคม 2569`（=2026-08-31，2026-09-23 印制，110 页 2083 条）。
- 逐条匹配（法人+地址）：`ratchada` = **MC125490056**「บริษัท รัชดา เอ็กซ์เชนจ์ จำกัด」78/13 ถนนประชาราษฎร์บำเพ็ญ ห้วยขวาง —— 与本站 `ratchada-main`「78/13 Prachatbamphen Rd., Huai Khwang, Bangkok 10310」逐字一致；`twelve-victory` = **125470175**「บริษัท ทเวลฟ์ วิคทอรี่ เอ็กซ์เชนจ์ จำกัด」231 ถนนประดิพัทธ์ พญาไท 10400 —— 与本站十二胜利总部地址逐字一致（该品牌另有 MC125500012 等多家分店法人）；`superrich-thailand` = **125470152**「บริษัท ซุปเปอร์ริช (ไทยแลนด์) จำกัด」45-45/1-2 ซอยราชดำริ 1 ลุมพินี ปทุมวัน 10330 —— 法人+拉差达里总部，与线上汇率行的 branchName「SuperRich Thailand Ratchadamri」一致（本站该 card 本身是水门区域参考地址）。
- 结论修正：此前「现金店当前资质只能记 unknown」的**原因是该查询页当时维护中，而非缺牌照**；2023 年旧名录不再引用，改用本当期名录。限制：名录只列**总部**地址、为按月快照，不等于全部分店许可均已核验；同名品牌存在多个法人，只采用与本站营业地址匹配的那一个。
- 落地（把 licence 证据写入 admin 内容存储并重新发布可见状态）属**生产数据变更**，等批准后执行。

**本轮未验证**：GSC 索引与搜索点击、GA4 平台侧事件接收、Cloudflare 面板访问与性能（curl 未复现 `/cdn-cgi/rum`、curl 返回的 HTML 未见 cloudflareinsights 脚本，不足以下结论）、AdSense 审核状态与站点限定 CMP 实际弹窗、手机真机 390px 回归。

**动作**：全程只读；未重启容器、未切版本、未回退、未付款、未外发、未换出口、未改数据库。证据：`evidence/2026-10-07/worker-outage-host-disk-20261007.json`、`evidence/2026-10-07/bot-money-changer-licence-20260831.json`、`evidence/2026-10-07/bot-money-changer-list-20260831.pdf`（sha256 `f2f111e323f4ae9371ffc295b1a77d88bfbda503bbf1f9c594ed6d29b528d8c2`）。

## 2026-10-07 11:08 TH 写入现金牌照证据（fujane 批准后执行）

**批准与快照**：fujane 2026-10-07 11:04「③licence 写入：写（证据条目，有快照即可；写完公网回读截图进 evidence）」。改动前快照 = 生产 `AdminConfigState`（key=`global`）整行 → `/opt/exchangethb/runtime/backups/admin-config-state-20261007-1000.json`；恢复该行即把三家牌照退回 `unknown`。

**写入方式**：在 `exchangethb-web-1` 容器内用应用自己的 `readAdminConfig` / `writeAdminConfig`（`lib/content-store.ts`，zod 全量校验）合并 `evidence[<slug>].license`，只动这三条、其余字段原样透传；脚本留档 `evidence/2026-10-07/apply-licence-evidence.ts`，跑完已从容器删除。payload：`status=verified`、`checkedAt=2026-10-07T03:50:00.000Z`（10:50 +07）、`expiresAt=2026-11-21T03:50:00.000Z`（+45 天，名录按月更新，到期强制复验）、`sourceUrl` = BOT 泰文名录页、`note` 写明牌照号/名录条目/总部地址与匹配依据。

**库内回读**：`SELECT value->'evidence'-><slug>->'license'->>'status' FROM "AdminConfigState" WHERE key='global'` → ratchada/twelve-victory/superrich-thailand 三条均 `verified`，`evidence` 共 **7** 个键（原 4 家加密交易所 + 新增 3 家现金商，合并未丢任何键）。

**公网回读（2026-10-07 11:12 +07）**：`GET /api/providers/cash/{ratchada,twelve-victory,superrich-thailand}` 均 **200**，`state=verified`、`checkedAt=2026-10-07T03:50:00.000Z`、`expiresAt=2026-11-21T03:50:00.000Z`。真机（HONOR BVL-N49，390×900，展开「平台依据与口碑」）实渲染：zh `/zh/money-changers/ratchada` = 「牌照核验 | 已核验 | 查看依据 ↗ | 核验时间: 2026/10/7」；en `/en/money-changers/twelve-victory` = 「License check | Verified | View evidence ↗ | Verified on: 07/10/2026」；th 页因该机 Chrome 的自动翻译而显示为中文（浏览器行为，非站点缺陷，已在证据里注明）。截图与 sha256 见下。

**限制**（写入不改结论强度）：该名录只列**总部**地址，持牌不等于每个网点均已核验；是 **2026-08-31 月度快照**（2026-09-23 印制）；SuperRich Thailand 属**实体级**匹配（站点自身门店卡是水门区域参考地址，名录只有拉差达里总部）。

**证据**：`evidence/2026-10-07/licence-public-readback-20261007.json`（含 API 状态码与响应体、库内查询结果、实渲染行、三张截图 sha256）、`licence-readback-zh-ratchada.png`、`licence-readback-th-superrich-thailand.png`、`licence-readback-en-twelve-victory.png`、`apply-licence-evidence.ts`、`licence-readback-probe.mjs`、`bot-licence-matches.tsv`、`bot-money-changer-list-20260831.pdf`。

**配套（同日）**：worker 已于 10:01 按 fujane 批准用 `compose.release-20261007c.yml` 重建并 healthy（记录在本文件「2026-10-07 09:00」节与 lark-status）；fujane 批准的低峰变更——把 web_canary/web 也统一到同一 DNS overlay（先 canary、通过再 web、失败回滚）——已排入 **2026-10-08 03:00 +07** 窗口，执行步骤与回滚写在该定时任务提示词与 lark-status 里。

## 2026-10-07 14:20 TH worker 偶发 degraded：定量根因与 24h 指标门槛（只读）

**观测窗口**：worker 于 2026-10-07T03:01:06Z（10:01 +07）按批准重建，故容器日志只有重建之后的周期 —— 03:01Z–07:07Z，共 **25 个周期 / 4.1 小时**（导出 `/Volumes/M2USB/_scratch/exchangethb/20261007/worker-logs-full.jsonl`）。**不足 24h，以下不作为 24h 结论。**

**周期判定是「全有全无」**：`lib/data-status.ts:21` 的 `cycleStatus` 要求「四家交易所各有至少一个币种新鲜 **且** 现金源全部 current」。所以 25 轮里 13 ok / 12 degraded（48%）这个串不能当故障率用 —— 1/8 检查失败与 8/8 全失败显示同一个 `degraded`。

**逐检查可用率（25 周期 × 8 检查）**：binance-th/BTC 80%、binance-th/USDT 72%、bitkub/BTC 84%、bitkub/USDT 48%、upbit-thailand/BTC 80%、**upbit-thailand/USDT 8%**、orbix/BTC 76%、orbix/USDT 76%。失败原因计数：`source_timeout` **49**、`stale_orderbook` **17**、`source_dns_failure` **3**。8 个检查同时失败的周期只有 1 个（06:36Z）。

**根因（实测）**：
1. **upbit-thailand/USDT 的 8% 是设计性陈旧，不是故障**：该所 USDT 盘口本身更新极慢（同一时刻其 THB-BTC 仅 16 秒前），校验器按 >2 分钟拒绝 `stale_orderbook` 是正确的，前端按设计标 fallback。
2. **其余 timeout 与 DNS 失败来自出网解析/取回慢且丢包**：worker 容器 `/etc/resolv.conf` 已是 `ExtServers: [8.8.8.8 1.1.1.1]`（c.yml 覆盖生效，**已绕开宿主 systemd-resolved**），但容器内实测 DNS 解析仍为**中位 ≈2.5 秒、每 10 次失败 1–3 次**（binance.th 2546ms/2 错、bitkub 2586ms/3 错、upbit 2552ms/1 错、orbixtrade 2619ms/2 错）；HTTPS 取回 bitkub 中位 40ms、binance 111ms、upbit 2601ms、orbixtrade **3 次里 2 次失败**。**故「宿主 resolver 上游含 47.84.83.155」不能作为 worker 抖动的充分解释**，此前那条 needs_owner 判断需收窄（它可能只影响仍在用宿主 resolver 的 web/web_canary）。
3. **失败逐源独立**：BTC 只有 4/25 周期出现 ≥2 家同时失败；USDT 上 binance 与 bitkub 同时失败 5 次、单侧失败 10 次、都不失败 10 次 → 指向逐请求超时/丢包，而非一次全局断网（唯一例外是 06:36Z 那轮 8/8）。

**用户可见影响**：结果页对过期行已有降级机制（进「仅供参考」分组 + 附警告），所以 degraded 的主要后果是**更多行被降级**，而不是展示错价。唯一缺口是聚合的「缓存生成时间」没展示：`cacheStale` 已由 API 计算并传进前端，但 `components/exchange-picker.tsx` 从未渲染（已记入待办，本轮未改）。

**现金源**：superrich-thailand 与 twelve-victory 25/25 current；ratchada 24/25 —— 06:46Z 那轮 `status=reference, currentCount=0`（该轮采集未成功），次轮恢复，无跨轮连续陈旧。

**建议的 24h 指标门槛（按可用率告警，不按 `degraded` 串）**：① 除 `upbit-thailand/USDT`（设计性陈旧）外，任一检查 24h 可用率 <90% 告警 —— 按当前基线 76–84% **现在就会触发**，说明要先改进再收紧门槛；② 出现「8 个检查同时失败」≥1 次/24h 立即人工确认（真实断网信号，当前 4%）；③ 任一现金源连续 2 轮（≈20 分钟）非 current 告警；④ 存活沿用 `health:worker`（退出 5 分钟 / 心跳 25 分钟）；⑤ 观察期 24h，改进（DNS 结果缓存、降低并发）上线后按新基线收紧。

**动作**：全程只读（`docker logs`、`docker exec` 内跑的 DNS 探测、`docker inspect`、`docker compose config`）；未重启、未改容器、未发布、未改数据库。证据：`evidence/2026-10-07/worker-quality-and-dns-runbook-20261007.json`。

## 2026-10-07 14:20 TH DNS overlay runbook 复核：回滚命令有缺陷，已修正

**复核对象**：fujane 已批、排在 **2026-10-08 03:00 +07** 的 web_canary/web DNS overlay 统一（`compose.release-20261007c.yml`）。

**发现的缺陷**：原回滚写法是「去掉 c.yml，用 base `docker-compose.yml` 重建」。`docker compose config` 实测：base 里 `web`/`web_canary`/`worker` **只有 `build:` 没有 `image:`**，base-only 配 `--no-build` 解析不出镜像（会失败，或起成 `exchangethb-web` 这类非发布镜像）。用这条命令回滚会在最需要它的时刻失败。

**正确回滚（已核对）**：`docker compose -f docker-compose.yml -f compose.release-20261007b.yml up -d --force-recreate --no-build <服务>`。`b.yml` 与 `c.yml` 逐字节**只差三处 `dns:` 块**，`config` 解析出的 image 仍是 `exchangethb:v0.1.0-20261007-market-retry` 且无 dns。

**现场基线（14:20 +07 实测）**：web / web_canary 由 `docker-compose.yml + compose.release-20261007b.yml` 创建（`com.docker.compose.project.config_files` 标签证实），`HostConfig.Dns` 为空；worker 由 base+c 创建，`HostConfig.Dns=[8.8.8.8 1.1.1.1]`。canary 与 web 都不发布宿主端口、都在 `exchangethb_net`（172.30.0.13 / 172.30.0.10），公网入口 nginx `proxy_pass http://exchangethb_pool` —— 重建 canary 是内部动作，重建 web 会有数秒对外不可用（属已批准窗口）。

**runbook 其他修正**：固定「等 70 秒」改为**轮询最多 180 秒**（healthcheck interval 30s / retries 5 / 无 start_period；实测 `Ready in 2.2s`，但轮询更稳）；基线记录增加 `config_files` 标签；回滚后要核对 `HostConfig.Dns` 恢复为空；显式**禁止 base-only 回滚**。已同步改写定时任务 `schedule-3674139c-8fff-44e3-a321-a7ce6b9eb661` 的提示词，并在 lark-status 对应小节写明。

## 2026-10-07 14:50 TH 路线页索引扩展（th/zh）—— 本地候选，未发布

**据以纠正的旧说法**：lark-status 原记「泰语路线页 27 条已有 th 文案、仅 4 条 en 在 sitemap，待确认收敛决策」。查实后**该说法不准确**：`lib/route-guides.ts` 确有 27 条文案，但其中 **23 条是 `middleware.ts` 里 `routeRedirects` 的 301 别名**，根本不渲染页面（例：`/en/routes/eth-to-thb` → 301 `/en/crypto?symbol=ETH&side=sell`）；真正存在的路线页只有 4 个 slug（`btc-to-thb`、`usdt-to-thb`、`usd-cash-to-thb`、`bangkok-airport-money-exchange-guide`）。所以真问题不是「27 条要不要放开」，而是**这 4 个页面只有 en 变体被索引**。

**生产实测（改动前，14:40 +07）**：`/th/routes/usd-cash-to-thb`、`/zh/routes/usd-cash-to-thb`、`/th/routes/btc-to-thb`、`/zh/routes/btc-to-thb` 均 **200**，`<html lang>` 与 `<h1>` 都是原生 th/zh 文案，但 `robots` = **`noindex, follow`**，且 **canonical 指向 en URL**（`metadataAlternatesForPolicy` 在 `['en']` 策略下把非 en 语言的 canonical 归到 en）。

**收敛决策（本轮采纳）**：**slug 集合不变，只放已验证有完整译文的语言** —— 路线页索引语言由 `['en']` 扩为 `['en','th','zh']`，与门店详情页既有策略（`indexedMoneyChangerLocales = ['en','th','zh']`）对齐。依据：`CopyGroup` 类型**强制要求** th/en/zh；路线页 `uiCopy` 有完整 th/zh 块；middleware 也已限定详情页仅 en/th/zh（其他语言 307 回 en）。**不放开更多 slug**：27 条共用同一模板、内容高度重叠，放开会引入模板化薄页风险，且需要搜索侧（GSC）证据支持，属 fujane/老板车道。

**实现**：`lib/indexing-policy.ts` 新增 `indexedRouteLocales` 与 `routeAlternateLocales(slug)`，`shouldIndexRoute` 由「仅 en」改为「slug 在集合内且语言在 `indexedRouteLocales`」；`app/sitemap.ts` 按策略生成 4 slug × 3 语言 = **12 条**（删掉只服务路线的 `englishOnly`，改用既有 `englishThaiAndChinese`）；路线页 metadata 改用 `routeAlternateLocales(slug)` 取 alternates，避免策略与页面漂移。sitemap **71 → 79** 条；`scripts/check-seo-cluster.mjs` 的 `expectedLocCount`（79）与 `mustInclude`/`mustNotInclude` 同步；`AGENTS.md` 的详情页索引策略条目与 sitemap 条数同步。

**本地验证（全部实测，输出见证据文件）**：`npm run typecheck` 干净、`eslint . --max-warnings=0` 0 问题、`npm run test` **146 tests / 42 files** 全过（新增 4 条路线索引断言）；`npm run build` exit 0；本地 `next start`（PORT=3210）实测 `/sitemap.xml` **79** 个 `<loc>`、4 slug × en/th/zh 齐全、`eth-to-thb` 未泄漏；`/th/routes/usd-cash-to-thb` 与 `/zh/routes/btc-to-thb` 200、**canonical 已自指**、alternates = en/th/zh + x-default、**robots noindex 已消失**（`localeRobots` 对可索引语言返回 undefined = 默认可索引）；`/ja/routes/usd-cash-to-thb` 仍 307 → `/en/...`、`/en/routes/eth-to-thb` 仍 301 → `/en/crypto?...`（别名行为未变）。

**脚本对本地实例的 1 项 FAIL 已定性**：`scripts/check-seo-cluster.mjs http://127.0.0.1:3210` → 30 项中仅 `/en/routes/usd-cash-to-thb` 缺 `/Latest data reference/`。原因是该块只在 `latestRouteDataTimestamp` 有值时才渲染，而本地**无现金缓存/行情数据**（本地 `/api/health` 的 `dataStatus.status=degraded`、现金源 unavailable），生产同页该文案存在（`grep -c` = 1）。**非本次改动引入**；该脚本是发布闸门，发布后需对 canary/生产重跑。

**状态**：本地候选，**未发布、未改生产**；发布需先写 lark-status「待审」并报 fujane 得「执行」。证据：`evidence/2026-10-07/route-index-expansion-local.txt`（含 79 条计数、12 条路线 URL、canonical/alternates/robots、307/301 行为、脚本输出）。
