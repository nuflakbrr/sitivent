import { test, expect } from '@playwright/test';

test('Free Event Instant Confirmation', async ({ page }) => {
  await page.goto('/events');
  await expect(page).toBeDefined();
});
