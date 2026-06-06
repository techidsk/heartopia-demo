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

const localizedSiteContent = {
  en: {
    name: "Heartopia Hub",
    description: "Independent Heartopia fan wiki hub with codes, maps, database notes, tools, and guides.",
    author: "Heartopia Hub editorial team",
    defaultImageAlt: "Heartopia Hub guide preview for Heartopia maps, codes, tools, and database routes.",
    updatedLabel: "June 6, 2026",
    navItems: [
      { href: "/", label: "Home" },
      { href: "/codes/", label: "Codes" },
      { href: "/database/", label: "Data" },
      { href: "/map/", label: "Map" },
      { href: "/shops/", label: "Shops" },
      { href: "/fish/", label: "Fish" },
      { href: "/recipes/", label: "Recipes" },
      { href: "/hobbies/", label: "Hobbies" },
      { href: "/pets/", label: "Pets" },
      { href: "/house-designs/", label: "House" },
      { href: "/characters/", label: "NPCs" },
      { href: "/tools/", label: "Tools" },
      { href: "/events/", label: "Events" },
      { href: "/download/", label: "Download" }
    ],
    navGroups: [
      {
        label: "Start",
        links: [
          { href: "/", label: "Home" },
          { href: "/guides/", label: "Beginner Guide" },
          { href: "/codes/", label: "Codes" },
          { href: "/events/", label: "Events" },
          { href: "/download/", label: "Download" }
        ]
      },
      {
        label: "Data",
        links: [
          { href: "/database/", label: "Database Home" },
          { href: "/characters/", label: "Characters" },
          { href: "/gardening/", label: "Gardening" },
          { href: "/insects/", label: "Insects" },
          { href: "/crops/", label: "Crops" },
          { href: "/fish/", label: "Fish" },
          { href: "/recipes/", label: "Recipes" },
          { href: "/shops/", label: "Shops" }
        ]
      },
      {
        label: "Routes",
        links: [
          { href: "/map/", label: "Map" },
          { href: "/hobbies/", label: "Hobbies" },
          { href: "/pets/", label: "Pets" },
          { href: "/animal-favorites/", label: "Animal Favorites" },
          { href: "/house-designs/", label: "House Designs" },
          { href: "/npcs/", label: "Legacy NPC Guide" }
        ]
      },
      {
        label: "Tools",
        links: [
          { href: "/tools/", label: "Tools Home" },
          { href: "/tools/profit-calculator/", label: "Profit Calculator" },
          { href: "/tools/crop-planner/", label: "Crop Planner" },
          { href: "/tools/recipe-finder/", label: "Recipe Finder" },
          { href: "/tools/fish-tracker/", label: "Fish Tracker" },
          { href: "/tools/checklist/", label: "Daily Checklist" },
          { href: "/search/", label: "Search" }
        ]
      }
    ],
    footerGroups: [
      {
        title: "Explore",
        links: [
          { href: "/codes/", label: "Codes" },
          { href: "/guides/", label: "Guides" },
          { href: "/map/", label: "Map" },
          { href: "/shops/", label: "Shops" },
          { href: "/characters/", label: "Characters" },
          { href: "/gardening/", label: "Gardening" },
          { href: "/insects/", label: "Insects" },
          { href: "/tools/", label: "Tools" },
          { href: "/search/", label: "Search" },
          { href: "/database/", label: "Database" }
        ]
      },
      {
        title: "Site",
        links: [
          { href: "/about/", label: "About" },
          { href: "/contact/", label: "Contact" },
          { href: "/privacy/", label: "Privacy Policy" },
          { href: "/terms/", label: "Terms" }
        ]
      }
    ]
  }
} satisfies Record<
  Locale,
  {
    name: string;
    description: string;
    author: string;
    defaultImageAlt: string;
    updatedLabel: string;
    navItems: NavLink[];
    navGroups: NavGroup[];
    footerGroups: FooterGroup[];
  }
>;

const withLocalizedLinks = <T extends NavLink>(links: T[], locale: Locale) =>
  links.map((link) => ({ ...link, href: localizePath(link.href, locale) }));

const withLocalizedGroups = <T extends { links: NavLink[] }>(groups: T[], locale: Locale) =>
  groups.map((group) => ({ ...group, links: withLocalizedLinks(group.links, locale) }));

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
    pathPrefix: meta.pathPrefix
  };
}

export function getNavItems(locale: Locale = defaultLocale) {
  return withLocalizedLinks(localizedSiteContent[locale].navItems, locale);
}

export function getNavGroups(locale: Locale = defaultLocale) {
  return withLocalizedGroups(localizedSiteContent[locale].navGroups, locale);
}

export function getDefaultFooterGroups(locale: Locale = defaultLocale) {
  return withLocalizedGroups(localizedSiteContent[locale].footerGroups, locale);
}

export const siteConfig = getSiteConfig(defaultLocale);
export const navItems = getNavItems(defaultLocale);
export const navGroups = getNavGroups(defaultLocale);
export const defaultFooterGroups = getDefaultFooterGroups(defaultLocale);
