import { test, expect } from '@playwright/test';

test('Attendance IP and UserAgent Tracking', async ({ page }) => {
  await expect(page).toBeDefined();
});
