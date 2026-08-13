import { test, expect } from '@playwright/test';

test.describe('External E-Commerce Flow', () => {
  
  // We tag it with @swaglabs so you can filter it easily
  test('Should log in and add item to cart @swaglabs', async ({ page }) => {
    
    // 1. Navigate to the testing site
    await page.goto('https://www.saucedemo.com/');

    // 2. Log in using their public test credentials
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 3. Verify we successfully reached the inventory page
    await expect(page.locator('.title')).toHaveText('Products');

    // 4. Add the first item to the cart (Sauce Labs Backpack)
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // 5. Verify the shopping cart badge updated to '1'
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // 6. Go to the cart page
    await page.locator('.shopping_cart_link').click();

    // 7. Verify the backpack is actually inside the cart
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    
  });
});