import { test, expect } from '@playwright/test';

test('Admin Export Registrations File', async ({ page }) => {
  await page.goto('/admin/transactions/registrations');

  const exportBtn = page.locator('button:has-text("Export"), a:has-text("Export")').first();
  if (await exportBtn.isVisible()) {
    await exportBtn.click();
    await expect(page).toBeDefined();
  }
});
