# Locale Alignment Runbook — 把某个语言对齐到英文源

> 目的:把一个「SEO 模板占位 / 伪翻译」状态的语言 overlay,提升到与 `zh-Hans` 同等的**真翻译、对齐英文源结构**的质量。
> 本文是可照做的执行手册。`ja` 已按此流程完成(commit `a0a7577`),作为参考样板。
>
> **剩余待对齐语言**:`de`、`es`、`fr`、`pt`、`id`、`ru`、`th`、`ko`(共 8 种)。
> 一次处理一种语言;每种约 41 个翻译 agent、约 100 万 token(用 Sonnet)。

---

## 0. 背景:为什么要做

`scripts/generate-seo-locale-overlays.mjs` 给这 8 种语言批量生成的是**伪翻译**:

- 静态页用精简的 `page-hero` 模板(英文源用的是丰富的 `wiki-hero` 结构)。
- 数据 overlay 是「英文值 + 本地化标签前缀 + 通用套话」,例如
  `spot: "マップ: Meadow Lake"`、`condition: "<name> を使って…比較できます"`。

对齐目标 = 像 `zh-Hans` 那样:静态页用英文源的完整结构 + 真翻译,数据 overlay 每个字段真翻译。

**判断某语言是否还是伪翻译**:看 `src/data/content/i18n/<locale>/data/fish.json` 第一行,
若 `name` 仍是英文(如 `Wels Catfish`)、`spot` 形如 `"<标签>: Meadow Lake"`,即为伪翻译,需要对齐。

---

## 1. 输入参数(每种语言)

| 变量 | 说明 | 取值 |
|---|---|---|
| `LOCALE` | locale 代码 | `de` / `es` / `fr` / `pt` / `id` / `ru` / `th` / `ko` |
| `PREFIX` | href 路径前缀 | 取自 `src/i18n/locales.json` 的 `pathPrefix`;这 8 种都等于 `LOCALE` 本身 |

> 注意:`zh-Hant` 的 `pathPrefix` 是小写 `zh-hant`,与代码 `zh-Hant` 不同。上面这 8 种没有这个问题。

不变的参照物(语言无关):
- **英文源**:`src/data/content/static-pages.json`、`src/data/content/<set>.json`
- **字段范围模板**:`src/data/content/i18n/zh-Hans/data/<set>.json` —— 它定义了**每个数据集到底翻译哪些字段**,直接照搬其结构,只是把值换成目标语言。

---

## 2. 流程总览

```
准备:拆分英文源静态页 → 单页文件
  ↓
Workflow(并行):29 个静态页 agent + 12 个数据 agent
  ↓
合并:把翻译好的单页输出合并进 <locale>/static-pages.json
  ↓
修补:href 本地化漏网 + codes.json 去掉非法 translationStatus 键
  ↓
校验:validate:data + validate:i18n + report:i18n:data(目标 100%)+ build
```

与 `ja` 样板的唯一差异:`ja` 的**首页是手工做的**(用来定质量/术语基线)。基线已定,**复制时首页直接纳入 workflow 一起翻译即可**(即处理全部 29 个静态页)。

---

## 3. 翻译规则(写进每个 agent 的 prompt)

### 静态页
- 翻译所有**人眼可见文本**:`title`、`description`、`section`、每个 `keyword`,以及 `content` 里每个文本节点、`alt`、`aria-label`。
- **HTML 结构必须逐字保留**:相同标签、相同 class 名、相同属性名与顺序、相同 emoji、相同字母徽章(`SH`/`HB`/`BUG`/`BD`/`CK`/`DAY1` 等)。不增删元素。
- **本地化内部链接**:所有以 `/` 开头的 `href` 加前缀 `/<PREFIX>`(如 `href="/codes/"` → `href="/<PREFIX>/codes/"`)。
- **不要改**:`http(s)` 外链、`img src`、`data-*` 属性、`data-copy-code` 值、兑换码 token(如 `r5a8m4q1n6`)、`mailto:`、纯 `#` 锚点。
- `path` 原样保留;`ogImage` 有才保留;每条 `translationStatus` 设为 `"translated"`。

