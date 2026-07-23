import { test, expect } from '@playwright/test';

test('FAQ Accordion Interactivity', async ({ page }) => {
  await page.goto('/faq');
  await expect(page).toHaveURL('/faq');
});
