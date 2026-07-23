import { test, expect } from '@playwright/test';

test('Reset Password Invalid Token Rejected', async ({ page }) => {
  await page.goto('/reset-password?token=invalid-token-123');

  const passwordInput = page.locator('#password, input[type="password"]');
  if (await passwordInput.isVisible()) {
    await passwordInput.fill('PasswordBaru123');
    await page.click('button[type="submit"]');

    const toast = page.locator(".sonner-toast-error, [role='status'], text=invalid");
    await expect(toast).toBeVisible();
  }
});
