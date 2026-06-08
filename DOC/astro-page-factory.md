# Astro 页面工厂架构

本项目目前只有一条可部署的 Astro 通道：

- `src/` 是新的 Astro 页面工厂源码，构建到 `dist/`。
- `src/data/content/` 存放规范 JSON 数据以及迁移后的静态页内容。
- `src/content.config.ts` 把规范 JSON 文件注册为 Astro Content Collections，并使用来自 `src/data/heartopiaSchemas.ts` 的共享 Zod schema。
- `public/` 存放浏览器可见的静态资源，如图片、CSS、favicon、manifest、`ads.txt` 与 Cloudflare `_headers`。

## 目标

- 保持现有 URL 与视觉语言稳定。
- 把重复的页头、页脚、SEO 与页面框架抽到共享组件中。
- 用基于校验 JSON 的 Astro Content Collections 生成数据库与工具页面，而不是手工维护 HTML 行。
- 保持静态部署，适配 Cloudflare Pages。

## 当前生成范围

- `/fish/` 与 `/fish/[id]/` 由 `src/data/content/fish.json` 生成。
- `/shops/` 与 `/shops/[id]/` 由 `src/data/content/shops.json` 生成。
- `/crops/` 与 `/crops/[id]/` 由 `src/data/content/crops.json` 生成。
- `/recipes/` 与 `/recipes/[id]/` 由 `src/data/content/recipes.json` 生成。
- `/tools/profit-calculator/` 由经过校验的作物数据生成。
- 迁移后的静态攻略、工具、爱好、法务、首页与 404 页面，由 `src/data/content/static-pages.json` 通过 `src/pages/[...slug].astro` 生成。
- `/search/`、`/search-index.json`、`/sitemap.xml` 与 `/feed.xml` 由 `src/data/routes.ts` 生成。

## 目录职责

- `src/layouts/BaseLayout.astro`：共享文档外壳、SEO 标签、页头、页脚与全局 CSS 链接。
- `src/components/`：可复用的页面框架，如导航、面包屑、指标卡与页脚分组。
- `src/content.config.ts`：规范数据与静态页 JSON 的 Astro Content Collections。
- `src/data/heartopiaSchemas.ts`：Content Collections 与 overlay 校验共用的 Zod schema。
- `src/data/heartopia.ts`：异步 collection 读取器、语言 overlay 合并器，以及类型化的扁平数据 helper。
- `src/data/staticPages.ts`：基于 collection 的静态页注册表与查找 helper。
- `src/data/routes.ts`：用于 sitemap、feed 与静态搜索的异步生成路由注册表。
- `src/pages/`：生成的 URL 路由。
- `src/tools/`：用于生成式交互页面的小型客户端模块。
- `scripts/validate-data.mjs`：JSON 结构与重复 ID 校验。
- `scripts/quality-gate.mjs`：针对构建产物的 SEO / 产物检查。
- `qa/check-layout.mjs`：针对 `dist/` 的移动端 / 桌面端溢出 QA。

## 新增一个数据库页面

1. 在 `src/data/content/` 增 / 改 JSON 数据。
2. 在 `src/data/heartopiaSchemas.ts` 加一个 Zod schema。
3. 在 `src/content.config.ts` 注册该 JSON 文件。
4. 当页面需要带 `id` 的行结构时，在 `src/data/heartopia.ts` 暴露扁平化数据。
5. 创建 `src/pages/<route>/index.astro` 作为列表页。
6. 若实体需要详情 URL，再加 `src/pages/<route>/[id].astro`。
7. 复用 `BaseLayout`、`Breadcrumbs` 与 `MetricCards`。
8. 在 `src/data/routes.ts` 加 sitemap / 搜索条目。
9. 运行 `npm run validate:data`、`npm run build` 与 `npm run qa`。

## 新增一个工具页面

1. 尽量把源数据保留在 JSON 中。
2. 由 Astro 渲染表单与种子数据。
3. 把客户端逻辑放进 `src/tools/<tool-name>.ts`。
4. `localStorage` 只存用户状态；不要在脚本里复制规范数据。
5. 运行 `npm run qa`，并在移动端宽度下手动检查工具。

## 生成式 SEO 与搜索

- `src/pages/sitemap.xml.ts` 由 `getIndexableRouteEntries()` 渲染 XML。
- `src/pages/feed.xml.ts` 由 `getFeedEntries()` 渲染 RSS。
- `src/pages/search-index.json.ts` 把同一个异步路由注册表暴露为 JSON。
- `src/pages/search/index.astro` 提供当前的轻量静态搜索 UI。
- `npm run quality` 在构建后检查代表性 HTML 路由、sitemap、feed 与搜索索引。

## 命令

```powershell
npm run dev
npm run validate:data
npm run build
npm run quality
npm run preview
npm run qa
npm run deploy
```
