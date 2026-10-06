# ExchangeTHB 推广与运维验收方案

## 已接管的资产

Google 使用用户明确指定的 fujane110@gmail.com / Profile 16。Search Console 域名属性所有权已验证，复用原站点地图。GA4 账号 410361296、属性 557014525、数据流 15934949405、衡量 ID G-HHPM4E9QGY，泰国时区、THB 已回读确认。本地预览 page_view、comparison_started、comparison_success 已在 GA4 实时报告接收，不能当成生产流量。affiliate_click、official_click 已登记关键事件，每会话一次，不赋予默认货币价值。purchase 是平台默认事件，本项目不发送购买或虚构佣金。

Cloudflare 复用 zone a28cae90fc75e24f5e0202025e1177bd 和自动 Web Analytics 资产 e790e394b37047f3bde76d899eea81d5，不重复部署 beacon。生产页面实际提交 /cdn-cgi/rum，响应 204；面板最近 24 小时、GMT+7、排除自动程序，13 次访问、22 次页面浏览。

## 推广漏斗

来源 → 比较开始 → 比较成功 → 查看费用/来源 → 地图/官网/推广跳转。

比较事件仅传币种、方向、渠道、结果数和金额区间，不传精确金额/坐标/客户身份。只接受预先约定的渠道标签；未知 UTM 不进入自定义统计。允许 utm_source: google/facebook/line/telegram/tiktok/x/qrcode/partner；utm_medium: organic/social/referral/email/cpc/offline；utm_campaign: exchange_thb_launch/cash_comparison/crypto_comparison。

示例：https://www.exchangethb.com/zh?utm_source=line&utm_medium=social&utm_campaign=cash_comparison

GA4 初始标签只有用户同意统计后才加载，广告存储/用户数据/个性化均关闭。页面地址去掉查询参数和片段；搜索/社媒来路只保留已允许域名的 origin。用户可撤回同意，后续业务埋点停止。Cloudflare 自动统计继续按其既有配置工作，隐私说明需分别解释。

推广奖励逐站记录官方活动页面、核验日期、奖励条件、账号资格及用户可获得的奖励。Binance TH 当前推荐计划暂停，VSHA3YP2 不作为已确认返佣入口，平台合作计划与用户推荐计划分开。禁止把跳转点击当注册/佣金，也不因商业收益改变报价排序。

## 每日核验与增长顺序

优先验证 HTTPS、比较 API、来源新鲜度、worker 数据降级状态；随后检查 GA4 生产事件、Cloudflare 页面浏览、Search Console 搜索展现/点击/CTR/排名及索引。各平台指标不可相加；新 GA4 不补造历史流量。正常未变化保持安静，故障、持续采集降级、标签失效、索引异常或重要趋势才通知。

第一阶段先解决旧报价、手机版易用性与索引问题；第二阶段根据真实搜索查询增加有需求的币种/地区说明；第三阶段依据官网/推广点击及已核实注册反馈决定渠道投入。当前不购买广告、不自动社媒发布、不新增付费 Google 服务。

## 正式版本切换门槛

本地构建、测试、手机回归、SEO、回退脚本通过；确认生产 21 项旧修改已逐项保留或合并；备份生产业务配置与数据库；web/canary/worker 同版本发布；GA4 标签在构建阶段传入（Docker 已补 build ARG，运行时 env 单独设置不能替代前端构建）；正式域名重复页面和同意流程正确；生产实际事件被平台接收；worker 对采集失败不得继续报全量正常。

未完成项：正式重构切换与生产 GA4 接收；新增 Vasu/Twelve 真实原文解析（固定代理 VPN 连接持续 reset/unhealthy）；Google 门店评论真实接入（需要经核验 Place ID、受限 key 和计费资源授权）。接口与拒绝/保真测试已完成，未接入不得出现伪造评论。

官方配置依据：[Google 页面浏览](https://developers.google.com/analytics/devguides/collection/ga4/views)、[Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/get-started/)。

## Search Console 索引优先级（真实平台回读）

数据上次更新2026-09-21，核验2026-10-01：25已索引；162未索引中，23备用网页（适当canonical）、14自动重定向、12未找到404、32已抓取尚未索引、81已发现尚未索引。备用页与重定向先检查是否符合预期，不把所有未收录当故障。优先核查12个失效入口；其余113页结合重复内容、内部链接和真实查询需求审查。新sitemap收敛为33个核心规范地址，避免为追求数量重新展开重复路线。没有承诺全收录或排名增长。

## 2026-10-02 当前进度修正（以上旧阻塞记录保留为历史）
目标已恢复active。正式站十语、真实手机GPS、Google Places评论、GA4生产事件接收及Cloudflare统计已验证；Twelve官方采集成功，Vasu失败/SIA当前HTTPS403未恢复。最新正式网页镜像88f2e6…已移除生产路径中的示例报价补位和推算买价；目录/路线页读取真实记录。当前另在构建曼谷时区及十语面额提示修复，构建不等于发布。现金店当前许可与推广资格尚未完成，不能宣称全项目完成或点击产生收入。最新证据以DELIVERY_RECEIPT.md及对应artifacts为准。

## 2026-10-02 AdSense审核正式提交
已授权Profile16/发布商pub-8386341379958173实际平台回读：本站所有权已验证、ads.txt已授权，但初始需要审核。点击申请审核后显示已请求审核/正在准备，未获批。CMP提示待处理：快捷配置会覆盖未来网站，本轮未选，未购买广告/付款/开启全局广告。EgoTaskSpace85完成keep[]；证据artifacts/adsense-review-requested-20261002.json。后续站点限定CMP配置和最终审核结果仍待完成，不将发布商ID或请求提交当获批/收益。
