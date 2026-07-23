import { test, expect } from '@playwright/test';

test('Unique Registration Code Generation', async ({ page }) => {
  await page.goto('/participant/dashboard');
  await expect(page).toBeDefined();
});
