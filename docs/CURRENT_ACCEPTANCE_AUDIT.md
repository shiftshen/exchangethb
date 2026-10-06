# ExchangeTHB 当前验收审计（2026-10-02，泰国时间）

本文件不替代原始目标，也不宣称全项目完成。运行证据详见 DELIVERY_RECEIPT.md 和 artifacts；截图或测试不代替真实平台接收。

| 原始要求 | 当前证据 | 判定 / 剩余 |
|---|---|---|
| 复用固定代理，恢复官方现金报价 | 同一18888代理健康；SuperRich/Ratchada/Twelve自然周期成功，15现金币种30买卖组合有当前报价 | 主要现金路径已验证。Vasu/SIA仍不可用，不虚构数据；不同面额和分店仍按来源范围解释 |
| 来源、时点、买卖方向和自动更新准确 | 发布与采集时点分开；自然周期21:20→21:31→21:41；正反方向算术已核对 | 加固入库校验已在21:51自然周期成功写入正式缓存；长期可用性依赖Mac/USB/Docker/SSH |
| 交易所行情和资产支持 | 15资产×两方向30请求；28有实时来源，LTC无结果；USDT四家曾同时实时报价 | 不代表每家支持所有资产，也不保证每次网络成功；无报价提示已上线 |
| 简单、自动筛选、十语手机页面 | 现金十语390px无溢出；现金/加密语言切换保持要求 | 现金及加密十语390px均已渲染通过，无横向溢出；真机HONOR已通过USB/无线连接，SGD自动更新验证成功 |
| 定位与地图准确 | 使用用户坐标/曼谷参考点分别标示；直线距离提示；池内数据一致 | 真机精确定位一次授权后成功，误差±18m；Google Maps实际打开已匹配Place ID的门店。权限拒绝流程仍未作真机测试 |
| SEO、统计、缓存一致性 | 正式十语SEO检查通过；GA4后台收到page_view/comparison_started/comparison_success；两个web BUILD_ID/报价相同 | 收录、真实排名和有机业务流量不保证；Cloudflare后台已显示24小时49次浏览/41次访问，含测试可能；不是UV或自然搜索点击 |
| Maps/Places与真实评论 | shiftshen521账号受限服务端key已配置；六个Place ID身份匹配、正式站返回真实评论，浏览器显示5条归属和原评论链接 | 复用已结算vdamo项目，无新付款；共享25/小时、25/日、500/月防护。观察到Docker偶发EAI_AGAIN，针对同目标一次短重试已发布并验证；不会针对403重试；评分不替代现金商牌照 |
| 正规平台、返佣和免责声明真实 | 四家交易所已匹配SEC名录，正式API显示许可证据；官方链接优先；十语比较免责声明 | 现金店当前许可证仍未全部匹配；推广资格/奖励/结算需平台账户证据，不把点击当收入 |
| 保留生产DB与其他任务 | 发布使用同一compose/镜像；PRISMA_PUSH_ON_BOOT=0；未迁移DB、未重启postgres、无DNS改动 | 回滚镜像保留；本轮Places发布版本三容器健康、网站探活通过，最终236ba9…制品三实例健康，92测试通过；详见最新回执；源码尚未提交推送 |

后台手动刷新旁路已修复：web/web_canary/worker均显式external采集模式，两个真实网站实例认证请求返回409并解释自动更新；不会触发旧原生采集、覆盖正式缓存或虚报刷新完成。证据 artifacts/admin-external-guard-runtime-confirmed-20261002.json。

旧手机/Maps阻塞已于11:35 TH解除：真机GPS、受限Places密钥和真实评论已通过。仍需恢复Vasu/SIA现金来源并核验当前现金许可/返佣资格；不自动付款。


## 2026-10-02 12:16 TH 恢复目标后的生产核验

