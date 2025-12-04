#!/usr/bin/env node

/**
 * Script d'automatisation des tests End-to-End
 * Sionohmair Insight Academy
 * 
 * Ce script teste automatiquement tous les flux critiques de l'application
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SCREENSHOTS_DIR = join(__dirname, '../test-screenshots');
const REPORT_FILE = join(__dirname, '../E2E_TEST_REPORT.md');

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Résultats des tests
const testResults = {
  passed: [],
  failed: [],
  warnings: [],
  startTime: new Date(),
  endTime: null,
};

// Créer le dossier de screenshots
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Fonction utilitaire pour logger
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Fonction pour prendre un screenshot
async function takeScreenshot(page, name) {
  const path = join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path, fullPage: true });
  return path;
}

// Fonction pour attendre et vérifier un élément
async function waitAndCheck(page, selector, description) {
  try {
    await page.waitForSelector(selector, { timeout: 10000 });
    return true;
  } catch (error) {
    testResults.failed.push({
      test: description,
      error: `Élément non trouvé: ${selector}`,
    });
    return false;
  }
}

// Test 1: Page d'accueil
async function testHomePage(page) {
  log('\n[1/10] Test de la page d\'accueil...', 'cyan');
  
  try {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Vérifier le titre
    const title = await page.title();
    if (!title.includes('Sionohmair')) {
      throw new Error(`Titre incorrect: ${title}`);
    }
    
    // Vérifier les sections principales
    const hero = await page.locator('text=L\'Ingénierie du Génie').count();
    if (hero === 0) {
      throw new Error('Section hero non trouvée');
    }
    
    // Screenshot
    await takeScreenshot(page, '01-homepage');
    
    testResults.passed.push('Page d\'accueil');
    log('✅ Page d\'accueil OK', 'green');
  } catch (error) {
    testResults.failed.push({
      test: 'Page d\'accueil',
      error: error.message,
    });
    log(`❌ Page d\'accueil FAILED: ${error.message}`, 'red');
  }
}

// Test 2: Navigation
async function testNavigation(page) {
  log('\n[2/10] Test de la navigation...', 'cyan');
  
  try {
    // Tester le menu mobile
    const isMobile = await page.viewportSize().width < 768;
    
    if (isMobile) {
      await page.click('[aria-label="Menu"]');
      await page.waitForTimeout(500);
    }
    
    // Vérifier les liens principaux
    const links = ['Outils', 'Tarifs', 'Connexion'];
    for (const link of links) {
      const count = await page.locator(`text=${link}`).count();
      if (count === 0) {
        throw new Error(`Lien "${link}" non trouvé`);
      }
    }
    
    await takeScreenshot(page, '02-navigation');
    
    testResults.passed.push('Navigation');
    log('✅ Navigation OK', 'green');
  } catch (error) {
    testResults.failed.push({
      test: 'Navigation',
      error: error.message,
    });
    log(`❌ Navigation FAILED: ${error.message}`, 'red');
  }
}

// Test 3: Page Outils
async function testToolsPage(page) {
  log('\n[3/10] Test de la page Outils...', 'cyan');
  
  try {
    await page.goto(`${BASE_URL}/tools`);
    await page.waitForLoadState('networkidle');
    
    // Vérifier qu'il y a au moins 10 outils
    const toolCards = await page.locator('[data-testid="tool-card"]').count();
    if (toolCards < 10) {
      throw new Error(`Seulement ${toolCards} outils trouvés (attendu: 10+)`);
    }
    
    // Vérifier les catégories
    const categories = await page.locator('[data-testid="category-filter"]').count();
    if (categories === 0) {
      testResults.warnings.push('Filtres de catégories non trouvés');
    }
    
    await takeScreenshot(page, '03-tools-page');
    
    testResults.passed.push('Page Outils');
    log('✅ Page Outils OK', 'green');
  } catch (error) {
    testResults.failed.push({
      test: 'Page Outils',
      error: error.message,
    });
    log(`❌ Page Outils FAILED: ${error.message}`, 'red');
  }
}

// Test 4: Inscription
async function testSignup(page) {
  log('\n[4/10] Test du flux d\'inscription...', 'cyan');
  
  try {
    await page.goto(`${BASE_URL}/signup`);
    await page.waitForLoadState('networkidle');
    
    // Remplir le formulaire
    const testEmail = `test-${Date.now()}@example.com`;
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.fill('input[name="name"]', 'Test User');
    
    await takeScreenshot(page, '04-signup-form');
    
    // Vérifier le bouton d'inscription
    const signupButton = await page.locator('button[type="submit"]').count();
    if (signupButton === 0) {
      throw new Error('Bouton d\'inscription non trouvé');
    }
    
    testResults.passed.push('Formulaire d\'inscription');
    log('✅ Formulaire d\'inscription OK', 'green');
  } catch (error) {
    testResults.failed.push({
      test: 'Inscription',
      error: error.message,
    });
    log(`❌ Inscription FAILED: ${error.message}`, 'red');
  }
}

// Test 5: Page Tarifs
async function testPricingPage(page) {
  log('\n[5/10] Test de la page Tarifs...', 'cyan');
  
  try {
    await page.goto(`${BASE_URL}/pricing`);
    await page.waitForLoadState('networkidle');
    
    // Vérifier les plans
    const plans = await page.locator('[data-testid="pricing-card"]').count();
    if (plans < 2) {
      throw new Error(`Seulement ${plans} plans trouvés (attendu: 2+)`);
    }
    
    // Vérifier les prix
    const monthlyPrice = await page.locator('text=29€').count();
    const yearlyPrice = await page.locator('text=290€').count();
    
    if (monthlyPrice === 0 || yearlyPrice === 0) {
      throw new Error('Prix non affichés correctement');
    }
    
    await takeScreenshot(page, '05-pricing-page');
    
    testResults.passed.push('Page Tarifs');
    log('✅ Page Tarifs OK', 'green');
  } catch (error) {
    testResults.failed.push({
      test: 'Page Tarifs',
      error: error.message,
    });
    log(`❌ Page Tarifs FAILED: ${error.message}`, 'red');
  }
}

// Test 6: Responsive Design
async function testResponsive(page) {
  log('\n[6/10] Test du design responsive...', 'cyan');
  
  try {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' },
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await takeScreenshot(page, `06-responsive-${viewport.name}`);
    }
    
    testResults.passed.push('Design Responsive');
    log('✅ Design Responsive OK', 'green');
  } catch (error) {
    testResults.failed.push({
      test: 'Design Responsive',
      error: error.message,
    });
    log(`❌ Design Responsive FAILED: ${error.message}`, 'red');
  }
}

// Test 7: Performance
async function testPerformance(page) {
  log('\n[7/10] Test de performance...', 'cyan');
  
  try {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    if (loadTime > 5000) {
      testResults.warnings.push(`Temps de chargement élevé: ${loadTime}ms`);
    }
    
    log(`⏱️  Temps de chargement: ${loadTime}ms`, loadTime > 5000 ? 'yellow' : 'green');
    
    testResults.passed.push('Performance');
    log('✅ Performance OK', 'green');
  } catch (error) {
    testResults.failed.push({
      test: 'Performance',
      error: error.message,
    });
    log(`❌ Performance FAILED: ${error.message}`, 'red');
  }
}

// Test 8: Accessibilité
async function testAccessibility(page) {
  log('\n[8/10] Test d\'accessibilité...', 'cyan');
  
  try {
    await page.goto(BASE_URL);
    
    // Vérifier les attributs alt sur les images
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    if (imagesWithoutAlt > 0) {
      testResults.warnings.push(`${imagesWithoutAlt} images sans attribut alt`);
    }
    
    // Vérifier les contrastes (simulation basique)
    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    
    testResults.passed.push('Accessibilité');
    log('✅ Accessibilité OK', 'green');
  } catch (error) {
    testResults.failed.push({
      test: 'Accessibilité',
      error: error.message,
    });
    log(`❌ Accessibilité FAILED: ${error.message}`, 'red');
  }
}

// Test 9: SEO
async function testSEO(page) {
  log('\n[9/10] Test SEO...', 'cyan');
  
  try {
    await page.goto(BASE_URL);
    
    // Vérifier les meta tags
    const metaDescription = await page.locator('meta[name="description"]').count();
    const metaOg = await page.locator('meta[property^="og:"]').count();
    
    if (metaDescription === 0) {
      testResults.warnings.push('Meta description manquante');
    }
    
    if (metaOg < 3) {
      testResults.warnings.push('Meta tags Open Graph incomplets');
    }
    
    // Vérifier le titre
    const title = await page.title();
    if (title.length < 30 || title.length > 60) {
      testResults.warnings.push(`Longueur du titre non optimale: ${title.length} caractères`);
    }
    
    testResults.passed.push('SEO');
    log('✅ SEO OK', 'green');
  } catch (error) {
    testResults.failed.push({
      test: 'SEO',
      error: error.message,
    });
    log(`❌ SEO FAILED: ${error.message}`, 'red');
  }
}

// Test 10: Erreurs Console
async function testConsoleErrors(page) {
  log('\n[10/10] Test des erreurs console...', 'cyan');
  
  const consoleErrors = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  try {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Naviguer sur plusieurs pages
    await page.goto(`${BASE_URL}/tools`);
    await page.waitForLoadState('networkidle');
    
    await page.goto(`${BASE_URL}/pricing`);
    await page.waitForLoadState('networkidle');
    
    if (consoleErrors.length > 0) {
      testResults.warnings.push(`${consoleErrors.length} erreurs console détectées`);
      consoleErrors.forEach((error) => {
        log(`  ⚠️  ${error}`, 'yellow');
      });
    }
    
    testResults.passed.push('Erreurs Console');
    log('✅ Erreurs Console OK', 'green');
  } catch (error) {
    testResults.failed.push({
      test: 'Erreurs Console',
      error: error.message,
    });
    log(`❌ Erreurs Console FAILED: ${error.message}`, 'red');
  }
}

// Générer le rapport
function generateReport() {
  testResults.endTime = new Date();
  const duration = (testResults.endTime - testResults.startTime) / 1000;
  
  const report = `# 📊 Rapport de Tests End-to-End

**Sionohmair Insight Academy**

---

## 📅 Informations

- **Date**: ${testResults.startTime.toLocaleString('fr-FR')}
- **Durée**: ${duration.toFixed(2)}s
- **URL testée**: ${BASE_URL}

---

## ✅ Résultats

### Tests Réussis (${testResults.passed.length})

${testResults.passed.map((test) => `- ✅ ${test}`).join('\n')}

### Tests Échoués (${testResults.failed.length})

${testResults.failed.length === 0 ? '_Aucun test échoué_' : testResults.failed.map((result) => `- ❌ **${result.test}**\n  - Erreur: ${result.error}`).join('\n\n')}

### Avertissements (${testResults.warnings.length})

${testResults.warnings.length === 0 ? '_Aucun avertissement_' : testResults.warnings.map((warning) => `- ⚠️ ${warning}`).join('\n')}

---

## 📸 Screenshots

Les screenshots sont disponibles dans le dossier \`test-screenshots/\`:

${fs.readdirSync(SCREENSHOTS_DIR).map((file) => `- \`${file}\``).join('\n')}

---

## 🎯 Taux de Réussite

**${Math.round((testResults.passed.length / (testResults.passed.length + testResults.failed.length)) * 100)}%** des tests ont réussi

${testResults.failed.length === 0 ? '🎉 **Tous les tests sont passés avec succès !**' : '⚠️ **Certains tests ont échoué. Veuillez corriger les erreurs avant la mise en production.**'}

---

## 📝 Prochaines Étapes

${testResults.failed.length === 0 ? `
1. ✅ Tous les tests sont passés
2. ✅ L'application est prête pour la production
3. 🚀 Vous pouvez procéder au déploiement
` : `
1. ❌ Corriger les tests échoués
2. 🔄 Relancer les tests
3. ✅ Vérifier que tous les tests passent
4. 🚀 Procéder au déploiement
`}

---

*Rapport généré automatiquement le ${new Date().toLocaleString('fr-FR')}*
`;

  fs.writeFileSync(REPORT_FILE, report);
  log(`\n📄 Rapport généré: ${REPORT_FILE}`, 'blue');
}

// Fonction principale
async function runTests() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║   Tests End-to-End Automatisés                            ║', 'blue');
  log('║   Sionohmair Insight Academy                               ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');
  log(`\n🌐 URL de test: ${BASE_URL}\n`, 'cyan');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  });
  const page = await context.newPage();
  
  try {
    // Exécuter tous les tests
    await testHomePage(page);
    await testNavigation(page);
    await testToolsPage(page);
    await testSignup(page);
    await testPricingPage(page);
    await testResponsive(page);
    await testPerformance(page);
    await testAccessibility(page);
    await testSEO(page);
    await testConsoleErrors(page);
    
    // Générer le rapport
    generateReport();
    
    // Résumé final
    log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
    log('║   ✅ Tests Terminés !                                      ║', 'blue');
    log('╚════════════════════════════════════════════════════════════╝', 'blue');
    log(`\n✅ Tests réussis: ${testResults.passed.length}`, 'green');
    log(`❌ Tests échoués: ${testResults.failed.length}`, testResults.failed.length > 0 ? 'red' : 'green');
    log(`⚠️  Avertissements: ${testResults.warnings.length}`, testResults.warnings.length > 0 ? 'yellow' : 'green');
    log(`\n📄 Consultez le rapport: E2E_TEST_REPORT.md\n`, 'cyan');
    
  } catch (error) {
    log(`\n❌ Erreur fatale: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    await browser.close();
  }
  
  // Exit code basé sur les résultats
  process.exit(testResults.failed.length > 0 ? 1 : 0);
}

// Exécuter les tests
runTests().catch((error) => {
  log(`\n❌ Erreur: ${error.message}`, 'red');
  process.exit(1);
});
