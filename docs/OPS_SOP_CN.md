# ExchangeTHB 运营巡检与告警处置 SOP（中文）

## 1. 日常巡检频率
- 每日开站巡检：1 次。
- 交易高峰时段巡检：每 2 小时 1 次。
- 发布后 24 小时：每 2 小时 1 次。

## 2. 必查页面与接口
- 前台：`/th`、`/en`、`/zh`、`/th/crypto`、`/th/cash`。
- 后台：`/admin/dashboard`、`/admin/cash-health`、`/admin/scrape-review`、`/admin/audit`。
- 接口：`/api/health`、`/api/compare/crypto`、`/api/compare/cash`。

## 3. 巡检判定标准
- 可用性：页面可打开，接口返回 200。
- 数据质量：存在更新时间、来源标签，且不出现明显异常值。
- 后台监控：provider 状态正常，无连续失败堆积。
- 审计链路：关键操作（登录、配置更新、抓取、回滚）均可在审计中检索。

## 4. 告警分级与处理

### P1（立即处理）
- 条件：`/api/health` 失败、首页不可访问、后台无法登录、关键比较 API 连续失败。
- 处理：
  1. 检查 `docker compose ps` 与服务日志。
  2. 若为采集污染，执行 scrape rollback。
  3. 若为版本问题，执行代码回滚并重启容器。
  4. 在审计记录中确认操作链路完整。

### P2（2 小时内处理）
- 条件：单一 provider 连续 degraded/down，fallback 比例升高。
- 处理：
  1. 在 scrape-review 中切换 provider mode（`force_fallback`）。
  2. 添加 review note 记录原因和预计恢复条件。
  3. 观察下一轮采集结果与告警数量变化。

### P3（当日处理）
- 条件：个别文案错误、标签不一致、SEO 元信息偏差。
- 处理：
  1. 修正文案或配置。
  2. 回归检查三语页面一致性。
  3. 记录到当日运营日志。

## 5. 采集异常处置流程
1. 在 `/admin/cash-health` 确认异常 provider 与时间窗口。
2. 到 `/admin/scrape-review` 标记隐藏误报或切换 provider mode。
3. 必要时执行 rollback cache。
4. 在 `/admin/audit` 核对操作记录与操作者。

## 6. 每周固定动作
- 校验推荐链接状态：`reward_available / campaign_only / official_only`。
- 抽查 feeOverrides 与平台资料页风险提示是否一致。
- 导出一份 cash-health CSV 留档。
- 备份 `content/admin-config.json`、`content/cash-scrape-cache.json`、`content/admin-audit-log.json`。

## 7. 交接模板（值班记录）
- 时间：
- 操作者：
- 触发告警：
- 影响范围：
- 已执行动作：
- 当前状态：
- 是否需要升级：
