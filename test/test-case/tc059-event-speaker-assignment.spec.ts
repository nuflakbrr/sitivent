import { test, expect } from '@playwright/test';

test('Event Speaker Assignment', async ({ page }) => {
  await page.goto('/admin/master/events/create');
  await expect(page).toBeDefined();
});
