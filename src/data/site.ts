import { defaultLocale, getLocaleMeta, localizePath, type Locale } from "@i18n/config";

export type NavLink = {
  href: string;
  label: string;
};

export type NavGroup = {
  label: string;
  links: NavLink[];
};

export type FooterGroup = {
  title: string;
  links: NavLink[];
};

type LinkKey =
  | "home"
  | "codes"
  | "database"
  | "map"
  | "shops"
  | "fish"
  | "recipes"
  | "hobbies"
  | "pets"
  | "house"
  | "characters"
  | "tools"
  | "events"
  | "download"
  | "guides"
  | "gardening"
  | "insects"
  | "crops"
  | "animalFavorites"
  | "houseDesigns"
  | "legacyNpc"
  | "profitCalculator"
  | "cropPlanner"
  | "recipeFinder"
  | "fishTracker"
  | "checklist"
  | "search"
  | "about"
  | "contact"
  | "privacy"
  | "terms";

const sharedSiteConfig = {
  origin: "https://heartopia.blog",
  adsenseClient: "ca-pub-1476592629109289",
  adsTxtLine: "google.com, pub-1476592629109289, DIRECT, f08c47fec0942fa0",
  logo: "/assets/heartopia-hub-logo.svg",
  defaultImage: "/assets/heartopia-guide-hero.png",
  themeColor: "#2aa89e",
  publishedDate: "2026-06-06",
  updatedDate: "2026-06-06"
};

const navItemsBase: Array<{ href: string; key: LinkKey }> = [
  { href: "/", key: "home" },
  { href: "/codes/", key: "codes" },
  { href: "/database/", key: "database" },
  { href: "/map/", key: "map" },
  { href: "/shops/", key: "shops" },
  { href: "/fish/", key: "fish" },
  { href: "/recipes/", key: "recipes" },
  { href: "/hobbies/", key: "hobbies" },
  { href: "/pets/", key: "pets" },
  { href: "/house-designs/", key: "house" },
  { href: "/characters/", key: "characters" },
  { href: "/tools/", key: "tools" },
  { href: "/events/", key: "events" },
  { href: "/download/", key: "download" }
];

const navGroupsBase: Array<{ labelKey: "start" | "data" | "routes" | "tools"; links: Array<{ href: string; key: LinkKey }> }> = [
  {
    labelKey: "start",
    links: [
      { href: "/", key: "home" },
      { href: "/guides/", key: "guides" },
      { href: "/codes/", key: "codes" },
      { href: "/events/", key: "events" },
      { href: "/download/", key: "download" }
    ]
  },
  {
    labelKey: "data",
    links: [
      { href: "/database/", key: "database" },
      { href: "/characters/", key: "characters" },
      { href: "/gardening/", key: "gardening" },
      { href: "/insects/", key: "insects" },
      { href: "/crops/", key: "crops" },
      { href: "/fish/", key: "fish" },
      { href: "/recipes/", key: "recipes" },
      { href: "/shops/", key: "shops" }
    ]
  },
  {
    labelKey: "routes",
    links: [
      { href: "/map/", key: "map" },
      { href: "/hobbies/", key: "hobbies" },
      { href: "/pets/", key: "pets" },
      { href: "/animal-favorites/", key: "animalFavorites" },
      { href: "/house-designs/", key: "houseDesigns" },
      { href: "/npcs/", key: "legacyNpc" }
    ]
  },
  {
    labelKey: "tools",
    links: [
      { href: "/tools/", key: "tools" },
      { href: "/tools/profit-calculator/", key: "profitCalculator" },
      { href: "/tools/crop-planner/", key: "cropPlanner" },
      { href: "/tools/recipe-finder/", key: "recipeFinder" },
      { href: "/tools/fish-tracker/", key: "fishTracker" },
      { href: "/tools/checklist/", key: "checklist" },
      { href: "/search/", key: "search" }
    ]
  }
];

