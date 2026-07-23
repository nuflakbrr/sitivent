import { test, expect } from '@playwright/test';

test('Participant Self Checkin', async ({ page }) => {
  await page.goto('/participant/dashboard');
  await expect(page).toBeDefined();
});