### 数据 overlay
- **完全照搬 `zh-Hans` overlay 的结构与字段集**:每行相同的 key、相同的数组/对象形态、按 `id`/`code` 对应同样的行(顺序同英文源)。`zh-Hans` 翻译哪些字段,就翻哪些字段,值取自英文源。
- **永不翻译(保持源形)**:`id`、`code`、路径/URL、图片 URL、`source` URL、数字、等级码(如 `"Lv 1"`)、兑换码 token。
- `translationStatus:"translated"` 只加在 `zh-Hans` 加了的地方。
- **绝不**把英文值原样塞进翻译字段,**绝不**用「标签前缀」式伪翻译。

### 专有名词策略(已与产品方确认)
- **音译成目标语言文字**(日语片假名;俄语西里尔;泰语泰文;等)。
- **真实世界物种**(鱼/昆虫/作物)用目标语言的**自然通用名**,不是音译。例:`Wels Catfish` → 日语 `ヨーロッパナマズ`(不是 `ウェルスキャットフィッシュ`)。
- 游戏专有名词(NPC、地名、道具、商店)→ 音译。

### 术语表(每种语言开跑前先固定一份,保证 41 个 agent 一致)
seed 来源:`scripts/generate-seo-locale-overlays.mjs` 里 `localePacks[LOCALE].terms` 已有每种语言的核心词(Codes/Database/Map/Tools/Fish/Crops…),拿来当起点,再补地名/道具/NPC。
下面是 `ja` 实际用的术语表,**照此结构为目标语言各产一份**:

```
Concepts: Codes->コード, Database->データベース, Map->マップ, Tools->ツール, Guides->ガイド,
  Events->イベント, Shops->ショップ, Hobbies->趣味, Pets->ペット, Download->ダウンロード,
  House Designs->ハウスデザイン, Recipes->レシピ, Crops->作物, Fish->魚, Insects->昆虫,
  NPCs->NPC, Gold->ゴールド, Fishing->釣り, Gardening->園芸, Cooking->料理, Birdwatching->野鳥観察
Regions/places: Central Town->セントラルタウン, Fishing Village->フィッシングビレッジ, Forest->フォレスト,
  Flower Field->フラワーフィールド, Onsen Mountains->温泉マウンテン, Meadow Lake->メドウレイク,
  Forest Lake->フォレストレイク, Whale Sea->ホエールシー, Secret Pond->秘密の池, Crater Lake->クレーターレイク
Items: Wishing Star->ウィッシングスター, Growth Booster->成長ブースター, Repair Kit->修理キット,
  Fertilizer->肥料, Bait->釣りエサ, Timber->木材
NPCs: Dorothy->ドロシー, Bob->ボブ (其他 NPC 名:音译)
Keep as-is: D.G., QTE, Oak-Oak, Bubble Net, Steam route, Fan-made
```

---

## 4. 脚本(按需把 `LOCALE`/`PREFIX` 替换后使用)

> 临时脚本建议放 `scripts/_*.mjs`(下划线前缀),输出工作目录用 `.seo-cache/`(已 gitignore),做完删掉。

### 4.1 准备:拆分英文源静态页(`scripts/_prep-src.mjs`)

```js
import fs from "node:fs";
import path from "node:path";

const outDir = ".seo-cache/loc-src/static";
fs.mkdirSync(outDir, { recursive: true });
const pages = JSON.parse(fs.readFileSync("src/data/content/static-pages.json", "utf8"));
const slugFor = (p) => (p === "/" ? "home" : p === "/404.html" ? "404" : p.replace(/^\/|\/$/g, "").replace(/\//g, "__"));

const manifest = [];
for (const page of pages) {                       // 复制时:全部 29 页都要(含首页)
  const slug = slugFor(page.path);
  const file = path.join(outDir, `${slug}.json`);
  fs.writeFileSync(file, JSON.stringify(page, null, 2), "utf8");
  manifest.push({ slug, path: page.path, srcFile: file.replace(/\\/g, "/") });
}
fs.writeFileSync(".seo-cache/loc-src/manifest.json", JSON.stringify(manifest, null, 2), "utf8");
console.log(JSON.stringify(manifest));
console.log("\nstatic pages:", manifest.length);
```

