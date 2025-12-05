import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('devrait naviguer vers la page Services', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Services/i }).click();
    await expect(page).toHaveURL(/\/services/);
  });

  test('devrait naviguer vers la page Ressources', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Ressources/i }).click();
    await expect(page).toHaveURL(/\/ressources/);
  });

  test('devrait naviguer vers le Calculateur', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Calculateur/i }).click();
    await expect(page).toHaveURL(/\/calculateur/);
  });
});
