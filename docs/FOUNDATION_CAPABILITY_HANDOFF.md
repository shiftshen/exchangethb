# ExchangeTHB → AI 基座维护交接

交接日期：2026-10-05（泰国时间）。用途：将可复用基础能力纳入现有基座统一规范；本文件是项目交接附件，事实主本仍为统一 registry / DSH-HANDOFF，不是新账号库或授权来源。

## 主本与目录

|对象|唯一实体/入口|责任边界|
|---|---|---|
|统一控制主目录|`/Users/shift/.local/state/dsh-infrastructure/control`；`/Users/shift/LocalEnv` 为同一目录链接|基座维护规则、工具、公共依赖与凭据调用；主本锁/SHA更新|
|项目源码|`/Volumes/M2USB/dev/exchangethb`|本站维护业务代码、锁文件、测试、内容、证据|
|旧项目入口|`/Volumes/M2USB/Projects/exchangethb.com` → 上述实体，2026-10-05定向核实|兼容链接，禁止再建同名副本；现采集plist仍使用旧入口|
|站点事实|`registry.json#site_operations.websites.exchangethb.com.website_operations`|统一登记仅存状态、资产和证据引用，不复制业务数据库|
|共享交接|控制主目录 `DSH-HANDOFF.md` 本交接索引|跨会话发现与维护任务入口|
|生产|SSH别名 `1panel-happy`，`/opt/exchangethb`|业务发布由本站负责；基座维护主机连接与通用运行基础|
|采集启动|`/Users/shift/Library/LaunchAgents/com.xmanx.exchangethb.cash-collector.plist`|基座管理调度/运行方式规范；本站负责源解析、节奏和导入逻辑|
|采集日志|`/Users/shift/Library/Logs/ExchangeTHB/`|项目日志；基座提供脱敏、轮转与保留规则，未配置的能力不能写已完成|
|项目证据|源码实体内 `artifacts/`、验收和开发文档|保留原历史，不搬进共享规则Git；不能将历史状态视为现状|
|生产受限数据|`/opt/exchangethb/runtime/`、`runtime/backups/`|秘密和数据库快照留受限位置，不进入源码/Git/普通交接|

## 依赖归属与实际状态

2026-10-05运行时实测：共享Node v26.10.0、Python3.14.7、uv0.12.21均与登记一致，通过 `agent-control runtime check`。使用 `agent-control runtime exec`，不另建Node/Python、全局包库或密码库。项目依赖由 `package-lock.json` + `npm ci` 管理，Next15/React19/Prisma6/TypeScript5/Vitest4等准确安装版本以锁文件为准，不把package声明范围当实际版本。

生产Docker固定 `node:20-alpine` 摘要，Postgres16：这是独立容器依赖，不等于宿主Node26；基座应登记并评估版本生命周期、漏洞与兼容迁移，不能直接全机替换。任何升级先复现构建、测试、候选环境验证，再由本站按生产授权发布。本轮未升级或切换。

WebCodex实际0.4.1，Server/Runner源码 f080c8f3ea70，Runner device-33b1baa91b894fa6 在线且 aligned、135工具、0活跃任务、15登记项目。已有共用Server/Runner不重建。历史本站根目录门禁未解除；本轮只验runtime，没有声称本站已绑定可编辑Project。请基座核对迁入dev后的真实项目登记、根目录与授权；技术权限不扩大业务范围。

现生产制品与回退查询原 `website_operations.production_release`；最近登记镜像69a9d682，overlay `compose.visible-costs-20261003.yml`，回退 `compose.company-background-20261003.yml`。本轮仅整理交接，不以旧制品记录替代重新上线验收。仓库大量未提交修改，禁止全库reset/clean/批量提交覆盖。

## 建议基座统一维护的能力

|能力|复用入口/技能|接管内容|项目保留内容|
|---|---|---|---|
|运行时与主机|agent-runtime-access、host-infrastructure；agent-control；已登记SSH别名|版本清单、安全升级流程、挂载/路径、服务依赖、受控恢复|npm锁文件、Docker兼容约束、业务发布与回退|
|公开采集传输|local-private-collection；localenv collect check/fetch|固定18888代理健康、HTTPS helper、限速、脱敏、故障分类；失败不直连/换出口|店铺解析、币种面额、买卖方向、官网报价时点、缓存导入|
|身份与浏览器|identity-profile、ego-browser、auth-verification-chain、captcha-solver|Profile绑定、控制权与任务生命周期、凭据按需调用、授权验证通道|本站资产归属、网站范围及每项操作授权|
|项目执行|webcodex-local / webcodex-project、dev-deploy|同一Server/Runner连接、路径登记、SHA编辑、任务观察|本站源码、测试、构建和交付证据|
|网站运维|site-ops-seo|共用检查模板：HTTPS、索引、事件接收、CF性能、归属、日期范围|本站指标、SEO内容、外链、转化定义、审核结论|
|监控和备份|现有exchangethb心跳、项目恢复证据|复用告警语义、无变化静默、备份计划/恢复演练规范|已有本站调度、数据库业务范围、实际备份及恢复结果|
|记忆和规则|memory-handoff、KNOWLEDGE-SYNC、foundation patch|单一事实来源、锁/SHA、独立规则PR及审查|本站业务事实写原字段，原始数据留项目|

