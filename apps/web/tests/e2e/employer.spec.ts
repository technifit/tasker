import test, { expect } from '@playwright/test';
import { $path } from 'remix-routes';

test('link to employer', async ({ page }) => {
  await page.goto($path('/'));

  // Click the get started link.
  await page.getByRole('link', { name: 'Link to Employer' }).click();

  // Expects page to have a heading with the name of Employer.
  await expect(page).toHaveTitle(/Employer/);
});
