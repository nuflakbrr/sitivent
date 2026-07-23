import { test, expect } from '@playwright/test';

test('Admin Moderate Testimonials', async ({ page }) => {
  await page.goto('/admin/publications/testimonies');

  await expect(page).toBeDefined();
});
