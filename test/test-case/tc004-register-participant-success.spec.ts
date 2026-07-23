import { test, expect } from '@playwright/test';

test('Register Participant Success', async ({ page }) => {
  await page.goto('/register');

  await page.fill('#reg-name', 'Peserta Baru');
  await page.fill('#reg-email', 'pesertabaru@gmail.com');
  await page.fill('#reg-password', 'Password123');

  await page.click('#btn-register-submit');

  await page.waitForURL('/login');
  await expect(page).toHaveURL('/login');

  const successToast = page.locator(".sonner-toast-success, [role='status']");
  await expect(successToast).toBeVisible();
});