### 4.2 Workflow 脚本(并行翻译)

要点(都是 `ja` 实跑踩过的坑):
1. **不要依赖 workflow 的 `args`**——实测 `args.static` 取不到(undefined)。把 `staticManifest` / `dataManifest` 两个数组**直接内嵌进脚本常量**(从 4.1 的输出 + 下面的数据清单复制进去)。
2. 静态 agent 把结果**写到 `.seo-cache/loc-out/static/<slug>.json`**(各写各的文件,无冲突),最后由 4.3 合并进同一个 `static-pages.json`。
3. 数据 agent **直接写入** `src/data/content/i18n/<LOCALE>/data/<set>.json`(各文件互不冲突)。
4. 跑前先 `mkdir -p .seo-cache/loc-out/static`。
5. 用 `model: 'sonnet'`。

把下面占位替换:`__LOCALE__`、`__PREFIX__`、`__GLOSSARY__`(第 3 节那份目标语言术语表)、`__STATIC_MANIFEST__`、`__DATA_MANIFEST__`。

```js
export const meta = {
  name: 'locale-align',
  description: 'Translate static pages + data overlays to English-source parity (__LOCALE__)',
  phases: [{ title: 'Static' }, { title: 'Data' }],
}
const ROOT = 'C:/Code/heartopia-demo'
const PREFIX = '__PREFIX__'
const GLOSSARY = `__GLOSSARY__`
const STATIC_SCHEMA = { type:'object', additionalProperties:false, required:['slug','ok','note'],
  properties:{ slug:{type:'string'}, ok:{type:'boolean'}, note:{type:'string'} } }
const DATA_SCHEMA = { type:'object', additionalProperties:false, required:['name','ok','rows'],
  properties:{ name:{type:'string'}, ok:{type:'boolean'}, rows:{type:'number'} } }

const staticManifest = __STATIC_MANIFEST__   // 4.1 的输出数组(29 项)
const dataManifest = __DATA_MANIFEST__       // 见 4.2.1

phase('Static')
const staticResults = await parallel(staticManifest.map((p) => () =>
  agent(
    `You are a professional EN->${'__LOCALE__'} game-wiki translator for the fan site "Heartopia Hub".\n\n` +
    `Read the English source page object at: ${ROOT}/${p.srcFile}\n` +
    `Fields: path, translationStatus, title, description, section, keywords[], optional ogImage, content (HTML string).\n\n` +
    `Produce the localized version and WRITE it as pretty JSON (2-space indent) to:\n${ROOT}/.seo-cache/loc-out/static/${p.slug}.json\n\n` +
    `RULES:\n` +
    `- Translate ALL human-visible text to natural fluent target language: title, description, section, every keyword, every text node / alt / aria-label inside content.\n` +
    `- PRESERVE HTML structure EXACTLY: same tags, class names, attribute names+order, emoji, letter badges (SH,HB,BUG,BD,CK,...). Do NOT add/remove elements.\n` +
    `- Localize internal links: every href starting with "/" gets prefix "/${PREFIX}" (href="/codes/" -> href="/${PREFIX}/codes/"). Do NOT touch http(s) links, img src, data-* attrs, data-copy-code, mailto:, bare #anchors, or alnum code tokens.\n` +
    `- Keep "path" EXACTLY. Keep "ogImage" only if present. Set "translationStatus" to "translated".\n` +
    `- Proper nouns: transliterate game-specific names (NPC/region/place/item) into the target language's script; use natural target-language names for real-world species (fish/insects/crops).\n` +
    `Glossary:\n${GLOSSARY}\n\n` +
    `Output keys exactly: path, translationStatus, title, description, section, keywords (string[]), content (and ogImage if source had it). Validate JSON parses before writing, then return the status object.`,
    { label: `static:${p.slug}`, phase: 'Static', model: 'sonnet', schema: STATIC_SCHEMA }
  )))

