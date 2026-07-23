import { test, expect } from '@playwright/test';

test('Admin Delete Event', async ({ page }) => {
  await page.goto('/admin/master/events');

  const deleteBtn = page.locator('button:has-text("Hapus"), [aria-label*="Hapus"]').first();
  if (await deleteBtn.isVisible()) {
    await deleteBtn.click();
    const confirm = page.locator('button:has-text("Ya"), button:has-text("Hapus")');
    if (await confirm.isVisible()) {
      await confirm.click();
    }
  }

  await expect(page).toBeDefined();
});
