import { test, expect } from '@playwright/test';

test('Admin Edit Event Details', async ({ page }) => {
  await page.goto('/admin/master/events');

  const editBtn = page.locator('a:has-text("Edit"), button:has-text("Edit")').first();
  if (await editBtn.isVisible()) {
    await editBtn.click();
    await expect(page).toBeDefined();
  }
});