const footerGroupsBase: Array<{ titleKey: "explore" | "site"; links: Array<{ href: string; key: LinkKey }> }> = [
  {
    titleKey: "explore",
    links: [
      { href: "/codes/", key: "codes" },
      { href: "/guides/", key: "guides" },
      { href: "/map/", key: "map" },
      { href: "/shops/", key: "shops" },
      { href: "/characters/", key: "characters" },
      { href: "/gardening/", key: "gardening" },
      { href: "/insects/", key: "insects" },
      { href: "/tools/", key: "tools" },
      { href: "/search/", key: "search" },
      { href: "/database/", key: "database" }
    ]
  },
  {
    titleKey: "site",
    links: [
      { href: "/about/", key: "about" },
      { href: "/contact/", key: "contact" },
      { href: "/privacy/", key: "privacy" },
      { href: "/terms/", key: "terms" }
    ]
  }
];

type SiteLocaleContent = {
  name: string;
  description: string;
  author: string;
  defaultImageAlt: string;
  updatedLabel: string;
  groupLabels: Record<"start" | "data" | "routes" | "tools", string>;
  footerLabels: Record<"explore" | "site", string>;
  linkLabels: Record<LinkKey, string>;
};

const englishLinks: Record<LinkKey, string> = {
  home: "Home",
  codes: "Codes",
  database: "Database",
  map: "Map",
  shops: "Shops",
  fish: "Fish",
  recipes: "Recipes",
  hobbies: "Hobbies",
  pets: "Pets",
  house: "House",
  characters: "Characters",
  tools: "Tools",
  events: "Events",
  download: "Download",
  guides: "Beginner Guide",
  gardening: "Gardening",
  insects: "Insects",
  crops: "Crops",
  animalFavorites: "Animal Favorites",
  houseDesigns: "House Designs",
  legacyNpc: "Legacy NPC Guide",
  profitCalculator: "Profit Calculator",
  cropPlanner: "Crop Planner",
  recipeFinder: "Recipe Finder",
  fishTracker: "Fish Tracker",
  checklist: "Daily Checklist",
  search: "Search",
  about: "About",
  contact: "Contact",
  privacy: "Privacy Policy",
  terms: "Terms"
};

