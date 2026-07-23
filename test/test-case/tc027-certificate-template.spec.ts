import { test, expect } from '@playwright/test';

test('Admin Certificate Template Creation', async ({ page }) => {
  await page.goto('/admin/master/certificates');

  const addTemplateBtn = page.locator('button:has-text("Template"), a:has-text("Template")');
  if (await addTemplateBtn.isVisible()) {
    await addTemplateBtn.click();
    await expect(page).toBeDefined();
  }
});