phase('Data')
const dataResults = await parallel(dataManifest.map((d) => () =>
  agent(
    `You are a professional EN->${'__LOCALE__'} game-wiki translator for "Heartopia Hub".\n\n` +
    `Translate the data overlay for "${d.name}".\n` +
    `- English source (authoritative values): ${ROOT}/${d.enSrc}\n` +
    `- zh-Hans overlay (defines EXACTLY which fields to translate + the structural template): ${ROOT}/${d.zhOverlay}\n\n` +
    `Produce the overlay and WRITE pretty JSON (2-space indent, trailing newline) to:\n${ROOT}/${d.out}\n\n` +
    `RULES:\n` +
    `- Match the zh-Hans overlay STRUCTURE and FIELD SET exactly: same keys per row, same shape, same rows keyed by id/code (source order). Translate the SAME fields zh-Hans translates, meaning from the English source.\n` +
    `- NEVER translate (keep source form): id, code, paths/URLs, image URLs, source URLs, numbers, level codes like "Lv 1", code tokens.\n` +
    `- Set "translationStatus":"translated" only where zh-Hans does. For codes.json: do NOT add translationStatus to activeCandidates/expiredArchive rows (schema rejects it).\n` +
    `- Real translation only. Real-world species -> natural target-language names. Game proper nouns -> transliteration. No label-prefix pseudo-translation.\n` +
    `Glossary:\n${GLOSSARY}\n\n` +
    `Validate JSON parses before writing, then return the status object with row count.`,
    { label: `data:${d.name}`, phase: 'Data', model: 'sonnet', schema: DATA_SCHEMA }
  )))

return {
  static: staticResults.filter(Boolean),
  data: dataResults.filter(Boolean),
  staticFailed: staticResults.filter((r) => !r || !r.ok).length,
  dataFailed: dataResults.filter((r) => !r || !r.ok).length,
}
```

#### 4.2.1 数据清单(`__DATA_MANIFEST__`,把 `<LOCALE>` 替换)

12 个集合:`fish, shops, crops, gardening, insects, recipes, events, npcs, pets, hobbies, tools, codes`。每项:
```js
{ name:"fish", enSrc:"src/data/content/fish.json",
  zhOverlay:"src/data/content/i18n/zh-Hans/data/fish.json",
  out:"src/data/content/i18n/<LOCALE>/data/fish.json" }
