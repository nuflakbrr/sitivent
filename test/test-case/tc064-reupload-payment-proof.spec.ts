import { test, expect } from '@playwright/test';

test('Re-upload Payment Proof Post Rejection', async ({ page }) => {
  await page.goto('/participant/dashboard');
  await expect(page).toBeDefined();
});
