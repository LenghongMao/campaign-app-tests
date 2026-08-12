import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const APP_URL = 'https://lenghongmao.github.io/Campaign-app/';
const campaignsData = JSON.parse(fs.readFileSync('tests/campaigns_data.txt', 'utf8'));
const productsData = JSON.parse(fs.readFileSync('tests/products_data.txt', 'utf8'));

test.describe('Campaign App E2E Flow', () => {

  //  TAGGED AS @index
  test('Test 1: Create campaigns @index', async ({ page }) => {
    console.log("Running Test 1: Create campaigns @index");
    await page.goto(APP_URL + 'index.html');
    await expect(page).toHaveTitle(/Campaigns/);

    for (const campaign of campaignsData) {
      await page.locator('button', { hasText: 'Add Campaign' }).click();
      await expect(page.locator('.modal-title', { hasText: 'New Campaign' })).toBeVisible();
      await page.waitForTimeout(500);

      await page.locator('#cName').fill(campaign.name);
      await page.locator('#cStart').fill(campaign.start);
      await page.locator('#cEnd').fill(campaign.end);
      await page.locator('#cChannel').fill(campaign.channel);

      await page.locator('button', { hasText: 'Save' }).click();
      await expect(page.locator('#campaignModal')).toBeHidden();

      await expect(page.locator('tr', { hasText: campaign.name })).toBeVisible();
    }
    await page.screenshot({ path: 'screenshots/campaign-list-complete.png', fullPage: true });
  });

  //  TAGGED AS @detail
  test('Test 2: Add products to campaign @detail', async ({ page }) => {
    console.log("Running Test 2: Add products to campaign @detail");
    const targetCampaign = campaignsData[0];
    const dummyId = '123456789';
    targetCampaign.id = dummyId;

    // Isolate test: Inject campaign into localStorage directly
    await page.goto(APP_URL);
    await page.evaluate((campaign) => {
      localStorage.setItem('campaigns', JSON.stringify([campaign]));
    }, targetCampaign);

    // Go straight to detail page
    await page.goto(`${APP_URL}detail.html?id=${dummyId}`);
    await expect(page.locator('#pageTitle', { hasText: /Products for Campaign/ })).toBeVisible();

    const myProducts = productsData.filter((p: any) => p.campaignName === targetCampaign.name);

    for (const product of myProducts) {
      await page.locator('button', { hasText: 'Add Product' }).click();
      await expect(page.locator('.modal-title', { hasText: 'New Product' })).toBeVisible();
      await page.waitForTimeout(500);

      await page.locator('#pNumber').fill(product.number);
      await page.locator('#pName').fill(product.name);
      await page.locator('#pCategory').fill(product.category);
      await page.locator('#pDesc').fill(product.desc);
      await page.locator('#pQty').fill(product.qty);

      await page.locator('button', { hasText: 'Save' }).click();
      await expect(page.locator('#productModal')).toBeHidden();

      await expect(page.locator('tr', { hasText: product.name })).toBeVisible();
    }
    await page.screenshot({ path: 'screenshots/detail-complete.png', fullPage: true });
  });
});