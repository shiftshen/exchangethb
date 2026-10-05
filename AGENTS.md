# ExchangeTHB 项目规则（项目级）

> 本文件是本项目唯一项目级规则。工作区级规则见 `/Volumes/M2USB/dev/AGENTS.md`（软链到 `workspace/AGENTS.md`）；
> 全局规则见 `$DSH_HOME/AGENTS.md` 与统一主本 `~/.local/state/dsh-infrastructure/control/AGENT-ENVIRONMENT-PROMPT.md`。
> 事实主本仍是 registry 与 `DSH-HANDOFF.md`，本文件只写本项目的目录、环境与边界。

## 唯一目录（硬性）

- 项目实体**只有一个**：`/Volumes/M2USB/dev/exchangethb`
- `/Volumes/M2USB/Projects/exchangethb.com` → 上述实体的**兼容软链**，不是第二份副本
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
- Google 环境：Profile 16 / `fujane110@gmail.com`。Places key 只按 registry 引用使用，不读取、不复制、不分发

## 已知坑（2026-10-05 实测）

- **软链会被采集 helper 拒绝**：共享 helper 的 `proxy_fetch.py:output_slot()` 用 `O_RDONLY|O_DIRECTORY|O_NOFOLLOW` 逐级固定路径组件。plist 一旦传旧软链路径 `/Volumes/M2USB/Projects/exchangethb.com`，三源全部 `output_rejected`、零 HTML 落盘，而**进程仍然 `state=running`**。当日因此静默断更 8h48m。
- **进程活着 ≠ 采集健康**：判据看轮次结果，不看进程。项目探针 `npm run health:cash`（`scripts/check-cash-collector-health.ts`）在「连续 3 轮三源全挂」或「超过 30 分钟无新轮次」时退出非 0。
  - 该探针**尚未**接入基座 `health-watch`：接入需改工作区外的 uchg 保护文件 `~/.agents/skills/host-infrastructure/scripts/healthcheck.sh`（该目录非 git 仓库、无 PR 通道），本次未获批准，保持未改。
- **工作区禁止粗暴清理**：不得 `git reset --hard`、`git clean`、批量提交或覆盖他人改动。

## 常用命令

```bash
npm run test                                              # vitest
npm run typecheck && npm run lint
npm run health:cash                                       # 本机现金采集健康探针
npm run health:prod                                       # 生产端点只读核验
```

## 收工

事实、证据、验证时间与未完成项回写 registry `site_operations.websites["exchangethb.com"]` 与 `DSH-HANDOFF.md`；只报实测过的结论。
