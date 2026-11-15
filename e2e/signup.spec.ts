import { expect, test } from '@playwright/test';

test('signs a user up end to end', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/signup$/);

  await page.getByLabel('First name').fill('Ada');
  await page.getByLabel('Last name').fill('Lovelace');
  await page.getByLabel('Email address').fill('Ada@Example.com ');
  await page.getByRole('button', { name: 'Sign up' }).click();

  const heading = page.getByRole('heading', { name: /signed up/i });
  await expect(heading).toBeVisible();
  await expect(heading).toBeFocused();
  await expect(page.getByText('ada@example.com')).toBeVisible();
});

test('blocks an empty submit and focuses the first invalid field', async ({ page }) => {
  await page.goto('/signup');

  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(page.getByLabel('First name')).toBeFocused();
  await expect(page.getByText('Enter your first name')).toBeVisible();
  await expect(page.getByRole('heading', { name: /signed up/i })).toHaveCount(0);
});

test('restarts with an empty, focused form after success', async ({ page }) => {
  await page.goto('/signup');

  await page.getByLabel('First name').fill('Ada');
  await page.getByLabel('Last name').fill('Lovelace');
  await page.getByLabel('Email address').fill('ada@example.com');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(page.getByRole('heading', { name: /signed up/i })).toBeVisible();

  await page.getByRole('button', { name: 'Sign up someone else' }).click();

  await expect(page.getByLabel('First name')).toHaveValue('');
  await expect(page.getByLabel('First name')).toBeFocused();
});
