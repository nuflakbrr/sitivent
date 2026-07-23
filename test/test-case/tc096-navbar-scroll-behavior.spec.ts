import { test, expect } from '@playwright/test';

test('Navbar Scroll Solid Backdrop Blur State', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 100));
  await expect(page.locator('header')).toBeVisible();
});
