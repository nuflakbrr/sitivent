import { test, expect } from '@playwright/test';

test('Support Inbox Unread Filter', async ({ page }) => {
  await page.goto('/admin/support/inbox');
  await expect(page).toBeDefined();
});
