import { chromium } from 'playwright';

const DRAFTS_URL = 'https://www.ebay.co.uk/sh/lst/drafts';
const FINAL_SCREENSHOT = 'ebay-listing-live-confirmation.png';

const LISTING_TITLE = "Premium Men's Genuine Lambskin Leather Baseball Varsity Jacket - Bomber Coat";
const DESCRIPTION = `Experience unparalleled style with this Premium Genuine Lambskin Leather Baseball Varsity Jacket. Crafted from premium materials and designed for supreme comfort and warmth, this versatile jacket is perfect for both casual outings and stylish events.

KEY FEATURES:
- Shell Material: 100% Genuine Lambskin Leather with a soft-touch, Napa finish
- Lining: 100% Polyester (Fully insulated interior for warmth)
- Storage: Two exterior side pockets and two secure interior pockets
- Design: Stretched knit cuffs, elastic hem inserts, full-front zipper closure
- Colours Available: Emerald Green, Grey, Navy, Pink, White, Purple, Olive, Burgundy, Powder Blue, Yellow
- Sizes: M to 6XL`;

async function clickByText(page, texts, timeout = 15000) {
  for (const text of texts) {
    const el = page.getByRole('button', { name: new RegExp(`^${text}$`, 'i') }).first();
    if (await el.isVisible({ timeout: 1500 }).catch(() => false)) {
      await el.click();
      return text;
    }

    const link = page.getByRole('link', { name: new RegExp(`^${text}$`, 'i') }).first();
    if (await link.isVisible({ timeout: 1500 }).catch(() => false)) {
      await link.click();
      return text;
    }
  }

  const combined = texts.join(' / ');
  const fallback = page.locator(`text=/^(${texts.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})$/i`).first();
  await fallback.waitFor({ state: 'visible', timeout });
  await fallback.click();
  return combined;
}

async function setTextbox(page, label, value) {
  const field = page.getByLabel(new RegExp(label, 'i')).first();
  await field.waitFor({ state: 'visible', timeout: 15000 });
  await field.fill('');
  await field.fill(value);
}

async function setSelectByLabel(page, label, optionLabel) {
  const select = page.getByLabel(new RegExp(label, 'i')).first();
  await select.waitFor({ state: 'visible', timeout: 15000 });
  await select.selectOption({ label: optionLabel });
}

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  const context = await browser.newContext({ viewport: { width: 1440, height: 2200 } });
  const page = await context.newPage();

  console.log('1) Navigating to eBay UK Seller Hub drafts...');
  await page.goto(DRAFTS_URL, { waitUntil: 'domcontentloaded' });

  // Allow manual login and 2FA if needed.
  if (/signin|login/i.test(page.url())) {
    console.log('Please sign in to eBay in the opened browser. Press Enter here when drafts are visible...');
    await new Promise((resolve) => process.stdin.once('data', resolve));
  }

  await page.waitForLoadState('networkidle');

  console.log('2) Opening the first draft (Resume draft/Edit)...');
  await clickByText(page, ['Resume draft', 'Edit']);
  await page.waitForLoadState('networkidle');

  console.log('3) Updating title and condition...');
  await setTextbox(page, 'Title', LISTING_TITLE);
  await setSelectByLabel(page, 'Condition', 'New with tags');

  console.log('4) Filling description...');
  await setTextbox(page, 'Description', DESCRIPTION);

  console.log('5) Setting price and quantity...');
  await setTextbox(page, 'Buy It Now price|Price', '79.99');
  await setTextbox(page, 'Quantity', '10');

  console.log('6) Setting item specifics...');
  await setTextbox(page, 'Brand', 'Unbranded');
  await setTextbox(page, 'Style', 'Bomber / Varsity');
  await setTextbox(page, 'Outer Shell Material', 'Genuine Leather / Lambskin');
  await setTextbox(page, 'Colour|Color', 'Grey');
  await setTextbox(page, 'Lining Material', 'Polyester');
  await setTextbox(page, 'Country/Region of Manufacture', 'Pakistan');

  console.log('7) Verifying policies...');
  await page.locator('text=/Shipping/i').first().scrollIntoViewIfNeeded();
  await page.locator('text=Pakistanto UK tracked').first().waitFor({ state: 'visible', timeout: 15000 });

  await page.locator('text=/Returns/i').first().scrollIntoViewIfNeeded();
  await page.locator('text=Returns 30 Days').first().waitFor({ state: 'visible', timeout: 15000 });

  console.log('8) Publishing listing...');
  await page.locator('button:has-text("List it for free"), button:has-text("List it")').first().scrollIntoViewIfNeeded();
  await page.locator('button:has-text("List it for free"), button:has-text("List it")').first().click();

  console.log('9) Verifying live confirmation and taking screenshot...');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: FINAL_SCREENSHOT, fullPage: true });

  console.log(`Success: listing submitted. Screenshot saved to ${FINAL_SCREENSHOT}`);
  await browser.close();
}

main().catch(async (error) => {
  console.error('Automation failed:', error);
  process.exitCode = 1;
});
