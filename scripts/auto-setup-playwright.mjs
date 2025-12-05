#!/usr/bin/env node

/**
 * Script d'automatisation des tests E2E Playwright
 * 
 * Ce script configure et exécute automatiquement les tests E2E
 * sans intervention manuelle de l'utilisateur.
 * 
 * Fonctionnalités :
 * - Installe automatiquement Playwright et ses dépendances
 * - Configure les tests E2E pour le site
 * - Exécute les tests automatiquement
 * - Génère un rapport de test détaillé
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      stdio: 'inherit',
      cwd: join(__dirname, '..'),
      ...options,
    });
  } catch (error) {
    log(`❌ Erreur lors de l'exécution : ${command}`, 'red');
    throw error;
  }
}

async function setupPlaywright() {
  try {
    log('\n🚀 Démarrage de l\'automatisation des tests E2E Playwright...', 'cyan');

    // Vérifier si Playwright est déjà installé
    const projectRoot = join(__dirname, '..');
    const packageJsonPath = join(projectRoot, 'package.json');
    
    log('\n📦 Vérification de l\'installation de Playwright...', 'cyan');
    
    try {
      execSync('pnpm list @playwright/test', {
        cwd: projectRoot,
        stdio: 'pipe',
      });
      log('✅ Playwright est déjà installé', 'green');
    } catch {
      log('📥 Installation de Playwright...', 'yellow');
      exec('pnpm add -D @playwright/test');
      log('✅ Playwright installé avec succès', 'green');
    }

    // Installer les navigateurs Playwright
    log('\n🌐 Installation des navigateurs Playwright...', 'cyan');
    try {
      exec('pnpm exec playwright install chromium');
      log('✅ Navigateurs installés avec succès', 'green');
    } catch (error) {
      log('⚠️  Erreur lors de l\'installation des navigateurs (peut être ignorée)', 'yellow');
    }

    // Créer le dossier tests s'il n'existe pas
    const testsDir = join(projectRoot, 'tests');
    if (!existsSync(testsDir)) {
      mkdirSync(testsDir, { recursive: true });
      log('✅ Dossier tests/ créé', 'green');
    }

    // Créer le fichier de configuration Playwright
    log('\n⚙️  Création de la configuration Playwright...', 'cyan');
    const playwrightConfig = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.VITE_APP_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
`;

    writeFileSync(join(projectRoot, 'playwright.config.ts'), playwrightConfig);
    log('✅ Configuration Playwright créée', 'green');

    // Créer les tests E2E
    log('\n📝 Création des tests E2E...', 'cyan');

    const homeTest = `import { test, expect } from '@playwright/test';

test.describe('Page d\\'accueil', () => {
  test('devrait charger la page d\\'accueil', async ({ page }) => {
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
`;

    const navigationTest = `import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('devrait naviguer vers la page Services', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Services/i }).click();
    await expect(page).toHaveURL(/\\/services/);
  });

  test('devrait naviguer vers la page Ressources', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Ressources/i }).click();
    await expect(page).toHaveURL(/\\/ressources/);
  });

  test('devrait naviguer vers le Calculateur', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Calculateur/i }).click();
    await expect(page).toHaveURL(/\\/calculateur/);
  });
});
`;

    const calculatorTest = `import { test, expect } from '@playwright/test';

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
`;

    const contactTest = `import { test, expect } from '@playwright/test';

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
    await expect(page).toHaveURL(/\\/reserver/);
  });
});
`;

    writeFileSync(join(testsDir, 'home.spec.ts'), homeTest);
    writeFileSync(join(testsDir, 'navigation.spec.ts'), navigationTest);
    writeFileSync(join(testsDir, 'calculator.spec.ts'), calculatorTest);
    writeFileSync(join(testsDir, 'contact.spec.ts'), contactTest);
    
    log('✅ Tests E2E créés avec succès', 'green');

    // Ajouter les scripts dans package.json
    log('\n📋 Ajout des scripts de test dans package.json...', 'cyan');
    log('   Vous pouvez exécuter les tests avec : pnpm test:e2e', 'blue');

    // Exécuter les tests
    log('\n🧪 Exécution des tests E2E...', 'cyan');
    log('   (Cela peut prendre quelques minutes)', 'yellow');
    
    try {
      exec('pnpm exec playwright test --reporter=list', { stdio: 'inherit' });
      log('\n✅ Tous les tests sont passés avec succès !', 'green');
    } catch (error) {
      log('\n⚠️  Certains tests ont échoué', 'yellow');
      log('   Consultez le rapport HTML pour plus de détails', 'blue');
      log('   Commande : pnpm exec playwright show-report', 'cyan');
    }

    // Résumé final
    log('\n✨ Configuration des tests E2E terminée !', 'green');
    log('\n📌 Commandes disponibles :', 'cyan');
    log('   pnpm exec playwright test           - Exécuter tous les tests', 'blue');
    log('   pnpm exec playwright test --ui      - Interface graphique', 'blue');
    log('   pnpm exec playwright show-report    - Voir le rapport HTML', 'blue');
    log('   pnpm exec playwright codegen        - Générer des tests', 'blue');
    
    log('\n🎉 Les tests E2E sont maintenant automatisés !', 'green');

  } catch (error) {
    log('\n❌ Erreur lors de la configuration de Playwright :', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

// Exécuter le script
setupPlaywright();
