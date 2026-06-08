# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 沟通与文档默认使用中文。本仓库的 `README.md` 等文档以中文为主。注意：这与站点内容的语言无关——站点本身以英文（`en`）为默认且唯一的内容来源语言，其他语言通过 overlay 叠加（见下文 I18n 部分）。

## 项目简介

独立的 Heartopia（心动小镇）粉丝攻略站。基于 Astro 的静态站点，构建产物输出到 `dist/`，部署到 Cloudflare Pages，并已为 Google AdSense 接入做好准备。站点内容以英文（`en`，无路径前缀）为默认且唯一的事实来源，其他语言以数据 / UI overlay 的形式叠加。

## 常用命令

```powershell
npm run dev                 # 本地开发服务器 (astro dev)
npm run build               # 构建到 dist/
npm run preview             # 预览已构建的 dist/ (npx serve)
npm run deploy              # 先构建，再 wrangler 部署到 Cloudflare Pages 项目 "heartopia-blog"

npm run validate:data       # 校验 JSON 结构、重复 ID、overlay schema、语言质量规则
npm run validate:i18n       # 校验语言元数据、站点框架文案、静态页接线、路由生成
npm run report:i18n:data    # 各语言数据 overlay 覆盖率报告
npm run quality             # 针对已构建 dist/ 的 SEO / 产物检查（需在 build 之后）
npm run qa:layout           # 针对 dist/ 的移动端 / 桌面端溢出检查 (Playwright)
npm run qa                  # 完整质量闸：validate:data + validate:i18n + report:i18n:data + build + quality + qa:layout

npm run import:wiki         # 导入 Biligame 心动小镇 TW Wiki 表格到 public/assets/wiki/
npm run scaffold:i18n           # 生成空的语言 overlay 目录骨架
npm run generate:zh-hant        # 生成 zh-Hant overlay
npm run generate:seo-locales    # 生成 SEO 语言 overlay
```

除了 `validate:*`、`quality`、`qa:*` 这些脚本之外，没有独立的测试框架或 linter。任何面向发布的改动前都要先跑 `npm run qa`。修改语言元数据、站点框架文案、静态页接线、路由生成或 i18n 文案契约后，至少要跑 `npm run validate:i18n`。

TypeScript 路径别名（见 `tsconfig.json`）：`@components/*`、`@data/*`、`@i18n/*`、`@layouts/*`、`@tools/*`。

## 架构

Astro 静态站点「页面工厂」：页面由经过校验的 JSON 数据生成，而非手写 HTML。数据流经三层——**规范 JSON → Content Collection → 类型化读取器 → 页面**。

- **规范数据** 位于 `src/data/content/*.json`（fish、shops、crops、gardening、insects、recipes、codes、events、npcs、pets、hobbies、tools，以及静态页）。英文 / 源语言形态为权威来源。
- **Schema** 是 `src/data/heartopiaSchemas.ts` 中共享的 Zod 定义。每个规范数据集有完整 schema；每个可本地化的数据集还有一个 *overlay schema*（`localizedArrayOverlay`），用白名单约束翻译可以覆盖哪些字段。
- **Content Collections** 在 `src/content.config.ts` 中用 Astro 的 `file()` loader 注册这些 JSON。loader 会剥离 / 派生 `id`（collection 存储不含 `id` 的数据，读取器再把 `id` 拼回去）。
- **类型化读取器** `src/data/heartopia.ts` 是数据访问的中心入口：
  - `getDefaultHeartopiaData()` 读取所有 collection（带 memo 缓存）。
  - `getHeartopiaData(locale)` 返回默认数据并按 `id`（`mergeById`）/ 按 `code`（codes）合并该语言的 overlay。`translationStatus: "draft"` 的行不计入「已翻译」统计。
  - overlay 通过 `import.meta.glob("./content/i18n/*/data/*.json")` 自动发现——新增 overlay 文件即可生效，无需额外注册。
- **静态页** 经由 `src/data/staticPages.ts`（基于 collection），通过 `src/pages/[...slug].astro` 从 `static-pages.json` 渲染。
- **路由 / SEO** 注册表是 `src/data/routes.ts`，被 `src/pages/sitemap.xml.ts`、`feed.xml.ts`、`search-index.json.ts`、`llms.txt.ts`、`opensearch.xml.ts`、`robots.txt.ts` 消费。这些 helper 都是 locale-aware 的，不要手工拼路由列表。
- **布局 / 框架**：`src/layouts/BaseLayout.astro` 是文档外壳（SEO 标签、页头、页脚、全局 CSS）。可复用框架组件在 `src/components/`（`Breadcrumbs`、`MetricCards`、`SiteFooter` 等）。
- **客户端工具**：交互功能以 `src/tools/` 下的小模块形式发布（收益计算器、鱼 / 作物 / 食谱数据库、站内搜索）。表单与种子数据由 Astro 渲染，行为放进 `src/tools/`。`localStorage` 只存用户状态——绝不要把规范数据复制进脚本。
- `public/` 存放浏览器可见的静态资源（图片、CSS、favicon、manifest、`ads.txt`、Cloudflare `_headers`）。`dist/`、`.astro/`、`.wrangler/`、`.seo-cache/` 是生成产物，已 gitignore。

### 新增一个数据库页面
1. 在 `src/data/content/` 增 / 改 JSON。2. 在 `heartopiaSchemas.ts` 加 Zod schema。3. 在 `content.config.ts` 注册。4. 在 `heartopia.ts` 暴露带 `id` 的扁平化行。5. 创建 `src/pages/<route>/index.astro`（详情 URL 再加 `[id].astro`）。6. 复用 `BaseLayout`/`Breadcrumbs`/`MetricCards`。7. 在 `routes.ts` 加 sitemap / 搜索条目。8. 跑 `validate:data`、`build`、`qa`。

## I18n 契约（详见 `Agents.MD`）

- 新语言在 `src/i18n/locales.json` 中添加，必须有非空的 `pathPrefix`。`en` 是默认且无前缀。`src/i18n/config.ts` 暴露 `localizePath`、`getCanonicalPath`、`getAlternateLocalePaths`、可索引性判断等。
- **不要** 在布局、组件、路由索引或浏览器脚本中硬编码随语言变化的文案。共享 UI 字符串放 `src/i18n/messages.ts`，站点框架文案放 `src/data/site.ts`，静态页内容走 `getStaticPages(locale)` / `getStaticPage(path, locale)`。
- 客户端标签通过 `src/tools/i18n.ts` 从注入的 `#site-i18n-messages` 载荷读取。
- 数据 overlay 位于 `src/data/content/i18n/<locale>/data/*.json`（与 `zh-Hans` 同样的 12 个文件名）。只翻译 overlay schema 允许的字段；ID、路径、图片 / 源 URL 保持源语言形态。不确定的行用 `translationStatus: "draft"`，不要把英文兜底正文发布进可索引的语言页面。
- 一个语言只有在其 overlay 覆盖率、`validate:data`、`validate:i18n`、`build` 与完整 `qa` 全部通过后才能上线（见 `DOC/i18n-data-locale-strategy.md`）。不要把 `zh-Hans` 专属的质量规则套用到其他语言；不要把 `zh-Hans` 机械转换成 `zh-Hant`。

## 参考文档
- `DOC/astro-page-factory.md` —— 页面工厂架构与迁移流程。
- `DOC/i18n-data-locale-strategy.md` —— 语言上线顺序与各语言交付契约。
- `Agents.MD` —— 完整的 i18n 契约。
