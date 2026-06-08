# Heartopia 攻略站

独立的 Heartopia（心动小镇）粉丝攻略站，面向 Cloudflare Pages 部署与 Google AdSense 接入准备。

## 本地预览

```powershell
npm run dev
```

## 构建与 QA

```powershell
npm run validate:data
npm run build
npm run quality
npm run qa
```

整站现已完全由 Astro 生成。源页面位于 `src/pages/`，结构化数据位于 `src/data/content/`，浏览器可见资源位于 `public/`。Astro 直接构建到 `dist/`。

## Wiki 数据导入

```powershell
npm run import:wiki
```

导入脚本读取 Biligame 心动小镇 TW Wiki 的园艺与昆虫语义表格，解析 imageinfo URL，并把本地副本存到 `public/assets/wiki/`。本仓库尚未配置 R2 上传；在替换本地资源路径前，请先添加 bucket 绑定或公开资源托管。

sitemap、RSS feed 与静态搜索索引由 `src/data/routes.ts` 生成：

```powershell
dist/sitemap.xml
dist/feed.xml
dist/search-index.json
```

## 部署

```powershell
npm run deploy
```

deploy 命令会先构建 `dist/`，再用 Wrangler 把它部署到 Cloudflare Pages。

脚手架架构与页面迁移流程见 `DOC/astro-page-factory.md`。

## AdSense 提交前检查

- 把 `/contact/` 的占位联系方式替换为有人维护的站长邮箱。
- `ads.txt` 已配置为 `pub-1476592629109289`。
- AdSense 验证脚本已注入可索引页面的 `<head>` 输出。
- 在 Google Search Console 提交 `https://heartopia.blog/sitemap.xml`。
