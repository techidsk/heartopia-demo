# Agent 须知

## I18n 契约

- 保持英文站点为默认、无前缀的语言。新语言必须通过 `src/i18n/locales.json` 添加，并带有非空的 `pathPrefix`。
- 当文案应随语言变化时，不要在布局、共享组件、路由索引或浏览器脚本中硬编码新的站级文案。共享 UI 字符串放 `src/i18n/messages.ts`，站点框架文案放 `src/data/site.ts`，静态页内容放在 `getStaticPages(locale)` / `getStaticPage(path, locale)` 之后。
- 路由、feed、sitemap、search-index、OpenSearch 与 `llms.txt` 的数据，必须通过 `src/data/routes.ts` 和 `src/data/site.ts` 中 locale-aware 的 helper 产出。
- 客户端标签与状态文案，当它们属于可复用的 UI 行为时，应通过 `src/tools/i18n.ts` 从注入的 `#site-i18n-messages` 载荷读取。
- 新增语言时，避免发布仍然包含默认语言正文的可索引兜底页面。缺失的翻译应当显式标注，并在进入语言 sitemap 之前被发现拦截。
- 修改语言元数据、站点框架文案、静态页接线、路由生成或 i18n 文案契约后，运行 `npm run validate:i18n`。面向发布的改动前先运行完整的 `npm run qa`。
