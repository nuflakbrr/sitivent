import { test, expect } from '@playwright/test';

test('Forgot Password Request', async ({ page }) => {
  await page.goto('/forgot-password');

  await page.fill('#email, input[type="email"]', 'peserta@gmail.com');
  await page.click('button[type="submit"]');

  const toastOrMessage = page.locator(".sonner-toast, [role='status'], text=dikirim");
  await expect(toastOrMessage).toBeVisible();
});
