import { test, expect } from '@playwright/test';

test('QR Code Already Used Guard', async ({ page }) => {
  // Login as admin/scanner first
  await page.goto('/login');
  await page.fill('#email', 'super.admin@gmail.com');
  await page.fill('#password', 'password');
  await page.click('#btn-login');
  await page.waitForURL('/admin/dashboard');

  // Open scan page
  await page.goto('/admin/attendance/scan');

  const tokenInput = page.locator('#qr-token-input');

  if (await tokenInput.isVisible()) {
    await tokenInput.fill('used-token-99999');
    await page.click('#btn-submit-token');

    // Expect error message indicating already checked in
    const errorToast = page.locator(".sonner-toast-error, .sonner-toast-warning, [role='status']");
    await expect(errorToast).toBeVisible();
    await expect(errorToast).toContainText('QR_ALREADY_USED');
  }
});
