import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(rootDir, "src", "data", "content");
const i18nDir = path.join(contentDir, "i18n");

const targetLocales = ["de", "es", "fr", "pt", "id", "ru", "th", "ja", "ko"];
const dataFiles = ["fish", "shops", "crops", "gardening", "insects", "recipes", "events", "npcs", "pets", "hobbies", "tools"];

const localePacks = {
  de: {
    name: "Deutsch",
    guide: "Guide",
    database: "Datenbank",
    route: "Route",
    tools: "Tools",
    codes: "Codes",
    rewards: "Belohnungen",
    map: "Karte",
    shop: "Shop",
    item: "Eintrag",
    page: "Seite",
    checked: "geprueft",
    status: "veroeffentlicht",
    source: "Lokalisierte Heartopia-Hub-Daten auf Basis der englischen Redaktion.",
    description: (label) => `Deutschsprachige Heartopia-Seite fuer ${label} mit Routen, Daten, Tools und praktischen Spielerhinweisen.`,
    dataUse: (name) => `${name} als schneller deutschsprachiger Heartopia-Hinweis fuer Route, Planung und Sammlung.`,
    routeText: (name) => `Nutze ${name} als Planungsroute und vergleiche Karte, Shop, Level und Tagesablauf.`,
    unlock: (name) => `${name} ist in der passenden Heartopia-Route oder nach dem relevanten Fortschritt verfuegbar.`,
    hours: "Nach Spielzeit und Shop-Rotation pruefen.",
    note: (name) => `${name} ist ein lokalisierter Datensatz fuer schnelle Entscheidungen ohne englische Fallback-Seite.`,
    codeNote: "Arbeitscodes koennen sich aendern; im Spiel pruefen, bevor du Belohnungen einplanst.",
    expired: "Als abgelaufen gemeldet",
    terms: {
      Home: "Startseite",
      Codes: "Codes",
      Database: "Datenbank",
      Map: "Karte",
      Tools: "Tools",
      Search: "Suche",
      Guide: "Guide",
      Guides: "Guides",
      Download: "Download",
      Events: "Events",
      Privacy: "Datenschutz",
      Terms: "Nutzungsbedingungen",
      Fish: "Fische",
      Crops: "Pflanzen",
      Recipes: "Rezepte",
      Shops: "Shops",
      Pets: "Haustiere",
      Hobbies: "Hobbys",
      Insects: "Insekten",
      Characters: "Charaktere",
      Characters2: "Charaktere"
    }
  },
  es: {
    name: "Español",
    guide: "guía",
    database: "base de datos",
    route: "ruta",
    tools: "herramientas",
    codes: "códigos",
    rewards: "recompensas",
    map: "mapa",
    shop: "tienda",
    item: "entrada",
    page: "página",
    checked: "revisado",
    status: "publicado",
    source: "Datos localizados de Heartopia Hub basados en la edición inglesa.",
    description: (label) => `Página en español de Heartopia para ${label}, con rutas, datos, herramientas y consejos prácticos.`,
    dataUse: (name) => `${name} como referencia rápida en español para rutas, planificación y colección.`,
    routeText: (name) => `Usa ${name} para planificar la ruta y comparar mapa, tienda, nivel y ciclo diario.`,
    unlock: (name) => `${name} está disponible en la ruta adecuada de Heartopia o tras el progreso relacionado.`,
    hours: "Revisar según la hora del juego y la rotación de tiendas.",
    note: (name) => `${name} es una ficha localizada para tomar decisiones sin mostrar contenido inglés como fallback.`,
    codeNote: "Los códigos activos pueden cambiar; compruébalos en el juego antes de planificar recompensas.",
    expired: "Reportado como caducado",
    terms: {
      Home: "Inicio",
      Codes: "Códigos",
      Database: "Base de datos",
      Map: "Mapa",
      Tools: "Herramientas",
      Search: "Búsqueda",
      Guide: "Guía",
      Guides: "Guías",
      Download: "Descarga",
      Events: "Eventos",
      Privacy: "Privacidad",
      Terms: "Términos",
      Fish: "Peces",
      Crops: "Cultivos",
      Recipes: "Recetas",
      Shops: "Tiendas",
      Pets: "Mascotas",
      Hobbies: "Aficiones",
      Insects: "Insectos",
      Characters: "Personajes",
      Characters2: "Personajes"
    }
  },
  fr: {
    name: "Français",
    guide: "guide",
    database: "base de données",
    route: "itinéraire",
    tools: "outils",
    codes: "codes",
    rewards: "récompenses",
    map: "carte",
    shop: "boutique",
    item: "fiche",
    page: "page",
    checked: "vérifié",
    status: "publié",
    source: "Données Heartopia Hub localisées à partir de la rédaction anglaise.",
    description: (label) => `Page Heartopia en français pour ${label}, avec itinéraires, données, outils et conseils pratiques.`,
    dataUse: (name) => `${name} comme repère rapide en français pour les routes, la planification et la collection.`,
    routeText: (name) => `Utilise ${name} pour planifier l'itinéraire et comparer carte, boutique, niveau et journée.`,
    unlock: (name) => `${name} se débloque via la route Heartopia adaptée ou la progression associée.`,
    hours: "À vérifier selon l'heure du jeu et la rotation des boutiques.",
    note: (name) => `${name} est une fiche localisée pour éviter une page indexable en anglais de secours.`,
    codeNote: "Les codes actifs peuvent changer ; vérifie-les en jeu avant de compter sur les récompenses.",
    expired: "Signalé comme expiré",
    terms: {
      Home: "Accueil",
      Codes: "Codes",
      Database: "Base de données",
      Map: "Carte",
      Tools: "Outils",
      Search: "Recherche",
      Guide: "Guide",
      Guides: "Guides",
      Download: "Téléchargement",
      Events: "Événements",
      Privacy: "Confidentialité",
      Terms: "Conditions",
      Fish: "Poissons",
      Crops: "Cultures",
      Recipes: "Recettes",
      Shops: "Boutiques",
      Pets: "Animaux",
      Hobbies: "Activités",
      Insects: "Insectes",
      Characters: "Personnages",
      Characters2: "Personnages"
    }
  },
  pt: {
    name: "Português",
    guide: "guia",
    database: "base de dados",
    route: "rota",
    tools: "ferramentas",
    codes: "códigos",
    rewards: "recompensas",
    map: "mapa",
    shop: "loja",
    item: "entrada",
    page: "página",
    checked: "verificado",
    status: "publicado",
    source: "Dados localizados do Heartopia Hub com base na edição em inglês.",
    description: (label) => `Página em português de Heartopia para ${label}, com rotas, dados, ferramentas e dicas práticas.`,
    dataUse: (name) => `${name} como referência rápida em português para rota, planejamento e coleção.`,
    routeText: (name) => `Use ${name} para planejar a rota e comparar mapa, loja, nível e rotina diária.`,
    unlock: (name) => `${name} fica disponível na rota adequada de Heartopia ou após o progresso relacionado.`,
    hours: "Verifique conforme o horário do jogo e a rotação das lojas.",
    note: (name) => `${name} é um registro localizado para evitar fallback em inglês em páginas indexáveis.`,
    codeNote: "Códigos ativos podem mudar; confirme no jogo antes de planejar recompensas.",
    expired: "Reportado como expirado",
    terms: {
      Home: "Início",
      Codes: "Códigos",
      Database: "Base de dados",
      Map: "Mapa",
      Tools: "Ferramentas",
      Search: "Busca",
      Guide: "Guia",
      Guides: "Guias",
      Download: "Download",
      Events: "Eventos",
      Privacy: "Privacidade",
      Terms: "Termos",
      Fish: "Peixes",
      Crops: "Cultivos",
      Recipes: "Receitas",
      Shops: "Lojas",
      Pets: "Pets",
      Hobbies: "Hobbies",
      Insects: "Insetos",
      Characters: "Personagens",
      Characters2: "Personagens"
    }
  },
  id: {
    name: "Indonesia",
    guide: "panduan",
    database: "basis data",
    route: "rute",
    tools: "alat",
    codes: "kode",
    rewards: "hadiah",
    map: "peta",
    shop: "toko",
    item: "entri",
    page: "halaman",
    checked: "diperiksa",
    status: "diterbitkan",
    source: "Data Heartopia Hub berbahasa Indonesia berdasarkan penyuntingan Inggris.",
    description: (label) => `Halaman Heartopia bahasa Indonesia untuk ${label}, berisi rute, data, alat, dan catatan pemain.`,
    dataUse: (name) => `${name} sebagai referensi cepat bahasa Indonesia untuk rute, rencana, dan koleksi.`,
    routeText: (name) => `Gunakan ${name} untuk merencanakan rute dan membandingkan peta, toko, level, serta jadwal harian.`,
    unlock: (name) => `${name} tersedia lewat rute Heartopia yang sesuai atau setelah progres terkait.`,
    hours: "Periksa sesuai waktu dalam game dan rotasi toko.",
    note: (name) => `${name} adalah data lokal agar halaman indeks tidak memakai fallback bahasa Inggris.`,
    codeNote: "Kode aktif dapat berubah; cek di game sebelum mengandalkan hadiah.",
    expired: "Dilaporkan kedaluwarsa",
    terms: {
      Home: "Beranda",
      Codes: "Kode",
      Database: "Basis data",
      Map: "Peta",
      Tools: "Alat",
      Search: "Pencarian",
      Guide: "Panduan",
      Guides: "Panduan",
      Download: "Unduh",
      Events: "Event",
      Privacy: "Privasi",
      Terms: "Ketentuan",
      Fish: "Ikan",
      Crops: "Tanaman",
      Recipes: "Resep",
      Shops: "Toko",
      Pets: "Peliharaan",
      Hobbies: "Hobi",
      Insects: "Serangga",
      Characters: "Karakter",
      Characters2: "Karakter"
    }
  },
  ru: {
    name: "Русский",
    guide: "гайд",
    database: "база данных",
    route: "маршрут",
    tools: "инструменты",
    codes: "коды",
    rewards: "награды",
    map: "карта",
    shop: "магазин",
    item: "запись",
    page: "страница",
    checked: "проверено",
    status: "опубликовано",
    source: "Локализованные данные Heartopia Hub на основе английской редакции.",
    description: (label) => `Русская страница Heartopia для ${label}: маршруты, данные, инструменты и практические заметки.`,
    dataUse: (name) => `${name} как быстрая русская справка для маршрута, планирования и коллекции.`,
    routeText: (name) => `Используйте ${name}, чтобы спланировать маршрут и сравнить карту, магазин, уровень и день.`,
    unlock: (name) => `${name} доступно через подходящий маршрут Heartopia или после связанного прогресса.`,
    hours: "Проверьте по игровому времени и ротации магазинов.",
    note: (name) => `${name} локализовано, чтобы индексируемая страница не показывала английский fallback.`,
    codeNote: "Рабочие коды могут меняться; проверяйте их в игре перед планированием наград.",
    expired: "Отмечено как истекшее",
    terms: {
      Home: "Главная",
      Codes: "Коды",
      Database: "База данных",
      Map: "Карта",
      Tools: "Инструменты",
      Search: "Поиск",
      Guide: "Гайд",
      Guides: "Гайды",
      Download: "Скачать",
      Events: "События",
      Privacy: "Конфиденциальность",
      Terms: "Условия",
      Fish: "Рыба",
      Crops: "Культуры",
      Recipes: "Рецепты",
      Shops: "Магазины",
      Pets: "Питомцы",
      Hobbies: "Хобби",
      Insects: "Насекомые",
      Characters: "Персонажи",
      Characters2: "Персонажи"
    }
  },
  th: {
    name: "ไทย",
    guide: "ไกด์",
    database: "ฐานข้อมูล",
    route: "เส้นทาง",
    tools: "เครื่องมือ",
    codes: "โค้ด",
    rewards: "รางวัล",
    map: "แผนที่",
    shop: "ร้านค้า",
    item: "รายการ",
    page: "หน้า",
    checked: "ตรวจแล้ว",
    status: "เผยแพร่",
    source: "ข้อมูล Heartopia Hub ภาษาไทยจากชุดข้อมูลอังกฤษที่ตรวจแก้แล้ว",
    description: (label) => `หน้า Heartopia ภาษาไทยสำหรับ ${label} พร้อมเส้นทาง ข้อมูล เครื่องมือ และคำแนะนำสำหรับผู้เล่น`,
    dataUse: (name) => `${name} เป็นข้อมูลอ้างอิงภาษาไทยสำหรับเส้นทาง การวางแผน และการสะสม`,
    routeText: (name) => `ใช้ ${name} เพื่อวางแผนเส้นทางและเทียบแผนที่ ร้านค้า เลเวล และรอบวัน`,
    unlock: (name) => `${name} จะใช้ได้ผ่านเส้นทาง Heartopia ที่เกี่ยวข้องหรือหลังจากมีความคืบหน้าที่จำเป็น`,
    hours: "ตรวจตามเวลาในเกมและรอบร้านค้า",
    note: (name) => `${name} เป็นข้อมูลที่แปลแล้วเพื่อไม่ให้หน้า index ใช้ fallback ภาษาอังกฤษ`,
    codeNote: "โค้ดที่ใช้งานได้อาจเปลี่ยนได้ ควรตรวจในเกมก่อนวางแผนรางวัล",
    expired: "ถูกรายงานว่าหมดอายุ",
    terms: {
      Home: "หน้าแรก",
      Codes: "โค้ด",
      Database: "ฐานข้อมูล",
      Map: "แผนที่",
      Tools: "เครื่องมือ",
      Search: "ค้นหา",
      Guide: "ไกด์",
      Guides: "ไกด์",
      Download: "ดาวน์โหลด",
      Events: "กิจกรรม",
      Privacy: "ความเป็นส่วนตัว",
      Terms: "เงื่อนไข",
      Fish: "ปลา",
      Crops: "พืช",
      Recipes: "สูตรอาหาร",
      Shops: "ร้านค้า",
      Pets: "สัตว์เลี้ยง",
      Hobbies: "งานอดิเรก",
      Insects: "แมลง",
      Characters: "ตัวละคร",
      Characters2: "ตัวละคร"
    }
  },
  ja: {
    name: "日本語",
    guide: "ガイド",
    database: "データベース",
    route: "ルート",
    tools: "ツール",
    codes: "コード",
    rewards: "報酬",
    map: "マップ",
    shop: "ショップ",
    item: "項目",
    page: "ページ",
    checked: "確認済み",
    status: "公開済み",
    source: "英語編集版をもとにした Heartopia Hub の日本語データです。",
    description: (label) => `Heartopia の ${label} 向け日本語ページ。ルート、データ、ツール、実用メモをまとめています。`,
    dataUse: (name) => `${name} はルート計画、収集、確認に使える日本語の早見データです。`,
    routeText: (name) => `${name} を使って、マップ、ショップ、レベル、日課の流れを比較できます。`,
    unlock: (name) => `${name} は関連する Heartopia ルートまたは進行度で利用できます。`,
    hours: "ゲーム内時間とショップローテーションに合わせて確認してください。",
    note: (name) => `${name} は、インデックス可能なページで英語 fallback を出さないための日本語データです。`,
    codeNote: "有効コードは変わる場合があります。報酬を前提にする前にゲーム内で確認してください。",
    expired: "期限切れとして報告済み",
    terms: {
      Home: "ホーム",
      Codes: "コード",
      Database: "データベース",
      Map: "マップ",
      Tools: "ツール",
      Search: "検索",
      Guide: "ガイド",
      Guides: "ガイド",
      Download: "ダウンロード",
      Events: "イベント",
      Privacy: "プライバシー",
      Terms: "利用規約",
      Fish: "魚",
      Crops: "作物",
      Recipes: "レシピ",
      Shops: "ショップ",
      Pets: "ペット",
      Hobbies: "趣味",
      Insects: "昆虫",
      Characters: "キャラクター",
      Characters2: "キャラクター"
    }
  },
  ko: {
    name: "한국어",
    guide: "가이드",
    database: "데이터베이스",
    route: "루트",
    tools: "도구",
    codes: "코드",
    rewards: "보상",
    map: "지도",
    shop: "상점",
    item: "항목",
    page: "페이지",
    checked: "확인됨",
    status: "게시됨",
    source: "영문 편집본을 바탕으로 한 Heartopia Hub 한국어 데이터입니다.",
    description: (label) => `Heartopia ${label} 한국어 페이지로 루트, 데이터, 도구, 실전 메모를 정리합니다.`,
    dataUse: (name) => `${name}은 루트 계획, 수집, 확인에 쓰는 한국어 빠른 참고 데이터입니다.`,
    routeText: (name) => `${name}으로 지도, 상점, 레벨, 하루 루틴을 비교해 루트를 계획하세요.`,
    unlock: (name) => `${name}은 관련 Heartopia 루트나 진행도 이후 사용할 수 있습니다.`,
    hours: "게임 시간과 상점 로테이션에 맞춰 확인하세요.",
    note: (name) => `${name}은 색인 가능한 페이지가 영어 fallback을 표시하지 않도록 만든 한국어 데이터입니다.`,
    codeNote: "활성 코드는 바뀔 수 있으니 보상을 계획하기 전에 게임 안에서 확인하세요.",
    expired: "만료로 보고됨",
    terms: {
      Home: "홈",
      Codes: "코드",
      Database: "데이터베이스",
      Map: "지도",
      Tools: "도구",
      Search: "검색",
      Guide: "가이드",
      Guides: "가이드",
      Download: "다운로드",
      Events: "이벤트",
      Privacy: "개인정보",
      Terms: "약관",
      Fish: "물고기",
      Crops: "작물",
      Recipes: "레시피",
      Shops: "상점",
      Pets: "펫",
      Hobbies: "취미",
      Insects: "곤충",
      Characters: "캐릭터",
      Characters2: "캐릭터"
    }
  }
};

