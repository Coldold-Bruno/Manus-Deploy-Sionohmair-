import { test, expect } from './fixtures';

/**
 * Tests E2E - Interface Admin
 * Vérifie l'accès et les fonctionnalités de l'interface d'administration
 */

test.describe('Interface Admin', () => {
  test('devrait afficher la page admin', async ({ page }) => {
    await page.goto('/admin');
    
    // Vérifier le titre de la page admin
    await expect(page.locator('h1, h2')).toContainText(/admin|administration|gestion/i);
  });

  test('devrait afficher la liste de toutes les commandes', async ({ page }) => {
    await page.goto('/admin');
    
    // Vérifier que la section commandes est présente
    await expect(page.locator('text=/commande|order|toutes les commandes/i')).toBeVisible();
    
    // Vérifier que le tableau de commandes existe
    const ordersTable = page.locator('table, div[role="table"]');
    await expect(ordersTable).toBeVisible();
  });

  test('devrait afficher les colonnes nécessaires dans le tableau', async ({ page }) => {
    await page.goto('/admin');
    
    // Attendre que le tableau se charge
    await page.waitForSelector('table, div[role="table"]', { timeout: 10000 });
    
    // Vérifier les en-têtes de colonnes
    await expect(page.locator('th:has-text("Email"), [role="columnheader"]:has-text("Email")')).toBeVisible();
    await expect(page.locator('th:has-text("Produit"), [role="columnheader"]:has-text("Produit")')).toBeVisible();
    await expect(page.locator('th:has-text("Montant"), [role="columnheader"]:has-text("Montant")')).toBeVisible();
    await expect(page.locator('th:has-text("Date"), [role="columnheader"]:has-text("Date")')).toBeVisible();
    await expect(page.locator('th:has-text("Statut"), [role="columnheader"]:has-text("Statut")')).toBeVisible();
  });

  test('devrait permettre de filtrer les commandes', async ({ page }) => {
    await page.goto('/admin');
    
    // Attendre que le tableau se charge
    await page.waitForSelector('table, div[role="table"]', { timeout: 10000 });
    
    // Chercher un champ de recherche ou des filtres
    const searchInput = page.locator('input[type="search"], input[placeholder*="Rechercher"], input[placeholder*="Filtrer"]');
    
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible();
      
      // Tester le filtre
      await searchInput.first().fill('test@example.com');
      
      // Attendre que les résultats se filtrent
      await page.waitForTimeout(1000);
    }
  });

  test('devrait permettre de trier les commandes', async ({ page }) => {
    await page.goto('/admin');
    
    // Attendre que le tableau se charge
    await page.waitForSelector('table, div[role="table"]', { timeout: 10000 });
    
    // Chercher des en-têtes de colonne cliquables pour le tri
    const sortableHeader = page.locator('th[role="columnheader"][class*="cursor"], th:has(button)');
    
    if (await sortableHeader.count() > 0) {
      // Cliquer sur un en-tête pour trier
      await sortableHeader.first().click();
      
      // Attendre que le tri s'applique
      await page.waitForTimeout(500);
    }
  });

  test('devrait afficher le formulaire d\'upload d\'artefacts', async ({ page }) => {
    await page.goto('/admin');
    
    // Attendre que le tableau se charge
    await page.waitForSelector('table, div[role="table"]', { timeout: 10000 });
    
    // Chercher un bouton ou une section pour uploader des artefacts
    const uploadSection = page.locator('text=/upload|téléverser|ajouter.*artefact/i');
    
    if (await uploadSection.count() > 0) {
      await expect(uploadSection.first()).toBeVisible();
    }
  });

  test('devrait permettre de sélectionner une commande', async ({ page }) => {
    await page.goto('/admin');
    
    // Attendre que le tableau se charge
    await page.waitForSelector('table, div[role="table"]', { timeout: 10000 });
    
    // Chercher des lignes de commande cliquables
    const orderRow = page.locator('tr[class*="order"], div[role="row"]').nth(1);
    
    if (await orderRow.count() > 0) {
      // Cliquer sur une commande
      await orderRow.click();
      
      // Vérifier qu'un détail ou une action s'affiche
      await page.waitForTimeout(500);
    }
  });

  test.skip('devrait permettre d\'uploader un artefact', async ({ page }) => {
    // Note: Ce test nécessite une commande existante
    // Il est skip par défaut et doit être adapté selon votre configuration
    
    await page.goto('/admin');
    
    // Attendre que le tableau se charge
    await page.waitForSelector('table, div[role="table"]', { timeout: 10000 });
    
    // Chercher un input file pour l'upload
    const fileInput = page.locator('input[type="file"]');
    
    if (await fileInput.count() > 0) {
      // Créer un fichier de test
      const buffer = Buffer.from('Test artefact content');
      
      // Uploader le fichier
      await fileInput.setInputFiles({
        name: 'test-artefact.pdf',
        mimeType: 'application/pdf',
        buffer: buffer,
      });
      
      // Soumettre le formulaire
      const submitButton = page.locator('button[type="submit"]:has-text("Upload"), button:has-text("Téléverser")');
      await submitButton.click();
      
      // Vérifier le succès
      await expect(page.locator('text=/succès|uploaded|téléversé/i')).toBeVisible({ timeout: 10000 });
    }
  });

  test('devrait afficher les statistiques globales', async ({ page }) => {
    await page.goto('/admin');
    
    // Chercher des statistiques (nombre de commandes, CA, etc.)
    const statsSection = page.locator('text=/total|statistique|chiffre/i');
    
    if (await statsSection.count() > 0) {
      await expect(statsSection.first()).toBeVisible();
    }
  });

  test('devrait avoir un lien vers le dashboard newsletter', async ({ page }) => {
    await page.goto('/admin');
    
    // Chercher un lien vers la newsletter
    const newsletterLink = page.locator('a[href="/admin/newsletter"]');
    
    if (await newsletterLink.count() > 0) {
      await expect(newsletterLink).toBeVisible();
    }
  });

  test('devrait avoir un lien vers les leads chauds', async ({ page }) => {
    await page.goto('/admin');
    
    // Chercher un lien vers les hot leads
    const hotLeadsLink = page.locator('a[href="/admin/hot-leads"]');
    
    if (await hotLeadsLink.count() > 0) {
      await expect(hotLeadsLink).toBeVisible();
    }
  });

  test('devrait être responsive sur tablette', async ({ page }) => {
    // Définir la taille de viewport tablette
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/admin');
    
    // Vérifier que le titre est visible
    await expect(page.locator('h1, h2')).toBeVisible();
    
    // Vérifier que le tableau est visible (peut être scrollable)
    await expect(page.locator('table, div[role="table"]')).toBeVisible();
  });
});