目标工具已active，本轮是有效进展：Google正式平台回读并保存当期证据。GSC近三个月2026-06-30至09-29为21点击/6060展示/CTR0.3%/平均位置14；站点地图10月2日成功读取并发现68页面（不是68页面已收录）。概述25已收录/162未收录为历史汇总。

GA4正式属性557014525后台实际收到测试page_view/session_start/comparison_started/comparison_success/official_click各一次，official_click为关键事件。仅测试1用户，不作获客或收入。浏览器原统计选择declined已用页面控件恢复。

Cloudflare本站过滤、排除机器人、最近24小时GMT+7：77浏览/56访问，含测试；页面加载210ms，LCP P75 452ms、92%好，INP100%好、CLS98%好。浏览、访问、GA用户和搜索点击不相加。

自然采集周期04:49、04:59、05:10 UTC均SR31/Ratchada31/Twelve5成功、Vasu失败；当前生产USDT一次四家live。三个容器healthy。SIA旧缓存仍只有参考来源，不称新采集。手机版最新25ba245网页版本已覆盖旧236ba9描述，worker仍236ba9。

证据：artifacts/gsc-performance-current-20261002.json、gsc-sitemap-current-20261002.json、ga4-realtime-current-20261002.json、cloudflare-current-20261002.json、cash-natural-cycles-current-20261002.json。TaskSpace80已完成。


## 现金身份/许可核验补充
当前网页版本3ae2453…：现金牌照单独显示unknown和BOT来源，SIA当前官网与历史报价来源已分离，95测试及实际手机宽度验收通过。BOT实时查询200正文维护中，因此当前现金许可仍未证明。目标active；下一切片审计并移除data/site.ts硬编码示例报价在备用比较与次级页面的生产用途，保留原有真实采集缓存。

## 2026-10-02 当前进度修正（以上旧阻塞记录保留为历史）
目标已恢复active。正式站十语、真实手机GPS、Google Places评论、GA4生产事件接收及Cloudflare统计已验证；Twelve官方采集成功，Vasu失败/SIA当前HTTPS403未恢复。最新正式网页镜像88f2e6…已移除生产路径中的示例报价补位和推算买价；目录/路线页读取真实记录。当前另在构建曼谷时区及十语面额提示修复，构建不等于发布。现金店当前许可与推广资格尚未完成，不能宣称全项目完成或点击产生收入。最新证据以DELIVERY_RECEIPT.md及对应artifacts为准。

## 最新网页版本数据矩阵验收
2026-10-02正式f210665…网页：15现金币种×买卖30请求HTTP200，30组合均有至少一个current报价，金额按官方buyRate/sellRate乘数量验证0错误；两实例读取同一2026-10-02T05:31:01.785Z缓存。自然周期SR31/Ratchada31/Twelve5成功、Vasu0失败。证据cash-matrix-after-cleanup-20261002.json及cash-canary-after-cleanup-20261002.json。只证明该次报价，不保证每店每币种长期实时。

## 最新 AdSense/隐私版本验收补充

正式网页 f6090bcd… 的上线后 SEO cluster check 已通过，日志见 artifacts/adsense-privacy-seo-20261002.log。AdSense 审核已请求、CMP 平台已发布，但同一授权浏览器 TaskSpace86 的正式隐私页面测试仍无 __tcfapi 或同意弹窗；实际 AdSense managed script 与广告 iframe 存在。一次重新加载出现 ERR_ABORTED，未对应明确请求，不作为 CMP 被阻断的结论。不能将平台发布代替正式弹窗验收。证据：artifacts/adsense-cmp-runtime-audit-20261002.json。目标仍 active，Vasu/SIA 当前数据、现金许可及推广资格仍未完成。

## CMP 官方前置条件排查

