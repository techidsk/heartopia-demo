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
  return mergeMessages(english, localeOverrides[locale]);
}

export function formatLocalizedGold(value: number | null, locale: Locale, messages = getDataUiMessages(locale)) {
  return value === null ? messages.common.unknown : `${value.toLocaleString(locale)} ${messages.common.gold}`;
}
