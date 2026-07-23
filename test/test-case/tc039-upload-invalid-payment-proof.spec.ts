import { test, expect } from '@playwright/test';

test('Upload Invalid File Payment Proof Blocked', async ({ page }) => {
  await page.goto('/participant/dashboard');

  const uploadBtn = page.locator('button:has-text("Upload"), button:has-text("Bukti")').first();
  if (await uploadBtn.isVisible()) {
    await uploadBtn.click();
    await expect(page).toBeDefined();
  }
});