2026-10-02：同一TaskSpace86平台回读本站消息仍已发布、六种语言、显示计数0。Google官方说明消息可能因跨源Referrer被禁止而不显示（https://support.google.com/adsense/answer/10960768?hl=en）；检查应用配置未发现Referrer策略设置，正式隐私页响应未发现Referrer-Policy头或referrer meta，不能据此认定该条件是根因，也未为试错更改策略。平台全账号消息覆盖选项未修改。测试参数仍依据https://support.google.com/adsense/answer/10924669?hl=en-ie，未重复发布、换出口或创建新空间。CMP实际显示与账户审核仍待验收。


## 2026-10-02 16:58 TH 续接目标与当前范围

目标工具实际为active。Vasu/SIA已按用户指示退出公开来源，旧阻塞不再要求恢复两家。Maps现用Profile16/fujane110的xmanx-site-operations受限服务端密钥，正式真实评论接口已验收；恢复邮箱用户已验证、网页安全页实查不再提示待验证，安卓自动通行密钥保留，未关闭两步验证或退出手机。Google Play由其他当前任务处理，本任务不覆盖其操作。

本轮正式现金15币种×2方向共30组合HTTP200、都有current报价、算术0错误，cacheAge约8分钟。十语SEO集群在正式实例通过，来源移除后sitemap实际64条，不能继续把历史68条当当前数量。AdSense实际仍正在准备，ads.txt已授权；官方测试URL仍未见广告同意弹窗，不声称广告获批/收入/同意流程验收完成。证据current-cash-matrix-20261002.json、public-provider-seo-current-20261002.log、adsense-current-review-20261002.json。

发现旧资料API仍能读取被移除两家，已修复公开来源白名单并增加拒绝后不调用Google/读取私有配置的测试：101测试/35文件、类型检查和聚焦lint通过。新制品构建及生产验证仍在进行，未将本地修复写作已上线。当前现金店牌照独立匹配与AdSense最终审核仍未完成。


## 2026-10-02 17:02 TH 公开资料接口收尾发布

新正式镜像sha256:18844edd401dc47a400e30e9f5be3e9d48755f8719bbac84e492b87cd7c3956f，compose.public-provider-guard-20261002.yml。构建session59412退出0，测试实例health200/两家旧API404/保留资料API200/SGD200后发布主实例，两web实际healthy；worker及数据库没有切换。回退compose.fujane-maps-20261002.yml及f52eebee镜像保留。

101测试/35文件、类型检查/聚焦lint通过。新正式实例十语SEO集群退出0，sitemap64。实际域名health及SGD接口200、被移除两家详情/API404。手机390px选择SGD自动比较且结果顶部20.1875px、金额1000保留、无横向溢出。证据public-provider-guard-production-20261002.json和public-provider-guard-seo-20261002.log。

当前现金30买卖组合都有current来源、金额算术0错误；原采集自动更新09:49UTC，未重启采集或代理。BOT当前查牌照200仍是maintenance页，三个保留店铺当前许可仍未证实；显示unknown，不以Google口碑代替许可。AdSense实查仍正在准备，CMP真实弹窗未验证。目标保持active，旧Vasu/SIA恢复不再是范围内任务，Google Play当前并行任务不由本站任务覆盖。


## 2026-10-02 17:09 TH 当前版本行情和十语验收

上一轮是实际开发/上线进展。本轮生产交易所15资产×2方向完整30响应200，其中28组合有live来源，LTC买卖均无报价，未补模拟价格。金额按订单簿平均价/成交数量/配置费用重新计算0错误，但费用本身均仍unknown，不把算术正确当官方费用已核实。USDT买卖来源数量出现3/2差异，BTC/ETH等可返回4家，保留实际可用来源不补齐。原浏览器整批evaluate观察超过15秒后仍继续，确认30请求结束后才用正式实例持续进程捕获完整payload；原首个观察超时证据保留，第二进程session12883退出0。

十语现金页面390px逐一真实渲染，无横向溢出或被移除来源。中文CNY/日文JPY/韩文KRW/法德EUR，其余不支持本币时USD，符合用户回退要求。session15776退出0。自动采集09:59UTC又成功SR31/Ratchada31/Twelve5，health200/状态current，未重启进程。证据crypto-current-full-matrix-20261002.json、crypto-current-math-audit-20261002.json、ten-language-current-mobile-20261002.json。

