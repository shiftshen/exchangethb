# ExchangeTHB 完整开发规划与验收目标

2026-10-01；基于当前 main `873beb6` 和已完成的手机界面修改。当前任务授权本地开发、测试及可审查交付，不包含正式生产切换、生产数据库迁移、付费 API 开通或对外发布。

## 产品目标与应用场景

旅行者携带现金：选择币种与金额，比较可核验的门店报价、面额、距离和营业时间，打开地图去具体店铺。持有泰铢买外币：选择买入方向，金额为希望获得的外币，比较预计泰铢支付。数字资产持有者：选择资产、买卖方向及数量，比较订单簿能够成交的金额和费用假设。初次使用者：按需查看平台证据及具体分店 Google 口碑，随后打开官方入口。

成功定义：手机首屏能够选择并提交；最新、过期、混合推算及备用数据分开；不会因来源失效、固定评分或推广奖励而误选；异常可以定位和恢复。用户界面不展示内部服务、采集器和调度配置。

## 开发交付范围

|阶段|交付内容|验收标准|
|---|---|---|
|1 数据可靠性|校验订单簿、时效、价格及数量；请求超时覆盖完整响应；现金逐来源保留最后成功数据并记录本次失败；更新任务报告 degraded，不因一次错误永久退出|空簿、非法数值、乱序/过期、部分失败、全部失败、未来时间等测试；失效来源不标实时最佳|
|2 场景与选择|现金卖外币/买外币；数字资产买卖；显示成交不足、费用假设、柜台确认提示；保持手机一套控件|金额单位和买卖方向一致，费用单位明确；旧结果及慢请求不覆盖新选择|
|3 来源扩充|接 Vasu、Twelve Victory 官方汇率，准确解析官网发布时间、面额与总店范围；加入央行参考入口；已有不稳定来源仍降级|真实官方页面解析验证，测试异常/缺时间；不虚构分店报价，不把央行参考当可成交价|
|4 可信评比|撤销缺乏证据的综合分推荐；分别展示行情新鲜度、成交深度、费用核验、牌照查询及用户口碑；人工证据带来源、核验日期、到期状态|证据缺失或过期为待核验；佣金不参与排序；默认固定手续费明确为未核验估算|
|5 Google 口碑|服务端 Places New 接口；分店 Place ID、身份匹配、评分/数量、最多5条评论、作者及原文链接；按需加载，受限凭据不进入浏览器|无配置/额度或上游失败时有清晰状态；不把名称近似视为身份确认；不持久保存 Google 评论；有凭据才做真实付费接口验收|
|6 运维与发布准备|公开数据状态页、后台状态、健康接口、worker degraded 心跳；接入步骤、更新频率、回退和生产差异保护记录|业务数据陈旧不能被进程健康掩盖；现有权限和存储复用；本地构建、测试、SEO及浏览器验收|

## 质量与排序规则

crypto 官方返回成功还要满足有效非空簿、价格数量合法及时间在容许窗口内。订单簿按买入卖单价升序、卖出买单价降序计算；成交不足单独提示。现金同时记录“采集时间”与“官网发布时间”，官方当天报价允许日内有效，但缓存需近期采集；只有采集时间而无官方发布时间时明确时间依据。过期数据保留为参考，不提升时间戳。人工 force_live 不能把混合推算或过期来源升级为实时。

先区分当前数据和参考数据，再比较能否完整成交及预计金额。平台合规信息与评论独立展示，不把 Google 星级称为资金安全评级，不合成武断的百分制。手续费未核验时明确提示，禁止宣称准确最终成本或保证最高到手。

## 更新与监控

现金任务默认10分钟，记录每个来源最近尝试、最近成功和错误；部分失效保留其原时间，不让一个来源的新时间刷新所有店铺。crypto 点击比较时获取，页面提供可选自动刷新并在页面隐藏时停止；自动刷新失败清除当前推荐而非默默保留旧结果。Google 用户展开时请求且不长期存储，调用次数受服务端保护；其失败不影响汇率比较。牌照、手续费人工证据必须有出处和有效期。

## 交付与限制

