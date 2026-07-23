import { test, expect } from '@playwright/test';

test('Login Empty Inputs Validation Error', async ({ page }) => {
  await page.goto('/login');

  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/login');
});
