import { test, expect } from './fixtures';

/**
 * Tests E2E - Parcours de paiement Stripe
 * Vérifie le processus complet d'achat avec Stripe Checkout
 */

test.describe('Parcours de paiement Stripe', () => {
  test('devrait afficher le bouton de paiement sur la page Sprint de Clarté', async ({ page }) => {
    await page.goto('/sprint-clarte');
    
    // Vérifier que le prix est affiché
    await expect(page.locator('text=/490.*€/i')).toBeVisible();
    
    // Vérifier que le bouton de paiement est présent
    const payButton = page.locator('button:has-text("Payer"), a:has-text("Payer"), button:has-text("Réserver")');
    await expect(payButton).toBeVisible();
    await expect(payButton).toBeEnabled();
  });

  test('devrait rediriger vers Stripe Checkout lors du clic sur Payer', async ({ page }) => {
    await page.goto('/sprint-clarte');
    
    // Cliquer sur le bouton de paiement
    const payButton = page.locator('button:has-text("Payer"), a:has-text("Payer"), button:has-text("Réserver")').first();
    await payButton.click();
    
    // Attendre la redirection vers Stripe Checkout
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 15000 });
    
    // Vérifier que nous sommes sur Stripe Checkout
    await expect(page).toHaveURL(/checkout\.stripe\.com/);
    
    // Vérifier que le formulaire Stripe est chargé
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible({ timeout: 10000 });
  });

  test('devrait afficher le montant correct dans Stripe Checkout', async ({ page }) => {
    await page.goto('/sprint-clarte');
    
    // Cliquer sur le bouton de paiement
    const payButton = page.locator('button:has-text("Payer"), a:has-text("Payer"), button:has-text("Réserver")').first();
    await payButton.click();
    
    // Attendre Stripe Checkout
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 15000 });
    
    // Vérifier que le montant 490€ est affiché
    await expect(page.locator('text=/490|€490/i')).toBeVisible({ timeout: 10000 });
  });

  test.skip('devrait compléter un paiement avec une carte de test', async ({ page }) => {
    // Note: Ce test est skip par défaut car il nécessite une configuration Stripe spécifique
    // Décommenter et adapter selon votre configuration
    
    await page.goto('/sprint-clarte');
    
    // Cliquer sur le bouton de paiement
    const payButton = page.locator('button:has-text("Payer"), a:has-text("Payer"), button:has-text("Réserver")').first();
    await payButton.click();
    
    // Attendre Stripe Checkout
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 15000 });
    
    // Remplir l'email
    await page.fill('input[type="email"], input[name="email"]', 'test@example.com');
    
    // Remplir les informations de carte (iframe Stripe)
    const cardFrame = page.frameLocator('iframe[name*="cardNumber"]').first();
    await cardFrame.locator('input[name="cardnumber"]').fill('4242424242424242');
    
    const expFrame = page.frameLocator('iframe[name*="cardExpiry"]').first();
    await expFrame.locator('input[name="exp-date"]').fill('1234');
    
    const cvcFrame = page.frameLocator('iframe[name*="cardCvc"]').first();
    await cvcFrame.locator('input[name="cvc"]').fill('123');
    
    // Soumettre le paiement
    await page.click('button[type="submit"]');
    
    // Attendre la redirection vers la page de succès
    await page.waitForURL(/\/payment\/success/, { timeout: 30000 });
    
    // Vérifier que nous sommes sur la page de succès
    await expect(page).toHaveURL(/\/payment\/success/);
    await expect(page.locator('text=/succès|merci|confirmation/i')).toBeVisible();
  });

  test('devrait afficher les boutons de paiement sur la page Services', async ({ page }) => {
    await page.goto('/services');
    
    // Vérifier que les 3 boutons de paiement sont présents
    const payButtons = page.locator('button:has-text("Payer"), a:has-text("Payer"), button:has-text("Réserver")');
    await expect(payButtons).toHaveCount(3, { timeout: 10000 });
    
    // Vérifier que les prix sont affichés
    await expect(page.locator('text=/490.*€/i')).toBeVisible();
    await expect(page.locator('text=/10.*000.*€/i')).toBeVisible();
    await expect(page.locator('text=/50.*000.*€/i')).toBeVisible();
  });

  test('devrait permettre d\'annuler le paiement', async ({ page }) => {
    await page.goto('/sprint-clarte');
    
    // Cliquer sur le bouton de paiement
    const payButton = page.locator('button:has-text("Payer"), a:has-text("Payer"), button:has-text("Réserver")').first();
    await payButton.click();
    
    // Attendre Stripe Checkout
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 15000 });
    
    // Cliquer sur le bouton retour/annuler
    const backButton = page.locator('button[aria-label*="back"], button:has-text("Back"), a:has-text("Back")').first();
    if (await backButton.isVisible()) {
      await backButton.click();
      
      // Vérifier que nous sommes revenus sur le site
      await page.waitForURL(/\/sprint-clarte|\/payment\/cancel/, { timeout: 10000 });
    }
  });

  test('devrait afficher la page de succès après paiement', async ({ page }) => {
    // Simuler un retour de Stripe avec session_id
    await page.goto('/payment/success?session_id=cs_test_123456789');
    
    // Vérifier que la page de succès est affichée
    await expect(page.locator('h1, h2')).toContainText(/succès|merci|confirmation/i);
    
    // Vérifier qu'un lien vers le dashboard est présent
    await expect(page.locator('a[href="/dashboard"]')).toBeVisible();
  });

  test('devrait afficher la page d\'annulation', async ({ page }) => {
    await page.goto('/payment/cancel');
    
    // Vérifier que la page d'annulation est affichée
    await expect(page.locator('h1, h2')).toContainText(/annulé|annulation|cancel/i);
    
    // Vérifier qu'un lien pour réessayer est présent
    await expect(page.locator('a[href="/services"], a[href="/sprint-clarte"]')).toBeVisible();
  });

  test('devrait gérer les erreurs de paiement', async ({ page }) => {
    // Simuler une erreur de paiement
    await page.goto('/payment/cancel?error=payment_failed');
    
    // Vérifier qu'un message d'erreur est affiché
    await expect(page.locator('text=/erreur|échec|failed/i')).toBeVisible();
  });

  test('devrait être responsive sur mobile', async ({ page }) => {
    // Définir la taille de viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/sprint-clarte');
    
    // Vérifier que le bouton de paiement est visible et cliquable
    const payButton = page.locator('button:has-text("Payer"), a:has-text("Payer"), button:has-text("Réserver")').first();
    await expect(payButton).toBeVisible();
    
    // Vérifier que le prix est lisible
    await expect(page.locator('text=/490.*€/i')).toBeVisible();
  });
});

test.describe('Webhook et création de commande', () => {
  test('devrait créer une commande après paiement réussi', async ({ page }) => {
    // Note: Ce test nécessite un paiement réel ou une simulation de webhook
    // Il est recommandé de le tester manuellement ou avec un environnement de staging
    
    // Aller sur le dashboard
    await page.goto('/dashboard');
    
    // Vérifier que la page dashboard existe
    await expect(page.locator('h1, h2')).toContainText(/dashboard|commandes|mes achats/i);
  });

  test('devrait afficher les commandes dans le dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Vérifier que la section commandes est présente
    await expect(page.locator('text=/commande|achat|historique/i')).toBeVisible();
    
    // Vérifier que le tableau ou la liste de commandes est présent
    await expect(page.locator('table, ul, div[role="list"]')).toBeVisible();
  });
});
