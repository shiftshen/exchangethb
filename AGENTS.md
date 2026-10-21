# ExchangeTHB 项目规则（项目级）

> 本文件是本项目唯一项目级规则。工作区级规则见 `/Volumes/M2USB/platform/shared-agents/AGENTS.md`（dev/ 下软链）；旧 `workspace/` 路径已停用；
> 全局规则见 `$DSH_HOME/AGENTS.md` 与统一主本 `~/.local/state/dsh-infrastructure/control/AGENT-ENVIRONMENT-PROMPT.md`。
> 事实主本仍是 registry 与 `DSH-HANDOFF.md`，本文件只写本项目的目录、环境与边界。

## 唯一目录（硬性）

- 项目实体**只有一个**：`/Volumes/M2USB/dev/exchangethb`
- 旧路径 `/Volumes/M2USB/workspace/exchangethb` 曾是兼容软链，已停用，不再引用
- 禁止在旧路径或别处新建、复制同名项目/目录/服务；清理旧软链必须等所有引用改完（见 registry `migration_discipline`）
- 采集 plist 与脚本里的路径一律写**真实路径**，不写旧软链（原因见下方「已知坑」）

## 生产位置

| 项 | 位置 |
|---|---|
| 生产主机 | SSH 别名 `1panel-happy`（`192.168.1.83`） |
| 生产目录 | `/opt/exchangethb` |
| 制品/回退 compose | registry `site_operations.websites["exchangethb.com"].website_operations.production_release` |
| 受限秘密 / 数据库快照 | `/opt/exchangethb/runtime/`、`runtime/backups/`（不进源码、Git、普通文档） |
| 现金采集 | launchd `com.xmanx.exchangethb.cash-collector`，每 10 分钟；日志 `/Users/shift/Library/Logs/ExchangeTHB/`，经 SSH 导入生产 |

- plist 的 `WorkingDirectory` 保持 `/Users/shift`，**不要**改成 USB 目录（会重现后台权限故障）；`--workspace` 用真实项目路径
- 生产运行的是服务器上的独立制品，**不等于**本工作区 HEAD；本工作区长期有大量未提交改动

## 发布边界（须老板或 fujane 批准）

未经批准不得执行：

- 生产发布 / 切换镜像 / 回退 / 重启生产服务
- 数据库迁移、写入、恢复或删除
- DNS 变更、付款、对外发送消息、改密
- 推送到 Git 远端

批准前只做只读核验与本地候选构建。任何「环境可用」不等于「已发布」，任何「接口 200」不等于「数据已接通」。

## 凭据

- 密码 / Key 只经 `agent-control` 与登记的受限位置取用；**不进**代码、文档、日志、URL、argv 或全局环境变量
- **统一默认密码（老板 2026-10-06）**：新建的后台/管理员账号与新注册平台账号一律用老板指定的统一默认密码，禁止自创随机密码。取值只经 `agent-control credential pipe default-account-password -- /绝对路径消费程序`（钥匙串注入；项目里用环境变量或首次启动注入），**不得**写进代码、配置、种子文件、文档、日志、聊天或命令参数；建好即按 `accounts.yaml` 风格登记（id/平台/网址/账号名/钥匙串服务名）并报 fujane。改密须老板授权。
- 账号现状（2026-10-06 盘点）：站点后台 `admin@exchangethb.com` 是统一默认密码之前自建的——明文未登记任何受限位置，只剩生产 `.env` 的 scrypt 哈希，且与统一默认不一致；待老板授权后用统一默认密码重置并登记。其余平台资产走既有 Google SSO 或 API key，无自建密码。
- Google 环境：Profile 16 / `fujane110@gmail.com`。Places key 只按 registry 引用使用，不读取、不复制、不分发

## 已知坑（2026-10-05 实测）

