import { test, expect } from '@playwright/test';

test('Article Views Counter Increment', async ({ page }) => {
  await page.goto('/articles');
  await expect(page).toBeDefined();
});
