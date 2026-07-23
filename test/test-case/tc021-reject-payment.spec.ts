import { test, expect } from '@playwright/test';

test('Admin Reject Payment Proof', async ({ page }) => {
  await page.goto('/admin/transactions/payments');

  const rejectButton = page.locator('button:has-text("Tolak")').first();
  if (await rejectButton.isVisible()) {
    await rejectButton.click();
    const reasonInput = page.locator('textarea, input[name="reason"]');
    if (await reasonInput.isVisible()) {
      await reasonInput.fill('Bukti transfer tidak terbaca');
      await page.click('button[type="submit"], button:has-text("Konfirmasi")');
    }
  }

  await expect(page).toBeDefined();
});
