import { test, expect } from '@playwright/test';

test('Banned User Login Blocked', async ({ page }) => {
  await page.goto('/login');

  await page.fill('#email, input[type="email"]', 'banneduser@gmail.com');
  await page.fill('#password, input[type="password"]', 'Password123');
  await page.click('button[type="submit"]');

  const errorMsg = page.locator(".sonner-toast-error, [role='status'], text=banned");
  await expect(errorMsg).toBeVisible();
});
