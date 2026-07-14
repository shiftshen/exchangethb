# ExchangeTHB 产品化改版发布候选

日期：2026-07-14
状态：本地验证完成，等待恢复到 `192.168.1.83` 的 SSH 网络路径后执行 canary 发布。

## 发布内容

- 首页改为真实 Cash/Crypto THB 决策入口。
- Cash 页面支持金额、币种、真实定位、距离、营业中筛选、最高净到手/最近排序。
- Crypto 页面支持买卖方向、净到手/总支付、费用、订单簿成交率、流动性缺口。
- 门店营业状态按曼谷时区动态计算。
- sitemap 从 129 条收缩到 29 条。
- 非核心 hub、路线、语言版本输出 `noindex,follow`。
- 批量 FAQ schema 已删除，只保留真实维护的换汇商实体 FAQ。
- 首页、Cash、Crypto 改为 SSG + ISR，加载后自动刷新实时 API 数据。
- GA4 覆盖比较开始、结果生成、结果展开、定位、地图、官网和详情点击。
- 交易所与换汇商详情页改为当前结果、费用/汇率、营业/位置和官方核验。
- 23 个非核心 route 已实施单跳 301 到 Cash/Crypto 工具 preset。

## 本地验证

- `npm run typecheck`：通过。
- `npm test`：14 个测试文件、38 项测试通过。
- `npm run build`：通过。
- `node scripts/ux-check.mjs`：10 项通过。
- `npm run seo:cluster -- http://localhost:3000`：通过。
- `bash scripts/check-prod-health.sh http://localhost:3000`：通过。
- `tests/release-web-canary.test.sh`：canary-only、精确晋级、失败自动回滚全部通过。
- 390px 与 1440px：无水平溢出，核心页唯一 H1。
- sitemap：29 条。

## 发布包

- 路径：`/tmp/exchangethb-release-<timestamp>.tgz`
- SHA-256：以发布包旁的同名 `.sha256` 文件为唯一校验依据。
- 已排除：`.env`、`.secrets`、Git、`.next`、`node_modules`、生产 admin config、生产 cash cache。

## Canary 发布步骤

1. 验证 `happy@192.168.1.83` 指纹与主机名仍为原生产主机。
2. 备份 `/opt/exchangethb`、生产 `.env`、动态 content 文件和当前 web/canary 镜像。
3. 同步发布包，保持生产 `.env`、数据库卷和缓存不变。
4. 执行 `bash scripts/release-web-canary.sh`，只构建并验证 `web_canary`。
5. 验证 canary：
   - `/api/health`
   - `/en`
   - `/en/cash`
   - `/en/crypto`
   - 定位 Cash API
   - sitemap 29 条
   - noindex/canonical/hreflang
   - 移动端截图
6. 执行 `bash scripts/release-web-canary.sh --skip-build --promote`，将已验证的同一 canary 镜像切到正式 web。
7. 不重启 PostgreSQL；worker 仅在 worker 源码发生变化时重建。
8. 运行公网 health 和 SEO cluster 检查。
9. 重新提交 GSC sitemap。

`release-web-canary.sh` 默认不会切正式环境。正式健康或 SEO 检查失败时，脚本会自动把旧 web 镜像重新标记并重建 web；PostgreSQL 和 worker 不参与发布。

## 回滚

- 代码：恢复发布前 `/opt/exchangethb` 备份。
- 镜像：将发布前带时间戳的 `exchangethb-web:rollback-*` 标记回 `exchangethb-web:latest`。
- Compose：`docker compose up -d --no-deps web web_canary`。
- 数据库、生产 `.env` 和现金缓存不参与前端回滚。

## 当前阻塞

当前电脑路由经 `utun4`，无法访问 `192.168.1.83:22`；ICMP 与 SSH 端口均超时。正式域名和数据库健康接口正常。

按照安全要求，不修改 VPN、不尝试未知公网主机、不使用其他服务器别名替代生产主机。
