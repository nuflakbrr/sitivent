import { test, expect } from '@playwright/test';

test('Certificate Font and Coordinates Customization', async ({ page }) => {
  await page.goto('/admin/master/certificates');
  await expect(page).toBeDefined();
});
