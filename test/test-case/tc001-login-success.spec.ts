import { test, expect } from '@playwright/test';

test('Participant Login Success', async ({ page }) => {
  await page.goto('/login');

  await page.fill('#email', 'peserta@gmail.com');
  await page.fill('#password', 'Password123');

  await page.click('#btn-login');

  await page.waitForURL('/participant/dashboard');
  await expect(page).toHaveURL('/participant/dashboard');

  const greeting = page.locator('#dashboard-title');
  await expect(greeting).toBeVisible();
});