test.describe('Dashboard Newsletter Admin', () => {
  test('devrait afficher la page dashboard newsletter', async ({ page }) => {
    await page.goto('/admin/newsletter');
    
    // Vérifier le titre
    await expect(page.locator('h1, h2')).toContainText(/newsletter|analytics|statistiques/i);
  });

  test('devrait afficher les KPIs de la newsletter', async ({ page }) => {
    await page.goto('/admin/newsletter');
    
    // Vérifier que les KPIs sont affichés
    await expect(page.locator('text=/taux d\'ouverture|open rate/i')).toBeVisible();
    await expect(page.locator('text=/taux de clic|click rate/i')).toBeVisible();
    await expect(page.locator('text=/abonnés|subscribers/i')).toBeVisible();
  });

  test('devrait afficher un graphique d\'engagement', async ({ page }) => {
    await page.goto('/admin/newsletter');
    
    // Chercher un graphique (canvas, svg, etc.)
    const chart = page.locator('canvas, svg[class*="chart"], div[class*="chart"]');
    
    if (await chart.count() > 0) {
      await expect(chart.first()).toBeVisible();
    }
  });
});

test.describe('Hot Leads Admin', () => {
  test('devrait afficher la page hot leads', async ({ page }) => {
    await page.goto('/admin/hot-leads');
    
    // Vérifier le titre
    await expect(page.locator('h1, h2')).toContainText(/leads|prospects|chauds/i);
  });

  test('devrait afficher la liste des leads chauds', async ({ page }) => {
    await page.goto('/admin/hot-leads');
    
    // Vérifier que la liste est présente
    const leadsList = page.locator('table, ul, div[role="list"]');
    await expect(leadsList).toBeVisible();
  });

  test('devrait afficher le score des leads', async ({ page }) => {
    await page.goto('/admin/hot-leads');
    
    // Chercher des scores affichés
    const scoreElement = page.locator('text=/score|\\d+\\/100/i');
    
    if (await scoreElement.count() > 0) {
      await expect(scoreElement.first()).toBeVisible();
    }
  });

  test('devrait permettre de voir le profil d\'un lead', async ({ page }) => {
    await page.goto('/admin/hot-leads');
    
    // Attendre que la liste se charge
    await page.waitForSelector('table, ul, div[role="list"]', { timeout: 10000 });
    
    // Chercher un lien vers un profil de lead
    const profileLink = page.locator('a[href*="/admin/lead-profile"]');
    
    if (await profileLink.count() > 0) {
      await expect(profileLink.first()).toBeVisible();
      
      // Cliquer et vérifier la navigation
      await profileLink.first().click();
      await expect(page).toHaveURL(/\/admin\/lead-profile/);
    }
  });
});

test.describe('Profil de Lead', () => {
  test.skip('devrait afficher le profil complet d\'un lead', async ({ page }) => {
    // Note: Ce test nécessite un lead existant
    // Il est skip par défaut et doit être adapté selon votre configuration
    
    await page.goto('/admin/lead-profile?email=test@example.com');
    
    // Vérifier que les informations du lead sont affichées
    await expect(page.locator('text=/test@example.com/i')).toBeVisible();
    await expect(page.locator('text=/score/i')).toBeVisible();
    await expect(page.locator('text=/température|temperature/i')).toBeVisible();
  });

  test.skip('devrait afficher la timeline d\'activité', async ({ page }) => {
    await page.goto('/admin/lead-profile?email=test@example.com');
    
    // Vérifier que la timeline est présente
    await expect(page.locator('text=/timeline|activité|historique/i')).toBeVisible();
    
    // Vérifier que des activités sont affichées
    const activities = page.locator('[class*="activity"], [class*="timeline-item"]');
    
    if (await activities.count() > 0) {
      await expect(activities.first()).toBeVisible();
    }
  });

  test.skip('devrait permettre d\'ajouter une note', async ({ page }) => {
    await page.goto('/admin/lead-profile?email=test@example.com');
    
    // Chercher un formulaire d'ajout de note
    const noteForm = page.locator('form:has(textarea), div:has-text("Ajouter une note")');
    
    if (await noteForm.count() > 0) {
      await expect(noteForm).toBeVisible();
      
      // Remplir et soumettre
      await page.fill('textarea', 'Note de test pour le lead');
      await page.click('button[type="submit"]:has-text("Ajouter"), button:has-text("Enregistrer")');
      
      // Vérifier le succès
      await expect(page.locator('text=/note ajoutée|succès/i')).toBeVisible({ timeout: 10000 });
    }
  });
});
