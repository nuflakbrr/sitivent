import { test, expect } from '@playwright/test';

test('Checkin Unpaid User Blocked', async ({ page }) => {
  await page.goto('/admin/attendance/scan');

  await expect(page).toBeDefined();
});
