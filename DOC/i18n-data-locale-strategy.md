# I18n 数据语言策略

## 当前基线

- 英文仍是默认、无前缀的语言与事实来源。
- `zh-Hans` 对当前的结构化数据集已有完整 overlay 覆盖：
  - fish、shops、crops、gardening、insects、recipes、codes、events、npcs、pets、hobbies、tools。
- 语言数据 overlay 位于 `src/data/content/i18n/<locale>/data/`。
- `npm run validate:data` 校验 overlay schema、源 ID 匹配、空 overlay 行，以及 zh-Hans 质量检查。
- `npm run report:i18n:data` 按语言报告数据 overlay 覆盖率，并已包含在 `npm run qa` 中。

## 下一批语言顺序

1. `zh-Hant`
   - 作为下一个数据语言风险最低，因为不少导入的 Wiki 源名称与设定字段本就源自繁体中文。
   - 适合验证 overlay 系统能否在不盲目复用简体质量规则的前提下支持同族中文语言。
   - 不应通过机械转换 `zh-Hans` 生成。优先采用可得的繁体源名称，再把路由、UI 与规划文案翻译成自然可读的繁体中文。

2. `ja`
   - 在 `zh-Hant` 之后做的最佳压力测试，因为日语在词序、路线描述与搜索关键词上的变化比中文变体更大。
   - 用它验证 overlay schema 是语言中立的，没有被无意中只为中文调优。

3. `ko`，随后是高流量的拉丁字母语言
   - `ko` 能暴露与日语类似的 CJK 排版问题。
   - 拉丁字母语言应在 overlay 工作流与质量闸成为常规之后再跟进。

## 各语言交付契约

每个数据语言只有在以下全部满足时才可发布：

- 存在完整的 `src/data/content/i18n/<locale>/data/` overlay 目录，文件与 `zh-Hans` 同样为 12 个。
- 已发布行用 `translationStatus: "translated"`，草稿行用 `translationStatus: "draft"`。
- `npm run report:i18n:data` 显示符合预期的发布覆盖率。完整数据发布的目标是 100%。
- `npm run validate:data` 在 schema、源 ID、重复 ID、空 overlay 行与语言专属质量规则上通过。
- 在语言元数据或路由行为变更后，`npm run validate:i18n` 通过。
- `npm run build` 证明本地化列表页、详情页、搜索索引、sitemap 与 feed 仍能生成。
- 发布候选要跑完整的 `npm run qa`。

## Overlay 编写规则

- 只翻译 `src/data/heartopia.ts` 与 `scripts/validate-data.mjs` 中 overlay schema 允许的本地化字段。
- 不要为了凑覆盖率而把英文字段复制进非英文 overlay。
- 不确定的行用 `draft`，而不是把英文兜底正文发布进可索引的语言页面。
- ID、路由路径、图片路径与源 URL 保持英文 / 源语言形态，除非 schema 明确允许本地化展示字段。
- 对源自数据源的名称，优先采用与目标语言匹配的权威源语言。
- 对 route、use、notes、schedule、prep、summary 等字段，撰写自然的目标语言规划文案，而不是逐字替换。

## 质量闸扩展

- 让 `zh-Hans` 检查聚焦于高置信问题：
  - 繁体中文残留。
  - 英文占位符，如 `Unknown`、`TBA`、`pending`、`Placeholder`、`fallback`。
  - 在已批准的产品 / 源术语之外可能的英文残留。
- 每引入一种语言就追加该语言专属的质量检查。不要把 zh-Hans 专属检查套用到 `zh-Hant`、日语、韩语或拉丁字母语言。
- 对产品名、源名称、兑换码值与无法避免的游戏术语，优先使用显式白名单。

## 推荐的下一步实现

从 `zh-Hant` 开始：

1. 添加 `src/data/content/i18n/zh-Hant/data/`，含 12 个 overlay 文件。
2. 在可得处复用 `nameZh` / Wiki 来源行的繁体源名称与设定。
3. 把路线规划字段从英文源或经审阅的 `zh-Hans` 文案翻译成繁体中文。
4. 通过语言发现机制自动把 `zh-Hant` 覆盖率纳入 `report:i18n:data`。
5. 添加一条仅在高置信处拦截简体残留的 `zh-Hant` 质量规则。
6. 运行 `npm run validate:data`、`npm run validate:i18n`、`npm run report:i18n:data`、`npm run build`，发布前再跑完整 `npm run qa`。
