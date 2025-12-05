import { test, expect } from '@playwright/test';

test.describe('Formulaire de contact', () => {
  test('devrait afficher le formulaire de réservation', async ({ page }) => {
    await page.goto('/reserver');
    await expect(page.getByLabel(/Nom/i)).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();
  });

  test('devrait valider les champs requis', async ({ page }) => {
    await page.goto('/reserver');
    await page.getByRole('button', { name: /Envoyer/i }).click();
    
    // Vérifier que le formulaire n'est pas soumis (validation HTML5)
    await expect(page).toHaveURL(/\/reserver/);
  });
});
