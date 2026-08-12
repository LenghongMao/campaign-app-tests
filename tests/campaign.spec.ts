import { test, expect } from '@playwright/test';

const APP_URL = 'https://lenghongmao.github.io/Campaign-app/';

test.describe('Campaign App Tests', () => {
  test('should load the campaign list page correctly', async ({ page }) => {
    await page.goto(APP_URL);
    await expect(page).toHaveTitle(/Campaigns/);

    const heading = page.locator('h2', { hasText: 'Campaign List' });
    await expect(heading).toBeVisible();
  });

  test('should open the Add Campaign modal', async ({ page }) => {
    await page.goto(APP_URL);
    await page.locator('button', { hasText: 'Add Campaign' }).click();

    const modalTitle = page.locator('.modal-title', { hasText: 'New Campaign' });
    await expect(modalTitle).toBeVisible();
  });
});