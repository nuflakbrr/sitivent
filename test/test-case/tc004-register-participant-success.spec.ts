import { test, expect } from '@playwright/test';

test('Register Participant Success', async ({ page }) => {
  await page.goto('/register');

  await page.fill('#name', 'Peserta Baru');
  await page.fill('#email', 'pesertabaru@gmail.com');
  await page.fill('#password', 'Password123');
  await page.fill('#passwordConfirmation', 'Password123');

  await page.click('#btn-register');

  await page.waitForURL('/login');
  await expect(page).toHaveURL('/login');

  const successToast = page.locator(".sonner-toast-success, [role='status']");
  await expect(successToast).toBeVisible();
});
