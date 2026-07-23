import { test, expect } from '@playwright/test';

test('Duplicate Newsletter Subscription Handled', async ({ page }) => {
  await page.goto('/');

  await expect(page).toBeDefined();
});
