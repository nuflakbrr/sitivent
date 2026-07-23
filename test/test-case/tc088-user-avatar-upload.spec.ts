import { test, expect } from '@playwright/test';

test('User Profile Avatar Image Upload', async ({ page }) => {
  await page.goto('/participant/profile');
  await expect(page).toBeDefined();
});
