import { test, expect } from '@playwright/test';

test('Register Paid Event Success', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('#email', 'peserta@gmail.com');
  await page.fill('#password', 'Password123');
  await page.click('#btn-login');
  await page.waitForURL('/participant/dashboard');

  // Go to paid event page
  await page.goto('/events/event-berbayar-1');

  // Click register button
  await page.click('#btn-register-event');

  // Confirm registration
  const confirmBtn = page.locator('#btn-confirm-registration');
  if (await confirmBtn.isVisible()) {
    await confirmBtn.click();
  }

  // Expect success toast and redirect to dashboard/payment-instruction page
  await page.waitForURL(/\/participant\/dashboard|\/payments\/.*/);

  const successToast = page.locator(".sonner-toast-success, [role='status']");
  await expect(successToast).toBeVisible();

  // Go to dashboard and verify status is WAITING_PAYMENT
  await page.goto('/participant/dashboard');
  const statusBadge = page.locator('#status-event-berbayar-1');
  await expect(statusBadge).toHaveText('WAITING_PAYMENT');
});
