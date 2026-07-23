import { test, expect } from '@playwright/test';

test('Register Invalid Short Password Error', async ({ page }) => {
  await page.goto('/register');

  await page.fill('#reg-name', 'User Pendek');
  await page.fill('#reg-email', 'shortpass@gmail.com');
  await page.fill('#reg-password', '123');

  await page.click('#btn-register-submit');

  const errorText = page.locator('text=minimal 8, text=Password');
  await expect(errorText).toBeVisible();
});