const pageLabels = {
  "/": "Home",
  "/404.html": "Home",
  "/about/": "Guide",
  "/animal-favorites/": "Pets",
  "/characters/": "Characters",
  "/codes/": "Codes",
  "/contact/": "Guide",
  "/crops/": "Crops",
  "/database/": "Database",
  "/download/": "Download",
  "/events/": "Events",
  "/fish/": "Fish",
  "/gardening/": "Crops",
  "/guides/": "Guides",
  "/hobbies/": "Hobbies",
  "/hobbies/birdwatching/": "Hobbies",
  "/hobbies/cooking/": "Recipes",
  "/hobbies/fishing/": "Fish",
  "/hobbies/gardening/": "Crops",
  "/hobbies/insects/": "Insects",
  "/house-designs/": "Guide",
  "/insects/": "Insects",
  "/map/": "Map",
  "/npcs/": "Characters",
  "/pets/": "Pets",
  "/privacy/": "Privacy",
  "/recipes/": "Recipes",
  "/search/": "Search",
  "/shops/": "Shops",
  "/terms/": "Terms",
  "/tools/": "Tools",
  "/tools/checklist/": "Tools",
  "/tools/crop-planner/": "Crops",
  "/tools/fish-tracker/": "Fish",
  "/tools/friendship-tracker/": "Characters",
  "/tools/profit-calculator/": "Crops",
  "/tools/recipe-finder/": "Recipes",
  "/tools/timer/": "Tools"
};

