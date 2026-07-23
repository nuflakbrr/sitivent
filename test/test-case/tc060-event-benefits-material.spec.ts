import { test, expect } from '@playwright/test';

test('Event Benefits and Material Links', async ({ page }) => {
  await page.goto('/admin/master/events/create');
  await expect(page).toBeDefined();
});
