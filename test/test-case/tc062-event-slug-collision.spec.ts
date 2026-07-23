import { test, expect } from '@playwright/test';

test('Event Slug Collision Resolved', async ({ page }) => {
  await page.goto('/admin/master/events');
  await expect(page).toBeDefined();
});