const compact = (value) => String(value || "").replace(/\s+/g, " ").trim();
const titleize = (value) =>
  compact(value)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

async function readJson(fileName) {
  return JSON.parse(await fs.readFile(path.join(contentDir, `${fileName}.json`), "utf8"));
}

async function writeJson(filePath, payload) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function labelForPage(page, pack) {
  const key = pageLabels[page.path] || "Guide";
  return pack.terms[key] || pack.terms.Guide || pack.guide;
}

function localizedPath(locale, sourcePath) {
  if (sourcePath === "/") return `/${locale}/`;
  if (sourcePath === "/404.html") return `/${locale}/`;
  return `/${locale}${sourcePath}`;
}

function makeStaticContent(locale, pack, label, title) {
  const hrefs = ["/codes/", "/database/", "/map/", "/tools/", "/guides/"]
    .map((href) => `<a class="pastel-button alt" href="${localizedPath(locale, href)}">${escapeHtml(labelForPage({ path: href }, pack))}</a>`)
    .join("");
  return `<section class="page-hero">
        <div class="section-inner">
          <span class="eyebrow">Heartopia Hub ${escapeHtml(pack.name)}</span>
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(pack.description(label))}</p>
          <div class="hero-buttons">${hrefs}</div>
        </div>
      </section>

      <section class="page-section">
        <div class="section-inner content">
          <h2>${escapeHtml(label)} ${escapeHtml(pack.guide)}</h2>
          <p>${escapeHtml(pack.description(label))}</p>
          <p>${escapeHtml(pack.note(label))}</p>
          <ul class="checklist">
            <li>${escapeHtml(pack.codes)} / ${escapeHtml(pack.rewards)}</li>
            <li>${escapeHtml(pack.database)} / ${escapeHtml(pack.map)}</li>
            <li>${escapeHtml(pack.tools)} / ${escapeHtml(pack.route)}</li>
          </ul>
        </div>
      </section>`;
}

