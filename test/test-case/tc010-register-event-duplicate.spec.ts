import { test, expect } from '@playwright/test';

test('Double Registration Guard', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('#email', 'peserta@gmail.com');
  await page.fill('#password', 'Password123');
  await page.click('#btn-login');
  await page.waitForURL('/participant/dashboard');

  // Go to the event that is already registered
  await page.goto('/events/event-gratis-1');

  // The register button should be disabled, or contain text indicating already registered
  const registerBtn = page.locator('#btn-register-event');

  const isButtonDisabled = await registerBtn.isDisabled();
  const buttonText = await registerBtn.innerText();

  if (isButtonDisabled || buttonText.toLowerCase().includes('terdaftar')) {
    // Correct behavior: UI blocks registration
    expect(true).toBe(true);
  } else {
    // If clickable, action should return a validation error toast
    await registerBtn.click();

    const confirmBtn = page.locator('#btn-confirm-registration');
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
    }

    const errorToast = page.locator(".sonner-toast-error, [role='status']");
    await expect(errorToast).toBeVisible();
  }
});