```
(其余 11 个同理换 `name`。)

> **启动方式**:`Workflow` 工具用 `script` 内联首发;若报错(如 args 问题),用返回的 `scriptPath` 编辑后再发,可 `resumeFromRunId` 复用已完成 agent 的缓存。

### 4.3 合并 + 结构校验(`scripts/_assemble-static.mjs`)

把 `<LOCALE>` 替换。会把 28~29 个单页输出合并进目标 `static-pages.json`,并比对英文源的标签/class 数、检查 href 是否都已本地化。

```js
import fs from "node:fs";
import path from "node:path";
const LOCALE = "<LOCALE>", PREFIX = "<PREFIX>";
const outDir = ".seo-cache/loc-out/static", srcDir = ".seo-cache/loc-src/static";
const target = `src/data/content/i18n/${LOCALE}/static-pages.json`;
const pages = JSON.parse(fs.readFileSync(target, "utf8"));
const byPath = new Map(pages.map((p) => [p.path, p]));
const sig = (h = "") => ({
  tags: (h.match(/<([a-zA-Z][\w-]*)/g) || []).length,
  classes: (h.match(/class="/g) || []).length,
  hrefs: (h.match(/href="\//g) || []).length,
  locHrefs: (h.match(new RegExp(`href="/${PREFIX}/`, "g")) || []).length,
});
const REQUIRED = ["path","translationStatus","title","description","section","keywords","content"];
const issues = []; let merged = 0;
for (const f of fs.readdirSync(outDir).filter((x) => x.endsWith(".json"))) {
  let obj; try { obj = JSON.parse(fs.readFileSync(path.join(outDir, f), "utf8")); }
  catch (e) { issues.push(`PARSE FAIL ${f}: ${e.message}`); continue; }
  for (const k of REQUIRED) if (!(k in obj)) issues.push(`${f}: missing "${k}"`);
  if (!byPath.has(obj.path)) { issues.push(`${f}: path "${obj.path}" not in target`); continue; }
  const sf = path.join(srcDir, f);
  if (fs.existsSync(sf)) {
    const a = sig(JSON.parse(fs.readFileSync(sf, "utf8")).content), b = sig(obj.content);
    if (a.tags !== b.tags) issues.push(`${f}: TAG drift EN=${a.tags} ${LOCALE}=${b.tags}`);
    if (a.classes !== b.classes) issues.push(`${f}: CLASS drift EN=${a.classes} ${LOCALE}=${b.classes}`);
    if (b.hrefs !== b.locHrefs) issues.push(`${f}: ${b.hrefs - b.locHrefs} internal href(s) NOT localized to /${PREFIX}`);
  }
  Object.assign(byPath.get(obj.path), obj); merged++;
}
fs.writeFileSync(target, `${JSON.stringify(pages, null, 2)}\n`, "utf8");
console.log(`Merged ${merged} pages into ${target} (total ${pages.length})`);
console.log(issues.length ? `\n=== ${issues.length} ISSUE(S) ===\n- ` + issues.join("\n- ") : "\nNo structural issues.");
```

任何 `TAG/CLASS drift` 或 `href NOT localized` → 对那一页**重跑单个 agent**或手工补;改完重跑本脚本。

---

## 5. 已知坑 & 必做修补

1. **href 漏本地化**:agent 偶尔漏掉某个内链(`ja` 有 1 例:guides 里 `/tools/checklist/`)。4.3 会报出来,用脚本把该页里 `href="/X/"`(非 `/PREFIX/` 开头)替换为 `href="/PREFIX/X/"`。
2. **codes.json 非法键**:agent 可能给 `activeCandidates`/`expiredArchive` 加 `translationStatus`,而 `zh-Hans` 的 codes **完全没有**这个键,schema 会拒。修补:
   ```js
   const d = JSON.parse(fs.readFileSync(f,"utf8"));
   (d.activeCandidates||[]).forEach(r=>delete r.translationStatus);
   (d.expiredArchive||[]).forEach(r=>delete r.translationStatus);
   delete d.translationStatus;
   fs.writeFileSync(f, JSON.stringify(d,null,2)+"\n");
   ```
3. **`args` 取不到**:见 4.2 要点 1——清单内嵌,别用 `args`。

---

## 6. 校验 & 验收标准

```powershell
npm run validate:data        # 必须 PASS
npm run validate:i18n        # 必须 "i18n contract passed for 12 locales."
npm run report:i18n:data     # 看目标 locale 区块:static 29/29、data 208/208、codes 全量、readiness=indexable-ready
npm run build                # 必须成功
```

**验收 = 目标 locale 覆盖率 100% + 上面四项通过。**

### 可忽略的既有基线噪声(不是你引入的回归,别去追)
- `npm run quality` 报 `tools/profit-calculator/index.html: contains localized fallback title page` —— **全部 12 个 locale(含 zh-Hans)都有**,是项目既有状况。
- `npm run qa:layout` 报 `/map/` 溢出 —— 只在 **en + zh-Hans** 上,既有基线。
- 验证「是否我引入」的方法:`git stash` 掉本次改动重新 build + quality/qa:layout,若同样报错即为既有。

> 自检:跑完后 `git diff --name-only` 应**只**包含 `src/data/content/i18n/<LOCALE>/...` 下的 13 个文件(`static-pages.json` + 12 个 data 文件)。

---

## 7. 收尾 & 提交

- 删除临时脚本与工作目录:`scripts/_*.mjs`、`.seo-cache/loc-src`、`.seo-cache/loc-out`。
- 只暂存目标 locale 的 13 个文件再提交(别带上无关的 `.gitignore`/`CLAUDE.md`)。
- 直接提交到 `main`(本仓库惯例);commit message 用英文,结尾加
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`。
- **bash 提交注意**:用 heredoc,不要用 PowerShell here-string(`@'...'@` 在 bash 里会把 `@` 混进 subject):
  ```bash
  git commit -F - <<'EOF'
  Align <LOCALE> locale to English source (static pages + data overlays)

  ...body...

  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
  EOF
  ```

参考样板提交:`a0a7577`(ja)。**一种语言一个 commit。**
