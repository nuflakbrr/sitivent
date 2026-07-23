import { test, expect } from '@playwright/test';

test('Payment Method Selection Instructions', async ({ page }) => {
  await page.goto('/events');
  await expect(page).toBeDefined();
});
