import { test, expect } from '@playwright/test';

test('Public Certificate Verification', async ({ page }) => {
  await page.goto('/verifications/sample-code');

  await expect(page.locator('body')).toBeVisible();
});
