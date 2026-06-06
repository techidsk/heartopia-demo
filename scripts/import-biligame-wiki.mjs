import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "data", "content");
const assetDir = path.join(rootDir, "public", "assets", "wiki");
const apiUrl = "https://wiki.biligame.com/heartopiatw/api.php";
const sourceBase = "https://wiki.biligame.com/heartopiatw";
const sourceLabel = "Biligame Heartopia TW Wiki";
const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  Accept: "application/json, text/javascript, */*; q=0.01",
  Referer: `${sourceBase}/%E9%A6%96%E9%A1%B5`
};

const cropNameMap = new Map([
  ["番茄", ["tomato", "Tomato"]],
  ["馬鈴薯", ["potato", "Potato"]],
  ["土豆", ["potato", "Potato"]],
  ["小麥", ["wheat", "Wheat"]],
  ["生菜", ["lettuce", "Lettuce"]],
  ["鳳梨", ["pineapple", "Pineapple"]],
  ["菠蘿", ["pineapple", "Pineapple"]],
  ["胡蘿蔔", ["carrot", "Carrot"]],
  ["紅蘿蔔", ["carrot", "Carrot"]],
  ["草莓", ["strawberry", "Strawberry"]],
  ["玉米", ["corn", "Corn"]],
  ["葡萄", ["grape", "Grape"]],
  ["茄子", ["eggplant", "Eggplant"]],
  ["茶樹", ["tea-tree", "Tea Tree"]],
  ["可可豆", ["cacao-tree", "Cacao Tree"]],
  ["酪梨", ["avocado", "Avocado"]],
  ["牛油果", ["avocado", "Avocado"]]
]);

const featuredCharacters = [
  {
    id: "blanc",
    name: "Blanc",
    nameZh: "布蘭克",
    imageFile: "布蘭克.png",
    group: "mentor",
    role: "Gardening mentor",
    location: "Garden Shop / Central Town",
    schedule: "Use Blanc as the gardening route anchor before seed buying and flower planning.",
    gifts: ["Fresh crop", "Flower", "Simple cooked dish"],
    shop: "/shops/?q=seed",
    map: "/map/?marker=gardening-store",
    tool: "/tools/friendship-tracker/",
    profile: "TW Wiki lists Blanc as the gardening mentor tied to crops, flowers, and later flower breeding routes."
  },
  {
    id: "albert-ii",
    name: "Albert II",
    nameZh: "阿爾伯特二世",
    imageFile: "阿爾伯特二世.png",
    group: "featured",
    role: "Featured town character",
    location: "Heartopia town route",
    schedule: "Homepage feature character; confirm live location in game before routing gifts.",
    gifts: ["Favorite gift pending", "Liked gift pending", "Talk route"],
    shop: "/shops/",
    map: "/map/",
    tool: "/tools/friendship-tracker/",
    profile: "Featured on the TW Wiki homepage character strip; detailed route data is still pending."
  },
  {
    id: "ka-ching",
    name: "Ka Ching",
    nameZh: "卡清",
    imageFile: "卡清.png",
    group: "shopkeeper",
    role: "General store owner",
    location: "Central Town",
    schedule: "Pair Ka Ching with inventory, utility, and long-route preparation errands.",
    gifts: ["Utility item", "Simple dish", "Favorite gift pending"],
    shop: "/shops/?q=general",
    map: "/map/?marker=general-store",
    tool: "/tools/friendship-tracker/",
    profile: "Featured on the TW Wiki homepage and connected to the general-store route in this guide."
  },
  {
    id: "annie",
    name: "Annie",
    nameZh: "安妮",
    imageFile: "安妮.png",
    group: "shopkeeper",
    role: "Music store owner",
    location: "Central Town",
    schedule: "Use Annie when house ambience, music, and collection routes overlap.",
    gifts: ["Music decor", "Dessert", "Favorite gift pending"],
    shop: "/shops/?q=music",
    map: "/map/?marker=music-store",
    tool: "/tools/friendship-tracker/",
    profile: "Featured on the TW Wiki homepage and connected to the music-store route in this guide."
  },
  {
    id: "vania",
    name: "Vania",
    nameZh: "萬尼亞",
    imageFile: "萬尼亞.png",
    group: "featured",
    role: "Featured town character",
    location: "Heartopia town route",
    schedule: "Homepage feature character; confirm live location in game before routing gifts.",
    gifts: ["Favorite gift pending", "Liked gift pending", "Talk route"],
    shop: "/shops/",
    map: "/map/",
    tool: "/tools/friendship-tracker/",
    profile: "Featured on the TW Wiki homepage character strip; detailed route data is still pending."
  }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
const first = (printouts, key) => normalize(printouts?.[key]?.[0] || "");
const sourceUrl = (title) => `${sourceBase}/${encodeURIComponent(title)}`;

async function readJson(fileName) {
  return JSON.parse(await fs.readFile(path.join(dataDir, fileName), "utf8"));
}

async function writeJson(fileName, payload) {
  await fs.writeFile(path.join(dataDir, fileName), `${JSON.stringify(payload, null, 2)}\n`);
}

async function fetchJson(params, attempt = 1) {
  const url = `${apiUrl}?${new URLSearchParams(params)}`;
  const response = await fetch(url, { headers });
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    if (attempt < 3) {
      await sleep(5000 * attempt);
      return fetchJson(params, attempt + 1);
    }
    throw new Error(`Wiki API returned non-JSON for ${url}: ${text.slice(0, 120)}`);
  }
}

