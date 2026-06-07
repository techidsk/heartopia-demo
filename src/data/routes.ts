import { getHeartopiaData, getTranslatedDataIds } from "./heartopia";
import { getSiteConfig } from "./site";
import { getStaticPages } from "./staticPages";
import { defaultLocale, localizePath, supportedLocales, type Locale } from "@i18n/config";

export type RouteEntry = {
  path: string;
  title: string;
  description: string;
  section: string;
  keywords: string[];
  updated: string;
  image?: string;
};

const route = (
  updated: string,
  path: string,
  title: string,
  description: string,
  section: string,
  keywords: string[] = [],
  image?: string
): RouteEntry => ({
  path,
  title,
  description,
  section,
  keywords,
  updated,
  image
});

export function getRouteEntries(locale: Locale = defaultLocale) {
  const updated = getSiteConfig(locale).updatedDate;
  const { crops, fish, gardening, hobbies, insects, npcs, recipes, shops, tools } = getHeartopiaData(locale);
  const createRoute = (
    path: string,
    title: string,
    description: string,
    section: string,
    keywords: string[] = [],
    image?: string
  ) => route(updated, path, title, description, section, keywords, image);

  const staticRoutes: RouteEntry[] = [
    ...getStaticPages(locale)
      .filter((page) => page.path !== "/404.html")
      .map((page) => createRoute(page.path, page.title, page.description, page.section, page.keywords, page.ogImage)),
    createRoute("/search/", "Heartopia Search", "Search Heartopia Hub pages, databases, tools, and route notes.", "Site", [
      "search",
      "database",
      "tools"
    ])
  ];

  const generatedRoutes: RouteEntry[] = [
    createRoute(
      "/fish/",
      "Heartopia Fish Database",
      "Search fish by location, water route, rarity, weather, time window, level gate, and cooking use.",
      "Database",
      ["fish", "fishing", "map"]
    ),
    ...fish.map((item) =>
      createRoute(
        `/fish/${item.id}/`,
        `${item.name} - Heartopia Fish`,
        `${item.name} fish detail with ${item.spot} location, ${item.condition} condition, ${item.window} window, and ${item.level} gate.`,
        "Fish",
        [item.name, item.type, item.rarity, item.spot, item.condition, item.use]
      )
    ),
    createRoute(
      "/shops/",
      "Heartopia Shop List",
      "Shop list with owners, inventory, unlock notes, map marker links, and route handoffs.",
      "Database",
      ["shops", "inventory", "map"]
    ),
    ...shops.map((shop) =>
      createRoute(
        `/shops/${shop.id}/`,
        `${shop.name} - Heartopia Shop`,
        `${shop.name} shop detail with owner ${shop.owner}, ${shop.region} route, unlock notes, and key inventory.`,
        "Shops",
        [shop.name, shop.type, shop.owner, shop.region, ...shop.inventory]
      )
    ),
    createRoute(
      "/characters/",
      "Heartopia Characters",
      "Character and NPC hub with TW Wiki portraits, source names, roles, locations, shops, map handoffs, and friendship notes.",
      "Database",
      ["characters", "NPCs", "portraits", "friendship", "wiki"]
    ),
    ...npcs.map((npc) =>
      createRoute(
        `/characters/${npc.id}/`,
        `${npc.name} - Heartopia Character`,
        `${npc.name} character detail with ${npc.role}, ${npc.location}, gift route notes, map handoff, and ${npc.nameZh || "structured"} source name.`,
        "Characters",
        [npc.name, npc.nameZh || "", npc.group, npc.role, npc.location, ...npc.gifts],
        npc.image
      )
    ),
    createRoute(
      "/crops/",
      "Heartopia Crop Database",
      "Crop database with growth times, seed costs, sell values, unlocks, route groups, and recipe handoffs.",
      "Database",
      ["crops", "gardening", "profit"]
    ),
    ...crops.map((crop) =>
      createRoute(
        `/crops/${crop.id}/`,
        `${crop.name} - Heartopia Crop`,
        `${crop.name} crop detail with ${crop.growth} growth, ${crop.unlock} unlock, seed cost, sell value, and route links.`,
        "Crops",
        [crop.name, crop.group, crop.growth, crop.unlock, crop.route, crop.use],
        crop.image
      )
    ),
    createRoute(
      "/gardening/",
      "Heartopia Gardening Handbook",
      "Gardening handbook imported from the TW wiki with crop, flower, tree, icon, hobby level, season, and source links.",
      "Database",
      ["gardening", "crops", "flowers", "wiki", "園藝手冊"]
    ),
    ...gardening.map((item) =>
      createRoute(
        `/gardening/${item.id}/`,
        `${item.name} - Heartopia Gardening Handbook`,
        `${item.name} gardening entry with ${item.nameZh} source name, ${item.season} season, hobby level ${item.hobbyLevel}, route notes, icon, and wiki source.`,
        "Gardening",
        [item.name, item.nameZh, item.category, item.season, item.route, item.hobbyLevel],
        item.image
      )
    ),
    createRoute(
      "/insects/",
      "Heartopia Insect Database",
      "Insect database imported from the TW wiki with bug icons, time windows, weather, routes, rarity, hobby level, and source links.",
      "Database",
      ["insects", "bugs", "bug catching", "蟲蟲物語"]
    ),
    ...insects.map((item) =>
      createRoute(
        `/insects/${item.id}/`,
        `${item.name} - Heartopia Insect`,
        `${item.name} insect detail with ${item.time} time window, ${item.weather} weather, ${item.route} route, rarity ${item.rarity}, and wiki source.`,
        "Insects",
        [item.name, item.nameZh, item.season, item.time, item.weather, item.route, item.rarity, item.hobbyLevel],
        item.image
      )
    ),
    createRoute(
      "/recipes/",
      "Heartopia Recipes Database",
      "Recipe database with ingredients, source lanes, route groups, risk notes, and cooking tool handoffs.",
      "Database",
      ["recipes", "cooking", "ingredients"]
    ),
    ...recipes.map((recipe) =>
      createRoute(
        `/recipes/${recipe.id}/`,
        `${recipe.name} - Heartopia Recipe`,
        `${recipe.name} recipe detail with ingredients ${recipe.ingredients.join(", ")}, ${recipe.route} route, and ${recipe.risk} risk.`,
        "Recipes",
        [recipe.name, recipe.group, recipe.route, recipe.risk, recipe.source, ...recipe.ingredients]
      )
    ),
    createRoute(
      "/tools/profit-calculator/",
      "Heartopia Crop Profit Calculator",
      "Crop profit calculator for plots, session length, seed cost, sell value, and star bonus planning.",
      "Tools",
      ["profit calculator", "crops", "gold"],
      "/assets/asset-gardening.jpg"
    ),
    ...tools.map((tool) =>
      createRoute(tool.href, tool.title, tool.description, "Tools", [tool.category, tool.useCase, ...tool.linkedData], tool.image)
    ),
    ...hobbies.map((hobby) =>
      createRoute(hobby.primary.includes("?") ? "/pets/" : hobby.primary, `Heartopia ${hobby.name}`, hobby.summary, "Hobbies", [
        hobby.name,
        hobby.group
      ])
    )
  ];

  const entriesByPath = new Map<string, RouteEntry>();
  for (const entry of [...staticRoutes, ...generatedRoutes]) {
    if (!entriesByPath.has(entry.path)) entriesByPath.set(entry.path, entry);
  }

  return [...entriesByPath.values()].sort((a, b) => a.path.localeCompare(b.path));
}

