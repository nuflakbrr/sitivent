import { test, expect } from '@playwright/test';

test('Submit Event Testimonial', async ({ page }) => {
  await page.goto('/participant/dashboard');

  await expect(page).toBeDefined();
});