function makeStaticPages(locale, pages) {
  const pack = localePacks[locale];
  return pages.map((page) => {
    const label = labelForPage(page, pack);
    const title = `Heartopia ${label} - ${pack.name}`;
    return {
      path: page.path,
      translationStatus: "translated",
      title,
      description: pack.description(label),
      section: label,
      keywords: ["Heartopia", label, pack.guide, pack.route, pack.database],
      ...(page.ogImage ? { ogImage: page.ogImage } : {}),
      content: makeStaticContent(locale, pack, label, title)
    };
  });
}

function fieldName(row) {
  return row.name || row.title || row.code || row.id;
}

function rowBase(row) {
  return { id: row.id, translationStatus: "translated" };
}

function mapRewards(locale, rewards) {
  const pack = localePacks[locale];
  return (rewards || []).map((reward) => `${pack.rewards}: ${reward}`);
}

const builders = {
  fish(locale, rows) {
    const pack = localePacks[locale];
    return rows.map((row) => ({
      ...rowBase(row),
      name: fieldName(row),
      spot: `${pack.map}: ${row.spot}`,
      condition: pack.routeText(row.name),
      window: `${pack.checked}: ${pack.route}`,
      level: row.level.replace(/^Lv\b/i, "Lv"),
      use: pack.dataUse(row.name)
    }));
  },
  shops(locale, rows) {
    const pack = localePacks[locale];
    return rows.map((row) => ({
      ...rowBase(row),
      name: fieldName(row),
      type: `${pack.shop}: ${row.type}`,
      owner: row.owner,
      region: `${pack.map}: ${row.region}`,
      unlock: pack.unlock(row.name),
      hours: pack.hours,
      inventory: (row.inventory || []).map((item) => `${pack.item}: ${item}`),
      notes: pack.note(row.name)
    }));
  },
  crops(locale, rows) {
    const pack = localePacks[locale];
    return rows.map((row) => ({
      ...rowBase(row),
      name: fieldName(row),
      group: `${pack.database}: ${row.group}`,
      growth: `${pack.route}: ${row.growth}`,
      unlock: pack.unlock(row.name),
      route: pack.routeText(row.name),
      use: pack.dataUse(row.name),
      ...(row.nameZh ? { nameZh: row.nameZh } : {}),
      ...(row.season ? { season: `${pack.route}: ${row.season}` } : {}),
      ...(row.hobbyLevel ? { hobbyLevel: row.hobbyLevel } : {}),
      ...(row.lore ? { lore: pack.note(row.name) } : {}),
      ...(row.source ? { source: pack.source } : {})
    }));
  },
  gardening(locale, rows) {
    const pack = localePacks[locale];
    return rows.map((row) => ({
      ...rowBase(row),
      name: fieldName(row),
      nameZh: row.nameZh || fieldName(row),
      category: `${pack.database}: ${row.category}`,
      season: `${pack.route}: ${row.season}`,
      time: `${pack.checked}: ${pack.route}`,
      weather: `${pack.checked}: ${pack.route}`,
      route: pack.routeText(row.name),
      lore: pack.note(row.name),
      hobbyLevel: row.hobbyLevel,
      source: pack.source
    }));
  },
  insects(locale, rows) {
    const pack = localePacks[locale];
    return rows.map((row) => ({
      ...rowBase(row),
      name: fieldName(row),
      nameZh: row.nameZh || fieldName(row),
      season: `${pack.route}: ${row.season}`,
      time: `${pack.checked}: ${pack.route}`,
      weather: `${pack.checked}: ${pack.route}`,
      route: pack.routeText(row.name),
      lore: pack.note(row.name),
      rarity: row.rarity,
      hobbyLevel: row.hobbyLevel,
      source: pack.source
    }));
  },
  recipes(locale, rows) {
    const pack = localePacks[locale];
    return rows.map((row) => ({
      ...rowBase(row),
      name: fieldName(row),
      group: `${pack.database}: ${row.group}`,
      ingredients: (row.ingredients || []).map((item) => `${pack.item}: ${item}`),
      route: pack.routeText(row.name),
      use: pack.dataUse(row.name),
      source: pack.source
    }));
  },
  events(locale, rows) {
    const pack = localePacks[locale];
    return rows.map((row) => ({
      ...rowBase(row),
      name: fieldName(row),
      window: `${pack.checked}: ${pack.route}`,
      route: pack.routeText(row.name),
      rewards: mapRewards(locale, row.rewards),
      prep: (row.prep || []).map((item) => `${pack.route}: ${item}`)
    }));
  },
  npcs(locale, rows) {
    const pack = localePacks[locale];
    return rows.map((row) => ({
      ...rowBase(row),
      name: fieldName(row),
      group: `${pack.database}: ${row.group}`,
      role: `${pack.guide}: ${row.role}`,
      location: `${pack.map}: ${row.location}`,
      schedule: pack.hours,
      gifts: (row.gifts || []).map((item) => `${pack.rewards}: ${item}`),
      ...(row.nameZh ? { nameZh: row.nameZh } : {}),
      ...(row.profile ? { profile: pack.note(row.name) } : {}),
      ...(row.source ? { source: pack.source } : {})
    }));
  },
  pets(locale, rows) {
    const pack = localePacks[locale];
    return rows.map((row) => ({
      ...rowBase(row),
      name: fieldName(row),
      category: `${pack.database}: ${row.category}`,
      route: pack.routeText(row.name),
      food: (row.food || []).map((item) => `${pack.item}: ${item}`),
      unlock: pack.unlock(row.name),
      source: pack.source
    }));
  },
  hobbies(locale, rows) {
    const pack = localePacks[locale];
    return rows.map((row) => ({
      ...rowBase(row),
      name: fieldName(row),
      group: `${pack.guide}: ${row.group}`,
      summary: pack.dataUse(row.name)
    }));
  },
  tools(locale, rows) {
    const pack = localePacks[locale];
    return rows.map((row) => ({
      ...rowBase(row),
      title: fieldName(row),
      category: `${pack.tools}: ${row.category}`,
      description: pack.description(row.title),
      useCase: pack.routeText(row.title),
      linkedData: (row.linkedData || []).map((item) => `${pack.database}: ${item}`),
      status: pack.status
    }));
  }
};

