import { defaultLocale, type Locale } from "./config";

type DataUiMessages = {
  common: {
    unknown: string;
    gold: string;
    sourceName: string;
    imageSource: string;
    wikiPortrait: string;
    routeData: string;
    wikiSource: string;
    dataStatus: string;
    group: string;
    route: string;
    use: string;
    location: string;
    condition: string;
    window: string;
    rarity: string;
    levelGate: string;
    waterRoute: string;
    source: string;
    season: string;
    type: string;
    hobbyLevel: string;
    wikiNumber: string;
    iconFile: string;
    risk: string;
    ingredients: string;
    ingredientCount: string;
  };
  actions: {
    openMapRoute: string;
    trackFish: string;
    cookingUses: string;
    openCropTool: string;
    findSeeds: string;
    relatedUses: string;
    openWikiSource: string;
    viewMap: string;
    characterRoute: string;
    relatedTool: string;
    openRecipeTool: string;
    ingredientSource: string;
    saveChecklist: string;
    shopHandoff: string;
    friendshipTool: string;
  };
  fish: {
    routeTitle: string;
    status: string;
    heroSuffix: string;
    relatedTitle: string;
    relatedText: string;
  };
  crop: {
    routeTitle: string;
    status: string;
    heroSuffix: string;
    growth: string;
    unlock: string;
    seed: string;
    sell: string;
    margin: string;
    recipeUsesTitle: string;
    recipeUsesText: string;
    relatedTitle: string;
    relatedText: string;
    iconAlt: string;
  };
  shop: {
    routeTitle: string;
    status: string;
    owner: string;
    type: string;
    region: string;
    icon: string;
    unlock: string;
    hours: string;
    mapMarker: string;
    relatedTitle: string;
    relatedText: string;
  };
  recipe: {
    routeTitle: string;
    status: string;
    heroSuffix: string;
    sourceCropsTitle: string;
    sourceCropsText: string;
    relatedTitle: string;
    relatedText: string;
  };
  character: {
    routeTitle: string;
    status: string;
    role: string;
    schedule: string;
    gifts: string;
    profile: (role: string, location: string) => string;
    portraitAlt: string;
    fanSource: string;
  };
  gardening: {
    routeTitle: string;
    status: string;
    heroSuffix: (nameZh: string) => string;
    time: string;
    weather: string;
    relatedTitle: string;
    relatedText: string;
    iconAlt: string;
    levelSuffix: string;
  };
  insect: {
    statusTitle: string;
    status: string;
    relatedTitle: string;
    relatedText: string;
    iconAlt: string;
  };
  index: {
    eyebrow: (label: string) => string;
    intro: (label: string, database: string, map: string, tools: string, guides: string) => string;
    description: (label: string, database: string, map: string, tools: string, guides: string) => string;
    fishRoutes: (count: number) => string;
    shopNodes: (count: number) => string;
    cropRecords: (count: number) => string;
    gardeningRecords: (count: number) => string;
    insectRecords: (count: number) => string;
    recipeRoutes: (count: number) => string;
    characters: (count: number) => string;
    petRoutes: (count: number) => string;
    hobbyRoutes: (count: number) => string;
    toolEntries: (count: number) => string;
    codeCandidates: (count: number) => string;
    eventItems: (count: number) => string;
    seedSell: (seed: number | null, sell: number | null) => string;
    rarityLine: (route: string, rarity: string) => string;
    riskLine: (route: string, risk: string) => string;
    activeCandidates: string;
    expiredArchive: string;
  };
  waterRoutes: Record<string, string>;
  rarity: Record<string, string>;
  risk: Record<string, string>;
};

const english: DataUiMessages = {
  common: {
    unknown: "Pending",
    gold: "gold",
    sourceName: "Source name",
    imageSource: "Image source",
    wikiPortrait: "Wiki portrait",
    routeData: "Route data",
    wikiSource: "Wiki source",
    dataStatus: "Data status",
    group: "Group",
    route: "Route",
    use: "Use",
    location: "Location",
    condition: "Condition",
    window: "Window",
    rarity: "Rarity",
    levelGate: "Level gate",
    waterRoute: "Water route",
    source: "Source",
    season: "Season",
    type: "Type",
    hobbyLevel: "Hobby level",
    wikiNumber: "Wiki number",
    iconFile: "Icon file",
    risk: "Risk",
    ingredients: "Ingredients",
    ingredientCount: "Ingredients"
  },
  actions: {
    openMapRoute: "Open map route",
    trackFish: "Track fish",
    cookingUses: "Cooking uses",
    openCropTool: "Open crop tool",
    findSeeds: "Find seeds",
    relatedUses: "Related uses",
    openWikiSource: "Open Wiki source",
    viewMap: "View map",
    characterRoute: "Character route",
    relatedTool: "Related tool",
    openRecipeTool: "Open recipe tool",
    ingredientSource: "Ingredient source",
    saveChecklist: "Save checklist",
    shopHandoff: "Shop handoff",
    friendshipTool: "Friendship tool"
  },
  fish: {
    routeTitle: "Fishing route",
    status: "This fish entry is localized. Water, condition, and route notes will keep following public source updates.",
    heroSuffix: "Check the water, weather, or time window first, then add the target to your fish tracker.",
    relatedTitle: "Same water route",
    relatedText: "Related fish from the same water route."
  },
  crop: {
    routeTitle: "Crop route",
    status: "This crop entry is localized. Growth time, sale value, and seed cost will keep following source updates.",
    heroSuffix: "Compare growth time, seed cost, and sell value before choosing an active or offline planting loop.",
    growth: "Growth",
    unlock: "Unlock",
    seed: "Seed",
    sell: "Sell",
    margin: "Margin",
    recipeUsesTitle: "Recipe uses",
    recipeUsesText: "These recipes mention this crop in their ingredient fields.",
    relatedTitle: "Same route group",
    relatedText: "Related crops from the same planning group.",
    iconAlt: "crop icon"
  },
  shop: {
    routeTitle: "Inventory and route",
    status: "This shop entry is localized. Inventory, unlock conditions, and map routes will keep following public source updates.",
    owner: "Owner",
    type: "Type",
    region: "Region",
    icon: "Icon",
    unlock: "Unlock",
    hours: "Shop route",
    mapMarker: "Map marker",
    relatedTitle: "Same shop type",
    relatedText: "Related entries from the same shop type."
  },
  recipe: {
    routeTitle: "Cooking route",
    status: "This recipe entry is localized. Ingredients, route, and source notes will keep following public source updates.",
    heroSuffix: "Confirm ingredient sources and risk before adding this dish to your daily checklist.",
    sourceCropsTitle: "Ingredient crop sources",
    sourceCropsText: "Crop records matched from the ingredient fields.",
    relatedTitle: "Same recipe group",
    relatedText: "Related dishes from the same recipe group."
  },
  character: {
    routeTitle: "Character route",
    status: "This character entry is localized. Gifts, location, and route notes will keep following public source updates.",
    role: "Role",
    schedule: "Schedule",
    gifts: "Gift route",
    profile: (role, location) => `${role}, usually found around ${location}.`,
    portraitAlt: "portrait",
    fanSource: "Fan route data"
  },
  gardening: {
    routeTitle: "Gardening route",
    status: "This gardening entry is localized. Profit, growth, and shop values are maintained in the crop database when verified.",
    heroSuffix: (nameZh) => `${nameZh} comes from the gardening handbook. Check the source name, icon, and level before planning around crop profit.`,
    time: "Time",
    weather: "Weather",
    relatedTitle: "Related gardening entries",
    relatedText: "Other entries from the same handbook group.",
    iconAlt: "icon",
    levelSuffix: "level"
  },
  insect: {
    statusTitle: "Catch notes",
    status: "This insect entry is localized. Rare spawns and exact behavior should still be confirmed in game before planning.",
    relatedTitle: "Same route insects",
    relatedText: "Other insects from the same route tag.",
    iconAlt: "insect icon"
  },
  index: {
    eyebrow: (label) => `${label} guide`,
    intro: (label, database, map, tools, guides) => `Heartopia ${label}: ${database}, ${map}, ${tools}, ${guides}.`,
    description: (label, database, map, tools, guides) => `Heartopia ${label}: ${database}, ${map}, ${tools}, ${guides}.`,
    fishRoutes: (count) => `${count} fish routes`,
    shopNodes: (count) => `${count} shop nodes`,
    cropRecords: (count) => `${count} crop records`,
    gardeningRecords: (count) => `${count} gardening records`,
    insectRecords: (count) => `${count} insect records`,
    recipeRoutes: (count) => `${count} recipe routes`,
    characters: (count) => `${count} characters`,
    petRoutes: (count) => `${count} animal routes`,
    hobbyRoutes: (count) => `${count} hobby routes`,
    toolEntries: (count) => `${count} tool entries`,
    codeCandidates: (count) => `${count} candidates`,
    eventItems: (count) => `${count} events`,
    seedSell: (seed, sell) => `Seed ${seed ?? "-"} / Sell ${sell ?? "-"}`,
    rarityLine: (route, rarity) => `${route} · Rarity ${rarity}`,
    riskLine: (route, risk) => `${route} · Risk ${risk}`,
    activeCandidates: "Active candidates",
    expiredArchive: "Expired archive"
  },
  waterRoutes: {
    lake: "Lake",
    river: "River",
    ocean: "Ocean",
    hidden: "Hidden water",
    event: "Event"
  },
  rarity: {
    common: "Common",
    uncommon: "Uncommon",
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary"
  },
  risk: {
    low: "Low",
    medium: "Medium",
    high: "High"
  }
};

