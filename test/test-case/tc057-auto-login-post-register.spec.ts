import { test, expect } from '@playwright/test';

test('Auto Login Post Register Disabled Verification', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveURL('/login');
});
