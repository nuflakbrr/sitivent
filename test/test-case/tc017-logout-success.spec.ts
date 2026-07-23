import { test, expect } from '@playwright/test';

test('Logout Success and Reload', async ({ page }) => {
  await page.goto('/');

  // Assuming user clicks user avatar menu and clicks logout
  const userMenuButton = page
    .locator('header button')
    .filter({ has: page.locator('span, img') })
    .last();
  if (await userMenuButton.isVisible()) {
    await userMenuButton.click();
    const logoutItem = page.locator('text=Keluar');
    if (await logoutItem.isVisible()) {
      await logoutItem.click();
      const confirmButton = page.locator('button:has-text("Keluar"), button:has-text("Ya")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
    }
  }

  await expect(page).toHaveURL('/');
});
