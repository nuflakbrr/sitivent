import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test('Upload Payment Proof Success', async ({ page }) => {
  // Create a dummy image file for upload testing if it does not exist
  const dummyFilePath = path.join(process.cwd(), 'test', 'dummy-proof.png');
  if (!fs.existsSync(dummyFilePath)) {
    fs.writeFileSync(dummyFilePath, 'dummy-image-content');
  }

  // Login first
  await page.goto('/login');
  await page.fill('#email', 'peserta@gmail.com');
  await page.fill('#password', 'Password123');
  await page.click('#btn-login');
  await page.waitForURL('/participant/dashboard');

  // Open upload proof form/modal
  await page.click('#btn-upload-proof-event-berbayar-1');

  // Upload file
  await page.setInputFiles("input[type='file']", dummyFilePath);

  // Submit proof
  await page.click('#btn-submit-proof');

  // Success toast
  const successToast = page.locator(".sonner-toast-success, [role='status']");
  await expect(successToast).toBeVisible();

  // Clean up dummy file
  if (fs.existsSync(dummyFilePath)) {
    fs.unlinkSync(dummyFilePath);
  }
});