- **软链会被采集 helper 拒绝**：共享 helper 的 `proxy_fetch.py:output_slot()` 用 `O_RDONLY|O_DIRECTORY|O_NOFOLLOW` 逐级固定路径组件，路径里任何一段是软链都会 `output_rejected`。历史故障（2026-10-05）：当年项目实体在 `/Volumes/M2USB/workspace/exchangethb`、`/Volumes/M2USB/dev/exchangethb` 是指向它的软链，plist 传了软链路径 → 三源全部 `output_rejected`、零 HTML 落盘，而**进程仍然 `state=running`**，当日静默断更 8h48m。现已统一为真实路径 `/Volumes/M2USB/dev/exchangethb`（plist 实测已用它，`WorkingDirectory=/Users/shift`）；**采集输出路径与 `--workspace` 必须是真实路径，不得经过任何软链**（含 2026-10-07 起 `.next`/`node_modules` 链到 `_scratch` 这类新增软链）。
- **进程活着 ≠ 采集健康**：判据看轮次结果，不看进程。项目探针 `npm run health:cash`（`scripts/check-cash-collector-health.ts`）在「连续 3 轮三源全挂」或「超过 30 分钟无新轮次」时退出非 0。
  - 该探针已由 fujane 于 **2026-10-06** 接入基座每日体检 `daily-maintenance` §14（`control/bin/daily-maintenance-check.py:154`：每天 09:03 在本项目跑该探针，rc≠0 计入 problems 并经 notify 发 Telegram 告警；探针文件缺失则跳过）。**无需**再改 `health-watch` 的 uchg 文件。
  - Google 流量（GSC/GA4/SEO）自 2026-10-06 起由 fujane 统一管理；本项目的 GA4/AdSense 发现写进 `lark-status.json` 交 fujane，不自行改动平台配置。
- **工作区禁止粗暴清理**：不得 `git reset --hard`、`git clean`、批量提交或覆盖他人改动。
- **worker 死活要看 inspect + 心跳，不能只看 `docker ps`（2026-10-07 实测）**：宿主磁盘写满时 dockerd 写不进 `.tmp-config.v2.json`，退出事件没落盘，`docker ps` 会一直显示 `Up (unhealthy)`，而 `docker inspect` 已是 `exited`、`docker top`/宿主进程列表证实已停 —— 当天因此漏报 5 小时 10 分。判据 = `docker inspect -f '{{.State.Running}}' exchangethb-worker-1` + 容器内 `/tmp/exchangethb-worker-heartbeat.json` 的 `updatedAt` 新鲜度。已装 launchd `com.xmanx.exchangethb.worker-watch`（每 5 分钟跑 `npm run health:worker`＝`scripts/check-worker-alive.ts`）：退出超 5 分钟或心跳超 25 分钟，就写一条到 `/Users/shift/LocalEnv/logs/supervisor/for-fujane.md`，恢复后自动清状态。**该脚本只读；重启 worker 仍须先获批。**
- **生产扫描拦截规则（2026-10-07 上线，易被覆盖）**：在 1Panel openresty 容器 `1Panel-openresty-inz6` 的 `/www/sites/exchangethb.com/proxy/root.conf` 的 `location ^~ /` 内，有两条 `if ($request_uri ~* "\.(php[0-9]?|phar|asp|aspx|jsp|cgi|sql|zip|gz|tar|tgz|bak|old|swp|env|ini)($|\?)") { return 403; }` 与 `^/(wp-|wordpress|xmlrpc|uploads?/|sites/default|phpmyadmin|pma/|vendor/|composer\.|cgi-bin/|telescope|actuator|@fs|\.git|\.svn|\.aws|\.ssh|adminer|alfa\.|chosen\.|simple\.|file\.php|edit\.php|gecko\.|goods\.php|classwithtostring|this_is_a_new_hello_world)`。规则必须写在 location 内（`^~ /` 会跳过正则 location 求值，服务器块里既有的 .env/.git 正则规则此前从未生效）。**若在 1Panel 面板重新保存该站点反向代理，root.conf 会被重写，需重新应用**。备份见同目录 `root.conf.bak.20261007-probe-block`；证据 `evidence/2026-10-07/`。
- **索引策略（2026-10-22 起）**：交易所详情 en/th/zh、门店详情 en/th/zh、路线指南页 en/th/zh（4 个 slug × 3 语言 = 12 个 URL；其余 23 个 routeGuides slug 是 middleware 里的 301 别名、不渲染页面，永远不进索引集）、`/exchanges` 与 `/money-changers` 两个 hub en/th/zh；`/routes` hub 仍是 noindex。规则都在 `lib/indexing-policy.ts`。改动后必须同步 `app/sitemap.ts` 的 hreflang 与 `scripts/check-seo-cluster.mjs` 的期望条数（当前 sitemap 107 条：core/legal/about/hub 6/币种页 15/详情/路线 12）。

## 常用命令

```bash
npm run test                                              # vitest
npm run typecheck && npm run lint
npm run health:cash                                       # 本机现金采集健康探针
npm run health:worker                                     # 生产 worker 死活探针（launchd 每 5 分钟跑同一脚本）
npm run health:prod                                       # 生产端点只读核验
```