export function getFeedEntries(locale: Locale = defaultLocale) {
  return getRouteEntries(locale)
    .filter((entry) => !["Site"].includes(entry.section))
    .slice(0, 30);
}

export function getIndexableRouteEntries() {
  const defaultEntries = getRouteEntries(defaultLocale);
  const translatedStaticEntries = supportedLocales
    .filter((locale) => locale !== defaultLocale)
    .flatMap((locale) => {
      const updated = getSiteConfig(locale).updatedDate;
      return getStaticPages(locale)
        .filter((page) => page.path !== "/404.html" && page.translationStatus === "translated")
        .map((page) => route(updated, localizePath(page.path, locale), page.title, page.description, page.section, page.keywords, page.ogImage));
    });
  const translatedDataEntries = supportedLocales
    .filter((locale) => locale !== defaultLocale)
    .flatMap((locale) => {
      const localizedRoutesByPath = new Map(getRouteEntries(locale).map((entry) => [entry.path, entry]));
      const translatedPaths = [
        ...getTranslatedDataIds(locale, "fish").map((id) => `/fish/${id}/`),
        ...getTranslatedDataIds(locale, "shops").map((id) => `/shops/${id}/`),
        ...getTranslatedDataIds(locale, "crops").map((id) => `/crops/${id}/`),
        ...getTranslatedDataIds(locale, "gardening").map((id) => `/gardening/${id}/`),
        ...getTranslatedDataIds(locale, "insects").map((id) => `/insects/${id}/`),
        ...getTranslatedDataIds(locale, "recipes").map((id) => `/recipes/${id}/`),
        ...getTranslatedDataIds(locale, "npcs").map((id) => `/characters/${id}/`)
      ];
      return translatedPaths
        .map((path) => localizedRoutesByPath.get(path))
        .filter((entry): entry is RouteEntry => Boolean(entry))
        .map((entry) => ({ ...entry, path: localizePath(entry.path, locale) }));
    });

  return [...defaultEntries, ...translatedStaticEntries, ...translatedDataEntries].filter(
    (entry) => !entry.path.includes("?") && !entry.path.includes("#")
  );
}

export const routeEntries = getRouteEntries(defaultLocale);
export const feedEntries = getFeedEntries(defaultLocale);
