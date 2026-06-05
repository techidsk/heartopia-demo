import { chromium } from "playwright";

const paths = [
  "/",
  "/codes/",
  "/guides/",
  "/map/",
  "/tools/",
  "/database/",
  "/fish/",
  "/recipes/",
  "/crops/",
  "/animal-favorites/",
  "/hobbies/fishing/",
  "/hobbies/cooking/",
  "/hobbies/gardening/",
  "/pets/",
  "/house-designs/",
  "/npcs/",
  "/events/",
  "/download/",
  "/privacy/"
];
const viewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 1365, height: 900 }
];

const browser = await chromium.launch({
  channel: "chrome",
  headless: true
});

const findings = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  for (const path of paths) {
    await page.goto(`http://127.0.0.1:4174${path}`, { waitUntil: "networkidle" });
    const metrics = await page.evaluate(() => ({
      title: document.title,
      width: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      overflowNodes: Array.from(document.querySelectorAll("*"))
        .filter((node) => node.scrollWidth > node.clientWidth + 1)
        .slice(0, 6)
        .map((node) => ({
          tag: node.tagName,
          className: node.className,
          clientWidth: node.clientWidth,
          scrollWidth: node.scrollWidth
        }))
    }));
    findings.push({ path, viewport: viewport.width, ...metrics });
  }
  await page.close();
}

await browser.close();
console.log(JSON.stringify(findings, null, 2));
