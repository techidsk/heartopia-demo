export const siteConfig = {
  name: "Heartopia Hub",
  origin: "https://heartopia.blog",
  description:
    "Independent Heartopia fan wiki hub with codes, maps, database notes, tools, and guides.",
  author: "Heartopia Hub editorial team",
  adsenseClient: "ca-pub-1476592629109289",
  adsTxtLine: "google.com, pub-1476592629109289, DIRECT, f08c47fec0942fa0",
  logo: "/assets/heartopia-hub-logo.svg",
  defaultImage: "/assets/heartopia-guide-hero.png",
  defaultImageAlt: "Heartopia Hub guide preview for Heartopia maps, codes, tools, and database routes.",
  themeColor: "#2aa89e",
  locale: "en_US",
  language: "en",
  publishedDate: "2026-06-06",
  updatedDate: "2026-06-06",
  updatedLabel: "June 6, 2026"
};

export const navItems = [
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
];

export const navGroups = [
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
];

export const defaultFooterGroups = [
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
];
