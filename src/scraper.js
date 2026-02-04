const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const CONFIG_PATH = path.join(__dirname, "..", "config", "marketplaces.json");
const OUTPUT_PATH = path.join(__dirname, "..", "output", "products.json");

const loadMarketplaces = () => {
  const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
  return JSON.parse(raw);
};

const scrapeMarketplace = async (browser, marketplace, limit = 5) => {
  const page = await browser.newPage();
  await page.goto(marketplace.url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const selectors = marketplace.selectors;
  const items = await page.$$eval(
    selectors.item,
    (nodes, selectorsArg, limitArg) => {
      const results = [];
      for (const node of nodes) {
        if (results.length >= limitArg) {
          break;
        }
        const title = node.querySelector(selectorsArg.title)?.textContent?.trim();
        const price = node.querySelector(selectorsArg.price)?.textContent?.trim();
        const link = node.querySelector(selectorsArg.link)?.getAttribute("href");
        const sold = node.querySelector(selectorsArg.sold)?.textContent?.trim();

        if (!title || !price || !link) {
          continue;
        }

        results.push({
          title,
          price,
          link,
          sold: sold || null,
        });
      }
      return results;
    },
    selectors,
    limit
  );

  await page.close();

  return items.map((item) => ({
    ...item,
    marketplace: marketplace.name,
    source: marketplace.id,
    scrapedAt: new Date().toISOString(),
  }));
};

const run = async () => {
  const marketplaces = loadMarketplaces();
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const marketplace of marketplaces) {
      const scraped = await scrapeMarketplace(browser, marketplace, 5);
      results.push(...scraped);
    }
  } finally {
    await browser.close();
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));

  console.log(`Saved ${results.length} products to ${OUTPUT_PATH}`);
};

run().catch((error) => {
  console.error("Scraper failed:", error);
  process.exit(1);
});