const zhHans: Partial<DataUiMessages> = {
  common: {
    ...english.common,
    unknown: "待补",
    gold: "金币",
    sourceName: "来源名称",
    imageSource: "图像来源",
    wikiPortrait: "Wiki 肖像",
    routeData: "路线资料",
    wikiSource: "Wiki 来源",
    dataStatus: "资料状态",
    group: "分组",
    route: "路线",
    use: "用途",
    location: "位置",
    condition: "条件",
    window: "时段",
    rarity: "稀有度",
    levelGate: "等级门槛",
    waterRoute: "水域路线",
    source: "来源",
    season: "季节",
    type: "类型",
    hobbyLevel: "爱好等级",
    wikiNumber: "Wiki 编号",
    iconFile: "图标文件",
    risk: "风险",
    ingredients: "材料",
    ingredientCount: "材料数"
  },
  actions: {
    openMapRoute: "打开地图路线",
    trackFish: "追踪鱼类",
    cookingUses: "查看料理用途",
    openCropTool: "打开作物工具",
    findSeeds: "查找种子",
    relatedUses: "相关用途",
    openWikiSource: "打开 Wiki 来源",
    viewMap: "查看地图",
    characterRoute: "角色路线",
    relatedTool: "相关工具",
    openRecipeTool: "打开食谱工具",
    ingredientSource: "材料来源",
    saveChecklist: "保存清单",
    shopHandoff: "商店关联",
    friendshipTool: "友谊工具"
  },
  fish: {
    ...english.fish,
    routeTitle: "钓鱼路线",
    status: "这条鱼类资料已完成本地化整理。水域、条件和路线备注会继续跟随公开资料更新。",
    heroSuffix: "先确认水域、天气或时段，再把目标加入钓鱼追踪。",
    relatedTitle: "同水域目标",
    relatedText: "来自同一水域路线的相关鱼类。"
  },
  crop: {
    ...english.crop,
    routeTitle: "作物路线",
    status: "这条作物资料已完成本地化整理。成长时间、售价和种子成本会继续跟随资料源更新。",
    heroSuffix: "对比成长时间、种子成本和出售价值，决定它更适合在线循环还是离线种植。",
    growth: "成长",
    unlock: "解锁",
    seed: "种子",
    sell: "出售",
    margin: "收益差",
    recipeUsesTitle: "配方用途",
    recipeUsesText: "这些配方在食材字段中提到了该作物。",
    relatedTitle: "同路线分组",
    relatedText: "来自同一规划分组的相关作物。",
    iconAlt: "作物图标"
  },
  shop: {
    ...english.shop,
    routeTitle: "库存与路线",
    status: "这家商店资料已完成本地化整理。库存、解锁条件和地图路线会继续跟随公开资料更新。",
    owner: "店主",
    type: "类型",
    region: "区域",
    icon: "图标",
    unlock: "解锁",
    hours: "营业路线",
    mapMarker: "地图标记",
    relatedTitle: "同类型商店",
    relatedText: "来自同一商店类型的相关入口。"
  },
  recipe: {
    ...english.recipe,
    routeTitle: "料理路线",
    status: "这条食谱资料已完成本地化整理。材料、路线和来源说明会继续跟随公开资料更新。",
    heroSuffix: "先确认材料来源和风险，再把料理加入每日清单。",
    sourceCropsTitle: "材料作物来源",
    sourceCropsText: "食材字段中匹配到的作物资料。",
    relatedTitle: "同分组食谱",
    relatedText: "来自同一食谱分组的相关料理。"
  },
  character: {
    ...english.character,
    routeTitle: "角色路线",
    status: "这条角色资料已完成本地化整理。礼物、位置和路线备注会继续跟随公开资料更新。",
    role: "角色",
    schedule: "行程",
    gifts: "礼物路线",
    profile: (role, location) => `${role}，常见位置在 ${location}。`,
    portraitAlt: "肖像",
    fanSource: "粉丝路线资料"
  },
  gardening: {
    ...english.gardening,
    routeTitle: "园艺路线",
    status: "这条园艺资料已完成本地化整理。收益、成长和商店数值会在对应作物数据中继续维护。",
    heroSuffix: (nameZh) => `${nameZh} 来自园艺手册。先确认来源名、图标和等级，再结合实际作物收益做规划。`,
    time: "时间",
    weather: "天气",
    relatedTitle: "相关园艺条目",
    relatedText: "同一手册分组中的其他条目。",
    iconAlt: "图标",
    levelSuffix: "级"
  },
  insect: {
    ...english.insect,
    statusTitle: "捕捉备注",
    status: "这条昆虫资料已完成本地化整理。稀有刷新和精确出现行为仍建议在游戏内确认后再规划。",
    relatedTitle: "同路线昆虫",
    relatedText: "来自同一路线标签的其他昆虫。",
    iconAlt: "昆虫图标"
  },
  index: {
    ...english.index,
    eyebrow: (label) => `${label}攻略`,
    intro: (label, database, map, tools, guides) => `Heartopia ${label}: ${database}、${map}、${tools}、${guides}。`,
    description: (label, database, map, tools, guides) => `Heartopia ${label}: ${database}、${map}、${tools}、${guides}。`,
    fishRoutes: (count) => `${count} 条鱼类路线`,
    shopNodes: (count) => `${count} 个商店节点`,
    cropRecords: (count) => `${count} 个作物记录`,
    gardeningRecords: (count) => `${count} 条园艺记录`,
    insectRecords: (count) => `${count} 条昆虫记录`,
    recipeRoutes: (count) => `${count} 条料理路线`,
    characters: (count) => `${count} 个角色`,
    petRoutes: (count) => `${count} 条动物路线`,
    hobbyRoutes: (count) => `${count} 条爱好路线`,
    toolEntries: (count) => `${count} 个工具入口`,
    codeCandidates: (count) => `${count} 个候选`,
    eventItems: (count) => `${count} 个活动项`,
    seedSell: (seed, sell) => `种子 ${seed ?? "-"} / 售价 ${sell ?? "-"}`,
    rarityLine: (route, rarity) => `${route} · 稀有度 ${rarity}`,
    riskLine: (route, risk) => `${route} · 风险 ${risk}`,
    activeCandidates: "可用候选",
    expiredArchive: "过期归档"
  },
  waterRoutes: {
    lake: "湖泊",
    river: "河流",
    ocean: "海洋",
    hidden: "隐藏水域",
    event: "活动"
  },
  rarity: {
    common: "常见",
    uncommon: "少见",
    rare: "稀有",
    epic: "史诗",
    legendary: "传说"
  },
  risk: {
    low: "低",
    medium: "中",
    high: "高"
  }
};