const localizedSiteContent = {
  en: {
    name: "Heartopia Hub",
    description: "Independent Heartopia fan wiki hub with codes, maps, database notes, tools, and guides.",
    author: "Heartopia Hub editorial team",
    defaultImageAlt: "Heartopia Hub guide preview for Heartopia maps, codes, tools, and database routes.",
    updatedLabel: "June 6, 2026",
    groupLabels: { start: "Start", data: "Data", routes: "Routes", tools: "Tools" },
    footerLabels: { explore: "Explore", site: "Site" },
    linkLabels: englishLinks
  },
  de: {
    name: "Heartopia Hub",
    description: "Unabhängiger Heartopia-Fan-Wiki-Hub mit Codes, Karten, Datenbanknotizen, Tools und Guides.",
    author: "Heartopia Hub Redaktion",
    defaultImageAlt: "Heartopia Hub Vorschau für Karten, Codes, Tools und Datenbankrouten.",
    updatedLabel: "6. Juni 2026",
    groupLabels: { start: "Start", data: "Daten", routes: "Routen", tools: "Tools" },
    footerLabels: { explore: "Entdecken", site: "Website" },
    linkLabels: { ...englishLinks, home: "Startseite", database: "Datenbank", map: "Karte", shops: "Läden", fish: "Fische", recipes: "Rezepte", hobbies: "Hobbys", pets: "Tiere", house: "Haus", characters: "Charaktere", events: "Events", download: "Download", guides: "Einsteiger-Guide", gardening: "Gartenbau", insects: "Insekten", crops: "Pflanzen", animalFavorites: "Tierfavoriten", houseDesigns: "Hausdesigns", legacyNpc: "Alter NPC-Guide", profitCalculator: "Gewinnrechner", cropPlanner: "Pflanzenplaner", recipeFinder: "Rezeptsuche", fishTracker: "Fisch-Tracker", checklist: "Tägliche Checkliste", search: "Suche", about: "Über uns", contact: "Kontakt", privacy: "Datenschutz", terms: "Bedingungen" }
  },
  es: {
    name: "Heartopia Hub",
    description: "Wiki fan independiente de Heartopia con códigos, mapas, notas de base de datos, herramientas y guías.",
    author: "Equipo editorial de Heartopia Hub",
    defaultImageAlt: "Vista previa de Heartopia Hub para mapas, códigos, herramientas y rutas de base de datos.",
    updatedLabel: "6 de junio de 2026",
    groupLabels: { start: "Inicio", data: "Datos", routes: "Rutas", tools: "Herramientas" },
    footerLabels: { explore: "Explorar", site: "Sitio" },
    linkLabels: { ...englishLinks, home: "Inicio", database: "Base de datos", map: "Mapa", shops: "Tiendas", fish: "Peces", recipes: "Recetas", hobbies: "Aficiones", pets: "Mascotas", house: "Casa", characters: "Personajes", tools: "Herramientas", events: "Eventos", download: "Descarga", guides: "Guía inicial", gardening: "Jardinería", insects: "Insectos", crops: "Cultivos", animalFavorites: "Favoritos animales", houseDesigns: "Diseños de casa", legacyNpc: "Guía NPC clásica", profitCalculator: "Calculadora de ganancias", cropPlanner: "Planificador de cultivos", recipeFinder: "Buscador de recetas", fishTracker: "Registro de peces", checklist: "Lista diaria", search: "Buscar", about: "Acerca de", contact: "Contacto", privacy: "Privacidad", terms: "Términos" }
  },
  fr: {
    name: "Heartopia Hub",
    description: "Wiki de fans indépendant pour Heartopia avec codes, cartes, notes de base de données, outils et guides.",
    author: "Équipe éditoriale Heartopia Hub",
    defaultImageAlt: "Aperçu Heartopia Hub pour cartes, codes, outils et routes de base de données.",
    updatedLabel: "6 juin 2026",
    groupLabels: { start: "Départ", data: "Données", routes: "Routes", tools: "Outils" },
    footerLabels: { explore: "Explorer", site: "Site" },
    linkLabels: { ...englishLinks, home: "Accueil", database: "Base de données", map: "Carte", shops: "Boutiques", fish: "Poissons", recipes: "Recettes", hobbies: "Loisirs", pets: "Animaux", house: "Maison", characters: "Personnages", tools: "Outils", events: "Événements", download: "Téléchargement", guides: "Guide débutant", gardening: "Jardinage", insects: "Insectes", crops: "Cultures", animalFavorites: "Préférences animales", houseDesigns: "Designs de maison", legacyNpc: "Ancien guide PNJ", profitCalculator: "Calculateur de profit", cropPlanner: "Planificateur de cultures", recipeFinder: "Recherche de recettes", fishTracker: "Suivi des poissons", checklist: "Liste quotidienne", search: "Recherche", about: "À propos", contact: "Contact", privacy: "Confidentialité", terms: "Conditions" }
  },
  pt: {
    name: "Heartopia Hub",
    description: "Wiki independente de fãs de Heartopia com códigos, mapas, notas de banco de dados, ferramentas e guias.",
    author: "Equipe editorial do Heartopia Hub",
    defaultImageAlt: "Prévia do Heartopia Hub para mapas, códigos, ferramentas e rotas de banco de dados.",
    updatedLabel: "6 de junho de 2026",
    groupLabels: { start: "Início", data: "Dados", routes: "Rotas", tools: "Ferramentas" },
    footerLabels: { explore: "Explorar", site: "Site" },
    linkLabels: { ...englishLinks, home: "Início", database: "Banco de dados", map: "Mapa", shops: "Lojas", fish: "Peixes", recipes: "Receitas", hobbies: "Hobbies", pets: "Pets", house: "Casa", characters: "Personagens", tools: "Ferramentas", events: "Eventos", download: "Download", guides: "Guia inicial", gardening: "Jardinagem", insects: "Insetos", crops: "Cultivos", animalFavorites: "Favoritos dos animais", houseDesigns: "Designs de casa", legacyNpc: "Guia NPC legado", profitCalculator: "Calculadora de lucro", cropPlanner: "Planejador de cultivos", recipeFinder: "Buscador de receitas", fishTracker: "Rastreador de peixes", checklist: "Checklist diária", search: "Pesquisar", about: "Sobre", contact: "Contato", privacy: "Privacidade", terms: "Termos" }
  },
  id: {
    name: "Heartopia Hub",
    description: "Wiki penggemar Heartopia independen dengan kode, peta, catatan database, alat, dan panduan.",
    author: "Tim editorial Heartopia Hub",
    defaultImageAlt: "Pratinjau Heartopia Hub untuk peta, kode, alat, dan rute database.",
    updatedLabel: "6 Juni 2026",
    groupLabels: { start: "Mulai", data: "Data", routes: "Rute", tools: "Alat" },
    footerLabels: { explore: "Jelajahi", site: "Situs" },
    linkLabels: { ...englishLinks, home: "Beranda", database: "Database", map: "Peta", shops: "Toko", fish: "Ikan", recipes: "Resep", hobbies: "Hobi", pets: "Peliharaan", house: "Rumah", characters: "Karakter", tools: "Alat", events: "Event", download: "Unduh", guides: "Panduan pemula", gardening: "Berkebun", insects: "Serangga", crops: "Tanaman", animalFavorites: "Favorit hewan", houseDesigns: "Desain rumah", legacyNpc: "Panduan NPC lama", profitCalculator: "Kalkulator profit", cropPlanner: "Perencana tanaman", recipeFinder: "Pencari resep", fishTracker: "Pelacak ikan", checklist: "Checklist harian", search: "Cari", about: "Tentang", contact: "Kontak", privacy: "Privasi", terms: "Ketentuan" }
  },
  ru: {
    name: "Heartopia Hub",
    description: "Независимый фанатский вики-хаб Heartopia с кодами, картами, базой данных, инструментами и гайдами.",
    author: "Редакция Heartopia Hub",
    defaultImageAlt: "Превью Heartopia Hub для карт, кодов, инструментов и маршрутов базы данных.",
    updatedLabel: "6 июня 2026 г.",
    groupLabels: { start: "Старт", data: "Данные", routes: "Маршруты", tools: "Инструменты" },
    footerLabels: { explore: "Разделы", site: "Сайт" },
    linkLabels: { ...englishLinks, home: "Главная", database: "База данных", map: "Карта", shops: "Магазины", fish: "Рыба", recipes: "Рецепты", hobbies: "Хобби", pets: "Питомцы", house: "Дом", characters: "Персонажи", tools: "Инструменты", events: "События", download: "Скачать", guides: "Гайд новичка", gardening: "Садоводство", insects: "Насекомые", crops: "Культуры", animalFavorites: "Любимая еда животных", houseDesigns: "Дизайны домов", legacyNpc: "Старый NPC-гайд", profitCalculator: "Калькулятор прибыли", cropPlanner: "Планировщик культур", recipeFinder: "Поиск рецептов", fishTracker: "Трекер рыбы", checklist: "Ежедневный список", search: "Поиск", about: "О сайте", contact: "Контакты", privacy: "Конфиденциальность", terms: "Условия" }
  },
  th: {
    name: "Heartopia Hub",
    description: "ศูนย์วิกิแฟน Heartopia อิสระ พร้อมโค้ด แผนที่ ฐานข้อมูล เครื่องมือ และคู่มือ",
    author: "ทีมบรรณาธิการ Heartopia Hub",
    defaultImageAlt: "ภาพตัวอย่าง Heartopia Hub สำหรับแผนที่ โค้ด เครื่องมือ และเส้นทางฐานข้อมูล",
    updatedLabel: "6 มิถุนายน 2026",
    groupLabels: { start: "เริ่มต้น", data: "ข้อมูล", routes: "เส้นทาง", tools: "เครื่องมือ" },
    footerLabels: { explore: "สำรวจ", site: "ไซต์" },
    linkLabels: { ...englishLinks, home: "หน้าแรก", database: "ฐานข้อมูล", map: "แผนที่", shops: "ร้านค้า", fish: "ปลา", recipes: "สูตรอาหาร", hobbies: "งานอดิเรก", pets: "สัตว์เลี้ยง", house: "บ้าน", characters: "ตัวละคร", tools: "เครื่องมือ", events: "กิจกรรม", download: "ดาวน์โหลด", guides: "คู่มือเริ่มต้น", gardening: "ทำสวน", insects: "แมลง", crops: "พืชผล", animalFavorites: "ของโปรดสัตว์", houseDesigns: "แบบบ้าน", legacyNpc: "คู่มือ NPC เดิม", profitCalculator: "คำนวณกำไร", cropPlanner: "วางแผนพืชผล", recipeFinder: "ค้นหาสูตร", fishTracker: "ติดตามปลา", checklist: "เช็กลิสต์รายวัน", search: "ค้นหา", about: "เกี่ยวกับ", contact: "ติดต่อ", privacy: "ความเป็นส่วนตัว", terms: "ข้อกำหนด" }
  },
  ja: {
    name: "Heartopia Hub",
    description: "コード、マップ、データベースメモ、ツール、ガイドをまとめた独立系HeartopiaファンWikiハブ。",
    author: "Heartopia Hub 編集チーム",
    defaultImageAlt: "Heartopia Hub のマップ、コード、ツール、データベースルートのプレビュー。",
    updatedLabel: "2026年6月6日",
    groupLabels: { start: "スタート", data: "データ", routes: "ルート", tools: "ツール" },
    footerLabels: { explore: "探索", site: "サイト" },
    linkLabels: { ...englishLinks, home: "ホーム", database: "データベース", map: "マップ", shops: "ショップ", fish: "魚", recipes: "レシピ", hobbies: "趣味", pets: "ペット", house: "家", characters: "キャラクター", tools: "ツール", events: "イベント", download: "ダウンロード", guides: "初心者ガイド", gardening: "ガーデニング", insects: "昆虫", crops: "作物", animalFavorites: "動物の好物", houseDesigns: "ハウスデザイン", legacyNpc: "旧NPCガイド", profitCalculator: "利益計算", cropPlanner: "作物プランナー", recipeFinder: "レシピ検索", fishTracker: "魚トラッカー", checklist: "デイリーチェック", search: "検索", about: "概要", contact: "連絡先", privacy: "プライバシー", terms: "利用規約" }
  },
  ko: {
    name: "Heartopia Hub",
    description: "코드, 지도, 데이터베이스 메모, 도구, 가이드를 모은 독립 Heartopia 팬 위키 허브.",
    author: "Heartopia Hub 편집팀",
    defaultImageAlt: "Heartopia 지도, 코드, 도구, 데이터베이스 루트용 Heartopia Hub 미리보기.",
    updatedLabel: "2026년 6월 6일",
    groupLabels: { start: "시작", data: "데이터", routes: "루트", tools: "도구" },
    footerLabels: { explore: "탐색", site: "사이트" },
    linkLabels: { ...englishLinks, home: "홈", database: "데이터베이스", map: "지도", shops: "상점", fish: "물고기", recipes: "레시피", hobbies: "취미", pets: "펫", house: "집", characters: "캐릭터", tools: "도구", events: "이벤트", download: "다운로드", guides: "초보자 가이드", gardening: "원예", insects: "곤충", crops: "작물", animalFavorites: "동물 선호 먹이", houseDesigns: "하우스 디자인", legacyNpc: "기존 NPC 가이드", profitCalculator: "수익 계산기", cropPlanner: "작물 플래너", recipeFinder: "레시피 찾기", fishTracker: "물고기 트래커", checklist: "일일 체크리스트", search: "검색", about: "소개", contact: "문의", privacy: "개인정보", terms: "약관" }
  },
  "zh-Hant": {
    name: "Heartopia Hub",
    description: "獨立 Heartopia 粉絲 Wiki 中心，整理兌換碼、地圖、資料庫筆記、工具與攻略。",
    author: "Heartopia Hub 編輯團隊",
    defaultImageAlt: "Heartopia Hub 地圖、兌換碼、工具與資料庫路線預覽。",
    updatedLabel: "2026 年 6 月 6 日",
    groupLabels: { start: "開始", data: "資料", routes: "路線", tools: "工具" },
    footerLabels: { explore: "探索", site: "網站" },
    linkLabels: { ...englishLinks, home: "首頁", codes: "兌換碼", database: "資料庫", map: "地圖", shops: "商店", fish: "魚類", recipes: "食譜", hobbies: "興趣", pets: "寵物", house: "房屋", characters: "角色", tools: "工具", events: "活動", download: "下載", guides: "新手攻略", gardening: "園藝", insects: "昆蟲", crops: "作物", animalFavorites: "動物喜好", houseDesigns: "房屋設計", legacyNpc: "舊版 NPC 攻略", profitCalculator: "收益計算器", cropPlanner: "作物規劃器", recipeFinder: "食譜搜尋", fishTracker: "魚類追蹤", checklist: "每日清單", search: "搜尋", about: "關於", contact: "聯絡", privacy: "隱私權政策", terms: "條款" }
  },
  "zh-Hans": {
    name: "Heartopia Hub",
    description: "独立 Heartopia 粉丝 Wiki 中心，整理兑换码、地图、数据库笔记、工具和攻略。",
    author: "Heartopia Hub 编辑团队",
    defaultImageAlt: "Heartopia Hub 地图、兑换码、工具和数据库路线预览。",
    updatedLabel: "2026 年 6 月 6 日",
    groupLabels: { start: "开始", data: "数据", routes: "路线", tools: "工具" },
    footerLabels: { explore: "探索", site: "站点" },
    linkLabels: { ...englishLinks, home: "首页", codes: "兑换码", database: "数据库", map: "地图", shops: "商店", fish: "鱼类", recipes: "食谱", hobbies: "兴趣", pets: "宠物", house: "房屋", characters: "角色", tools: "工具", events: "活动", download: "下载", guides: "新手攻略", gardening: "园艺", insects: "昆虫", crops: "作物", animalFavorites: "动物喜好", houseDesigns: "房屋设计", legacyNpc: "旧版 NPC 攻略", profitCalculator: "收益计算器", cropPlanner: "作物规划器", recipeFinder: "食谱搜索", fishTracker: "鱼类追踪", checklist: "每日清单", search: "搜索", about: "关于", contact: "联系", privacy: "隐私政策", terms: "条款" }
  }
} satisfies Record<Locale, SiteLocaleContent>;

