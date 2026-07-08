import { test, expect } from '@playwright/test';

test('Download Certificate Success', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('#email', 'peserta@gmail.com');
  await page.fill('#password', 'Password123');
  await page.click('#btn-login');
  await page.waitForURL('/participant/dashboard');

  // Locate the download button for certificate
  const downloadBtn = page.locator('#btn-download-cert-event-gratis-1');
  await expect(downloadBtn).toBeVisible();

  // Handle the download event
  const [download] = await Promise.all([page.waitForEvent('download'), downloadBtn.click()]);

  // Assert suggested filename matches PDF extension
  const filename = download.suggestedFilename();
  expect(filename.endsWith('.pdf')).toBe(true);

  // Assert download completed
  const path = await download.path();
  expect(path).not.toBeNull();
});
