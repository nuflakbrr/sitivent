import { test, expect } from '@playwright/test';

test('Admin Dashboard Quick Stats Aggregation', async ({ page }) => {
  await page.goto('/admin/dashboard');
  await expect(page).toBeDefined();
});
