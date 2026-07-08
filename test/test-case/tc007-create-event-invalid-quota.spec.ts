import { test, expect } from '@playwright/test';

test('Create Event Fails due to Negative Quota', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('#email', 'super.admin@gmail.com');
  await page.fill('#password', 'password');
  await page.click('#btn-login');
  await page.waitForURL('/admin/dashboard');

  await page.goto('/admin/events/new');

  await page.fill('#title', 'Seminar AI Gagal');
  await page.fill('#slug', 'seminar-ai-gagal');
  await page.fill('#quota', '-10');

  await page.click('#btn-submit-event');

  // URL should remain on create page
  await expect(page).toHaveURL('/admin/events/new');

  // Error validation message should be visible
  const quotaError = page.locator('#quota-error, .text-destructive, .sonner-toast-error');
  await expect(quotaError).toBeVisible();
});
