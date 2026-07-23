import { test, expect } from '@playwright/test';

test('Unauthorized Admin Page Access Blocked', async ({ page }) => {
  await page.goto('/admin/dashboard');

  await expect(page).not.toHaveURL('/admin/dashboard');
});
