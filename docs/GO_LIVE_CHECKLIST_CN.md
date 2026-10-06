# ExchangeTHB 上线当日打勾检查表

## A. 发布前（T-1）
- [ ] 已确认目标 commit 与分支一致。
- [ ] `.env` 生产值已填完且二次复核。
- [ ] 推荐链接、活动链接、披露文案已确认。
- [ ] 法务页（Methodology/Disclaimer）已确认终稿。
- [ ] 备份策略可执行（content 文件 + 数据卷）。

## B. 发布执行（T0）
- [ ] `docker compose down --remove-orphans` 执行成功。
- [ ] `docker compose up -d --build` 执行成功。
- [ ] `docker compose ps` 显示 web/postgres 全部 healthy/running，worker 如启用则为 running。
- [ ] 首轮 worker 已执行（首次部署场景）。
- [ ] Nginx 反向代理与 HTTPS 配置完成。

## C. 功能验收（T0+）
- [ ] `/api/health` 返回正常。
- [ ] `/th`、`/en`、`/zh` 全部可访问。
- [ ] `/th/crypto` 比较结果正常，显示 estimated/来源/更新时间。
- [ ] `/th/cash` 比较结果正常，显示来源与告警信息。
- [ ] 详情页 `/th/exchanges/[slug]`、`/th/money-changers/[slug]` 正常。
- [ ] 后台 `/admin/login` 可登录。
- [ ] 后台页面 `/admin/dashboard`、`/admin/cash-health`、`/admin/exchange-profiles`、`/admin/branch-manager`、`/admin/scrape-review`、`/admin/audit` 可访问。
- [ ] `/sitemap.xml`、`/robots.txt` 可访问。

## D. 运营验收（T0+）
- [ ] 审计日志可看到登录与配置操作记录。
- [ ] cash health 可导出 CSV 且字段完整。
- [ ] scrape review 可保存 provider mode 与 note。
- [ ] rollback 接口可鉴权并可用。
- [ ] GA4（如启用）事件有入库迹象。

## E. 稳定性观察（T0~T+24h）
- [ ] 每 2 小时巡检一次健康接口与关键页面。
- [ ] 记录 fallback-only provider 数量变化。
- [ ] 无持续 P1 告警。
- [ ] 若出现采集异常，已按 SOP 处置并留痕。

## F. 上线结束确认
- [ ] 输出上线记录（时间/负责人/commit）。
- [ ] 留存关键页面截图。
- [ ] 记录未完成项与后续计划。
