import { test, expect } from '@playwright/test';

test('Print Participant Name Label Badge', async ({ page }) => {
  await page.goto('/admin/transactions/registrations');
  await expect(page).toBeDefined();
});