现有21个生产现场修改保持原状，部署前重新核对。最终交付当前源码、运行预览、完整测试证据和可复核状态。Google API 真实调用需要已授权的本站专用项目/密钥/计费；若权威登记没有该资产，完成接口、配置及模拟测试，明确列为外部接入条件，不能把测试数据标成真实 Google 评论。正式发布、GA4/GSC 平台收到事件及真实手机硬件验收另列状态。

后续扩展渠道依实际覆盖需求：TT Pattaya、机场具体分店、更多币种和获 SEC 授权且有可验证 THB 数据的交易所。未完成报价与分店核验前不混入比较；本轮先完成两家已确认有官方当日报价的现金来源及现有四家交易所质量控制。

## 补充：本站流量接管与推广运维（用户 2026-10-01 明确授权）

指定 Google 环境：Profile 16 / fujane110@gmail.com。复用 Cloudflare 现有 zone 和自动 Web Analytics，不重复注入 beacon。已完成 Search Console 域名验证，新增独立 TXT，保留既有记录；原站点地图已存在且成功，不重复创建资源。

GA4 本站专属账号 410361296、媒体资源 557014525、网站数据流 15934949405、衡量 ID G-HHPM4E9QGY 已创建。时区选择泰国、币种 THB；关闭可选数据共享与增强型衡量，使用受控埋点，避免自动传出精确金额及定位查询参数。资产存在不等于收到流量。标签发布、浏览器请求、实时平台接收、关键事件各自验收。

推广漏斗：来源渠道 → 比较开始 → 比较成功/失败 → 展开报价 → 地图/官方网站/推广链接跳转。保留 amount_bucket，禁止精确金额、经纬度、邮箱、含秘密的 URL。Google 搜索点击、GA4 会话和 Cloudflare 请求单独报告，不能相加。奖励状态以官方核验时间和实际账号资格为准，不为推广佣金改变报价排序。

代理：默认 nordvpn-th31-proxy / 18888 当前 running/unhealthy，健康检查未运行、采集 503。修复必须复用原容器且不自动切换出口；共享容器不可无调查直接重启。新增 Vasu/Twelve 原文解析验收依赖恢复固定采集路径。

## 2026-10-02 追加范围

现金选择扩为15种（新增AUD/CAD/SGD/HKD/CHF/NZD/KRW/TWD/MYR/INR）；加密资产选择扩为15种（新增USDC/ADA/BNB/AVAX/DOT/LINK/LTC/TRX/NEAR）。选择表示支持查询，不保证每家平台上架；只有官方有效订单簿/汇率才能出报价，新资产不补造历史价格。币种、方向、位置变化自动查询，数字输入400ms防抖，勾选营业/距离立即本地筛选；保留失败重试。

新增三语比较范围、第三方交易及商业推广说明，完整声明保留不可排除的法定责任；不能以文字保证免于所有法律责任。三语SEO保留独立canonical/hreflang，现金及加密页补齐分享元数据。返佣核验单独见 REFERRAL_VERIFICATION_2026-10-02.md。

## 更新后的目标提示词 · 2026-10-02

继续完成 ExchangeTHB 上线与获客交付。保留手机简洁选择、勾选自动筛选和多币种比较，实现英文、泰文、中文和日文核心比较流程；为日本円／タイバーツ／バンコク両替、แลกเงิน／เงินบาท及 Thai baht exchange 建立真实有用的内容、独立 canonical 和 hreflang。禁止将未翻译的英文页面伪装成可索引日文；次级英文资料明确跳转英文，后续逐页翻译。核验 sitemap、robots、结构化数据、手机布局和功能，并通过既有 Google Search Console 提交已上线的正式站点地图。

复用 GA4、Cloudflare 和 AdSense 发布商 pub-8386341379958173，核实实际代码发布、平台收到数据、站点审核和收入资格。广告账号创建不等于广告获批；推广链接存在不等于获得佣金，普通跳转不得声称有收入。仅使用已核验的正规第三方，佣金不改变比较排序。最新数据和 Google 评论的真实接入须独立验收，来源失效如实降级。Google Ads 付费投放不在本次自动执行范围。

发布使用独立制品与既有 canary，保留服务器未提交修改、数据库和报价缓存，记录旧镜像与回退；发布前完成可审查交付并遵守正式生产切换的授权边界。无法保证搜索排名，Google 提交、发现、索引、展现、点击各自记录。验收包括完整测试、类型检查、静态检查、生产构建、多语言SEO与浏览器手机验证、公开域名和官方平台回读。

