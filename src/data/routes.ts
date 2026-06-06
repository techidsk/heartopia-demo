import { crops, fish, gardening, hobbies, insects, npcs, recipes, shops, tools } from "./heartopia";
import { staticPages } from "./staticPages";

export type RouteEntry = {
  path: string;
  title: string;
  description: string;
  section: string;
  keywords: string[];
  updated: string;
};

const updated = "2026-06-06";

const route = (
  path: string,
  title: string,
  description: string,
  section: string,
  keywords: string[] = []
): RouteEntry => ({
  path,
  title,
  description,
  section,
  keywords,
  updated
});

const staticRoutes: RouteEntry[] = [
  ...staticPages
    .filter((page) => page.path !== "/404.html")
    .map((page) => route(page.path, page.title, page.description, page.section, page.keywords)),
  route("/search/", "Heartopia Search", "Search Heartopia Hub pages, databases, tools, and route notes.", "Site", [
    "search",
    "database",
    "tools"
  ])
];

const generatedRoutes: RouteEntry[] = [
  route("/fish/", "Heartopia Fish Database", "Search fish by location, water route, rarity, weather, time window, level gate, and cooking use.", "Database", [
    "fish",
    "fishing",
    "map"
  ]),
  ...fish.map((item) =>
    route(
      `/fish/${item.id}/`,
      `${item.name} - Heartopia Fish`,
      `${item.name} fish detail with ${item.spot} location, ${item.condition} condition, ${item.window} window, and ${item.level} gate.`,
      "Fish",
      [item.name, item.type, item.rarity, item.spot, item.condition, item.use]
    )
  ),
  route("/shops/", "Heartopia Shop List", "Shop list with owners, inventory, unlock notes, map marker links, and route handoffs.", "Database", [
    "shops",
    "inventory",
    "map"
  ]),
  ...shops.map((shop) =>
    route(
      `/shops/${shop.id}/`,
      `${shop.name} - Heartopia Shop`,
      `${shop.name} shop detail with owner ${shop.owner}, ${shop.region} route, unlock notes, and key inventory.`,
      "Shops",
      [shop.name, shop.type, shop.owner, shop.region, ...shop.inventory]
    )
  ),
  route(
    "/characters/",
    "Heartopia Characters",
    "Character and NPC hub with TW Wiki portraits, source names, roles, locations, shops, map handoffs, and friendship notes.",
    "Database",
    ["characters", "NPCs", "portraits", "friendship", "wiki"]
  ),
  ...npcs.map((npc) =>
    route(
      `/characters/${npc.id}/`,
      `${npc.name} - Heartopia Character`,
      `${npc.name} character detail with ${npc.role}, ${npc.location}, gift route notes, map handoff, and ${npc.nameZh || "structured"} source name.`,
      "Characters",
      [npc.name, npc.nameZh || "", npc.group, npc.role, npc.location, ...npc.gifts]
    )
  ),
  route("/crops/", "Heartopia Crop Database", "Crop database with growth times, seed costs, sell values, unlocks, route groups, and recipe handoffs.", "Database", [
    "crops",
    "gardening",
    "profit"
  ]),
  ...crops.map((crop) =>
    route(
      `/crops/${crop.id}/`,
      `${crop.name} - Heartopia Crop`,
      `${crop.name} crop detail with ${crop.growth} growth, ${crop.unlock} unlock, seed cost, sell value, and route links.`,
      "Crops",
      [crop.name, crop.group, crop.growth, crop.unlock, crop.route, crop.use]
    )
  ),
  route(
    "/gardening/",
    "Heartopia Gardening Handbook",
    "Gardening handbook imported from the TW wiki with crop, flower, tree, icon, hobby level, season, and source links.",
    "Database",
    ["gardening", "crops", "flowers", "wiki", "園藝手冊"]
  ),
  ...gardening.map((item) =>
    route(
      `/gardening/${item.id}/`,
      `${item.name} - Heartopia Gardening Handbook`,
      `${item.name} gardening entry with ${item.nameZh} source name, ${item.season} season, hobby level ${item.hobbyLevel}, route notes, icon, and wiki source.`,
      "Gardening",
      [item.name, item.nameZh, item.category, item.season, item.route, item.hobbyLevel]
    )
  ),
  route(
    "/insects/",
    "Heartopia Insect Database",
    "Insect database imported from the TW wiki with bug icons, time windows, weather, routes, rarity, hobby level, and source links.",
    "Database",
    ["insects", "bugs", "bug catching", "蟲蟲物語"]
  ),
  ...insects.map((item) =>
    route(
      `/insects/${item.id}/`,
      `${item.name} - Heartopia Insect`,
      `${item.name} insect detail with ${item.time} time window, ${item.weather} weather, ${item.route} route, rarity ${item.rarity}, and wiki source.`,
      "Insects",
      [item.name, item.nameZh, item.season, item.time, item.weather, item.route, item.rarity, item.hobbyLevel]
    )
  ),
  route("/recipes/", "Heartopia Recipes Database", "Recipe database with ingredients, source lanes, route groups, risk notes, and cooking tool handoffs.", "Database", [
    "recipes",
    "cooking",
    "ingredients"
  ]),
  ...recipes.map((recipe) =>
    route(
      `/recipes/${recipe.id}/`,
      `${recipe.name} - Heartopia Recipe`,
      `${recipe.name} recipe detail with ingredients ${recipe.ingredients.join(", ")}, ${recipe.route} route, and ${recipe.risk} risk.`,
      "Recipes",
      [recipe.name, recipe.group, recipe.route, recipe.risk, recipe.source, ...recipe.ingredients]
    )
  ),
  route(
    "/tools/profit-calculator/",
    "Heartopia Crop Profit Calculator",
    "Crop profit calculator for plots, session length, seed cost, sell value, and star bonus planning.",
    "Tools",
    ["profit calculator", "crops", "gold"]
  ),
  ...tools.map((tool) => route(tool.href, tool.title, tool.description, "Tools", [tool.category, tool.useCase, ...tool.linkedData])),
  ...hobbies.map((hobby) =>
    route(hobby.primary.includes("?") ? "/pets/" : hobby.primary, `Heartopia ${hobby.name}`, hobby.summary, "Hobbies", [
      hobby.name,
      hobby.group
    ])
  )
];

const entriesByPath = new Map<string, RouteEntry>();
for (const entry of [...staticRoutes, ...generatedRoutes]) {
  if (!entriesByPath.has(entry.path)) entriesByPath.set(entry.path, entry);
}

export const routeEntries = [...entriesByPath.values()].sort((a, b) => a.path.localeCompare(b.path));

export const feedEntries = routeEntries
  .filter((entry) => !["Site"].includes(entry.section))
  .slice(0, 30);
