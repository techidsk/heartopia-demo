import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "data", "content");
const pathSchema = z.string().min(1).regex(/^\//, "must be an absolute site path");
const routePathSchema = z.string().min(1).regex(/^(?:\/|\/(?:.*\/|404\.html))$/, "must be a site route path");

const schemas = {
  fish: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      type: z.enum(["lake", "river", "ocean", "hidden", "event"]),
      spot: z.string().min(1),
      condition: z.string().min(1),
      window: z.string().min(1),
      rarity: z.enum(["common", "uncommon", "rare"]),
      level: z.string().min(1),
      use: z.string().min(1),
      map: pathSchema
    })
  ),
  shops: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      type: z.string().min(1),
      icon: z.string().min(1),
      owner: z.string().min(1),
      region: z.string().min(1),
      mapMarkerId: z.string().min(1),
      unlock: z.string().min(1),
      hours: z.string().min(1),
      inventory: z.array(z.string().min(1)),
      notes: z.string().min(1),
      links: z.object({
        map: pathSchema.optional(),
        npc: pathSchema.optional(),
        tool: pathSchema.optional()
      })
    })
  ),
  crops: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      group: z.string().min(1),
      growth: z.string().min(1),
      minutes: z.number().positive().nullable(),
      seed: z.number().nonnegative().nullable(),
      sell: z.number().nonnegative().nullable(),
      unlock: z.string().min(1),
      route: z.string().min(1),
      use: z.string().min(1),
      shop: pathSchema,
      tool: pathSchema,
      related: pathSchema,
      nameZh: z.string().min(1).optional(),
      image: pathSchema.optional(),
      wikiUrl: z.string().url().optional(),
      season: z.string().min(1).optional(),
      hobbyLevel: z.string().min(1).optional(),
      lore: z.string().min(1).optional(),
      source: z.string().min(1).optional()
    })
  ),
  gardening: z.array(
    z.object({
      id: z.string().min(1),
      sourceId: z.string(),
      name: z.string().min(1),
      nameZh: z.string().min(1),
      number: z.string().min(1),
      category: z.string().min(1),
      season: z.string().min(1),
      time: z.string().min(1),
      weather: z.string().min(1),
      route: z.string().min(1),
      lore: z.string().min(1),
      hobbyLevel: z.string().min(1),
      iconFile: z.string().min(1),
      wikiUrl: z.string().url(),
      source: z.string().min(1),
      image: pathSchema,
      sourceImageUrl: z.string().url(),
      imageWidth: z.number().positive(),
      imageHeight: z.number().positive()
    })
  ),
  insects: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      nameZh: z.string().min(1),
      number: z.string().min(1),
      season: z.string().min(1),
      time: z.string().min(1),
      weather: z.string().min(1),
      route: z.string().min(1),
      lore: z.string().min(1),
      rarity: z.string().min(1),
      hobbyLevel: z.string().min(1),
      iconFile: z.string().min(1),
      wikiUrl: z.string().url(),
      source: z.string().min(1),
      image: pathSchema,
      sourceImageUrl: z.string().url(),
      imageWidth: z.number().positive(),
      imageHeight: z.number().positive()
    })
  ),
  recipes: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      group: z.string().min(1),
      ingredients: z.array(z.string().min(1)),
      route: z.string().min(1),
      use: z.string().min(1),
      risk: z.enum(["low", "medium", "high"]),
      source: z.string().min(1),
      tool: pathSchema,
      primary: pathSchema
    })
  ),
  codes: z.object({
    checkedAt: z.string().min(1),
    sourceNote: z.string().min(1),
    activeCandidates: z.array(
      z.object({
        code: z.string().min(1),
        status: z.enum(["priority", "new", "milestone"]),
        rewards: z.array(z.string().min(1)),
        rewardTypes: z.array(z.string().min(1)),
        expiresAt: z.string().min(1).optional(),
        note: z.string().min(1).optional()
      })
    ),
    expiredArchive: z.array(
      z.object({
        code: z.string().min(1),
        reportedReward: z.string().min(1),
        expired: z.string().min(1)
      })
    )
  }),
  events: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      status: z.enum(["current", "route", "upcoming", "archive"]),
      window: z.string().min(1),
      endAt: z.string(),
      route: z.string().min(1),
      rewards: z.array(z.string().min(1)),
      prep: z.array(z.string().min(1)),
      links: z.object({
        map: pathSchema,
        tool: pathSchema,
        guide: pathSchema
      })
    })
  ),
  npcs: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      group: z.string().min(1),
      role: z.string().min(1),
      location: z.string().min(1),
      schedule: z.string().min(1),
      gifts: z.array(z.string().min(1)),
      shop: pathSchema,
      map: pathSchema,
      tool: pathSchema,
      nameZh: z.string().min(1).optional(),
      imageFile: z.string().min(1).optional(),
      image: pathSchema.optional(),
      sourceImageUrl: z.string().url().optional(),
      imageWidth: z.number().positive().optional(),
      imageHeight: z.number().positive().optional(),
      profile: z.string().min(1).optional(),
      wikiUrl: z.string().url().optional(),
      source: z.string().min(1).optional()
    })
  ),
  pets: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      category: z.string().min(1),
      route: z.string().min(1),
      food: z.array(z.string().min(1)),
      unlock: z.string().min(1),
      source: z.string().min(1),
      map: pathSchema,
      shop: pathSchema,
      guide: pathSchema
    })
  ),
  hobbies: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      group: z.string().min(1),
      summary: z.string().min(1),
      primary: pathSchema,
      tool: pathSchema,
      database: pathSchema
    })
  ),
  tools: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      category: z.string().min(1),
      href: pathSchema,
      image: pathSchema,
      description: z.string().min(1),
      useCase: z.string().min(1),
      linkedData: z.array(z.string().min(1)),
      status: z.string().min(1)
    })
  ),
  "static-pages": z.array(
    z.object({
      path: routePathSchema,
      title: z.string().min(1),
      description: z.string().min(1),
      section: z.string().min(1),
      keywords: z.array(z.string().min(1)),
      ogImage: pathSchema.optional(),
      content: z.string().min(1)
    })
  )
};

function assertUniqueIds(name, rows) {
  if (!Array.isArray(rows)) return;
  const seen = new Set();
  const duplicates = rows.filter((row) => {
    if (!row.id || !seen.has(row.id)) {
      seen.add(row.id);
      return false;
    }
    return true;
  });
  if (duplicates.length) {
    throw new Error(`${name}.json has duplicate ids: ${duplicates.map((row) => row.id).join(", ")}`);
  }
}

for (const [name, schema] of Object.entries(schemas)) {
  const filePath = path.join(dataDir, `${name}.json`);
  const payload = JSON.parse(await fs.readFile(filePath, "utf8"));
  const result = schema.safeParse(payload);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`${name}.json failed validation:\n${issues}`);
  }
  assertUniqueIds(name, result.data);
  console.log(`${name}.json ok`);
}
