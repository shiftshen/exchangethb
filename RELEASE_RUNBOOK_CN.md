# ExchangeTHB 生产发布 Runbook（中文）

## 1. 发布目标
- 在不扩范围的前提下，将当前 V1 代码稳定发布到 `https://exchangethb.com`。
- 发布后前台、后台、采集链路、审计链路均可用。
- 全部结果维持 `estimated` 定位，不引入交易或用户系统能力。

## 2. 发布前输入（必须准备）
- 域名与 DNS：`exchangethb.com` 指向生产 VPS。
- 服务器访问：生产主机 SSH 访问路径与权限。
- 生产环境变量：`ADMIN_EMAIL`、`ADMIN_PASSWORD_HASH`、`ADMIN_SESSION_SECRET`、`DATABASE_URL`、`NEXT_PUBLIC_SITE_URL`。
- 法务与披露：最终免责声明文案、推荐/活动链接清单。
- 可选分析：GA4 测量 ID、Search Console 验证方式。

## 3. 上线执行步骤
1. 拉取最新代码并切换分支。
2. 复制 `.env.example` 为 `.env`，填入生产值。
3. 执行 `docker compose down --remove-orphans`。
4. 执行 `docker compose up -d --build`。
5. 执行 `docker compose ps`，确认 `web/postgres` 全部运行，worker 如启用则正常运行。
6. 若首次缓存为空，执行 `docker compose --profile worker run --rm worker` 进行首轮采集。
7. 配置 Nginx 反向代理到 `127.0.0.1:3000`。
8. 配置 HTTPS 证书并开启自动续期。

## 4. 发布后验证（必须逐项打勾）
- 健康接口：`/api/health` 返回正常。
- 前台多语言：`/th`、`/en`、`/zh` 均可访问。
- 前台关键页：Home、Crypto、Cash、Exchange Detail、Money Changer Detail、Methodology、Disclaimer。
- 后台登录页：`/admin/login`。
- 后台工作台：`/admin/dashboard`、`/admin/cash-health`、`/admin/exchange-profiles`、`/admin/branch-manager`、`/admin/scrape-review`、`/admin/audit`。
- SEO：`/sitemap.xml`、`/robots.txt` 可访问。
- 标签一致性：crypto/cash 页面均展示数据来源、更新时间、estimated 语义。

## 5. 回滚策略
- 触发条件：核心路由不可访问、后台不可登录、采集结果异常覆盖、关键接口持续报错。
- 业务回滚：在后台采集审阅页执行 cache rollback（恢复上一版现金缓存）。
- 代码回滚：回退到上一个稳定 commit，重新执行 `docker compose up -d --build`。
- 数据回滚顺序：恢复 `.env` → 恢复 `content/*.json` → 恢复 DB/Redis 卷 → 重启服务。

## 6. 发布后 24 小时观察
- 每 2 小时检查一次：`/api/health`、后台数据源监控、cash health 告警数量。
- 关注项：fallback-only 状态、重复 scraper failure、审计日志中的配置变更异常。
- 若 SIA 源仍不稳定，保持 `force_fallback`。

## 7. 交接输出物
- 发布记录：执行人、时间、目标 commit、环境变量版本号（不记录密文）。
- 验收截图：首页、crypto、cash、exchange detail、money changer detail、admin login、admin dashboard。
- 问题清单：已处理与未处理项、影响范围、下一步计划。