不要把 `scripts/collect-cash-private.ts` 整个搬成全局技能：通用传输已在helper中，源解析/导入为本站专用。可提炼通用合同和测试规范，但新规则/工具须走现有私有基座仓库独立PR；本交接不代表提炼已实施。

## 资产和凭据只引用，不复制

Google使用Profile16 / fujane110@gmail.com，GSC `sc-domain:exchangethb.com`，GA4属性557014525。Cloudflare zone与Web Analytics引用原站点登记，管理权限与DNS权限分开验收。AdSense发布商pub-8386341379958173；审核请求、审核获批、广告实际展示/收入资格是独立状态。

Maps/Places复用原 `maps_places_setup` 和凭据登记；生产受限env `/opt/exchangethb/runtime/google-places-fujane.env`，本机受限key引用 `/Users/shift/LocalEnv/secrets/exchangethb-google-places-fujane.key`。此处仅列引用，不读取/分发密钥。其他站点不得因同账号自动获得该key授权。

用户最终要求保留店铺资料/评论：仅展开查询，共享DB计数25/小时、25/日、500/月，跨副本及重启；达限停请求，不持久缓存评论/评分。坐标有限期缓存，评论不是三天落库。该限额不是整个共享Google账单的金额硬上限。基座不能按历史disabled条目关闭当前功能，不能启用付费资源或抬高额度。

原浏览器Space86已交还，2026-10-05列表已不见该空间；不能重用失效ID、接管他人空间或为绕过控制权建立替代环境。由基座核对原Google环境当前占用与后续安全复用方式。生物识别不能导出给智能体绕过本人验证。

## 已完成、未完成与易踩坑

- 已验证：宿主三运行时；WebCodex在线/版本对齐；项目实体与兼容链接；采集plist使用共享运行入口、显式tsx配置和项目路径。
- 最近公开运行证据：`artifacts/heartbeat-audit-20261005.json`；HTTPS/SGD/USDT接口200、四容器healthy，现金三源31/31/5当前。行情存在间歇DNS/超时，进程健康不是全部行情可用。
- 采集每10分钟、串行源请求至少2秒，Cash collection external，不在worker再启动同源采集。plist WorkingDirectory为 `/Users/shift`，不能改回USB工作目录重现后台权限故障；迁移路径前核对兼容入口。
- 公开源仅SuperRich Thailand/Ratchada/Twelve Victory；Vasu/SIA按用户要求退出。registry.cash_collection早期remaining/source_failures为历史残留，应按原事实证据定向纠正，不恢复退役源。
- AdSense最终审核、CMP真实弹窗、现金店当前法人/网点许可仍未完成；GSC/GA4/CF最新后台本轮未验证，不能复用旧数字称当前。2023许可证名单、Google评分不等于当前许可。
- 受限数据库快照和隔离恢复已留历史证据；自动数据库备份尚未部署。基座可设计复用方案，接入和恢复需最小授权范围，不称已长期保护。
- 手机精确定位和本站直线距离不需要Google付费API；地图外链不是本站Places请求。浏览器/手机定位验收与服务器API验收分开。
- 普通跳转不能自动赚钱，个人推荐不等于网站返佣资格；不能用商业条件改变报价排序。

## 基座接管顺序与验收

1. 基座维护负责人先回读本附件和原站点字段，核对目录迁移、当前占用及凭据引用；不新建资源、不搬业务数据库。
2. 将宿主运行时、Docker版本例外、采集服务依赖链、WebCodex项目路径和浏览器复用问题纳入现有公共登记/维护待办；每项标已验证/待验证及时间、证据。公共层只索引本站附件。
3. 通用工具/规则调整在现有私有基座Git仓库独立分支PR，审查通过后应用；不把本站业务证据或真实registry提交Git。
4. 验收应证明：旧兼容入口可读，collector自然周期仍成功；无第二代理/第二运行时/第二凭据库；共享升级后本站聚焦测试/候选构建通过；原生产未被未经授权切换；各平台查询能区分旧数据和本次结果。
5. 完成后回写同一registry/DSH-HANDOFF并给本站接管回执：负责人、已接管能力、真实证据、未接管项、回退路径。之后本站只引用共享能力继续业务开发。

本轮规则SHA：4713e6139f17fac2f4b82db34fc354a2fd5539480a39bfecb6adca98b56e72bc；基座Git：bc18b73d362045a54ee7fe0c2c46b7c402bc7f46。共享主本会变化，执行修改前重新读取最新SHA。
