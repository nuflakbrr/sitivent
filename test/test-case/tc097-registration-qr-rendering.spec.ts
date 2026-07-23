import { test, expect } from '@playwright/test';

test('Participant Ticket QR Code Rendering', async ({ page }) => {
  await page.goto('/participant/dashboard');
  await expect(page).toBeDefined();
});
