# 健康记录 PWA

这是从 `日常热量_运动_体重记录模板.xlsx` 拆出来的轻量 PWA。它可以离线使用，默认把数据保存在当前浏览器；如果配置 Supabase，也可以跨设备自动同步。

食品库支持新增自定义食品，并可先用中文常见食材库补全热量、蛋白质、脂肪和碳水；遇到薯片、饼干、巧克力、饮料、泡面等包装食品时，会先按关键词给出估算值，内置库没有命中时再尝试 USDA FoodData Central / Open Food Facts 在线数据源。每日记录页保留常用固定项，包括按克记录的土豆（生，水煮或蒸），也可以在“其他食物”里添加任意食品库条目。

运动库支持新增自定义运动。每日记录页保留跑步、走路、力量、波比、羽毛球，也可以在“其他运动”里添加徒步、游泳等项目；默认按 MET 估算，也可以直接手填 kcal。

跨日期重新打开应用时，记录页会自动回到当天；同一天内手动查看旧日期时不会被自动切走。

总览页的摄入/消耗/净热量和体重趋势折线图支持悬浮查看节点数值；三大营养素使用目标盘展示当天蛋白质、脂肪和碳水完成度，100% 目标可在普通、减脂、增肌三种模式间切换，悬浮到扇区时会显示对应营养素贡献最高的前三项食物，并会根据最近摄入自动生成日常健康建议。

## 本地运行

在 `health-pwa` 目录启动任意静态服务器即可，例如：

```powershell
python -m http.server 4173
```

然后打开：

```text
http://localhost:4173
```

## 云同步

1. 创建一个 Supabase 项目。
2. 在 Supabase SQL Editor 运行 `supabase-schema.sql`。
3. 当前项目已内置 Supabase URL 和 Publishable Key，应用的“设置”页只需要填邮箱和密码。
4. 注册/登录后会自动拉取云端数据，本机保存后会自动上传，并每 1 分钟检查其他设备更新；“立即上传”和“立即拉取”保留为兜底操作。

## 部署

这个目录是纯静态站点，可直接部署到 Vercel、Cloudflare Pages、Netlify 或 GitHub Pages。当前仓库已配置 GitHub Pages 工作流，推送 `main` 后会自动把 `health-pwa` 发布到 `gh-pages` 分支，访问地址为：

```text
https://miso-soup98.github.io/health_record/
```

如果首次发布后页面没有出现，需要在 GitHub 仓库的 `Settings -> Pages` 中设置：Source 选择 `Deploy from a branch`，Branch 选择 `gh-pages`，Folder 选择 `/ (root)`。发布只负责让多设备打开同一个应用；跨设备共享记录还需要配置上面的 Supabase 云同步。
