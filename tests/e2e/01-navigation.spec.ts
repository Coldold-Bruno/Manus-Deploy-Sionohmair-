import { test, expect } from './fixtures';

/**
 * Tests E2E - Navigation générale
 * Vérifie que toutes les pages principales sont accessibles
 */

test.describe('Navigation générale', () => {
  test('devrait charger la page d\'accueil correctement', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier le titre de la page
    await expect(page).toHaveTitle(/Sionohmair Insight Academy/);
    
    // Vérifier que le logo est visible
    await expect(page.locator('img[alt*="logo"]')).toBeVisible();
    
    // Vérifier que le hero est présent
    await expect(page.locator('h1')).toBeVisible();
    
    // Vérifier que le CTA principal est présent
    await expect(page.locator('a:has-text("Sprint de Clarté"), button:has-text("Sprint de Clarté")')).toBeVisible();
  });

  test('devrait naviguer vers la page Services', async ({ page }) => {
    await page.goto('/');
    
    // Cliquer sur le lien Services dans la navigation
    await page.click('a[href="/services"]');
    
    // Vérifier l'URL
    await expect(page).toHaveURL('/services');
    
    // Vérifier que les 3 niveaux sont affichés
    await expect(page.locator('text=/Sprint de Clarté|Niveau 1/i')).toBeVisible();
    await expect(page.locator('text=/Architecture de l\'Insight|Niveau 2/i')).toBeVisible();
    await expect(page.locator('text=/Partenariat Stratégique|Niveau 3/i')).toBeVisible();
    
    // Vérifier que les prix sont affichés
    await expect(page.locator('text=/490.*€/i')).toBeVisible();
    await expect(page.locator('text=/10.*000.*€/i')).toBeVisible();
    await expect(page.locator('text=/50.*000.*€/i')).toBeVisible();
  });

  test('devrait naviguer vers la page Sprint de Clarté', async ({ page }) => {
    await page.goto('/');
    
    // Cliquer sur le lien Sprint de Clarté
    await page.click('a[href="/sprint-clarte"]');
    
    // Vérifier l'URL
    await expect(page).toHaveURL('/sprint-clarte');
    
    // Vérifier le contenu de la page
    await expect(page.locator('h1')).toContainText(/Sprint de Clarté/i);
    await expect(page.locator('text=/490.*€/i')).toBeVisible();
    
    // Vérifier que le bouton de paiement est présent
    await expect(page.locator('button:has-text("Payer"), a:has-text("Payer")')).toBeVisible();
  });

  test('devrait naviguer vers la page Calculateur', async ({ page }) => {
    await page.goto('/');
    
    // Cliquer sur le lien Calculateur
    await page.click('a[href="/calculateur"]');
    
    // Vérifier l'URL
    await expect(page).toHaveURL('/calculateur');
    
    // Vérifier que le formulaire est présent
    await expect(page.locator('textarea, input[type="text"]')).toBeVisible();
    
    // Vérifier que le bouton d'analyse est présent
    await expect(page.locator('button:has-text("Analyser"), button:has-text("Calculer")')).toBeVisible();
  });

  test('devrait naviguer vers la page Blog', async ({ page }) => {
    await page.goto('/');
    
    // Cliquer sur le lien Blog
    await page.click('a[href="/blog"]');
    
    // Vérifier l'URL
    await expect(page).toHaveURL('/blog');
    
    // Vérifier que le titre est présent
    await expect(page.locator('h1')).toContainText(/Blog|Études de cas/i);
  });

  test('devrait naviguer vers la page Ressources', async ({ page }) => {
    await page.goto('/');
    
    // Cliquer sur le lien Ressources
    await page.click('a[href="/ressources"]');
    
    // Vérifier l'URL
    await expect(page).toHaveURL('/ressources');
    
    // Vérifier le contenu
    await expect(page.locator('h1')).toContainText(/Ressources/i);
  });

  test('devrait naviguer vers la page À Propos', async ({ page }) => {
    await page.goto('/');
    
    // Cliquer sur le lien À Propos
    await page.click('a[href="/about"]');
    
    // Vérifier l'URL
    await expect(page).toHaveURL('/about');
    
    // Vérifier que le contenu de Bruno Coldold est présent
    await expect(page.locator('text=/Bruno Coldold/i')).toBeVisible();
  });

  test('devrait afficher une page 404 pour une route inexistante', async ({ page }) => {
    await page.goto('/page-qui-nexiste-pas');
    
    // Vérifier que la page 404 est affichée
    await expect(page.locator('text=/404|Page non trouvée|Not Found/i')).toBeVisible();
    
    // Vérifier qu'il y a un lien pour retourner à l'accueil
    await expect(page.locator('a[href="/"]')).toBeVisible();
  });

  test('devrait avoir un menu responsive sur mobile', async ({ page }) => {
    // Définir la taille de viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Vérifier que le bouton hamburger est visible
    const menuButton = page.locator('button[aria-label*="menu"], button:has(svg)').first();
    await expect(menuButton).toBeVisible();
    
    // Cliquer sur le menu
    await menuButton.click();
    
    // Vérifier que le menu est ouvert
    await expect(page.locator('nav a[href="/services"]')).toBeVisible();
  });

  test('devrait avoir un footer avec tous les liens', async ({ page }) => {
    await page.goto('/');
    
    // Scroll vers le bas
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Vérifier que le footer est visible
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Vérifier les liens du footer
    await expect(footer.locator('a[href="/services"]')).toBeVisible();
    await expect(footer.locator('a[href="/about"]')).toBeVisible();
    await expect(footer.locator('a[href="/contact"]')).toBeVisible();
    
    // Vérifier le copyright
    await expect(footer.locator('text=/©.*Sionohmair/i')).toBeVisible();
  });
});
