import { test as base, expect } from '@playwright/test';

/**
 * Fixtures Playwright pour Sionohmair Insight Academy
 * Fournit des contextes d'authentification et des helpers
 */

// Types pour les fixtures personnalisées
type CustomFixtures = {
  authenticatedPage: any;
  adminPage: any;
};

// Étendre le test de base avec nos fixtures
export const test = base.extend<CustomFixtures>({
  // Fixture pour un utilisateur authentifié
  authenticatedPage: async ({ page }, use) => {
    // Naviguer vers la page de connexion
    await page.goto('/login');
    
    // Remplir le formulaire de connexion
    // Note: Adapter selon votre implémentation réelle
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'testpassword123');
    await page.click('button[type="submit"]');
    
    // Attendre la redirection vers le dashboard
    await page.waitForURL('/dashboard');
    
    // Utiliser la page authentifiée
    await use(page);
  },

  // Fixture pour un administrateur authentifié
  adminPage: async ({ page }, use) => {
    // Naviguer vers la page de connexion
    await page.goto('/login');
    
    // Remplir le formulaire avec un compte admin
    // Note: Adapter selon votre implémentation réelle
    await page.fill('input[name="email"]', 'admin@sionohmair.com');
    await page.fill('input[name="password"]', 'adminpassword123');
    await page.click('button[type="submit"]');
    
    // Attendre la redirection
    await page.waitForURL('/dashboard');
    
    // Utiliser la page admin
    await use(page);
  },
});

// Exporter expect pour l'utiliser dans les tests
export { expect };

/**
 * Helpers pour les tests
 */

// Helper pour attendre le chargement complet de la page
export async function waitForPageLoad(page: any) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

// Helper pour vérifier qu'un élément est visible
export async function expectVisible(page: any, selector: string) {
  await expect(page.locator(selector)).toBeVisible();
}

// Helper pour vérifier qu'un texte est présent
export async function expectText(page: any, selector: string, text: string) {
  await expect(page.locator(selector)).toContainText(text);
}

// Helper pour remplir un formulaire
export async function fillForm(page: any, fields: Record<string, string>) {
  for (const [name, value] of Object.entries(fields)) {
    await page.fill(`input[name="${name}"], textarea[name="${name}"]`, value);
  }
}

// Helper pour simuler un paiement Stripe (mode test)
export async function completeStripePayment(page: any) {
  // Attendre que le formulaire Stripe Checkout soit chargé
  await page.waitForURL(/checkout\.stripe\.com/);
  
  // Remplir les informations de carte de test
  const cardFrame = page.frameLocator('iframe[name*="__privateStripeFrame"]').first();
  await cardFrame.locator('input[name="cardnumber"]').fill('4242424242424242');
  await cardFrame.locator('input[name="exp-date"]').fill('12/34');
  await cardFrame.locator('input[name="cvc"]').fill('123');
  await cardFrame.locator('input[name="postal"]').fill('12345');
  
  // Remplir l'email si demandé
  const emailInput = page.locator('input[type="email"]');
  if (await emailInput.isVisible()) {
    await emailInput.fill('test@example.com');
  }
  
  // Soumettre le paiement
  await page.click('button[type="submit"]');
  
  // Attendre la redirection vers la page de succès
  await page.waitForURL(/\/payment\/success/);
}

// Helper pour vérifier qu'une commande est créée
export async function verifyOrderCreated(page: any, productName: string) {
  // Aller sur le dashboard
  await page.goto('/dashboard');
  
  // Vérifier que la commande apparaît
  await expect(page.locator(`text=${productName}`)).toBeVisible();
}

// Helper pour se déconnecter
export async function logout(page: any) {
  await page.click('button[aria-label="Déconnexion"], button:has-text("Déconnexion")');
  await page.waitForURL('/');
}