目标工具状态：旧目标 blocked 未完成；2026-10-02尝试创建以上新目标被系统拒绝（unfinished goal）。不得把旧目标虚报完成以绕过限制。旧目标的恢复由用户或系统控制；当前工具没有恢复或编辑目标的方法。工作继续按本更新范围推进。

## 2026-10-02 十种语言与币种偏好追加目标

在既有中/英/泰/日文上加入俄/韩/法/德/印尼/越南语，覆盖主页、现金、加密比较、说明、数据状态、来源与评论界面、隐私同意和法务说明。现金语言切换：zh→CNY、ja→JPY、ko→KRW、fr/de→EUR、en→USD；RUB/IDR/VND及作为目标币的THB不是当前外币输入项，ru/id/vi/th→USD。保留现金金额和买卖方向，清除原币种面额；加密只换语言，保留资产、数量和买卖方向。语言路由重新初始化选择状态，防止只改地址但选择器仍保留旧币种。

语言顺序采用2025全年官方入境客源人数：中文、俄语、韩语、日语、英语、德语、法语、印尼语、越南语；泰语为本地语言，单独末位。英语以英国为代表客源，中文以中国大陆为代表，不将国籍统计称为语言人口，不宣称排序自动实时更新。数据与出处见lib/locale-preferences.ts。主比较页及方法/免责声明的十语hreflang互指；站点地图扩为68条。尚未翻译的历史交易所、店铺和路线详情明确跳到英文，不生成伪本地化索引页。

验收：72项测试、类型检查、零警告lint、Docker构建、十语SEO检查、390px手机语言切换与资产保留、1Panel独立测试服务验证；正式发布继续沿用现有授权门禁。

## 2026-10-02 采集、定位与 Google Maps 新目标提示词

复用当前ExchangeTHB、五家既有正规换汇来源、固定18888采集代理、已授权fujane110 Google环境及xmanx-site-operations项目，不另建同名账号或复制秘密。先恢复/定位采集通路，不将代理503归因于目标站点；采集App安装不等于网络和控制接口已验收。每来源保留采集、报价时点与失败原因，仅最新合格报价参与当前排序，无报价/过期分开显示。当前正式USD接口返回SIA/SuperRich/Ratchada三家旧报价；Ratchada8.5km是曼谷参考点直线距离。

完善十语定位：定位入口默认可见，enableHighAccuracy=true、maximumAge=0，显示浏览器报告的误差范围和低精度提示；报价旁明确参考点或用户来源，说明直线估算不是导航路程。手机真实GPS、电脑网络定位、模拟浏览器位置分别验收，不保证手机永远准确。Google Maps链接可以打开手机地图，不能将Google用户位置自动回传本站。

Google Play复用原已付费个人开发账号，不重新申请。Maps/Places使用Cloud开发项目与API，核验结算状态、启用Places API(New)、服务端受限密钥、API限制、分店Place ID身份匹配、出处及最多5条相关评论显示。密钥只在登记受限位置和服务器运行配置，不进Git/网页。现有接口请求reviews会使用Place Details Enterprise+Atmosphere SKU，官方当前免费1000次/月，超出首档25美元/1000次；需要启用结算，免费额度不是无需结算。最小字段、按用户展开请求、服务端额度防护；现有每进程300/日不足以控制月费，多实例/重启不能称硬费用上限。计划先降低应用额度并配置Cloud方法限额、告警，明确预算告警不是强制停费。预付款金额、结算/费用授权、真实接口回读、正式站发布各自验收。

交付：源码和完整规划、聚焦测试、手机模拟定位误差证据、真实五来源状态、Google平台配置及接口真实回读、可审查测试制品；未获收费授权不付款，不将模拟/配置视为真实接入。当前旧goal工具状态blocked，新create_goal被 unfinished goal 拒绝；接口没有恢复或改objective操作，不虚假完成旧目标。提示词已在本文件更新，继续执行可完成的开发/只读配置核查。

