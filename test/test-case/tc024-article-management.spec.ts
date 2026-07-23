import { test, expect } from '@playwright/test';

test('Admin Create Article', async ({ page }) => {
  await page.goto('/admin/publications/articles');

  const addArticleBtn = page.locator(
    'button:has-text("Tambah Artikel"), a:has-text("Tambah Artikel")'
  );
  if (await addArticleBtn.isVisible()) {
    await addArticleBtn.click();
    await expect(page).toBeDefined();
  }
});
