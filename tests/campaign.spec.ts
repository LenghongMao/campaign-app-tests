import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs'; // Use '* as' for strict TypeScript modules

const APP_URL = 'https://lenghongmao.github.io/Campaign-app/';

// Tell Playwright to run these tests in order
test.describe.configure({ mode: 'serial' });

let page: Page;

// Playwright runs from the root folder, so we can just point directly to the tests folder!
const campaignsData = JSON.parse(fs.readFileSync('tests/campaigns_data.txt', 'utf8'));
const productsData = JSON.parse(fs.readFileSync('tests/products_data.txt', 'utf8'));

test.beforeAll(async ({ browser }) => {
  // Create ONE page context for the entire test suite
  page = await browser.newPage();
  await page.goto(APP_URL);
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Campaign App E2E Flow', () => {

  test('Test 1: Create 10 campaigns from text file', async () => {
    await expect(page).toHaveTitle(/Campaigns/);

    for (const campaign of campaignsData) {
      // Open Modal
      await page.locator('button', { hasText: 'Add Campaign' }).click();
      await expect(page.locator('.modal-title', { hasText: 'New Campaign' })).toBeVisible();

      // Fill out the form
      await page.locator('#cName').fill(campaign.name);
      await page.locator('#cStart').fill(campaign.start);
      await page.locator('#cEnd').fill(campaign.end);
      await page.locator('#cChannel').fill(campaign.channel);

      // Save and wait for modal to disappear
      await page.locator('button', { hasText: 'Save' }).click();
      await expect(page.locator('#campaignModal')).toBeHidden();

      // Verify the campaign was added to the table
      const newRow = page.locator('tr', { hasText: campaign.name });
      await expect(newRow).toBeVisible();
    }
    await page.waitForTimeout(1000); // Wait for a second to ensure all campaigns are rendered
    await page.screenshot({ 
      path: 'screenshots/campaign-list-complete.png', 
      fullPage: true 
    });
  });

  test('Test 2: Add 2 products to each campaign', async () => {
    // Iterate over the campaigns again to click into their detail pages
    for (const campaign of campaignsData) {
      
      // Find the row for this campaign and click its 'View Details' link
      const row = page.locator('tr', { hasText: campaign.name });
      await row.locator('text=View Details').click();

      // Verify we arrived on the detail page
      // Verify we arrived on the detail page by looking for the dynamic text
      await expect(page.locator('#pageTitle', { hasText: /Products for Campaign/ })).toBeVisible();

      // Find the 2 products that belong to this specific campaign
      const myProducts = productsData.filter((p: any) => p.campaignName === campaign.name);

      for (const product of myProducts) {
        // Open Product Modal
        await page.locator('button', { hasText: 'Add Product' }).click();
        await expect(page.locator('.modal-title', { hasText: 'New Product' })).toBeVisible();

        await page.waitForTimeout(500);

        // Fill out the product form
        await page.locator('#pNumber').fill(product.number);
        await page.locator('#pName').fill(product.name);
        await page.locator('#pCategory').fill(product.category);
        await page.locator('#pDesc').fill(product.desc);
        await page.locator('#pQty').fill(product.qty);

        // Save and wait for modal to close
        await page.locator('button', { hasText: 'Save' }).click();
        await expect(page.locator('#productModal')).toBeHidden();

        // Verify product is in the detail table
        const prodRow = page.locator('tr', { hasText: product.name });
        await expect(prodRow).toBeVisible();
      }

      // Navigate back to the main campaign list for the next loop iteration
      await page.locator('a', { hasText: 'Back to Campaigns' }).click();
      await expect(page.locator('h2', { hasText: 'Campaign List' })).toBeVisible();
    }
  });

});