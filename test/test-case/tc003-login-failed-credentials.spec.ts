import { test, expect } from '@playwright/test';

test('Login Failed due to Invalid Credentials', async ({ page }) => {
  await page.goto('/login');

  await page.fill('#email', 'peserta@gmail.com');
  await page.fill('#password', 'PasswordSalah');

  await page.click('#btn-login');

  // URL should remain the same
  await expect(page).toHaveURL('/login');

  // Expect validation error message or error toast to appear
  const errorToast = page.locator(".sonner-toast-error, [role='status']");
  await expect(errorToast).toBeVisible();
});
