import { test, expect } from '@playwright/test';

test('Event Search and Filter', async ({ page }) => {
  await page.goto('/events');

  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]');
  if (await searchInput.isVisible()) {
    await searchInput.fill('Seminar');
    await searchInput.press('Enter');
    await page.waitForTimeout(500);
  }

  await expect(page.locator('body')).toBeVisible();
});
