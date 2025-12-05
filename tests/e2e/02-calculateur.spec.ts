import { test, expect } from './fixtures';

/**
 * Tests E2E - Calculateur de Score de Clarté
 * Vérifie le fonctionnement complet du calculateur PFPMA
 */

test.describe('Calculateur de Score de Clarté', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculateur');
  });

  test('devrait afficher le formulaire du calculateur', async ({ page }) => {
    // Vérifier le titre
    await expect(page.locator('h1')).toContainText(/Calculateur|Score de Clarté/i);
    
    // Vérifier que le champ de texte est présent
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    await expect(textarea).toBeEditable();
    
    // Vérifier que le bouton d'analyse est présent
    const analyzeButton = page.locator('button:has-text("Analyser"), button:has-text("Calculer")');
    await expect(analyzeButton).toBeVisible();
  });

  test('devrait analyser un message et afficher un score', async ({ page }) => {
    // Remplir le champ avec un message de test
    const testMessage = `
      Vous perdez des clients parce que votre message n'est pas clair.
      Notre formule PFPMA transforme votre communication en 5 étapes.
      Nous avons aidé 50+ entreprises à augmenter leur taux de conversion de 40%.
      Réservez votre Sprint de Clarté pour 490€ et obtenez un message qui convertit.
      Cliquez ici pour commencer maintenant.
    `;
    
    await page.fill('textarea', testMessage);
    
    // Cliquer sur le bouton d'analyse
    await page.click('button:has-text("Analyser"), button:has-text("Calculer")');
    
    // Attendre que les résultats s'affichent
    await page.waitForSelector('text=/Score|Résultat/i', { timeout: 10000 });
    
    // Vérifier qu'un score est affiché (format /20)
    await expect(page.locator('text=/\\d+\\/20|Score.*:\\s*\\d+/i')).toBeVisible();
    
    // Vérifier que l'analyse PFPMA est affichée
    await expect(page.locator('text=/Problème|Formule|Preuve|Méthode|Appel/i')).toBeVisible();
  });

  test('devrait afficher les frictions détectées', async ({ page }) => {
    const testMessage = `
      Notre produit est le meilleur du marché.
      Achetez maintenant.
    `;
    
    await page.fill('textarea', testMessage);
    await page.click('button:has-text("Analyser"), button:has-text("Calculer")');
    
    // Attendre les résultats
    await page.waitForSelector('text=/Score|Résultat/i', { timeout: 10000 });
    
    // Vérifier que les frictions sont mentionnées
    await expect(page.locator('text=/Friction|Attention|Cognitive|Émotionnelle/i')).toBeVisible();
  });

  test('devrait afficher des recommandations', async ({ page }) => {
    const testMessage = `
      Vous avez un problème de communication.
      Nous avons la solution.
    `;
    
    await page.fill('textarea', testMessage);
    await page.click('button:has-text("Analyser"), button:has-text("Calculer")');
    
    // Attendre les résultats
    await page.waitForSelector('text=/Score|Résultat/i', { timeout: 10000 });
    
    // Vérifier que des recommandations sont affichées
    await expect(page.locator('text=/Recommandation|Amélioration|Conseil/i')).toBeVisible();
  });

  test('devrait proposer un CTA vers le Sprint de Clarté', async ({ page }) => {
    const testMessage = `
      Notre service aide les entreprises.
      Contactez-nous pour en savoir plus.
    `;
    
    await page.fill('textarea', testMessage);
    await page.click('button:has-text("Analyser"), button:has-text("Calculer")');
    
    // Attendre les résultats
    await page.waitForSelector('text=/Score|Résultat/i', { timeout: 10000 });
    
    // Vérifier qu'un CTA vers le Sprint est présent
    const ctaButton = page.locator('a[href="/sprint-clarte"], button:has-text("Sprint de Clarté")');
    await expect(ctaButton).toBeVisible();
  });

  test('devrait gérer un champ vide', async ({ page }) => {
    // Cliquer sur le bouton sans remplir le champ
    await page.click('button:has-text("Analyser"), button:has-text("Calculer")');
    
    // Vérifier qu'un message d'erreur ou de validation est affiché
    await expect(page.locator('text=/requis|obligatoire|vide|minimum/i')).toBeVisible();
  });

  test('devrait gérer un message trop court', async ({ page }) => {
    // Remplir avec un message très court
    await page.fill('textarea', 'Test');
    await page.click('button:has-text("Analyser"), button:has-text("Calculer")');
    
    // Vérifier qu'un message d'erreur est affiché
    await expect(page.locator('text=/trop court|minimum|caractères/i')).toBeVisible();
  });

  test('devrait permettre de réinitialiser le formulaire', async ({ page }) => {
    // Remplir le champ
    await page.fill('textarea', 'Message de test pour le calculateur');
    
    // Vérifier que le champ est rempli
    await expect(page.locator('textarea')).toHaveValue(/Message de test/);
    
    // Chercher un bouton de réinitialisation
    const resetButton = page.locator('button:has-text("Réinitialiser"), button:has-text("Effacer"), button[type="reset"]');
    
    // Si le bouton existe, le cliquer
    if (await resetButton.count() > 0) {
      await resetButton.click();
      
      // Vérifier que le champ est vide
      await expect(page.locator('textarea')).toHaveValue('');
    }
  });

  test('devrait afficher un exemple de message AVANT/APRÈS', async ({ page }) => {
    const testMessage = `
      Nous sommes une entreprise qui propose des services de qualité.
      Nos clients sont satisfaits.
      Contactez-nous pour plus d'informations.
    `;
    
    await page.fill('textarea', testMessage);
    await page.click('button:has-text("Analyser"), button:has-text("Calculer")');
    
    // Attendre les résultats
    await page.waitForSelector('text=/Score|Résultat/i', { timeout: 10000 });
    
    // Vérifier qu'un exemple AVANT/APRÈS est proposé
    await expect(page.locator('text=/AVANT|APRÈS|Exemple/i')).toBeVisible();
  });

  test('devrait être responsive sur mobile', async ({ page }) => {
    // Définir la taille de viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Vérifier que le formulaire est visible et utilisable
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('button:has-text("Analyser"), button:has-text("Calculer")')).toBeVisible();
    
    // Remplir et soumettre
    await page.fill('textarea', 'Message de test sur mobile');
    await page.click('button:has-text("Analyser"), button:has-text("Calculer")');
    
    // Vérifier que les résultats s'affichent correctement
    await page.waitForSelector('text=/Score|Résultat/i', { timeout: 10000 });
    await expect(page.locator('text=/\\d+\\/20|Score.*:\\s*\\d+/i')).toBeVisible();
  });
});
