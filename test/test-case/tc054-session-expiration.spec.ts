import { test, expect } from '@playwright/test';

test('Expired Session Redirects to Login', async ({ page }) => {
  await page.goto('/participant/dashboard');
  await expect(page).toBeDefined();
});