实施进展：定位UI已开发（默认可见、十语参考点标识、报告误差、超过1000米提示低精度），模拟2500米误差实测提示出现且经纬度不进入URL，不能替代实体手机GPS验收。Google接口新增每进程10/小时、25/日、500/月保守计数，测试覆盖跨日月额度与次月恢复；重启/多实例仍非硬费用上限。73项测试、类型检查、lint通过。Places启用动作被导向Maps结算创建流程，已取消创建，未创建重复结算账号、未付款、未生成密钥。GoogleCloud现有结算账号页面显示免费试用需要预付款，进一步核实实际金额与已有项目绑定；旧无结算记录不能当当前状态。

## 2026-10-02 采集优化目标续接

用户要求复用已有采集方案、自动推进全部数据和页面验收。工具get_goal确认旧目标blocked；create_goal拒绝unfinished goal，不能以伪完成绕过。等待应用恢复原目标。当前固定18888代理unhealthy，重复Connection reset；共享容器重启具体审批仍待答复，不切换出口。Maps1000THB预付款未授权支付。新增诊断修复：cash-live对所有有效配置来源建立providerHealth，不再仅依靠存在种子报价的币种推导来源；missing仅表示匹配报价缺失，不承诺店铺支持该币种。代码测试结果见本轮回执；未发布此诊断修复，不声称真实现金数据已恢复。

## 2026-10-02 11:30 泰国时间：Maps 和真机条件已解除

本节取代旧的“缺手机连接/Maps预付款阻塞”判断。用户明确授权改用shiftshen521@gmail.com；Profile1登录核验后复用其已结算vdamo-420503及已启用Places API(New)，为本站创建独立服务端密钥并限定API和已验证服务器出口IP。新exchangethb-maps项目已建但结算名额受限，未付费或启用重复结算。GA4/GSC仍用原Profile16，不更换统计资产。

六家门店分别核对Place ID和官网/地址，两家SuperRich保持不同实体。共享数据库事务与锁控制25/小时、25/日、500/月；日/月上限未增加，重启及双实例不重置。不是共享Google项目的金钱硬上限。评论/评分不写入业务缓存，坐标最多使用30天并在真实详情回读成功时更新，过期退回参考点。正式流量池两实例和worker一并发布，无数据库迁移。

USB和无线两连接均已恢复为原登记HONOR BVL-N49，用户批准Chrome本次精确定位后真机误差±18m，距离1.8/6.5km，SGD选择自动更新，原生Google Maps打开已核对门店。手机与Maps阻塞不再保留为剩余条件；Vasu/SIA实时汇率、现金商当前牌照、推广资格和真实业务流量仍需独立证据，不能据Maps成功宣称整个项目全完成。

## 2026-10-02 当前进度修正（以上旧阻塞记录保留为历史）
目标已恢复active。正式站十语、真实手机GPS、Google Places评论、GA4生产事件接收及Cloudflare统计已验证；Twelve官方采集成功，Vasu失败/SIA当前HTTPS403未恢复。最新正式网页镜像88f2e6…已移除生产路径中的示例报价补位和推算买价；目录/路线页读取真实记录。当前另在构建曼谷时区及十语面额提示修复，构建不等于发布。现金店当前许可与推广资格尚未完成，不能宣称全项目完成或点击产生收入。最新证据以DELIVERY_RECEIPT.md及对应artifacts为准。

## 2026-10-02 用户明确调整来源范围

用户决定删除无法采集的Vasu、SIA站点内容。公开目录、比较、状态页和索引只保留SuperRich Thailand、Ratchada、Twelve Victory；旧来源历史缓存保留但不展示、不参与比较，即使启用includeUnstableProviders也不恢复两家。原固定代理不变。用户报告1000THB已支付，需核对支付所属Cloud项目后才迁移凭据；目前Maps真实可用项目仍vdamo-420503/shiftshen521，不能将报告付款当作目标项目API验收。Google Play手机登录与服务器Maps API分开。AdSense平台回读仍正在准备，尚无已获批广告收入证据。


## 2026-10-02 16:58 TH 续接目标与当前范围

目标工具实际为active。Vasu/SIA已按用户指示退出公开来源，旧阻塞不再要求恢复两家。Maps现用Profile16/fujane110的xmanx-site-operations受限服务端密钥，正式真实评论接口已验收；恢复邮箱用户已验证、网页安全页实查不再提示待验证，安卓自动通行密钥保留，未关闭两步验证或退出手机。Google Play由其他当前任务处理，本任务不覆盖其操作。