async function askRows(category, properties) {
  const query = [`[[Category:${category}]]`, ...properties.map((property) => `?${property}`), "limit=500"].join("|");
  await sleep(900);
  const payload = await fetchJson({ action: "ask", query, format: "json" });
  return Object.values(payload.query?.results || {});
}

async function imageInfo(fileName) {
  if (!fileName) return null;
  await sleep(650);
  const payload = await fetchJson({
    action: "query",
    titles: `File:${fileName}`,
    prop: "imageinfo",
    iiprop: "url|mime|size",
    format: "json"
  });
  const pages = Object.values(payload.query?.pages || {});
  return pages[0]?.imageinfo?.[0] || null;
}

async function downloadImage(url, outputPath) {
  if (!url) return false;
  try {
    await fs.access(outputPath);
    return false;
  } catch {
    // Download below.
  }
  await sleep(500);
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`Image download failed: ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(outputPath, bytes);
  return true;
}

async function resolveAsset(fileName, id, group) {
  const info = await imageInfo(fileName);
  if (!info?.url) return { image: "", sourceImageUrl: "" };
  const extension = info.mime === "image/jpeg" ? "jpg" : "png";
  const relativePath = `/assets/wiki/${group}/${id}.${extension}`;
  const outputPath = path.join(assetDir, group, `${id}.${extension}`);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await downloadImage(info.url, outputPath);
  return {
    image: relativePath,
    sourceImageUrl: info.url,
    imageWidth: info.width,
    imageHeight: info.height
  };
}

function mapGardeningRow(row) {
  const printouts = row.printouts || {};
  const nameZh = first(printouts, "園藝名稱") || row.fulltext;
  const number = first(printouts, "園藝編號");
  const mapped = cropNameMap.get(nameZh);
  const fallbackId = `garden-${String(number || nameZh).padStart(3, "0").replace(/\D+/g, "") || encodeURIComponent(nameZh)}`;
  const id = mapped?.[0] || fallbackId;
  return {
    id,
    sourceId: mapped?.[0] || "",
    name: mapped?.[1] || nameZh,
    nameZh,
    number,
    category: mapped ? "crop" : "garden",
    season: first(printouts, "活躍時期") || "日常",
    time: first(printouts, "活躍時間段") || "Any time",
    weather: first(printouts, "適宜天氣") || "Any weather",
    route: first(printouts, "出現途徑") || "Gardening handbook",
    lore: first(printouts, "園藝趣聞") || "TW Wiki handbook row; gameplay details pending.",
    hobbyLevel: first(printouts, "愛好等級") || "Pending",
    iconFile: first(printouts, "園藝圖示"),
    wikiUrl: row.fullurl || sourceUrl(nameZh),
    source: `${sourceLabel} 園藝手冊`
  };
}

function mapInsectRow(row) {
  const printouts = row.printouts || {};
  const nameZh = first(printouts, "蟲蟲名稱") || row.fulltext;
  const number = first(printouts, "蟲蟲編號");
  const id = `insect-${String(number || nameZh).padStart(3, "0").replace(/\D+/g, "") || encodeURIComponent(nameZh)}`;
  return {
    id,
    name: nameZh,
    nameZh,
    number,
    season: first(printouts, "活躍時期") || "日常",
    time: first(printouts, "活躍時間段") || "Any time",
    weather: first(printouts, "適宜天氣") || "Any weather",
    route: first(printouts, "出現途徑") || "Route pending",
    lore: first(printouts, "蟲蟲趣聞") || "TW Wiki handbook row; collection detail pending.",
    rarity: first(printouts, "稀有度") || "Unknown",
    hobbyLevel: first(printouts, "愛好等級") || "Pending",
    iconFile: first(printouts, "蟲蟲圖示"),
    wikiUrl: row.fullurl || sourceUrl(nameZh),
    source: `${sourceLabel} 蟲蟲物語`
  };
}

async function importCollections() {
  const gardeningRows = await askRows("園藝手冊圖鑑", [
    "園藝編號",
    "園藝圖示",
    "園藝名稱",
    "活躍時期",
    "活躍時間段",
    "適宜天氣",
    "出現途徑",
    "園藝趣聞",
    "愛好等級"
  ]);
  const gardening = [];
  for (const row of gardeningRows.map(mapGardeningRow).sort((a, b) => Number(a.number || 999) - Number(b.number || 999))) {
    gardening.push({ ...row, ...(await resolveAsset(row.iconFile, row.id, "gardening")) });
  }

  const insectRows = await askRows("蟲蟲物語圖鑑", [
    "蟲蟲編號",
    "蟲蟲圖示",
    "蟲蟲名稱",
    "活躍時期",
    "活躍時間段",
    "適宜天氣",
    "出現途徑",
    "蟲蟲趣聞",
    "稀有度",
    "愛好等級"
  ]);
  const insects = [];
  for (const row of insectRows.map(mapInsectRow).sort((a, b) => Number(a.number || 999) - Number(b.number || 999))) {
    insects.push({ ...row, ...(await resolveAsset(row.iconFile, row.id, "insects")) });
  }

  return { gardening, insects };
}

async function updateCrops(gardening) {
  const crops = await readJson("crops.json");
  const bySourceId = new Map(gardening.filter((item) => item.sourceId).map((item) => [item.sourceId, item]));
  const next = crops.map((crop) => {
    const wiki = bySourceId.get(crop.id);
    if (!wiki) return crop;
    return {
      ...crop,
      nameZh: wiki.nameZh,
      image: wiki.image,
      wikiUrl: wiki.wikiUrl,
      season: wiki.season,
      hobbyLevel: wiki.hobbyLevel,
      lore: wiki.lore,
      source: wiki.source
    };
  });
  await writeJson("crops.json", next);
}

async function updateNpcs() {
  const current = await readJson("npcs.json");
  const byId = new Map(current.map((npc) => [npc.id, npc]));
  const nextCharacters = [];
  for (const character of featuredCharacters) {
    const asset = await resolveAsset(character.imageFile, character.id, "characters");
    const existing = byId.get(character.id) || {};
    nextCharacters.push({
      ...existing,
      ...character,
      ...asset,
      wikiUrl: sourceUrl(character.nameZh),
      source: `${sourceLabel} homepage`
    });
  }

  for (const character of nextCharacters) byId.set(character.id, character);
  await writeJson("npcs.json", [...byId.values()]);
}

async function main() {
  await fs.mkdir(assetDir, { recursive: true });
  const { gardening, insects } = await importCollections();
  await writeJson("gardening.json", gardening);
  await writeJson("insects.json", insects);
  await updateCrops(gardening);
  await updateNpcs();
  console.log(`Imported ${gardening.length} gardening rows and ${insects.length} insect rows from ${sourceLabel}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
