import { test, expect } from '@playwright/test';

test('Terms and Privacy Legal Pages Accessible', async ({ page }) => {
  await page.goto('/terms');
  await expect(page).toHaveURL('/terms');
  await page.goto('/privacy');
  await expect(page).toHaveURL('/privacy');
});
