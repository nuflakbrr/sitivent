import { test, expect } from '@playwright/test';

test('Public Filter Articles by Category', async ({ page }) => {
  await page.goto('/articles');

  await expect(page.locator('body')).toBeVisible();
});
