import { test, expect } from '@playwright/test';

test('Admin Verify Payment Paid Success', async ({ page }) => {
  // Login as admin first
  await page.goto('/login');
  await page.fill('#email', 'super.admin@gmail.com');
  await page.fill('#password', 'password');
  await page.click('#btn-login');
  await page.waitForURL('/admin/dashboard');

  // Go to payments administration page
  await page.goto('/admin/payments');

  // Find a pending verification payment row and open verification detail
  const pendingRow = page.locator('.payment-row-pending').first();
  await pendingRow.locator('.btn-view-payment').click();

  // Click Approve Button
  await page.click('#btn-approve-payment');

  // Confirm approve modal
  const confirmBtn = page.locator('#btn-confirm-approve');
  if (await confirmBtn.isVisible()) {
    await confirmBtn.click();
  }

  // Success message toast
  const successToast = page.locator(".sonner-toast-success, [role='status']");
  await expect(successToast).toBeVisible();

  // Verify status is now PAID
  const statusBadge = pendingRow.locator('.payment-status-badge');
  await expect(statusBadge).toHaveText('PAID');
});