const linkFor = (link: { href: string; key: LinkKey }, locale: Locale): NavLink => ({
  href: localizePath(link.href, locale),
  label: localizedSiteContent[locale].linkLabels[link.key]
});

export function getSiteConfig(locale: Locale = defaultLocale) {
  const meta = getLocaleMeta(locale);
  const content = localizedSiteContent[locale];
  return {
    ...sharedSiteConfig,
    ...content,
    locale: meta.ogLocale,
    language: meta.language,
    htmlLang: meta.htmlLang,
    textDirection: meta.textDirection,
    pathPrefix: meta.pathPrefix,
    isIndexableLocale: meta.indexable
  };
}

export function getNavItems(locale: Locale = defaultLocale) {
  return navItemsBase.map((link) => linkFor(link, locale));
}

export function getNavGroups(locale: Locale = defaultLocale): NavGroup[] {
  const content = localizedSiteContent[locale];
  return navGroupsBase.map((group) => ({
    label: content.groupLabels[group.labelKey],
    links: group.links.map((link) => linkFor(link, locale))
  }));
}

export function getDefaultFooterGroups(locale: Locale = defaultLocale): FooterGroup[] {
  const content = localizedSiteContent[locale];
  return footerGroupsBase.map((group) => ({
    title: content.footerLabels[group.titleKey],
    links: group.links.map((link) => linkFor(link, locale))
  }));
}

export const siteConfig = getSiteConfig(defaultLocale);
export const navItems = getNavItems(defaultLocale);
export const navGroups = getNavGroups(defaultLocale);
export const defaultFooterGroups = getDefaultFooterGroups(defaultLocale);
