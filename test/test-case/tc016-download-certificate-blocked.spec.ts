import { test, expect } from '@playwright/test';

test('Certificate Download Blocked for Non-Attendees', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('#email', 'peserta@gmail.com');
  await page.fill('#password', 'Password123');
  await page.click('#btn-login');
  await page.waitForURL('/participant/dashboard');

  // Locate the download button for certificate for event-gratis-2 (where attendee did not check in)
  const downloadBtn = page.locator('#btn-download-cert-event-gratis-2');

  // The button should NOT be visible or exist in the DOM
  await expect(downloadBtn).not.toBeVisible();

  // Try direct API / page navigation access to check if it's blocked by server
  const response = await page.goto('/api/certificates/event-gratis-2/download');

  // Expect Forbidden (403), Unauthorized (401), or Bad Request (400) status code from direct fetch
  if (response) {
    const status = response.status();
    expect(status === 403 || status === 401 || status === 400 || status === 404).toBe(true);
  }
});