本轮正式现金15币种×2方向共30组合HTTP200、都有current报价、算术0错误，cacheAge约8分钟。十语SEO集群在正式实例通过，来源移除后sitemap实际64条，不能继续把历史68条当当前数量。AdSense实际仍正在准备，ads.txt已授权；官方测试URL仍未见广告同意弹窗，不声称广告获批/收入/同意流程验收完成。证据current-cash-matrix-20261002.json、public-provider-seo-current-20261002.log、adsense-current-review-20261002.json。

发现旧资料API仍能读取被移除两家，已修复公开来源白名单并增加拒绝后不调用Google/读取私有配置的测试：101测试/35文件、类型检查和聚焦lint通过。新制品构建及生产验证仍在进行，未将本地修复写作已上线。当前现金店牌照独立匹配与AdSense最终审核仍未完成。


## 2026-10-02 17:02 TH 公开资料接口收尾发布

新正式镜像sha256:18844edd401dc47a400e30e9f5be3e9d48755f8719bbac84e492b87cd7c3956f，compose.public-provider-guard-20261002.yml。构建session59412退出0，测试实例health200/两家旧API404/保留资料API200/SGD200后发布主实例，两web实际healthy；worker及数据库没有切换。回退compose.fujane-maps-20261002.yml及f52eebee镜像保留。

101测试/35文件、类型检查/聚焦lint通过。新正式实例十语SEO集群退出0，sitemap64。实际域名health及SGD接口200、被移除两家详情/API404。手机390px选择SGD自动比较且结果顶部20.1875px、金额1000保留、无横向溢出。证据public-provider-guard-production-20261002.json和public-provider-guard-seo-20261002.log。

当前现金30买卖组合都有current来源、金额算术0错误；原采集自动更新09:49UTC，未重启采集或代理。BOT当前查牌照200仍是maintenance页，三个保留店铺当前许可仍未证实；显示unknown，不以Google口碑代替许可。AdSense实查仍正在准备，CMP真实弹窗未验证。目标保持active，旧Vasu/SIA恢复不再是范围内任务，Google Play当前并行任务不由本站任务覆盖。

## 2026-10-03 Non-server cost policy

User explicitly prioritizes minimizing all expenses beyond existing server. Embedded Google Places reviews now disabled (GOOGLE_PLACES_ENABLED0 in protected server runtime and latest compose overlay); no changes to secret, project, billing, other sites or shared proxy. Official monthly free tier for review field SKU1000 events, then25USD/1000 first tier; usage aggregated by billing account, not assumed private to this site. Existing application cap500/month was not monetary hard cap. API provider200 returns not_configured before budget/upstream request; cash comparison and outbound Google Maps links remain working. Phone browser location does not require our Places call. No persistent review cache introduced (Google restrictions); historical actual bills unverified. Default do not re-enable paid API consumption without specific cost authorization. Evidence artifacts/google-cost-saving-20261003.json.

## 2026-10-03 User restores Google reviews with original bounded queries

User corrected previous disable choice: restore Google store information/reviews, limit usage. Enabled original protected runtime/latest compose; no new key/project or cache. Original shared DB budget25/hour25/day500/month applies across two replicas and restarts, counted retries fail closed. Live Ratchada provider returned200/available5reviews; monthly attempts24→25, not asserted billable calls. Three budget tests passed. Limit is application requests, not global billing hardcap; Google free1000/month SKU aggregated across billing account. No background polling, no persisted reviews. Previous disabled-mode entry is historical superseded by this user instruction. Evidence artifacts/google-reviews-restored-budget-20261003.json.

## 2026-10-07 文档结构与发布闸门（fujane 清单落地）

docs/ 下 19 份 PLAN/RECEIPT/HANDOFF/MATRIX 已归档到 `/Volumes/M2USB/archive/exchangethb-docs-20261007/docs/`，docs/ 只留 OPS_SOP_CN / RELEASE_RUNBOOK_CN / PROD_INPUT_TEMPLATE_CN / GO_LIVE_CHECKLIST_CN 四份现用文档；**本文件成为唯一计划**，09:00 每日任务与项目会话只读本文件 + `SITE_OPERATIONS_EVIDENCE.md`（业务事实）+ `lark-status.json`（进度/卡点/待审）。原验收矩阵里仍有效的条件继续以本文件为准：手机真机 390px、GA4 平台侧接收、AdSense 审核与站点限定 CMP 实际弹窗、现金店当期资质、自动备份。

