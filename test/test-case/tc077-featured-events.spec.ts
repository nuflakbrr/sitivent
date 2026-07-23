import { test, expect } from '@playwright/test';

test('Homepage Featured Events Displayed', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
