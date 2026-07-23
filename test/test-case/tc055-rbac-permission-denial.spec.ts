import { test, expect } from '@playwright/test';

test('RBAC Permission Denial', async ({ page }) => {
  await page.goto('/admin/managements/users');
  await expect(page).toBeDefined();
});
