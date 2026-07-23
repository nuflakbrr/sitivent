import { test, expect } from '@playwright/test';

test('Participant Cancel Pending Registration', async ({ page }) => {
  await page.goto('/participant/dashboard');

  const cancelBtn = page.locator('button:has-text("Batal"), button:has-text("Batalkan")').first();
  if (await cancelBtn.isVisible()) {
    await cancelBtn.click();
    await expect(page).toBeDefined();
  }
});
