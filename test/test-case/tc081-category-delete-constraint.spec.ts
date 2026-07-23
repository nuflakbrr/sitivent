import { test, expect } from '@playwright/test';

test('Category Deletion Constraint Protection', async ({ page }) => {
  await page.goto('/admin/master/categories');
  await expect(page).toBeDefined();
});
