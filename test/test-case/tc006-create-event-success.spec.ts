import { test, expect } from '@playwright/test';

test('Create Offline Event Success', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('#email', 'super.admin@gmail.com');
  await page.fill('#password', 'password');
  await page.click('#btn-login');
  await page.waitForURL('/admin/dashboard');

  // Go to create event page
  await page.goto('/admin/events/new');

  await page.fill('#title', 'Seminar AI Terapan');
  await page.fill('#slug', 'seminar-ai-terapan');
  await page.fill('#description', 'Seminar membahas penerapan kecerdasan buatan dalam industri.');
  await page.selectOption('#eventType', 'OFFLINE');
  await page.fill('#location', 'Auditorium Kampus A');
  await page.fill('#quota', '100');
  await page.fill('#price', '50000');
  await page.fill('#startDate', '2026-10-10');
  await page.fill('#endDate', '2026-10-10');
  await page.fill('#startTime', '09:00');
  await page.fill('#endTime', '12:00');
  await page.fill('#registrationDeadline', '2026-10-09');

  await page.click('#btn-submit-event');

  await page.waitForURL('/admin/events');
  await expect(page).toHaveURL('/admin/events');

  const successToast = page.locator(".sonner-toast-success, [role='status']");
  await expect(successToast).toBeVisible();
});
