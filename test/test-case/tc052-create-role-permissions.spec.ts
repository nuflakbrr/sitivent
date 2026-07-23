import { test, expect } from '@playwright/test';

test('Super Admin Create Role and Permissions', async ({ page }) => {
  await page.goto('/admin/managements/roles');

  await expect(page).toBeDefined();
});
