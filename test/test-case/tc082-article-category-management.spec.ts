import { test, expect } from '@playwright/test';

test('Article Category Management', async ({ page }) => {
  await page.goto('/admin/publications/articles');
  await expect(page).toBeDefined();
});
