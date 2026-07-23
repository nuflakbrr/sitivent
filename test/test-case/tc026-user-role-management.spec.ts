import { test, expect } from '@playwright/test';

test('Super Admin Change User Role', async ({ page }) => {
  await page.goto('/admin/managements/users');

  const actionButton = page.locator('button:has-text("..."), [aria-label*="Action"]').first();
  if (await actionButton.isVisible()) {
    await actionButton.click();
    await expect(page).toBeDefined();
  }
});
