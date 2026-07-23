import { test, expect } from '@playwright/test';

test('Support Message Submission', async ({ page }) => {
  await page.goto('/help');

  const nameInput = page.locator('input[name="name"], #name');
  if (await nameInput.isVisible()) {
    await nameInput.fill('Penanya');
    await page.fill('input[name="email"], #email', 'penanya@gmail.com');
    await page.fill('input[name="subject"], #subject', 'Pertanyaan Sertifikat');
    await page.fill(
      'textarea[name="message"], #message',
      'Bagaimana cara mengunduh sertifikat digital?'
    );

    await page.click('button[type="submit"]');
    const toast = page.locator(".sonner-toast, [role='status']");
    await expect(toast).toBeVisible();
  }
});
