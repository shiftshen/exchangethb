# ExchangeTHB 变现实施与申请回执

普通官网链接不产生点击佣金。展示广告按联盟有效展示规则结算；推广合作通常要求合格新客户/成交，不能把GA4跳转事件作为收益。比较顺序不因佣金改变，不强制跳广告，不使用误导按钮或诱导点击。

## 已实际推进

- Travelpayouts：使用站点已授权 Profile16 / fujane110@gmail.com 完成Google SSO，登记 https://www.exchangethb.com，生成 marker 784381、项目580269，进入Drive手工安装页。官方接入代码保存 artifacts/travelpayouts-drive-registration-20261002.txt；未安装线上、未验证广告/订单/付款。当前仍在安装引导，不能把注册完成称作已上线获利。
- AdSense：已通过Google登录、图片验证及用户提供的SMS，账号真实创建，发布者 pub-8386341379958173；站点 exchangethb.com 已添加，平台状态“需要审核”，Ads.txt“未找到”。本地 public/ads.txt 已准备官方原文，尚未发布线上，未点击虚假的“已发布”。收款资料已在平台保存（首页显示已获得信息），网站所有权未验证，审核尚未申请，广告收入未验证。短信读取的单进程脚本执行错误不能证明没有收到短信，撤回之前“未收到”的判断。
- Wise：官方Website Partnerships经Partnerize申请，入口 https://join.partnerize.com/wise/en 。需公司、地址、电话及后续收款主体。未提交虚构公司或AI实名，未声称获得Wise批准，也未把Wise放入已核验泰国现金换汇店名单。

## 接入安排

第一步完成平台账户与真实收款主体核验，第二步获取批准的广告位或联盟链接，第三步接入单独标注“广告/推广”的区域，第四步按平台订单/佣金报表对账。Travelpayouts用于泰国旅行相关附加服务，不把交易所/现金门店链接自动改成无关旅游链接。Drive全页自动插入不作为默认生产部署，保留简洁手机比较体验；优先取得明确商户批准后用局部链接。

AdSense需要站点审核；现有低访问量与旧版数据质量不能支持收入预测。收款实名/税务/银行资料必须来自真实自然人或法人，不用助手显示名代替；邮箱和手机只解决登录验证。无获批publisher广告ID前，不插入假广告或声称流量已变现。

官方依据：
- https://support.google.com/adsense/answer/14129646
- https://wise.com/gb/affiliate-program/
- https://support.travelpayouts.com/hc/en-us/articles/11395179019538-How-to-join-Travelpayouts

## 最新回读与发布准备 · 2026-10-02

AdSense站点详情再次实测：需要审核、所有权验证待完成、ads.txt未找到。public/ads.txt 和 google-adsense-account meta 已进入独立测试制品，正式站未切换，因此没有勾选已发布、没有假称审核申请完成。账户收款资料已收到，不等同于站点批准或收入。

当前没有已核验、可归属于本站的新交易所佣金收入。Binance TH官方推广暂停；Bitkub方案调整；Orbix可有活动奖励但本站未完成符合条件的推广账号与追踪链接。现金门店无已核验公开返佣。推广正规官网不会自动产生收益。详细日期及官方依据见 REFERRAL_VERIFICATION_2026-10-02.md。