const localeOverrides: Partial<Record<Locale, Partial<DataUiMessages>>> = {
  de: {
    common: { ...english.common, unknown: "Offen", gold: "Gold", dataStatus: "Datenstatus", route: "Route", use: "Nutzung", location: "Ort", condition: "Bedingung", window: "Zeitfenster", rarity: "Seltenheit", levelGate: "Levelgrenze", waterRoute: "Gewasserroute", group: "Gruppe", source: "Quelle", season: "Saison", type: "Typ", hobbyLevel: "Hobby-Level", wikiNumber: "Wiki-Nummer", iconFile: "Icon-Datei", risk: "Risiko", ingredients: "Zutaten", ingredientCount: "Zutaten", sourceName: "Quellname", imageSource: "Bildquelle", wikiPortrait: "Wiki-Portrat", routeData: "Routendaten", wikiSource: "Wiki-Quelle" },
    actions: { ...english.actions, openMapRoute: "Kartenroute offnen", trackFish: "Fisch verfolgen", cookingUses: "Kochverwendung", openCropTool: "Pflanzen-Tool offnen", findSeeds: "Samen finden", relatedUses: "Verwandte Nutzung", openWikiSource: "Wiki-Quelle offnen", viewMap: "Karte ansehen", characterRoute: "Charakterroute", relatedTool: "Verwandtes Tool", openRecipeTool: "Rezept-Tool offnen", ingredientSource: "Zutatenquelle", saveChecklist: "Checkliste speichern", shopHandoff: "Shop-Ubergabe", friendshipTool: "Freundschafts-Tool" },
    index: { ...english.index, eyebrow: (label) => `${label} Guide`, intro: (label, database, map, tools, guides) => `Heartopia ${label}: ${database}, ${map}, ${tools}, ${guides}.`, description: (label, database, map, tools, guides) => `Heartopia ${label}: ${database}, ${map}, ${tools}, ${guides}.`, fishRoutes: (count) => `${count} Fischrouten`, shopNodes: (count) => `${count} Shop-Knoten`, cropRecords: (count) => `${count} Pflanzen`, gardeningRecords: (count) => `${count} Garten-Eintrage`, insectRecords: (count) => `${count} Insekten`, recipeRoutes: (count) => `${count} Rezepte`, characters: (count) => `${count} Charaktere`, petRoutes: (count) => `${count} Tier-Routen`, hobbyRoutes: (count) => `${count} Hobby-Routen`, toolEntries: (count) => `${count} Tools`, codeCandidates: (count) => `${count} Kandidaten`, eventItems: (count) => `${count} Events`, seedSell: (seed, sell) => `Samen ${seed ?? "-"} / Verkauf ${sell ?? "-"}`, rarityLine: (route, rarity) => `${route} · Seltenheit ${rarity}`, riskLine: (route, risk) => `${route} · Risiko ${risk}`, activeCandidates: "Aktive Kandidaten", expiredArchive: "Abgelaufenes Archiv" },
    waterRoutes: { lake: "See", river: "Fluss", ocean: "Meer", hidden: "Verstecktes Wasser", event: "Event" },
    rarity: { common: "Haufig", uncommon: "Ungewohnlich", rare: "Selten", epic: "Episch", legendary: "Legendar" },
    risk: { low: "Niedrig", medium: "Mittel", high: "Hoch" }
  },
  es: {
    common: { ...english.common, unknown: "Pendiente", gold: "oro", dataStatus: "Estado de datos", route: "Ruta", use: "Uso", location: "Ubicacion", condition: "Condicion", window: "Ventana", rarity: "Rareza", levelGate: "Nivel requerido", waterRoute: "Ruta de agua", group: "Grupo", source: "Fuente", season: "Temporada", type: "Tipo", hobbyLevel: "Nivel de aficion", wikiNumber: "Numero wiki", iconFile: "Archivo de icono", risk: "Riesgo", ingredients: "Ingredientes", ingredientCount: "Ingredientes", sourceName: "Nombre fuente", imageSource: "Fuente de imagen", wikiPortrait: "Retrato wiki", routeData: "Datos de ruta", wikiSource: "Fuente wiki" },
    actions: { ...english.actions, openMapRoute: "Abrir ruta del mapa", trackFish: "Seguir pez", cookingUses: "Usos de cocina", openCropTool: "Abrir herramienta de cultivo", findSeeds: "Buscar semillas", relatedUses: "Usos relacionados", openWikiSource: "Abrir fuente wiki", viewMap: "Ver mapa", characterRoute: "Ruta de personaje", relatedTool: "Herramienta relacionada", openRecipeTool: "Abrir herramienta de receta", ingredientSource: "Fuente de ingredientes", saveChecklist: "Guardar lista", shopHandoff: "Ir a tienda", friendshipTool: "Herramienta de amistad" },
    waterRoutes: { lake: "Lago", river: "Rio", ocean: "Oceano", hidden: "Agua oculta", event: "Evento" },
    rarity: { common: "Comun", uncommon: "Poco comun", rare: "Raro", epic: "Epico", legendary: "Legendario" },
    risk: { low: "Bajo", medium: "Medio", high: "Alto" }
  },
  fr: {
    common: { ...english.common, unknown: "A completer", gold: "or", dataStatus: "Etat des donnees", route: "Route", use: "Usage", location: "Lieu", condition: "Condition", window: "Fenetre", rarity: "Rarete", levelGate: "Niveau requis", waterRoute: "Route d'eau", group: "Groupe", source: "Source", season: "Saison", type: "Type", hobbyLevel: "Niveau hobby", wikiNumber: "Numero wiki", iconFile: "Fichier icone", risk: "Risque", ingredients: "Ingredients", ingredientCount: "Ingredients", sourceName: "Nom source", imageSource: "Source image", wikiPortrait: "Portrait wiki", routeData: "Donnees de route", wikiSource: "Source wiki" },
    actions: { ...english.actions, openMapRoute: "Ouvrir la carte", trackFish: "Suivre le poisson", cookingUses: "Usages cuisine", openCropTool: "Ouvrir l'outil culture", findSeeds: "Trouver des graines", relatedUses: "Usages lies", openWikiSource: "Ouvrir la source wiki", viewMap: "Voir la carte", characterRoute: "Route personnage", relatedTool: "Outil lie", openRecipeTool: "Ouvrir l'outil recette", ingredientSource: "Source d'ingredients", saveChecklist: "Enregistrer la liste", shopHandoff: "Aller a la boutique", friendshipTool: "Outil d'amitie" },
    waterRoutes: { lake: "Lac", river: "Riviere", ocean: "Ocean", hidden: "Eau cachee", event: "Evenement" },
    rarity: { common: "Commun", uncommon: "Peu commun", rare: "Rare", epic: "Epique", legendary: "Legendaire" },
    risk: { low: "Faible", medium: "Moyen", high: "Eleve" }
  },
  pt: {
    common: { ...english.common, unknown: "Pendente", gold: "ouro", dataStatus: "Estado dos dados", route: "Rota", use: "Uso", location: "Local", condition: "Condicao", window: "Janela", rarity: "Raridade", levelGate: "Nivel exigido", waterRoute: "Rota de agua", group: "Grupo", source: "Fonte", season: "Temporada", type: "Tipo", hobbyLevel: "Nivel de hobby", wikiNumber: "Numero wiki", iconFile: "Arquivo de icone", risk: "Risco", ingredients: "Ingredientes", ingredientCount: "Ingredientes", sourceName: "Nome fonte", imageSource: "Fonte da imagem", wikiPortrait: "Retrato wiki", routeData: "Dados de rota", wikiSource: "Fonte wiki" },
    actions: { ...english.actions, openMapRoute: "Abrir rota no mapa", trackFish: "Rastrear peixe", cookingUses: "Usos culinarios", openCropTool: "Abrir ferramenta de cultivo", findSeeds: "Encontrar sementes", relatedUses: "Usos relacionados", openWikiSource: "Abrir fonte wiki", viewMap: "Ver mapa", characterRoute: "Rota de personagem", relatedTool: "Ferramenta relacionada", openRecipeTool: "Abrir ferramenta de receita", ingredientSource: "Fonte de ingredientes", saveChecklist: "Salvar checklist", shopHandoff: "Ir para loja", friendshipTool: "Ferramenta de amizade" },
    waterRoutes: { lake: "Lago", river: "Rio", ocean: "Oceano", hidden: "Agua oculta", event: "Evento" },
    rarity: { common: "Comum", uncommon: "Incomum", rare: "Raro", epic: "Epico", legendary: "Lendario" },
    risk: { low: "Baixo", medium: "Medio", high: "Alto" }
  },
  id: {
    common: { ...english.common, unknown: "Tertunda", gold: "emas", dataStatus: "Status data", route: "Rute", use: "Kegunaan", location: "Lokasi", condition: "Syarat", window: "Waktu", rarity: "Kelangkaan", levelGate: "Batas level", waterRoute: "Rute air", group: "Grup", source: "Sumber", season: "Musim", type: "Tipe", hobbyLevel: "Level hobi", wikiNumber: "Nomor wiki", iconFile: "File ikon", risk: "Risiko", ingredients: "Bahan", ingredientCount: "Bahan", sourceName: "Nama sumber", imageSource: "Sumber gambar", wikiPortrait: "Potret wiki", routeData: "Data rute", wikiSource: "Sumber wiki" },
    actions: { ...english.actions, openMapRoute: "Buka rute peta", trackFish: "Lacak ikan", cookingUses: "Kegunaan masak", openCropTool: "Buka alat tanaman", findSeeds: "Cari benih", relatedUses: "Kegunaan terkait", openWikiSource: "Buka sumber wiki", viewMap: "Lihat peta", characterRoute: "Rute karakter", relatedTool: "Alat terkait", openRecipeTool: "Buka alat resep", ingredientSource: "Sumber bahan", saveChecklist: "Simpan checklist", shopHandoff: "Buka toko", friendshipTool: "Alat pertemanan" },
    waterRoutes: { lake: "Danau", river: "Sungai", ocean: "Laut", hidden: "Air tersembunyi", event: "Event" },
    rarity: { common: "Umum", uncommon: "Tidak umum", rare: "Langka", epic: "Epik", legendary: "Legendaris" },
    risk: { low: "Rendah", medium: "Sedang", high: "Tinggi" }
  },
  ru: {
    common: { ...english.common, unknown: "Позже", gold: "золота", dataStatus: "Статус данных", route: "Маршрут", use: "Применение", location: "Локация", condition: "Условие", window: "Окно", rarity: "Редкость", levelGate: "Уровень", waterRoute: "Водоем", group: "Группа", source: "Источник", season: "Сезон", type: "Тип", hobbyLevel: "Уровень хобби", wikiNumber: "Номер wiki", iconFile: "Файл иконки", risk: "Риск", ingredients: "Ингредиенты", ingredientCount: "Ингредиенты", sourceName: "Имя источника", imageSource: "Источник изображения", wikiPortrait: "Портрет wiki", routeData: "Данные маршрута", wikiSource: "Источник wiki" },
    actions: { ...english.actions, openMapRoute: "Открыть карту", trackFish: "Отслеживать рыбу", cookingUses: "Кулинарное применение", openCropTool: "Открыть инструмент культур", findSeeds: "Найти семена", relatedUses: "Похожие применения", openWikiSource: "Открыть wiki", viewMap: "Смотреть карту", characterRoute: "Маршрут персонажа", relatedTool: "Связанный инструмент", openRecipeTool: "Открыть инструмент рецептов", ingredientSource: "Источник ингредиентов", saveChecklist: "Сохранить список", shopHandoff: "Перейти к магазину", friendshipTool: "Инструмент дружбы" },
    waterRoutes: { lake: "Озеро", river: "Река", ocean: "Океан", hidden: "Скрытая вода", event: "Событие" },
    rarity: { common: "Обычная", uncommon: "Необычная", rare: "Редкая", epic: "Эпическая", legendary: "Легендарная" },
    risk: { low: "Низкий", medium: "Средний", high: "Высокий" }
  },
  th: {
    common: { ...english.common, unknown: "รอเติม", gold: "ทอง", dataStatus: "สถานะข้อมูล", route: "เส้นทาง", use: "การใช้งาน", location: "ตำแหน่ง", condition: "เงื่อนไข", window: "ช่วงเวลา", rarity: "ความหายาก", levelGate: "เลเวลที่ต้องใช้", waterRoute: "เส้นทางน้ำ", group: "กลุ่ม", source: "แหล่งข้อมูล", season: "ฤดู", type: "ประเภท", hobbyLevel: "เลเวลฮอบบี้", wikiNumber: "หมายเลข wiki", iconFile: "ไฟล์ไอคอน", risk: "ความเสี่ยง", ingredients: "วัตถุดิบ", ingredientCount: "จำนวนวัตถุดิบ", sourceName: "ชื่อจากแหล่งข้อมูล", imageSource: "แหล่งรูปภาพ", wikiPortrait: "ภาพจาก wiki", routeData: "ข้อมูลเส้นทาง", wikiSource: "แหล่ง wiki" },
    actions: { ...english.actions, openMapRoute: "เปิดเส้นทางแผนที่", trackFish: "ติดตามปลา", cookingUses: "ใช้ทำอาหาร", openCropTool: "เปิดเครื่องมือพืช", findSeeds: "หาเมล็ด", relatedUses: "การใช้งานที่เกี่ยวข้อง", openWikiSource: "เปิดแหล่ง wiki", viewMap: "ดูแผนที่", characterRoute: "เส้นทางตัวละคร", relatedTool: "เครื่องมือที่เกี่ยวข้อง", openRecipeTool: "เปิดเครื่องมือสูตร", ingredientSource: "แหล่งวัตถุดิบ", saveChecklist: "บันทึกเช็กลิสต์", shopHandoff: "ไปยังร้านค้า", friendshipTool: "เครื่องมือมิตรภาพ" },
    waterRoutes: { lake: "ทะเลสาบ", river: "แม่น้ำ", ocean: "ทะเล", hidden: "แหล่งน้ำลับ", event: "อีเวนต์" },
    rarity: { common: "ทั่วไป", uncommon: "ไม่ธรรมดา", rare: "หายาก", epic: "อีปิก", legendary: "ตำนาน" },
    risk: { low: "ต่ำ", medium: "กลาง", high: "สูง" }
  },
  ja: {
    common: { ...english.common, unknown: "未確認", gold: "ゴールド", dataStatus: "データ状況", route: "ルート", use: "用途", location: "場所", condition: "条件", window: "時間帯", rarity: "レア度", levelGate: "必要レベル", waterRoute: "水域ルート", group: "グループ", source: "出典", season: "季節", type: "タイプ", hobbyLevel: "趣味レベル", wikiNumber: "Wiki番号", iconFile: "アイコンファイル", risk: "リスク", ingredients: "材料", ingredientCount: "材料数", sourceName: "出典名", imageSource: "画像出典", wikiPortrait: "Wiki画像", routeData: "ルート資料", wikiSource: "Wiki出典" },
    actions: { ...english.actions, openMapRoute: "マップルートを開く", trackFish: "魚を追跡", cookingUses: "料理用途", openCropTool: "作物ツールを開く", findSeeds: "種を探す", relatedUses: "関連用途", openWikiSource: "Wiki出典を開く", viewMap: "マップを見る", characterRoute: "キャラルート", relatedTool: "関連ツール", openRecipeTool: "レシピツールを開く", ingredientSource: "材料の入手先", saveChecklist: "チェックリストに保存", shopHandoff: "ショップへ", friendshipTool: "友好度ツール" },
    waterRoutes: { lake: "湖", river: "川", ocean: "海", hidden: "隠し水域", event: "イベント" },
    rarity: { common: "通常", uncommon: "やや珍しい", rare: "レア", epic: "エピック", legendary: "伝説" },
    risk: { low: "低", medium: "中", high: "高" }
  },
  ko: {
    common: { ...english.common, unknown: "미확인", gold: "골드", dataStatus: "데이터 상태", route: "루트", use: "용도", location: "위치", condition: "조건", window: "시간대", rarity: "희귀도", levelGate: "필요 레벨", waterRoute: "수역 루트", group: "그룹", source: "출처", season: "시즌", type: "유형", hobbyLevel: "취미 레벨", wikiNumber: "위키 번호", iconFile: "아이콘 파일", risk: "위험", ingredients: "재료", ingredientCount: "재료 수", sourceName: "출처 이름", imageSource: "이미지 출처", wikiPortrait: "위키 초상화", routeData: "루트 데이터", wikiSource: "위키 출처" },
    actions: { ...english.actions, openMapRoute: "지도 루트 열기", trackFish: "물고기 추적", cookingUses: "요리 용도", openCropTool: "작물 도구 열기", findSeeds: "씨앗 찾기", relatedUses: "관련 용도", openWikiSource: "위키 출처 열기", viewMap: "지도 보기", characterRoute: "캐릭터 루트", relatedTool: "관련 도구", openRecipeTool: "레시피 도구 열기", ingredientSource: "재료 출처", saveChecklist: "체크리스트 저장", shopHandoff: "상점으로 이동", friendshipTool: "친밀도 도구" },
    waterRoutes: { lake: "호수", river: "강", ocean: "바다", hidden: "숨겨진 수역", event: "이벤트" },
    rarity: { common: "일반", uncommon: "고급", rare: "희귀", epic: "에픽", legendary: "전설" },
    risk: { low: "낮음", medium: "중간", high: "높음" }
  },
  "zh-Hant": {
    ...zhHans,
    common: { ...zhHans.common!, unknown: "待補", sourceName: "來源名稱", imageSource: "圖像來源", routeData: "路線資料", dataStatus: "資料狀態", iconFile: "圖標檔案", ingredients: "材料", ingredientCount: "材料數" },
    actions: { ...zhHans.actions!, openMapRoute: "開啟地圖路線", openWikiSource: "開啟 Wiki 來源", viewMap: "查看地圖", saveChecklist: "儲存清單" },
    index: { ...zhHans.index!, activeCandidates: "可用候選", expiredArchive: "過期歸檔", seedSell: (seed, sell) => `種子 ${seed ?? "-"} / 售價 ${sell ?? "-"}`, rarityLine: (route, rarity) => `${route} · 稀有度 ${rarity}`, riskLine: (route, risk) => `${route} · 風險 ${risk}` },
    waterRoutes: { lake: "湖泊", river: "河流", ocean: "海洋", hidden: "隱藏水域", event: "活動" },
    rarity: { common: "常見", uncommon: "少見", rare: "稀有", epic: "史詩", legendary: "傳說" },
    risk: { low: "低", medium: "中", high: "高" }
  },
  "zh-Hans": zhHans
};

