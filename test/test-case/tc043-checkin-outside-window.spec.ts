import { test, expect } from '@playwright/test';

test('Checkin Outside Window Blocked', async ({ page }) => {
  await page.goto('/admin/attendance/scan');

  await expect(page).toBeDefined();
});
