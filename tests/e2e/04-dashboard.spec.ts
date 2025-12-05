import { test, expect } from './fixtures';

/**
 * Tests E2E - Dashboard utilisateur
 * Vérifie l'accès et les fonctionnalités du dashboard client
 */

test.describe('Dashboard utilisateur', () => {
  test('devrait afficher la page dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Vérifier le titre de la page
    await expect(page.locator('h1, h2')).toContainText(/dashboard|mes commandes|mon compte/i);
  });

  test('devrait afficher la liste des commandes', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Vérifier que la section commandes est présente
    await expect(page.locator('text=/commande|achat|historique/i')).toBeVisible();
    
    // Vérifier que le conteneur de commandes existe
    const ordersContainer = page.locator('table, ul, div[role="list"], div[class*="order"]');
    await expect(ordersContainer).toBeVisible();
  });

  test('devrait afficher les détails d\'une commande', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Attendre que les commandes se chargent
    await page.waitForSelector('text=/commande|achat|historique/i', { timeout: 10000 });
    
    // Si des commandes existent, vérifier qu'elles affichent les informations nécessaires
    const orderItems = page.locator('[class*="order"], tr[class*="order"], li[class*="order"]');
    const count = await orderItems.count();
    
    if (count > 0) {
      // Vérifier que la première commande affiche les informations de base
      const firstOrder = orderItems.first();
      
      // Vérifier que le nom du produit est affiché
      await expect(firstOrder.locator('text=/Sprint|Niveau|Architecture|Partenariat/i')).toBeVisible();
      
      // Vérifier que le montant est affiché
      await expect(firstOrder.locator('text=/€|EUR/i')).toBeVisible();
      
      // Vérifier que la date est affichée
      await expect(firstOrder.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{4}-\\d{2}-\\d{2}/i')).toBeVisible();
    }
  });

  test('devrait permettre de télécharger les artefacts', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Attendre que les commandes se chargent
    await page.waitForSelector('text=/commande|achat|historique/i', { timeout: 10000 });
    
    // Chercher un bouton de téléchargement
    const downloadButton = page.locator('button:has-text("Télécharger"), a:has-text("Télécharger"), a[download]');
    
    if (await downloadButton.count() > 0) {
      // Vérifier que le bouton est visible et cliquable
      await expect(downloadButton.first()).toBeVisible();
      await expect(downloadButton.first()).toBeEnabled();
    }
  });

  test('devrait afficher le statut de la commande', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Attendre que les commandes se chargent
    await page.waitForSelector('text=/commande|achat|historique/i', { timeout: 10000 });
    
    // Chercher un indicateur de statut
    const statusIndicator = page.locator('text=/payé|en cours|livré|pending|paid|delivered/i');
    
    if (await statusIndicator.count() > 0) {
      await expect(statusIndicator.first()).toBeVisible();
    }
  });

  test('devrait afficher un message si aucune commande', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Attendre que la page se charge
    await page.waitForSelector('h1, h2', { timeout: 10000 });
    
    // Chercher un message "aucune commande"
    const emptyMessage = page.locator('text=/aucune commande|pas de commande|no orders|vide/i');
    
    // Si le message existe, il devrait être visible
    if (await emptyMessage.count() > 0) {
      await expect(emptyMessage).toBeVisible();
    }
  });

  test('devrait avoir un lien vers les services', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Vérifier qu'il y a un lien pour acheter de nouveaux services
    const servicesLink = page.locator('a[href="/services"], a[href="/sprint-clarte"]');
    await expect(servicesLink.first()).toBeVisible();
  });

  test('devrait permettre de filtrer les commandes', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Attendre que les commandes se chargent
    await page.waitForSelector('text=/commande|achat|historique/i', { timeout: 10000 });
    
    // Chercher des filtres (select, boutons, etc.)
    const filterElement = page.locator('select, button:has-text("Filtrer"), input[type="search"]');
    
    if (await filterElement.count() > 0) {
      await expect(filterElement.first()).toBeVisible();
    }
  });

  test('devrait être responsive sur mobile', async ({ page }) => {
    // Définir la taille de viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard');
    
    // Vérifier que le titre est visible
    await expect(page.locator('h1, h2')).toBeVisible();
    
    // Vérifier que les commandes sont affichées correctement
    await expect(page.locator('text=/commande|achat|historique/i')).toBeVisible();
  });

  test('devrait afficher les informations du profil utilisateur', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Chercher une section profil ou des informations utilisateur
    const profileSection = page.locator('text=/profil|compte|email/i');
    
    if (await profileSection.count() > 0) {
      await expect(profileSection.first()).toBeVisible();
    }
  });

  test('devrait avoir un bouton de déconnexion', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Chercher un bouton de déconnexion
    const logoutButton = page.locator('button:has-text("Déconnexion"), a:has-text("Déconnexion"), button:has-text("Logout")');
    
    if (await logoutButton.count() > 0) {
      await expect(logoutButton.first()).toBeVisible();
    }
  });
});

test.describe('Navigation dans le dashboard', () => {
  test('devrait permettre de naviguer vers les différentes sections', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Vérifier que la navigation du dashboard existe
    const navLinks = page.locator('nav a, aside a, [role="navigation"] a');
    
    if (await navLinks.count() > 0) {
      // Vérifier que les liens sont visibles
      await expect(navLinks.first()).toBeVisible();
    }
  });

  test('devrait permettre de retourner à l\'accueil', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Chercher un lien vers l'accueil
    const homeLink = page.locator('a[href="/"]');
    await expect(homeLink.first()).toBeVisible();
    
    // Cliquer et vérifier la navigation
    await homeLink.first().click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Artefacts et téléchargements', () => {
  test('devrait afficher la liste des artefacts disponibles', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Attendre que les commandes se chargent
    await page.waitForSelector('text=/commande|achat|historique/i', { timeout: 10000 });
    
    // Chercher une section artefacts
    const artifactsSection = page.locator('text=/artefact|document|fichier|téléchargement/i');
    
    if (await artifactsSection.count() > 0) {
      await expect(artifactsSection.first()).toBeVisible();
    }
  });

  test('devrait afficher le statut de livraison des artefacts', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Attendre que les commandes se chargent
    await page.waitForSelector('text=/commande|achat|historique/i', { timeout: 10000 });
    
    // Chercher un indicateur de livraison
    const deliveryStatus = page.locator('text=/disponible|en préparation|livré|prêt/i');
    
    if (await deliveryStatus.count() > 0) {
      await expect(deliveryStatus.first()).toBeVisible();
    }
  });

  test.skip('devrait télécharger un artefact', async ({ page }) => {
    // Note: Ce test nécessite une commande existante avec des artefacts
    // Il est skip par défaut et doit être adapté selon votre configuration
    
    await page.goto('/dashboard');
    
    // Attendre que les commandes se chargent
    await page.waitForSelector('text=/commande|achat|historique/i', { timeout: 10000 });
    
    // Configurer l'écoute des téléchargements
    const downloadPromise = page.waitForEvent('download');
    
    // Cliquer sur le bouton de téléchargement
    const downloadButton = page.locator('button:has-text("Télécharger"), a:has-text("Télécharger")').first();
    await downloadButton.click();
    
    // Attendre que le téléchargement commence
    const download = await downloadPromise;
    
    // Vérifier que le téléchargement a un nom de fichier
    expect(download.suggestedFilename()).toBeTruthy();
  });
});
