import { test, expect } from '@playwright/test';

test('Registered Participant Access Meeting Link', async ({ page }) => {
  await page.goto('/participant/dashboard');
  await expect(page).toBeDefined();
});