const localeSectionOverrides: Partial<Record<Locale, Partial<DataUiMessages>>> = {
  de: {
    fish: { ...english.fish, routeTitle: "Angelroute", status: "Dieser Fischeintrag ist lokalisiert. Gewasser, Bedingungen und Routennotizen folgen weiter den offentlichen Quellen.", heroSuffix: "Prufe zuerst Gewasser, Wetter oder Zeitfenster und setze das Ziel dann auf deine Fischliste.", relatedTitle: "Gleiche Gewasserroute", relatedText: "Verwandte Fische aus derselben Gewasserroute." },
    crop: { ...english.crop, routeTitle: "Pflanzenroute", status: "Dieser Pflanzeneintrag ist lokalisiert. Wachstumszeit, Verkaufswert und Samenkosten folgen weiter den Quellen.", heroSuffix: "Vergleiche Wachstumszeit, Samenkosten und Verkaufswert, bevor du eine aktive oder Offline-Route wahlst.", growth: "Wachstum", unlock: "Freischaltung", seed: "Samen", sell: "Verkauf", margin: "Marge", recipeUsesTitle: "Rezeptnutzung", recipeUsesText: "Diese Rezepte nennen diese Pflanze in den Zutaten.", relatedTitle: "Gleiche Routengruppe", relatedText: "Verwandte Pflanzen aus derselben Planungsgruppe.", iconAlt: "Pflanzenicon" },
    shop: { ...english.shop, routeTitle: "Inventar und Route", status: "Dieser Shop-Eintrag ist lokalisiert. Inventar, Freischaltungen und Kartenrouten folgen weiter den offentlichen Quellen.", owner: "Besitzer", type: "Typ", region: "Region", icon: "Icon", unlock: "Freischaltung", hours: "Shop-Route", mapMarker: "Kartenmarker", relatedTitle: "Gleicher Shop-Typ", relatedText: "Verwandte Eintrage aus demselben Shop-Typ." },
    recipe: { ...english.recipe, routeTitle: "Kochroute", status: "Dieser Rezepteintrag ist lokalisiert. Zutaten, Route und Quellenhinweise folgen weiter den offentlichen Quellen.", heroSuffix: "Prufe Zutatenquellen und Risiko, bevor du das Gericht in deine Tagesliste aufnimmst.", sourceCropsTitle: "Pflanzenquellen fur Zutaten", sourceCropsText: "Pflanzendaten, die in den Zutaten gefunden wurden.", relatedTitle: "Gleiche Rezeptgruppe", relatedText: "Verwandte Gerichte aus derselben Rezeptgruppe." },
    character: { ...english.character, routeTitle: "Charakterroute", status: "Dieser Charaktereintrag ist lokalisiert. Geschenke, Ort und Routennotizen folgen weiter den offentlichen Quellen.", role: "Rolle", schedule: "Zeitplan", gifts: "Geschenkroute", profile: (role, location) => `${role}, meist bei ${location}.`, portraitAlt: "Portrat", fanSource: "Fan-Routendaten" },
    gardening: { ...english.gardening, routeTitle: "Gartenroute", status: "Dieser Garteneintrag ist lokalisiert. Gewinn, Wachstum und Shopwerte werden in der Pflanzendatenbank gepflegt, sobald sie verifiziert sind.", heroSuffix: (nameZh) => `${nameZh} stammt aus dem Gartenhandbuch. Prufe Quellname, Icon und Level, bevor du mit Pflanzengewinn planst.`, time: "Zeit", weather: "Wetter", relatedTitle: "Verwandte Garteneintrage", relatedText: "Weitere Eintrage aus derselben Handbuchgruppe.", iconAlt: "Icon", levelSuffix: "Level" },
    insect: { ...english.insect, statusTitle: "Fangnotizen", status: "Dieser Insekteneintrag ist lokalisiert. Seltene Spawns und genaues Verhalten sollten vor der Planung im Spiel bestatigt werden.", relatedTitle: "Insekten derselben Route", relatedText: "Weitere Insekten mit demselben Routen-Tag.", iconAlt: "Insektenicon" }
  },
  es: {
    fish: { ...english.fish, routeTitle: "Ruta de pesca", status: "Esta ficha de pez esta localizada. Agua, condiciones y notas de ruta seguiran las fuentes publicas.", heroSuffix: "Revisa primero el agua, clima o ventana horaria y luego anade el objetivo al rastreador.", relatedTitle: "Misma ruta de agua", relatedText: "Peces relacionados de la misma ruta de agua." },
    crop: { ...english.crop, routeTitle: "Ruta de cultivo", status: "Esta ficha de cultivo esta localizada. Crecimiento, venta y coste de semillas seguiran las fuentes.", heroSuffix: "Compara crecimiento, coste de semillas y venta antes de elegir una ruta activa u offline.", growth: "Crecimiento", unlock: "Desbloqueo", seed: "Semilla", sell: "Venta", margin: "Margen", recipeUsesTitle: "Usos en recetas", recipeUsesText: "Estas recetas mencionan este cultivo en ingredientes.", relatedTitle: "Mismo grupo de ruta", relatedText: "Cultivos relacionados del mismo grupo de planificacion.", iconAlt: "icono de cultivo" },
    shop: { ...english.shop, routeTitle: "Inventario y ruta", status: "Esta ficha de tienda esta localizada. Inventario, desbloqueos y rutas del mapa seguiran las fuentes publicas.", owner: "Dueno", type: "Tipo", region: "Region", icon: "Icono", unlock: "Desbloqueo", hours: "Ruta de tienda", mapMarker: "Marcador del mapa", relatedTitle: "Mismo tipo de tienda", relatedText: "Entradas relacionadas del mismo tipo de tienda." },
    recipe: { ...english.recipe, routeTitle: "Ruta de cocina", status: "Esta ficha de receta esta localizada. Ingredientes, ruta y notas de fuente seguiran las fuentes publicas.", heroSuffix: "Confirma fuentes de ingredientes y riesgo antes de anadir el plato a tu lista diaria.", sourceCropsTitle: "Fuentes de cultivos", sourceCropsText: "Cultivos encontrados desde los campos de ingredientes.", relatedTitle: "Mismo grupo de recetas", relatedText: "Platos relacionados del mismo grupo de recetas." },
    character: { ...english.character, routeTitle: "Ruta de personaje", status: "Esta ficha de personaje esta localizada. Regalos, ubicacion y notas de ruta seguiran las fuentes publicas.", role: "Rol", schedule: "Horario", gifts: "Ruta de regalos", profile: (role, location) => `${role}, normalmente cerca de ${location}.`, portraitAlt: "retrato", fanSource: "Datos de ruta fan" },
    gardening: { ...english.gardening, routeTitle: "Ruta de jardineria", status: "Esta ficha de jardineria esta localizada. Beneficio, crecimiento y valores de tienda se mantienen en cultivos cuando se verifican.", heroSuffix: (nameZh) => `${nameZh} viene del manual de jardineria. Revisa nombre fuente, icono y nivel antes de planear beneficios.`, time: "Tiempo", weather: "Clima", relatedTitle: "Entradas de jardineria relacionadas", relatedText: "Otras entradas del mismo grupo del manual.", iconAlt: "icono", levelSuffix: "nivel" },
    insect: { ...english.insect, statusTitle: "Notas de captura", status: "Esta ficha de insecto esta localizada. Los spawns raros y el comportamiento exacto deben confirmarse en el juego antes de planear.", relatedTitle: "Insectos de la misma ruta", relatedText: "Otros insectos con la misma etiqueta de ruta.", iconAlt: "icono de insecto" }
  },
  fr: {
    fish: { ...english.fish, routeTitle: "Route de peche", status: "Cette fiche poisson est localisee. Eau, conditions et notes de route suivront les sources publiques.", heroSuffix: "Verifiez l'eau, la meteo ou le creneau avant d'ajouter la cible au suivi.", relatedTitle: "Meme route d'eau", relatedText: "Poissons lies a la meme route d'eau." },
    crop: { ...english.crop, routeTitle: "Route de culture", status: "Cette fiche culture est localisee. Croissance, vente et cout des graines suivront les sources.", heroSuffix: "Comparez croissance, cout des graines et valeur de vente avant de choisir une boucle active ou hors ligne.", growth: "Croissance", unlock: "Deblocage", seed: "Graine", sell: "Vente", margin: "Marge", recipeUsesTitle: "Usages recettes", recipeUsesText: "Ces recettes mentionnent cette culture dans les ingredients.", relatedTitle: "Meme groupe de route", relatedText: "Cultures liees au meme groupe de planification.", iconAlt: "icone de culture" },
    shop: { ...english.shop, routeTitle: "Inventaire et route", status: "Cette fiche boutique est localisee. Inventaire, deblocages et routes de carte suivront les sources publiques.", owner: "Proprietaire", type: "Type", region: "Region", icon: "Icone", unlock: "Deblocage", hours: "Route boutique", mapMarker: "Marqueur carte", relatedTitle: "Meme type de boutique", relatedText: "Entrees liees au meme type de boutique." },
    recipe: { ...english.recipe, routeTitle: "Route cuisine", status: "Cette fiche recette est localisee. Ingredients, route et notes de source suivront les sources publiques.", heroSuffix: "Confirmez les sources d'ingredients et le risque avant d'ajouter ce plat a la liste quotidienne.", sourceCropsTitle: "Sources de cultures", sourceCropsText: "Cultures trouvees dans les champs d'ingredients.", relatedTitle: "Meme groupe de recettes", relatedText: "Plats lies au meme groupe de recettes." },
    character: { ...english.character, routeTitle: "Route personnage", status: "Cette fiche personnage est localisee. Cadeaux, lieu et notes de route suivront les sources publiques.", role: "Role", schedule: "Horaire", gifts: "Route cadeaux", profile: (role, location) => `${role}, souvent pres de ${location}.`, portraitAlt: "portrait", fanSource: "Donnees de route fan" },
    gardening: { ...english.gardening, routeTitle: "Route jardinage", status: "Cette fiche jardinage est localisee. Profit, croissance et valeurs boutique sont maintenus dans les cultures une fois verifies.", heroSuffix: (nameZh) => `${nameZh} vient du manuel de jardinage. Verifiez source, icone et niveau avant de planifier le profit.`, time: "Temps", weather: "Meteo", relatedTitle: "Entrees jardinage liees", relatedText: "Autres entrees du meme groupe de manuel.", iconAlt: "icone", levelSuffix: "niveau" },
    insect: { ...english.insect, statusTitle: "Notes de capture", status: "Cette fiche insecte est localisee. Les apparitions rares et le comportement exact doivent etre confirmes en jeu avant de planifier.", relatedTitle: "Insectes de la meme route", relatedText: "Autres insectes avec la meme etiquette de route.", iconAlt: "icone d'insecte" }
  },
  pt: {
    fish: { ...english.fish, routeTitle: "Rota de pesca", status: "Esta ficha de peixe esta localizada. Agua, condicoes e notas de rota continuarao seguindo fontes publicas.", heroSuffix: "Confira agua, clima ou janela de tempo antes de adicionar o alvo ao rastreador.", relatedTitle: "Mesma rota de agua", relatedText: "Peixes relacionados da mesma rota de agua." },
    crop: { ...english.crop, routeTitle: "Rota de cultivo", status: "Esta ficha de cultivo esta localizada. Crescimento, venda e custo de sementes seguirao as fontes.", heroSuffix: "Compare crescimento, custo da semente e venda antes de escolher uma rota ativa ou offline.", growth: "Crescimento", unlock: "Desbloqueio", seed: "Semente", sell: "Venda", margin: "Margem", recipeUsesTitle: "Usos em receitas", recipeUsesText: "Estas receitas citam este cultivo nos ingredientes.", relatedTitle: "Mesmo grupo de rota", relatedText: "Cultivos relacionados do mesmo grupo de planejamento.", iconAlt: "icone de cultivo" },
    shop: { ...english.shop, routeTitle: "Inventario e rota", status: "Esta ficha de loja esta localizada. Inventario, desbloqueios e rotas de mapa seguirao fontes publicas.", owner: "Dono", type: "Tipo", region: "Regiao", icon: "Icone", unlock: "Desbloqueio", hours: "Rota da loja", mapMarker: "Marcador no mapa", relatedTitle: "Mesmo tipo de loja", relatedText: "Entradas relacionadas do mesmo tipo de loja." },
    recipe: { ...english.recipe, routeTitle: "Rota de cozinha", status: "Esta ficha de receita esta localizada. Ingredientes, rota e notas de fonte seguirao fontes publicas.", heroSuffix: "Confirme fontes dos ingredientes e risco antes de colocar o prato na lista diaria.", sourceCropsTitle: "Fontes de cultivos", sourceCropsText: "Cultivos encontrados nos campos de ingredientes.", relatedTitle: "Mesmo grupo de receitas", relatedText: "Pratos relacionados do mesmo grupo de receitas." },
    character: { ...english.character, routeTitle: "Rota de personagem", status: "Esta ficha de personagem esta localizada. Presentes, local e notas de rota seguirao fontes publicas.", role: "Papel", schedule: "Horario", gifts: "Rota de presentes", profile: (role, location) => `${role}, geralmente em ${location}.`, portraitAlt: "retrato", fanSource: "Dados de rota fan" },
    gardening: { ...english.gardening, routeTitle: "Rota de jardinagem", status: "Esta ficha de jardinagem esta localizada. Lucro, crescimento e valores de loja ficam nos cultivos quando verificados.", heroSuffix: (nameZh) => `${nameZh} vem do manual de jardinagem. Confira nome da fonte, icone e nivel antes de planejar lucro.`, time: "Tempo", weather: "Clima", relatedTitle: "Entradas de jardinagem relacionadas", relatedText: "Outras entradas do mesmo grupo do manual.", iconAlt: "icone", levelSuffix: "nivel" },
    insect: { ...english.insect, statusTitle: "Notas de captura", status: "Esta ficha de inseto esta localizada. Spawns raros e comportamento exato ainda devem ser confirmados no jogo antes do planejamento.", relatedTitle: "Insetos da mesma rota", relatedText: "Outros insetos com a mesma etiqueta de rota.", iconAlt: "icone de inseto" }
  },
  id: {
    fish: { ...english.fish, routeTitle: "Rute memancing", status: "Entri ikan ini sudah dilokalkan. Perairan, syarat, dan catatan rute akan mengikuti sumber publik.", heroSuffix: "Cek perairan, cuaca, atau waktu dulu, lalu masukkan target ke pelacak ikan.", relatedTitle: "Rute air yang sama", relatedText: "Ikan terkait dari rute air yang sama." },
    crop: { ...english.crop, routeTitle: "Rute tanaman", status: "Entri tanaman ini sudah dilokalkan. Waktu tumbuh, nilai jual, dan biaya benih akan mengikuti sumber.", heroSuffix: "Bandingkan waktu tumbuh, biaya benih, dan nilai jual sebelum memilih rute aktif atau offline.", growth: "Tumbuh", unlock: "Buka", seed: "Benih", sell: "Jual", margin: "Margin", recipeUsesTitle: "Kegunaan resep", recipeUsesText: "Resep ini menyebut tanaman ini di bahan.", relatedTitle: "Grup rute yang sama", relatedText: "Tanaman terkait dari grup rencana yang sama.", iconAlt: "ikon tanaman" },
    shop: { ...english.shop, routeTitle: "Inventori dan rute", status: "Entri toko ini sudah dilokalkan. Inventori, syarat buka, dan rute peta akan mengikuti sumber publik.", owner: "Pemilik", type: "Tipe", region: "Wilayah", icon: "Ikon", unlock: "Buka", hours: "Rute toko", mapMarker: "Marker peta", relatedTitle: "Tipe toko yang sama", relatedText: "Entri terkait dari tipe toko yang sama." },
    recipe: { ...english.recipe, routeTitle: "Rute memasak", status: "Entri resep ini sudah dilokalkan. Bahan, rute, dan catatan sumber akan mengikuti sumber publik.", heroSuffix: "Pastikan sumber bahan dan risiko sebelum memasukkan masakan ke checklist harian.", sourceCropsTitle: "Sumber tanaman bahan", sourceCropsText: "Data tanaman yang cocok dari kolom bahan.", relatedTitle: "Grup resep yang sama", relatedText: "Masakan terkait dari grup resep yang sama." },
    character: { ...english.character, routeTitle: "Rute karakter", status: "Entri karakter ini sudah dilokalkan. Hadiah, lokasi, dan catatan rute akan mengikuti sumber publik.", role: "Peran", schedule: "Jadwal", gifts: "Rute hadiah", profile: (role, location) => `${role}, biasanya berada di ${location}.`, portraitAlt: "potret", fanSource: "Data rute fan" },
    gardening: { ...english.gardening, routeTitle: "Rute berkebun", status: "Entri berkebun ini sudah dilokalkan. Profit, pertumbuhan, dan nilai toko dirawat di database tanaman saat terverifikasi.", heroSuffix: (nameZh) => `${nameZh} berasal dari buku berkebun. Cek nama sumber, ikon, dan level sebelum merencanakan profit.`, time: "Waktu", weather: "Cuaca", relatedTitle: "Entri berkebun terkait", relatedText: "Entri lain dari grup buku yang sama.", iconAlt: "ikon", levelSuffix: "level" },
    insect: { ...english.insect, statusTitle: "Catatan tangkap", status: "Entri serangga ini sudah dilokalkan. Spawn langka dan perilaku tepat tetap perlu dikonfirmasi di game sebelum direncanakan.", relatedTitle: "Serangga rute sama", relatedText: "Serangga lain dengan tag rute yang sama.", iconAlt: "ikon serangga" }
  },
  ru: {
    fish: { ...english.fish, routeTitle: "Маршрут рыбалки", status: "Эта запись о рыбе локализована. Водоем, условия и заметки маршрута будут обновляться по открытым источникам.", heroSuffix: "Сначала проверьте водоем, погоду или время, затем добавьте цель в трекер рыбы.", relatedTitle: "Тот же водоем", relatedText: "Похожие рыбы из того же водного маршрута." },
    crop: { ...english.crop, routeTitle: "Маршрут культуры", status: "Эта запись о культуре локализована. Рост, продажа и цена семян будут обновляться по источникам.", heroSuffix: "Сравните время роста, цену семян и продажу перед выбором активного или офлайн цикла.", growth: "Рост", unlock: "Открытие", seed: "Семена", sell: "Продажа", margin: "Маржа", recipeUsesTitle: "Использование в рецептах", recipeUsesText: "Эти рецепты упоминают культуру в ингредиентах.", relatedTitle: "Та же группа маршрута", relatedText: "Похожие культуры из той же группы планирования.", iconAlt: "иконка культуры" },
    shop: { ...english.shop, routeTitle: "Инвентарь и маршрут", status: "Эта запись магазина локализована. Инвентарь, условия открытия и маршруты карты будут обновляться по открытым источникам.", owner: "Владелец", type: "Тип", region: "Регион", icon: "Иконка", unlock: "Открытие", hours: "Маршрут магазина", mapMarker: "Метка карты", relatedTitle: "Тот же тип магазина", relatedText: "Похожие записи того же типа магазина." },
    recipe: { ...english.recipe, routeTitle: "Кулинарный маршрут", status: "Эта запись рецепта локализована. Ингредиенты, маршрут и источники будут обновляться по открытым данным.", heroSuffix: "Проверьте источники ингредиентов и риск перед добавлением блюда в дневной список.", sourceCropsTitle: "Источники культур", sourceCropsText: "Культуры, найденные по полям ингредиентов.", relatedTitle: "Та же группа рецептов", relatedText: "Похожие блюда из той же группы рецептов." },
    character: { ...english.character, routeTitle: "Маршрут персонажа", status: "Эта запись персонажа локализована. Подарки, локация и заметки маршрута будут обновляться по открытым источникам.", role: "Роль", schedule: "Расписание", gifts: "Маршрут подарков", profile: (role, location) => `${role}, обычно находится в ${location}.`, portraitAlt: "портрет", fanSource: "Фан-данные маршрута" },
    gardening: { ...english.gardening, routeTitle: "Маршрут садоводства", status: "Эта запись садоводства локализована. Прибыль, рост и значения магазина ведутся в базе культур после проверки.", heroSuffix: (nameZh) => `${nameZh} взято из садового справочника. Проверьте источник, иконку и уровень перед расчетом прибыли.`, time: "Время", weather: "Погода", relatedTitle: "Похожие записи садоводства", relatedText: "Другие записи из той же группы справочника.", iconAlt: "иконка", levelSuffix: "уровень" },
    insect: { ...english.insect, statusTitle: "Заметки ловли", status: "Эта запись насекомого локализована. Редкие появления и точное поведение стоит подтвердить в игре перед планированием.", relatedTitle: "Насекомые того же маршрута", relatedText: "Другие насекомые с тем же тегом маршрута.", iconAlt: "иконка насекомого" }
  },
  th: {
    fish: { ...english.fish, routeTitle: "เส้นทางตกปลา", status: "ข้อมูลปลานี้แปลแล้ว แหล่งน้ำ เงื่อนไข และบันทึกเส้นทางจะอัปเดตตามแหล่งข้อมูลสาธารณะ", heroSuffix: "เช็กแหล่งน้ำ สภาพอากาศ หรือช่วงเวลาก่อน แล้วค่อยเพิ่มเป้าหมายลงตัวติดตามปลา", relatedTitle: "เส้นทางน้ำเดียวกัน", relatedText: "ปลาที่เกี่ยวข้องจากเส้นทางน้ำเดียวกัน" },
    crop: { ...english.crop, routeTitle: "เส้นทางพืช", status: "ข้อมูลพืชนี้แปลแล้ว เวลาเติบโต ราคาขาย และค่าเมล็ดจะอัปเดตตามแหล่งข้อมูล", heroSuffix: "เทียบเวลาเติบโต ค่าเมล็ด และราคาขายก่อนเลือกปลูกแบบออนไลน์หรือออฟไลน์", growth: "เติบโต", unlock: "ปลดล็อก", seed: "เมล็ด", sell: "ขาย", margin: "ส่วนต่าง", recipeUsesTitle: "ใช้ในสูตร", recipeUsesText: "สูตรเหล่านี้มีพืชนี้ในช่องวัตถุดิบ", relatedTitle: "กลุ่มเส้นทางเดียวกัน", relatedText: "พืชที่เกี่ยวข้องจากกลุ่มแผนเดียวกัน", iconAlt: "ไอคอนพืช" },
    shop: { ...english.shop, routeTitle: "สินค้าและเส้นทาง", status: "ข้อมูลร้านค้านี้แปลแล้ว สินค้า เงื่อนไขปลดล็อก และเส้นทางแผนที่จะอัปเดตตามแหล่งข้อมูลสาธารณะ", owner: "เจ้าของ", type: "ประเภท", region: "ภูมิภาค", icon: "ไอคอน", unlock: "ปลดล็อก", hours: "เส้นทางร้าน", mapMarker: "หมุดแผนที่", relatedTitle: "ร้านประเภทเดียวกัน", relatedText: "รายการที่เกี่ยวข้องจากร้านประเภทเดียวกัน" },
    recipe: { ...english.recipe, routeTitle: "เส้นทางทำอาหาร", status: "ข้อมูลสูตรนี้แปลแล้ว วัตถุดิบ เส้นทาง และหมายเหตุแหล่งข้อมูลจะอัปเดตตามแหล่งข้อมูลสาธารณะ", heroSuffix: "ยืนยันแหล่งวัตถุดิบและความเสี่ยงก่อนเพิ่มเมนูลงเช็กลิสต์รายวัน", sourceCropsTitle: "แหล่งพืชวัตถุดิบ", sourceCropsText: "ข้อมูลพืชที่ตรงกับช่องวัตถุดิบ", relatedTitle: "กลุ่มสูตรเดียวกัน", relatedText: "เมนูที่เกี่ยวข้องจากกลุ่มสูตรเดียวกัน" },
    character: { ...english.character, routeTitle: "เส้นทางตัวละคร", status: "ข้อมูลตัวละครนี้แปลแล้ว ของขวัญ ตำแหน่ง และบันทึกเส้นทางจะอัปเดตตามแหล่งข้อมูลสาธารณะ", role: "บทบาท", schedule: "ตาราง", gifts: "เส้นทางของขวัญ", profile: (role, location) => `${role} มักอยู่แถว ${location}`, portraitAlt: "ภาพตัวละคร", fanSource: "ข้อมูลเส้นทางจากแฟน" },
    gardening: { ...english.gardening, routeTitle: "เส้นทางทำสวน", status: "ข้อมูลทำสวนนี้แปลแล้ว กำไร การเติบโต และค่าร้านจะดูแลในฐานข้อมูลพืชเมื่อยืนยันแล้ว", heroSuffix: (nameZh) => `${nameZh} มาจากคู่มือทำสวน เช็กชื่อแหล่งข้อมูล ไอคอน และเลเวลก่อนวางแผนกำไร`, time: "เวลา", weather: "อากาศ", relatedTitle: "รายการทำสวนที่เกี่ยวข้อง", relatedText: "รายการอื่นในกลุ่มคู่มือเดียวกัน", iconAlt: "ไอคอน", levelSuffix: "เลเวล" },
    insect: { ...english.insect, statusTitle: "บันทึกการจับ", status: "ข้อมูลแมลงนี้แปลแล้ว การเกิดแบบหายากและพฤติกรรมที่แน่นอนควรยืนยันในเกมก่อนวางแผน", relatedTitle: "แมลงเส้นทางเดียวกัน", relatedText: "แมลงอื่นที่มีแท็กเส้นทางเดียวกัน", iconAlt: "ไอคอนแมลง" }
  },
  ja: {
    fish: { ...english.fish, routeTitle: "釣りルート", status: "この魚データはローカライズ済みです。水域、条件、ルートメモは公開ソースに合わせて更新します。", heroSuffix: "水域、天候、時間帯を確認してから魚トラッカーに追加しましょう。", relatedTitle: "同じ水域ルート", relatedText: "同じ水域ルートに属する関連魚です。" },
    crop: { ...english.crop, routeTitle: "作物ルート", status: "この作物データはローカライズ済みです。成長時間、売値、種コストはソースに合わせて更新します。", heroSuffix: "成長時間、種コスト、売値を比べて、アクティブ栽培かオフライン栽培かを選びます。", growth: "成長", unlock: "解放", seed: "種", sell: "売値", margin: "差益", recipeUsesTitle: "レシピ用途", recipeUsesText: "材料欄にこの作物が含まれるレシピです。", relatedTitle: "同じルートグループ", relatedText: "同じ計画グループの関連作物です。", iconAlt: "作物アイコン" },
    shop: { ...english.shop, routeTitle: "在庫とルート", status: "このショップデータはローカライズ済みです。在庫、解放条件、マップルートは公開ソースに合わせて更新します。", owner: "店主", type: "タイプ", region: "地域", icon: "アイコン", unlock: "解放", hours: "ショップルート", mapMarker: "マップマーカー", relatedTitle: "同じショップタイプ", relatedText: "同じショップタイプの関連項目です。" },
    recipe: { ...english.recipe, routeTitle: "料理ルート", status: "このレシピデータはローカライズ済みです。材料、ルート、出典メモは公開ソースに合わせて更新します。", heroSuffix: "材料の入手先とリスクを確認してから、毎日のチェックリストに追加しましょう。", sourceCropsTitle: "材料作物の入手先", sourceCropsText: "材料欄から一致した作物データです。", relatedTitle: "同じレシピグループ", relatedText: "同じレシピグループの関連料理です。" },
    character: { ...english.character, routeTitle: "キャラクタールート", status: "このキャラクターデータはローカライズ済みです。ギフト、場所、ルートメモは公開ソースに合わせて更新します。", role: "役割", schedule: "スケジュール", gifts: "ギフトルート", profile: (role, location) => `${role}。よくいる場所は ${location} です。`, portraitAlt: "ポートレート", fanSource: "ファンルートデータ" },
    gardening: { ...english.gardening, routeTitle: "園芸ルート", status: "この園芸データはローカライズ済みです。利益、成長、ショップ値は検証後に作物データベースで管理します。", heroSuffix: (nameZh) => `${nameZh} は園芸ハンドブック由来です。出典名、アイコン、レベルを確認してから利益計画に使いましょう。`, time: "時間", weather: "天候", relatedTitle: "関連する園芸項目", relatedText: "同じハンドブックグループの他の項目です。", iconAlt: "アイコン", levelSuffix: "レベル" },
    insect: { ...english.insect, statusTitle: "捕獲メモ", status: "この昆虫データはローカライズ済みです。レア出現や正確な挙動は、計画前にゲーム内で確認してください。", relatedTitle: "同じルートの昆虫", relatedText: "同じルートタグを持つ他の昆虫です。", iconAlt: "昆虫アイコン" }
  },
  ko: {
    fish: { ...english.fish, routeTitle: "낚시 루트", status: "이 물고기 항목은 현지화되었습니다. 수역, 조건, 루트 메모는 공개 자료에 맞춰 계속 업데이트됩니다.", heroSuffix: "수역, 날씨, 시간대를 먼저 확인한 뒤 물고기 추적기에 추가하세요.", relatedTitle: "같은 수역 루트", relatedText: "같은 수역 루트의 관련 물고기입니다." },
    crop: { ...english.crop, routeTitle: "작물 루트", status: "이 작물 항목은 현지화되었습니다. 성장 시간, 판매가, 씨앗 비용은 자료에 맞춰 업데이트됩니다.", heroSuffix: "성장 시간, 씨앗 비용, 판매가를 비교한 뒤 활성 또는 오프라인 재배 루트를 고르세요.", growth: "성장", unlock: "해금", seed: "씨앗", sell: "판매", margin: "차익", recipeUsesTitle: "레시피 용도", recipeUsesText: "재료 항목에 이 작물이 포함된 레시피입니다.", relatedTitle: "같은 루트 그룹", relatedText: "같은 계획 그룹의 관련 작물입니다.", iconAlt: "작물 아이콘" },
    shop: { ...english.shop, routeTitle: "재고와 루트", status: "이 상점 항목은 현지화되었습니다. 재고, 해금 조건, 지도 루트는 공개 자료에 맞춰 업데이트됩니다.", owner: "상점 주인", type: "유형", region: "지역", icon: "아이콘", unlock: "해금", hours: "상점 루트", mapMarker: "지도 마커", relatedTitle: "같은 상점 유형", relatedText: "같은 상점 유형의 관련 항목입니다." },
    recipe: { ...english.recipe, routeTitle: "요리 루트", status: "이 레시피 항목은 현지화되었습니다. 재료, 루트, 출처 메모는 공개 자료에 맞춰 업데이트됩니다.", heroSuffix: "재료 출처와 위험도를 확인한 뒤 일일 체크리스트에 추가하세요.", sourceCropsTitle: "재료 작물 출처", sourceCropsText: "재료 필드에서 매칭된 작물 데이터입니다.", relatedTitle: "같은 레시피 그룹", relatedText: "같은 레시피 그룹의 관련 요리입니다." },
    character: { ...english.character, routeTitle: "캐릭터 루트", status: "이 캐릭터 항목은 현지화되었습니다. 선물, 위치, 루트 메모는 공개 자료에 맞춰 업데이트됩니다.", role: "역할", schedule: "일정", gifts: "선물 루트", profile: (role, location) => `${role}, 보통 ${location} 근처에 있습니다.`, portraitAlt: "초상화", fanSource: "팬 루트 데이터" },
    gardening: { ...english.gardening, routeTitle: "가드닝 루트", status: "이 가드닝 항목은 현지화되었습니다. 수익, 성장, 상점 값은 검증 후 작물 데이터베이스에서 관리됩니다.", heroSuffix: (nameZh) => `${nameZh}은 가드닝 핸드북에서 온 항목입니다. 출처명, 아이콘, 레벨을 확인한 뒤 수익 계획에 사용하세요.`, time: "시간", weather: "날씨", relatedTitle: "관련 가드닝 항목", relatedText: "같은 핸드북 그룹의 다른 항목입니다.", iconAlt: "아이콘", levelSuffix: "레벨" },
    insect: { ...english.insect, statusTitle: "포획 메모", status: "이 곤충 항목은 현지화되었습니다. 희귀 출현과 정확한 행동은 계획 전에 게임 안에서 확인하세요.", relatedTitle: "같은 루트 곤충", relatedText: "같은 루트 태그를 가진 다른 곤충입니다.", iconAlt: "곤충 아이콘" }
  }
};

function mergeMessages(base: DataUiMessages, override: Partial<DataUiMessages> = {}): DataUiMessages {
  return {
    common: { ...base.common, ...override.common },
    actions: { ...base.actions, ...override.actions },
    fish: { ...base.fish, ...override.fish },
    crop: { ...base.crop, ...override.crop },
    shop: { ...base.shop, ...override.shop },
    recipe: { ...base.recipe, ...override.recipe },
    character: { ...base.character, ...override.character },
    gardening: { ...base.gardening, ...override.gardening },
    insect: { ...base.insect, ...override.insect },
    index: { ...base.index, ...override.index },
    waterRoutes: { ...base.waterRoutes, ...override.waterRoutes },
    rarity: { ...base.rarity, ...override.rarity },
    risk: { ...base.risk, ...override.risk }
  };
}

export function getDataUiMessages(locale: Locale = defaultLocale) {
  return mergeMessages(mergeMessages(english, localeOverrides[locale]), localeSectionOverrides[locale]);
}

export function formatLocalizedGold(value: number | null, locale: Locale, messages = getDataUiMessages(locale)) {
  return value === null ? messages.common.unknown : `${value.toLocaleString(locale)} ${messages.common.gold}`;
}
