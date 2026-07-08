import { test, expect } from '@playwright/test';

test('Admin Login Success', async ({ page }) => {
  await page.goto('/login');

  await page.fill('#email', 'super.admin@gmail.com');
  await page.fill('#password', 'password');

  await page.click('#btn-login');

  await page.waitForURL('/admin/dashboard');
  await expect(page).toHaveURL('/admin/dashboard');

  const sidebar = page.locator('#admin-sidebar');
  await expect(sidebar).toBeVisible();
});
