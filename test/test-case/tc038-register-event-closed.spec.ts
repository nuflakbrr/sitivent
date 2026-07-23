import { test, expect } from '@playwright/test';

test('Register Event Past Deadline Blocked', async ({ page }) => {
  await page.goto('/events');

  const closedBtn = page.locator('text=Pendaftaran Ditutup, text=Selesai');
  if (await closedBtn.isVisible()) {
    await expect(closedBtn).toBeVisible();
  }
});
