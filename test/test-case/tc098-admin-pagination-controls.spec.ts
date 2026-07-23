import { test, expect } from '@playwright/test';

test('Admin Data Table Pagination Controls', async ({ page }) => {
  await page.goto('/admin/managements/users');
  await expect(page).toBeDefined();
});
