import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(rootDir, "src", "data", "content");
const i18nDir = path.join(dataDir, "i18n");
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

const translationStatusSchema = z.enum(["translated", "draft"]);

const localizedArrayOverlay = (shape) =>
  z.array(z.object({ id: z.string().min(1), translationStatus: translationStatusSchema.optional(), ...shape }).strict());

const overlaySchemas = {
  fish: localizedArrayOverlay(
    schemas.fish.element.pick({ name: true, spot: true, condition: true, window: true, level: true, use: true }).partial()
      .shape
  ),
  shops: localizedArrayOverlay(
    schemas.shops.element
      .pick({ name: true, type: true, owner: true, region: true, unlock: true, hours: true, inventory: true, notes: true })
      .partial().shape
  ),
  crops: localizedArrayOverlay(
    schemas.crops.element
      .pick({
        name: true,
        group: true,
        growth: true,
        unlock: true,
        route: true,
        use: true,
        nameZh: true,
        season: true,
        hobbyLevel: true,
        lore: true,
        source: true
      })
      .partial().shape
  ),
  gardening: localizedArrayOverlay(
    schemas.gardening.element
      .pick({
        name: true,
        nameZh: true,
        category: true,
        season: true,
        time: true,
        weather: true,
        route: true,
        lore: true,
        hobbyLevel: true,
        source: true
      })
      .partial().shape
  ),
  insects: localizedArrayOverlay(
    schemas.insects.element
      .pick({
        name: true,
        nameZh: true,
        season: true,
        time: true,
        weather: true,
        route: true,
        lore: true,
        rarity: true,
        hobbyLevel: true,
        source: true
      })
      .partial().shape
  ),
  recipes: localizedArrayOverlay(
    schemas.recipes.element.pick({ name: true, group: true, ingredients: true, route: true, use: true, source: true }).partial()
      .shape
  ),
  codes: z
    .object({
      sourceNote: z.string().min(1).optional(),
      activeCandidates: z.array(
        z
          .object({
            code: z.string().min(1),
            rewards: z.array(z.string().min(1)).optional(),
            rewardTypes: z.array(z.string().min(1)).optional(),
            note: z.string().min(1).optional()
          })
          .strict()
      ),
      expiredArchive: z.array(
        z
          .object({
            code: z.string().min(1),
            reportedReward: z.string().min(1).optional(),
            expired: z.string().min(1).optional()
          })
          .strict()
      )
    })
    .strict(),
  events: localizedArrayOverlay(
    schemas.events.element.pick({ name: true, window: true, route: true, rewards: true, prep: true }).partial().shape
  ),
  npcs: localizedArrayOverlay(
    schemas.npcs.element
      .pick({
        name: true,
        group: true,
        role: true,
        location: true,
        schedule: true,
        gifts: true,
        nameZh: true,
        profile: true,
        source: true
      })
      .partial().shape
  ),
  pets: localizedArrayOverlay(
    schemas.pets.element.pick({ name: true, category: true, route: true, food: true, unlock: true, source: true }).partial()
      .shape
  ),
  hobbies: localizedArrayOverlay(schemas.hobbies.element.pick({ name: true, group: true, summary: true }).partial().shape),
  tools: localizedArrayOverlay(
    schemas.tools.element.pick({ title: true, category: true, description: true, useCase: true, linkedData: true, status: true })
      .partial().shape
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

const sourceData = {};

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
  sourceData[name] = result.data;
  console.log(`${name}.json ok`);
}

function assertKnownOverlayIds(name, rows, sourceRows) {
  if (!Array.isArray(rows) || !Array.isArray(sourceRows)) return;
  const sourceIds = new Set(sourceRows.map((row) => row.id));
  const unknown = rows.filter((row) => !sourceIds.has(row.id)).map((row) => row.id);
  if (unknown.length) throw new Error(`${name} overlay references unknown ids: ${unknown.join(", ")}`);
}

function assertOverlayRowsHaveCopy(name, rows) {
  if (!Array.isArray(rows)) return;
  const emptyRows = rows
    .filter((row) => Object.keys(row).filter((key) => key !== "id" && key !== "translationStatus").length === 0)
    .map((row) => row.id);
  if (emptyRows.length) throw new Error(`${name} overlay rows have no localized fields: ${emptyRows.join(", ")}`);
}

function assertKnownCodeOverlayIds(label, rows, sourceRows) {
  const sourceCodes = new Set(sourceRows.map((row) => row.code));
  const unknown = rows.filter((row) => !sourceCodes.has(row.code)).map((row) => row.code);
  if (unknown.length) throw new Error(`${label} overlay references unknown codes: ${unknown.join(", ")}`);
}

try {
  const localeDirs = await fs.readdir(i18nDir);
  for (const locale of localeDirs) {
    const dataOverlayDir = path.join(i18nDir, locale, "data");
    const stat = await fs.stat(dataOverlayDir).catch(() => null);
    if (!stat?.isDirectory()) continue;

    for (const [name, overlaySchema] of Object.entries(overlaySchemas)) {
      const overlayPath = path.join(dataOverlayDir, `${name}.json`);
      const payload = JSON.parse(await fs.readFile(overlayPath, "utf8"));
      const result = overlaySchema.safeParse(payload);
      if (!result.success) {
        const issues = result.error.issues
          .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
          .join("\n");
        throw new Error(`${path.relative(rootDir, overlayPath)} failed validation:\n${issues}`);
      }

      if (name === "codes") {
        assertKnownCodeOverlayIds(`${locale}/data/codes.activeCandidates`, result.data.activeCandidates, sourceData.codes.activeCandidates);
        assertKnownCodeOverlayIds(`${locale}/data/codes.expiredArchive`, result.data.expiredArchive, sourceData.codes.expiredArchive);
      } else {
        assertUniqueIds(`${locale}/data/${name}`, result.data);
        assertKnownOverlayIds(`${locale}/data/${name}`, result.data, sourceData[name]);
        assertOverlayRowsHaveCopy(`${locale}/data/${name}`, result.data);
      }
      console.log(`${path.relative(dataDir, overlayPath)} ok`);
    }
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
