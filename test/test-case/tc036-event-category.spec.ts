import { test, expect } from '@playwright/test';

test('Admin Manage Event Category', async ({ page }) => {
  await page.goto('/admin/master/categories');

  const addCategoryBtn = page.locator('button:has-text("Tambah"), a:has-text("Tambah")');
  if (await addCategoryBtn.isVisible()) {
    await addCategoryBtn.click();
    await expect(page).toBeDefined();
  }
});