发布闸门（fujane 2026-10-07 09:06，替代已撤销的 PM 窗口）：生产发布、切换镜像、回退、重启生产服务、写生产数据前，先把改动+证据写进 `lark-status.json` 的「待审」并报 fujane，得到「执行」才执行；紧急回滚除外。当前两项待审：①重启 `exchangethb-worker`（宿主 2026-10-07 03:30-03:56 磁盘写满，worker 03:51:33 ENOSPC 退出后未拉起，站点不受影响）；②把当期 BOT 名录（2026-08-31）中三家公开现金商的牌照证据写入站点并发布可见状态（ratchada MC125490056 / twelve-victory 125470175 / superrich-thailand 125470152）。

编译产物 `.next`、`node_modules`、`tsconfig.tsbuildinfo` 已移到 `/Volumes/M2USB/_scratch/exchangethb/build-cache/` 并在项目根留软链，项目体积 780M→65M；移动后 typecheck、eslint、vitest 142/142、health:cash 全部通过。

## 2026-10-07 14:20 worker 质量门槛 + 路线页索引收敛 + DNS runbook 修正

**worker 偶发 degraded 的结论**（fujane PM 14:45 问；量化证据见 `SITE_OPERATIONS_EVIDENCE.md` 同日节与 `evidence/2026-10-07/worker-quality-and-dns-runbook-20261007.json`）：重建后 4.1h / 25 周期的 `degraded` 串（48%）是**全有全无判定**的产物，不能当故障率；真实成分是 ① upbit-thailand/USDT 盘口本身陈旧（8%，设计上不算缺陷）、② 逐源独立的出网超时/丢包（`source_timeout` 49 次、`source_dns_failure` 3 次），容器已直连 8.8.8.8/1.1.1.1 但解析中位仍 ≈2.5 秒。**不是 worker 代码缺陷**；用户侧由「过期行降级进仅供参考分组」兜住，不会展示错价。

**后续监控口径（替代看 status 串）**：任一转播检查（除 upbit-thailand/USDT）24h 可用率 <90%、或出现 8/8 检查同时失败 ≥1 次/24h、或任一现金源连续 2 轮非 current → 告警；存活沿用 `health:worker`。**观察期 24h**，改进（DNS 结果缓存 / 降低并发）上线后按新基线收紧门槛。待办（本轮未做）：结果页展示聚合的缓存生成时间（`cacheStale` 已计算但 `components/exchange-picker.tsx` 未渲染）。

**路线页索引收敛决策（本轮已实现，本地候选）**：路线页不是「27 条文案只有 4 条进 sitemap」——23 条是 middleware 的 301 别名、不渲染页面，实际只有 4 个 slug 存在页面，问题是**只有 en 变体被索引**（th/zh 页面 200 但 `noindex` 且 canonical 指向 en）。**收敛为：slug 集合不变，索引语言 `['en']` → `['en','th','zh']`**，与门店详情页策略对齐；不放开更多 slug（模板化重叠内容 + 需 GSC 证据，属 fujane/老板车道）。改动：`lib/indexing-policy.ts`（`indexedRouteLocales`/`routeAlternateLocales`）、`app/sitemap.ts`（71→79 条）、路线页 metadata alternates、`scripts/check-seo-cluster.mjs`、`AGENTS.md` 索引策略条目。本地门禁全过（typecheck / eslint 0 / vitest 146-42 / build exit 0 / 本地实例 79 loc + 自指 canonical + noindex 消失）。**未发布**：下次发布走闸门，发布后必须对 canary/生产重跑 `scripts/check-seo-cluster.mjs`。

**DNS overlay runbook 已修正**：原回滚命令（去掉 c.yml 用 base 重建）**解析不出镜像**（base 只有 `build:` 没有 `image:`），正确回滚是换回 `compose.release-20261007b.yml`（与 c.yml 只差三处 dns 块、镜像 pin 相同）。2026-10-08 03:00 +07 定时任务提示词已改写（含轮询 180s、基线记 `config_files`、回滚后核对 Dns 为空、禁止 base-only）。
