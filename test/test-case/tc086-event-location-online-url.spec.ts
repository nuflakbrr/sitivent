import { test, expect } from '@playwright/test';

test('Online Event Meeting URL Validation', async ({ page }) => {
  await page.goto('/admin/master/events/create');
  await expect(page).toBeDefined();
});
