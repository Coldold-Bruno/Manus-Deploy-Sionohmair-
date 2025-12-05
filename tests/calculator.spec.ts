import { test, expect } from '@playwright/test';

test.describe('Calculateur de Score de Clarté', () => {
  test('devrait afficher le formulaire du calculateur', async ({ page }) => {
    await page.goto('/calculateur');
    const textarea = page.getByPlaceholder(/Collez votre message/i);
    await expect(textarea).toBeVisible();
  });

  test('devrait calculer un score après soumission', async ({ page }) => {
    await page.goto('/calculateur');
    
    const textarea = page.getByPlaceholder(/Collez votre message/i);
    await textarea.fill('Découvrez notre formation en marketing digital. Nous vous aidons à augmenter vos ventes grâce à des stratégies éprouvées. Nos clients ont vu leurs revenus augmenter de 150%. Inscrivez-vous maintenant !');
    
    await page.getByRole('button', { name: /Analyser/i }).click();
    
    // Attendre que le résultat s'affiche
    await expect(page.getByText(/Score de Clarté/i)).toBeVisible({ timeout: 10000 });
  });
});
