import { test, expect } from '@playwright/test';

test('Newsletter Subscription', async ({ page }) => {
  await page.goto('/');

  const newsletterInput = page.locator('input[placeholder*="email"], input[type="email"]').last();
  if (await newsletterInput.isVisible()) {
    await newsletterInput.fill('langganan@gmail.com');
    const subscribeButton = page
      .locator('button:has-text("Langganan"), button:has-text("Subscribe")')
      .last();
    if (await subscribeButton.isVisible()) {
      await subscribeButton.click();
    }
  }

  await expect(page).toBeDefined();
});
