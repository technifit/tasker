import test, { expect } from '@playwright/test';
import { $path } from 'remix-routes';

test('link to employee', async ({ page }) => {
  await page.goto($path('/'));

  // Click the get started link.
  await page.getByRole('link', { name: 'Link to Employee' }).click();

  // Expects page to have a heading with the name of Employee.
  await expect(page).toHaveTitle(/Employee/);
});
