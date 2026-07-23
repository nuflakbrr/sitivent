import { test, expect } from '@playwright/test';

test('Participant Profile Update', async ({ page }) => {
  await page.goto('/participant/profile');

  const nameInput = page.locator('#name, input[name="name"]');
  if (await nameInput.isVisible()) {
    await nameInput.fill('Peserta Terbaru');
    await page.click('button[type="submit"]');

    const toast = page.locator(".sonner-toast-success, [role='status']");
    await expect(toast).toBeVisible();
  }
});
