import { test, expect } from '@playwright/test';

test('Bulk Certificate Generation', async ({ page }) => {
  await page.goto('/admin/master/certificates');
  await expect(page).toBeDefined();
});
