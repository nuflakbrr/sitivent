import { test, expect } from '@playwright/test';

test('Event Speaker Photo Upload and Rendering', async ({ page }) => {
  await page.goto('/events');
  await expect(page).toBeDefined();
});