## 文档纪律（老板 2026-10-06；fujane 转达）

本项目**只维护**这五类文件，其余一律不再新建：

| 文件 | 用途 |
|---|---|
| `AGENTS.md` | 项目规则（规则改动直接改对应条目，不新开文档） |
| `SITE_OPERATIONS_EVIDENCE.md` | 业务事实（运维/SEO/平台实测、发布记录正文） |
| `DEVELOPMENT_PLAN.md` | 唯一计划文件（追加小节，不建 `_v2`） |
| `lark-status.json` | 进度 / 卡点 / 待老板确认 / 账号清单 |
| `evidence/<日期>/` | 证据原件（按日期分目录，替代旧的散落 `artifacts/` 新文件） |

- **禁止**为汇报、复盘、合并、对照、交接新建 `*_REPORT_*`、`*_SUMMARY_*`、`LEGACY_*`、`*_v2` 之类文档；汇报写聊天 + `lark-status.json`。
- 临时文件放 `/Volumes/M2USB/_scratch/exchangethb/<日期>/`，用完归档；**任何文件不删除**，归档到 `/Volumes/M2USB/archive/`。`artifacts/` 是历史遗留，不再新增文件，后续整理需 fujane 确认。
- 遗留根文档已按 2026-10-06 文件规范整理（见下节「目录规范」）；引用它们的 registry / 09:00 任务指针由 fujane 侧更新，本文件不再逐个列举。

## 目录规范（老板 2026-10-06 / 底座规则第 20 节；2026-10-06 已整理）

| 位置 | 放什么 |
|---|---|
| 项目根 | `AGENTS.md`、`README.md`、`lark-status.json`、`DEVELOPMENT_PLAN.md`（唯一计划）、`SITE_OPERATIONS_EVIDENCE.md`（业务事实）、工具链必需配置（`package*.json`、`tsconfig/next/tailwind/postcss/eslint/vitest` 配置、`middleware.ts`、`Dockerfile`、`docker-compose.yml`、`.env.example`、`.gitignore`、`.dockerignore`、`.nvmrc`）与源码子目录（`app/ components/ lib/ content/ data/ prisma/ public/ scripts/ tests/ worker/`） |
| `docs/` | 只剩 4 个现用固定文档：`OPS_SOP_CN.md`、`RELEASE_RUNBOOK_CN.md`、`PROD_INPUT_TEMPLATE_CN.md`、`GO_LIVE_CHECKLIST_CN.md`。其余 19 份 PLAN/RECEIPT/HANDOFF/MATRIX 已于 2026-10-07 由 fujane 归档到 `/Volumes/M2USB/archive/exchangethb-docs-20261007/docs/`（只在溯源时读）。**唯一计划 = 根目录 `DEVELOPMENT_PLAN.md`**；09:00 每日任务只读它 + `SITE_OPERATIONS_EVIDENCE.md` + `lark-status.json` |
| `evidence/<日期>/` | 证据原件，**新证据只写这里**（如 `evidence/2026-10-06/`、`evidence/2026-10-01/`） |
| `tmp/` | 截图、草稿、一次性文件；14 天不用自动归档 |
| `artifacts/` | 历史遗留：只保留 JSON/PNG/LOG/TXT 类旧证据（826 个、16M），不再新增；原始抓取已归档 |
| `/Volumes/M2USB/_scratch/exchangethb/` | 编译产物与缓存：`build-cache/{.next,node_modules,tsconfig.tsbuildinfo}`（2026-10-07 按 fujane 清单移出并在项目根留软链，项目体积 780M→65M；移动后 typecheck/lint/vitest 142/42/health:cash 全过）＋ `20261006/` 一次性脚本 |
| `/Volumes/M2USB/archive/exchangethb-cleanup-20261006/` | 本次整理归档：原始抓取 html/js/gz 1803 个（256M）+ 早前归档 | 

- 本项目是单一 Next.js 应用，无子项目，故不建 `其他/`；模型与成片不在本项目（成片走 NAS seek），数据库数据在生产服务器 Docker volume `/opt/exchangethb`，本地无库文件可迁。
- **任何文件不删除**；`tmp/` 与归档由 fujane/老板按规则清理。
- 整理后实测：`npm run test` 127/39 通过、`tsc --noEmit` 干净、`eslint` 0 问题、`health:cash` exit 0（采集正常）。

## 收工

事实、证据、验证时间与未完成项回写 registry `site_operations.websites["exchangethb.com"]` 与 `DSH-HANDOFF.md`；只报实测过的结论。
