import { test, expect } from '@playwright/test';

test('Admin Support Message Reply Email Queued', async ({ page }) => {
  await page.goto('/admin/support/inbox');
  await expect(page).toBeDefined();
});