仍需完成官方费用核验、当前现金许可与AdSense/CMP最终验收；目标active，本轮无生产改动或新付款。


## 2026-10-02 17:12 TH 官方费用发现与本地修复
币安TH官方当前页明确THB交易0.25%、费用从收到资产扣；买入旧实现错误追加THB费且未扣币，已本地修正并按净到手币单位成本排序。102测试/35文件、类型检查和聚焦lint通过，尚未部署。Bitkub当前官方表提现依银行/金额20/75/200，不能把旧20当所有金额正确；固定代理请求其crypto fee页403后停止，不浏览器绕过。Orbix规则PDF不含当前数字，只指向动态fee tab，数值仍待验。证据official-fee-basis-audit-20261002.json，源码lib/compare.ts/data/site.ts/lib/types.ts。正在构建tag codex-fee-basis-20261002，日志/tmp/exchangethb-fee-basis-build-20261002.log；保持原正式18844e版本，后续必须观察同一构建并测试实例验证后才发布。


## 2026-10-02 17:17 TH 币安费用币种修复正式上线
构建1427退出0，镜像59d78fceacb359394afa1d29d4237498387f4cd1b0df1f4aa915f875e3c9f497；compose.fee-basis-20261002.yml，回退compose.public-provider-guard-20261002.yml/18844edd保留。测试实例真实BTC费0.0025BTC、不重复加THB成本、净币量验证通过。正式首个BTC200但缺Binance行，证据标未验证且未覆盖；独立ETH实际报价验证新扣费公式通过，不能据一次结果声称所有行情来源永不缺失。两web实际healthy，worker和数据库不变。
全套102测试曾通过，新增公平单位净币成本排序聚焦4测试通过，类型检查/lint通过；新正式十语SEO退出0。证据fee-basis-canary-20261002.json、fee-basis-production-20261002.json、fee-basis-production-eth-20261002.json、fee-basis-seo-20261002.log。下一必要工作：收到币计费在费用详情显示实际币单位；Bitkub银行/金额提现范围及Binance大额提现范围；动态提币费无当前网络依据不能当已验证。目标active，现金许可维护及AdSense审核/CMP仍未解决。


## 2026-10-02 17:24 TH 提币费真实边界发布
已移除四平台没有实时网络依据的固定示例提币费，未知时networkFee内部占位0但withdrawalFeeKnown=false，UI显示—并明确金额不包含未知费用，仍保留管理员配置费用覆盖。费用明细支持实际扣币单位及THB等值。104测试/35文件、类型检查/聚焦lint通过；build20567退出0。正式镜像d96591c3a7c614a530007f74c7a7b8b727732cf72051f69486197e545ed2f0f3，compose.fee-disclosure-20261002.yml，回退fee-basis/59d78f保留；两webhealthy、worker/数据库不变。Canary真实3平台未知提币状态通过，正式390px未知提示与—通过无溢出，但该次BTC没有Binance行，actual asset-unit rendering尚未证明。SEO新实例通过。
手机展开明细同时发现旧通用文案仍声称买入包括资产提币；本地已修复未知时改费用未核验说明，typecheck/lint通过，但该小修尚未同步/构建/上线。当前生产仍存在这条通用文案矛盾，不能把费用展示验收全部算完成。下一次与银行/金额提现费完善一并部署并实际验收。证据fee-disclosure-canary-20261002.json、fee-disclosure-production-mobile-20261002.json、fee-disclosure-seo-20261002.log。目标active。


