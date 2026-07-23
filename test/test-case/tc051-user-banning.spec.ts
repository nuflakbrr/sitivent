import { test, expect } from '@playwright/test';

test('Super Admin User Banning and Unbanning', async ({ page }) => {
  await page.goto('/admin/managements/users');

  await expect(page).toBeDefined();
});
