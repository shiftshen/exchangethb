# 生产版本核对 · 2026-10-01

本次为只读核对，没有同步文件或重启生产容器。

- GitHub main：`873beb68d200824fc5e66d29d57818d223474d82`。
- 服务器 Git HEAD：`ae40915c9cbe6a3fde624a57ef59d23a243dd675`，另有 21 个未提交修改文件。
- 服务器源码不是正在运行的镜像本身；`.last_deployed_commit` 为 `57e4c7a`，不能据源码推断运行版本。
- 正式镜像：`sha256:9e6e4e01bb76039c93210b7104924a59924830e3099c8624770b206041161519`。
- 未提交差异保留在 `/tmp/exchangethb-production-uncommitted-20261001.patch`，SHA256 `93006e5b0aa1746538dad821c53f173635ed860cbf24c5a55e4e1dd85fbbf766`。
- 对这 21 个文件重新从服务器读取 Git blob 哈希，与 GitHub main 比较：3 个一致，18 个不同。完整证据见 `production-version-evidence.json`。

## 差异处理结论

| 现场文件 | 核对及本次处理 |
| --- | --- |
| `app/page.tsx`、`docker-compose.yml`、`tests/locale.test.ts` | 工作文件与 GitHub main 完全一致。保留 main。Docker entrypoint 修复已在 main 内，不重复补丁。 |
| 首页、现金、加密、页脚 | 现场主要为旧布局与移除快捷入口的候选修改。本次在较新的 main 上统一重构输入和结果，不向服务器覆盖旧修改。 |
| 交易所目录、换汇目录及门店详情 | main 已有 7 月更完整的目录和来源整理；本次保留 main 的内容与访问路径，详情页仍沿用已有布局。 |
| 路线目录及路线详情 | main 已有路线收敛及跳转策略，本次保留；本地验证 ETH 路线 301 指向带参数的加密页面。 |
| `app/llms.txt/route.ts`、`app/robots.ts` | main 与现场的 AI 抓取条款和说明不同，本次不更改抓取政策；上线前需按最终政策确认。 |
| `app/sitemap.ts`、`lib/seo.ts`、`middleware.ts`、`next.config.ts` | main 使用 `/en` 规范地址、29 条 sitemap、旧链接跳转和收敛的索引策略；现场候选只包含部分改动。保留 main 整套策略，SEO 检查通过，不单独拼接现场补丁。 |
| 健康检查、SEO 检查、GSC 脚本 | 保留 main 工具，SEO 检查随新页面更新，同时支持预览地址与正式 canonical 分开核验。真实 GSC 资产仍未验证。 |

## 正式发布前的具体门槛

1. 获得正式生产切换授权后，重新确认现场 HEAD、工作区差异及镜像没有被其他会话改动。
2. 使用独立发布制品，不在存在未提交修改的生产目录直接 checkout 或覆盖。
3. 在既有 canary 验证真实数据库、现金采集缓存、交易所来源和部署环境；本机没有复制生产凭据，现金目前是种子参考数据。
4. 检查正式域名的规范地址、旧链接跳转、sitemap 及健康；记录可回退的旧镜像后再推广制品。
5. GA4/GSC 实际接收、推广账户资格与佣金到账需要独立证据，本次不以事件代码或官方链接存在冒充完成。