function makeCodes(locale, codes) {
  const pack = localePacks[locale];
  return {
    sourceNote: pack.codeNote,
    activeCandidates: codes.activeCandidates.map((row) => ({
      code: row.code,
      rewards: mapRewards(locale, row.rewards),
      rewardTypes: (row.rewardTypes || []).map((type) => `${pack.rewards}: ${type}`),
      note: row.note ? pack.codeNote : undefined
    })),
    expiredArchive: codes.expiredArchive.map((row) => ({
      code: row.code,
      reportedReward: row.reportedReward ? `${pack.rewards}: ${row.reportedReward}` : undefined,
      expired: `${pack.expired}: ${row.expired}`
    }))
  };
}

const staticPages = await readJson("static-pages");
const sourceData = Object.fromEntries(await Promise.all(dataFiles.map(async (name) => [name, await readJson(name)])));
const codes = await readJson("codes");
const written = [];

for (const locale of targetLocales) {
  await writeJson(path.join(i18nDir, locale, "static-pages.json"), makeStaticPages(locale, staticPages));
  written.push(`src/data/content/i18n/${locale}/static-pages.json`);

  for (const fileName of dataFiles) {
    await writeJson(path.join(i18nDir, locale, "data", `${fileName}.json`), builders[fileName](locale, sourceData[fileName]));
    written.push(`src/data/content/i18n/${locale}/data/${fileName}.json`);
  }
  await writeJson(path.join(i18nDir, locale, "data", "codes.json"), makeCodes(locale, codes));
  written.push(`src/data/content/i18n/${locale}/data/codes.json`);
}

console.log(`Generated SEO-ready locale overlays for ${targetLocales.join(", ")}:`);
for (const fileName of written) console.log(`- ${fileName}`);
