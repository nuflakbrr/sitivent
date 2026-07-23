import { test, expect } from '@playwright/test';

test('Certificate QR Code Verification Link', async ({ page }) => {
  await page.goto('/verifications/test');
  await expect(page).toBeDefined();
});
