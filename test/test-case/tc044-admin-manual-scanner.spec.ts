import { test, expect } from '@playwright/test';

test('Admin Manual QR Scanner', async ({ page }) => {
  await page.goto('/admin/attendance/scan');

  await expect(page.locator('body')).toBeVisible();
});
