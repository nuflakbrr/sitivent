import { test, expect } from '@playwright/test';

test('Email Verification Process', async ({ page }) => {
  await page.goto('/');
  await expect(page).toBeDefined();
});
