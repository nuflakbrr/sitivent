import { test, expect } from '@playwright/test';

test('Register Participant Duplicate Email', async ({ page }) => {
  await page.goto('/register');

  await page.fill('#name', 'Peserta Duplikat');
  await page.fill('#email', 'peserta@gmail.com');
  await page.fill('#password', 'Password123');
  await page.fill('#passwordConfirmation', 'Password123');

  await page.click('#btn-register');

  // Should remain on register page
  await expect(page).toHaveURL('/register');

  // Error toast should appear
  const errorToast = page.locator(".sonner-toast-error, [role='status']");
  await expect(errorToast).toBeVisible();
});
