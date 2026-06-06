import { crops, fish, hobbies, recipes, shops, tools } from "./heartopia";

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
  route("/", "Heartopia Hub", "Independent Heartopia fan wiki hub with codes, maps, database notes, tools, and guides.", "Home", [
    "heartopia",
    "guide",
    "wiki"
  ]),
  route("/codes/", "Heartopia Codes", "Redeem code tracking with active candidates, reward notes, and expired archive guidance.", "Explore", [
    "codes",
    "rewards",
    "wishing star"
  ]),
  route("/map/", "Heartopia Map", "Route map for shops, animals, fishing, events, resources, and hobby planning.", "Explore", [
    "map",
    "shops",
    "routes"
  ]),
  route("/database/", "Heartopia Database Hub", "Central database hub for fish, crops, recipes, pets, animals, shops, NPCs, and tools.", "Database", [
    "database",
    "fish",
    "crops",
    "recipes"
  ]),
  route("/guides/", "Heartopia Guides", "Practical route guides for progression, money, events, fishing, gardening, cooking, and pets.", "Guides", [
    "guides",
    "progression",
    "money"
  ]),
  route("/tools/", "Heartopia Tools", "Interactive planning tools for crops, recipes, fish, friendship, route timers, and checklists.", "Tools", [
    "tools",
    "planner",
    "tracker"
  ]),
  route("/events/", "Heartopia Events", "Event planning hub with windows, prep lists, rewards, and route handoffs.", "Explore", [
    "events",
    "festival",
    "checklist"
  ]),
  route("/download/", "Heartopia Download", "Download and platform notes for Heartopia players.", "Explore", [
    "download",
    "platform"
  ]),
  route("/animal-favorites/", "Heartopia Animal Favorites", "Animal food and favorite route notes for pets, farm animals, and wild animals.", "Database", [
    "animals",
    "favorites",
    "food"
  ]),
  route("/pets/", "Heartopia Pets", "Pet and animal route notes with food lanes, unlocks, shops, and map handoffs.", "Database", [
    "pets",
    "animals",
    "food"
  ]),
  route("/house-designs/", "Heartopia House Designs", "House design and furniture route ideas for decorating sessions.", "Guides", [
    "house",
    "furniture",
    "design"
  ]),
  route("/npcs/", "Heartopia NPCs", "NPC route notes with locations, shops, gifts, schedules, and friendship tools.", "Database", [
    "npcs",
    "friendship",
    "shops"
  ]),
  route("/hobbies/", "Heartopia Hobbies", "Hobby route hub for fishing, gardening, cooking, birdwatching, insects, and pet care.", "Hobbies", [
    "hobbies",
    "fishing",
    "gardening",
    "cooking"
  ]),
  route("/about/", "About Heartopia Hub", "About this independent Heartopia fan guide and data-maintenance approach.", "Site", [
    "about",
    "fan guide"
  ]),
  route("/contact/", "Contact Heartopia Hub", "Contact page for Heartopia Hub site feedback and corrections.", "Site", ["contact"]),
  route("/privacy/", "Heartopia Hub Privacy Policy", "Privacy policy for the independent Heartopia Hub fan guide.", "Site", [
    "privacy"
  ]),
  route("/terms/", "Heartopia Hub Terms", "Terms for the independent Heartopia Hub fan guide.", "Site", ["terms"]),
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
