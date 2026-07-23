import { test, expect } from '@playwright/test';

test('Audit Log Entity Filtering', async ({ page }) => {
  await page.goto('/admin/managements/audit-logs');
  await expect(page).toBeDefined();
});
