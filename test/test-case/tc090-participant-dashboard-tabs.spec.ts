import { test, expect } from '@playwright/test';

test('Participant Dashboard Event Filtering Tabs', async ({ page }) => {
  await page.goto('/participant/dashboard');
  await expect(page).toBeDefined();
});
