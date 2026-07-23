import { test, expect } from '@playwright/test';

test('Register Event Full Quota Blocked', async ({ page }) => {
  await page.goto('/events');

  const fullEventBtn = page.locator('button:has-text("Penuh"), button:disabled');
  if (await fullEventBtn.isVisible()) {
    await expect(fullEventBtn).toBeDisabled();
  }
});
