import { test, expect } from '@playwright/test';

test('Password Change Success', async ({ page }) => {
  await page.goto('/participant/profile');

  const oldPassword = page.locator('#currentPassword, input[name="currentPassword"]');
  if (await oldPassword.isVisible()) {
    await oldPassword.fill('Password123');
    await page.fill('#newPassword, input[name="newPassword"]', 'PasswordBaru456');
    await page.fill('#confirmPassword, input[name="confirmPassword"]', 'PasswordBaru456');
    await page.click('button:has-text("Ubah Password"), button[type="submit"]');

    const toast = page.locator(".sonner-toast, [role='status']");
    await expect(toast).toBeVisible();
  }
});
