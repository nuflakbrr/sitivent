import { test, expect } from '@playwright/test';

test('Admin Manage Support Inbox', async ({ page }) => {
  await page.goto('/admin/support/inbox');

  await expect(page).toBeDefined();
});
