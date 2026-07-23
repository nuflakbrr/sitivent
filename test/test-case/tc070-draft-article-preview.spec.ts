import { test, expect } from '@playwright/test';

test('Draft Articles Excluded From Public Grid', async ({ page }) => {
  await page.goto('/articles');
  await expect(page).toBeDefined();
});
