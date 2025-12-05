import { test, expect } from '@playwright/test';

test.describe('Page d\'accueil', () => {
  test('devrait charger la page d\'accueil', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Sionohmair Insight Academy/);
  });

  test('devrait afficher le hero section', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('h1').first();
    await expect(hero).toBeVisible();
  });

  test('devrait avoir un CTA vers le Sprint de Clarté', async ({ page }) => {
    await page.goto('/');
    const ctaButton = page.getByRole('link', { name: /Sprint de Clarté/i });
    await expect(ctaButton).toBeVisible();
  });
});