## 2026-10-02 17:27 TH 银行费用范围本地开发
上一轮是实际发布进展，目标active。新增lib/fiat-withdrawal-fee.ts依据已核对的币安TH官方费页和Bitkub/en/fee/thb：币安提现200万THB边界20/100，Bitkub未知收款银行费用20–75或20–200而非永远20。compare返回提现费范围以及卖出预计到手范围，UI显示对应区间，配置override仍优先；不声称所有银行/账户资格或超限提款可执行。旧买入未知费通用文案已修正。106测试/36文件在范围计算初版通过，随后加到手范围字段与UI，typecheck/lint/diff通过；还需最终范围集成测试及手机区间渲染/账号提现上下限处理后全面验收。
当前构建同一远端隔离上下文tag codex-fiat-fee-range-20261002，活动session61982，日志/tmp/exchangethb-fiat-fee-range-build-20261002.log；尚未发布，正式仍fee-disclosure/d96591c。下一轮先观察同一session，不因等待重复构建；测试实例实际范围验证后再生产发布。保留worker/Postgres/代理/采集不动。


## 2026-10-02 17:31 TH 提现范围与费用显示正式验收
原构建61982退出0，新正式dd9f8415ea1c4afc5440fa40f93f9c089657fe0556902ce450bbfb6544e41f47/compose.fiat-fee-range-20261002.yml，回退fee-disclosure/d96591保留。测试实例Bitkub真实卖出0.1BTC：提现20–75，到手端点差55通过。正式390px同样显示到手范围和费用20–75，无溢出。真实Binance买入0.1BTC展开明细实际0.00025BTC约724.07THB、净0.09975BTC、未知提币费—且旧声称买入含未知提币文字消失。feeStatus仍unknown，不宣称全部费用已核实或提款超银行限制可执行；不自动付款。
两webhealthy，worker/Postgres未切换。106测试/36文件此前通过；新增范围集成后聚焦8测试通过，typecheck/lint通过；新正式SEO通过。证据fiat-fee-range-canary-20261002.json、fiat-fee-range-production-mobile-20261002.json、fiat-fee-range-production-buy-20261002.json、fiat-fee-range-seo-20261002.log。下一待办：提现上下限及收款银行适用范围明确处理、Upbit/Orbix当前数值费率独立验证、Google广告审核/CMP、现金牌照仍未完成。目标active。


## 2026-10-02 17:33 TH Orbix当前普通档核验
上一轮实际发布进展。固定18888当前健康，Orbix官方2026分档说明实采200：普通Select0.25%、Platinum0.20%依月交易量，旧统一0.2不是普通档。官方FAQ同时说明按交易币扣费。本地data/site.ts已改普通0.25和received；聚焦8测试、tsc通过，尚未同步/构建/发布，生产仍dd9f8415。Orbix提现15THB尚无官方数值证明，Upbit费率亦未验证，不把文档不含数字/搜索未命中当不存在收费。Upbit官方入口200仅JS壳，已保存；下一步从真实公开脚本或官方费用表定向核验，不换出口、不用第三方评测替代官方。证据orbix-fee-correction-audit-20261002.json和两份原文。新构建未启动，61982此前已成功终止，不重复观察为运行。目标active。


## 2026-10-02 17:36 TH Upbit公开官方费率成功采集
从官方首页引用的TH_PC bundle与共享route chunk解析出/service_center/fees以及公开guest标准费接口，固定18888 HTTPS GET https://ccxth.upbit.com/api/v1/market_status/base_trade_fee_conditions/guest 实采200。返回country_code=th、quote_unit=THB，bid/ask及maker均ratio0.0015，即0.15%；BTC/USDT报价单位ratio0.0025不能用于本站THB交易比较。已本地改Upbit标准THB费0.15，Orbix普通0.25与received本地修复仍保留；尚未构建/上线。原始首页、两份公开JS和guestJSON均留artifacts/upbit-th-*20261002*。无需登录token/新key/浏览器代理绕过。提现数字及限制仍待核验；正式仍dd9f8415。目标active，上一轮是实际官方证据发现及本地修复进展。


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
