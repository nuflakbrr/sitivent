import { test, expect } from '@playwright/test';

test('Register Free Event Success', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('#email', 'peserta@gmail.com');
  await page.fill('#password', 'Password123');
  await page.click('#btn-login');
  await page.waitForURL('/participant/dashboard');

  // Go to free event page
  await page.goto('/events/event-gratis-1');

  // Click register button
  await page.click('#btn-register-event');

  // Confirm registration if modal appears
  const confirmBtn = page.locator('#btn-confirm-registration');
  if (await confirmBtn.isVisible()) {
    await confirmBtn.click();
  }

  // Expect success toast and redirection
  await page.waitForURL('/participant/dashboard');
  await expect(page).toHaveURL('/participant/dashboard');

  const successToast = page.locator(".sonner-toast-success, [role='status']");
  await expect(successToast).toBeVisible();

  // Verify status is REGISTERED
  const statusBadge = page.locator('#status-event-gratis-1');
  await expect(statusBadge).toHaveText('REGISTERED');
});
