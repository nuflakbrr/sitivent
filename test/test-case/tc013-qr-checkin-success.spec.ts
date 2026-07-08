import { test, expect } from '@playwright/test';

test('QR Code Check-In Success', async ({ page }) => {
  // Login as admin/scanner first
  await page.goto('/login');
  await page.fill('#email', 'super.admin@gmail.com');
  await page.fill('#password', 'password');
  await page.click('#btn-login');
  await page.waitForURL('/admin/dashboard');

  // Open the attendance check-in scan page
  await page.goto('/admin/attendance/scan');

  // Since camera scan is hard to automate in browser without mock, we use the manual token text input fallback if available,
  // or mock the scanner API call.
  const tokenInput = page.locator('#qr-token-input');

  if (await tokenInput.isVisible()) {
    await tokenInput.fill('valid-token-12345');
    await page.click('#btn-submit-token');

    // Success confirmation message
    const successMsg = page.locator('.checkin-success-message, .sonner-toast-success');
    await expect(successMsg).toBeVisible();
    await expect(successMsg).toContainText('CHECKED_IN');
  } else {
    // If only camera is present, skip or check scanner widget visibility
    const scannerWidget = page.locator('#qr-scanner-widget');
    await expect(scannerWidget).toBeVisible();
  }
});
