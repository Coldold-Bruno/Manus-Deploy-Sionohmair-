# Guide des Tests E2E avec Playwright
## Sionohmair Insight Academy

---

## 📋 Vue d'ensemble

Ce guide explique comment utiliser et maintenir la suite de tests E2E (End-to-End) avec **Playwright** pour garantir la qualité et la fiabilité de l'application.

**Couverture des tests** :
- ✅ Navigation générale (10 tests)
- ✅ Calculateur de Score de Clarté (10 tests)
- ✅ Parcours de paiement Stripe (12 tests)
- ✅ Dashboard utilisateur (13 tests)
- ✅ Interface Admin (18 tests)

**Total** : 63 tests automatisés

---

## 🎯 Objectifs des tests E2E

1. **Validation des parcours critiques** : Vérifier que les fonctionnalités principales fonctionnent de bout en bout
2. **Détection précoce des régressions** : Identifier les bugs avant qu'ils n'atteignent la production
3. **Documentation vivante** : Les tests servent de documentation sur le comportement attendu
4. **Confiance dans les déploiements** : Déployer en production avec sérénité

---

## 🚀 Installation et configuration

### Prérequis

- Node.js 18+ installé
- pnpm installé
- Application démarrée localement (`pnpm dev`)

### Installation

Les dépendances Playwright sont déjà installées. Si vous devez les réinstaller :

```bash
# Installer Playwright
pnpm add -D @playwright/test playwright

# Installer les navigateurs
pnpm exec playwright install --with-deps chromium
```

### Configuration

Le fichier `playwright.config.ts` contient la configuration globale :

```typescript
{
  testDir: './tests/e2e',           // Répertoire des tests
  timeout: 30 * 1000,                // Timeout par test (30s)
  retries: 0,                        // Pas de retry en local
  workers: undefined,                // Tests parallèles (auto)
  baseURL: 'http://localhost:3000',  // URL de base
  trace: 'on-first-retry',           // Trace en cas d'échec
  screenshot: 'only-on-failure',     // Screenshot en cas d'échec
  video: 'retain-on-failure',        // Vidéo en cas d'échec
}
```

---

## 📁 Structure des tests

```
tests/e2e/
├── fixtures.ts                    # Fixtures et helpers réutilisables
├── 01-navigation.spec.ts          # Tests de navigation générale
├── 02-calculateur.spec.ts         # Tests du calculateur de score
├── 03-paiement-stripe.spec.ts     # Tests du parcours de paiement
├── 04-dashboard.spec.ts           # Tests du dashboard utilisateur
└── 05-admin.spec.ts               # Tests de l'interface admin
```

### Fixtures personnalisées

Le fichier `fixtures.ts` fournit des helpers réutilisables :

```typescript
// Fixtures d'authentification
test.use({ authenticatedPage });  // Utilisateur authentifié
test.use({ adminPage });           // Admin authentifié

// Helpers
waitForPageLoad(page);                          // Attendre le chargement complet
expectVisible(page, selector);                  // Vérifier la visibilité
expectText(page, selector, text);               // Vérifier le texte
fillForm(page, { name: 'value' });              // Remplir un formulaire
completeStripePayment(page);                    // Compléter un paiement Stripe
verifyOrderCreated(page, productName);          // Vérifier la création d'une commande
logout(page);                                   // Se déconnecter
```

---

## 🧪 Exécution des tests

### Lancer tous les tests

```bash
# Exécuter tous les tests
pnpm exec playwright test

# Exécuter avec l'interface UI (recommandé)
pnpm exec playwright test --ui

# Exécuter en mode debug
pnpm exec playwright test --debug
```

### Lancer des tests spécifiques

```bash
# Un fichier de test
pnpm exec playwright test 01-navigation.spec.ts

# Un test spécifique
pnpm exec playwright test -g "devrait charger la page d'accueil"

# Tests par tag
pnpm exec playwright test --grep @smoke
```

### Options utiles

```bash
# Mode headed (voir le navigateur)
pnpm exec playwright test --headed

# Navigateur spécifique
pnpm exec playwright test --project=chromium

# Parallélisation
pnpm exec playwright test --workers=4

# Générer un rapport HTML
pnpm exec playwright test --reporter=html
```

---

## 📊 Rapports de tests

### Rapport HTML

Après l'exécution des tests, un rapport HTML est généré :

```bash
# Ouvrir le rapport
pnpm exec playwright show-report
```

Le rapport contient :
- ✅ Résumé des tests (passés/échoués)
- 📸 Screenshots des échecs
- 🎥 Vidéos des échecs
- 📝 Traces détaillées

### Rapport JSON

Un fichier `test-results.json` est généré pour l'intégration CI/CD :

```json
{
  "suites": [...],
  "tests": [...],
  "stats": {
    "passed": 60,
    "failed": 3,
    "skipped": 0
  }
}
```

---

## 🎭 Écrire de nouveaux tests

### Structure de base

```typescript
import { test, expect } from './fixtures';

test.describe('Nom du groupe de tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup avant chaque test
    await page.goto('/');
  });

  test('devrait faire quelque chose', async ({ page }) => {
    // Arrange : Préparer les données
    
    // Act : Effectuer l'action
    await page.click('button');
    
    // Assert : Vérifier le résultat
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### Bonnes pratiques

**1. Utiliser des sélecteurs robustes**

```typescript
// ✅ Bon : Sélecteurs sémantiques
await page.click('button[aria-label="Submit"]');
await page.click('a[href="/services"]');

// ❌ Mauvais : Sélecteurs fragiles
await page.click('.btn-primary-123');
await page.click('div > div > button');
```

**2. Attendre les éléments**

```typescript
// ✅ Bon : Attendre explicitement
await page.waitForSelector('text=Success');
await expect(page.locator('h1')).toBeVisible();

// ❌ Mauvais : Timeout arbitraire
await page.waitForTimeout(5000);
```

**3. Isoler les tests**

```typescript
// ✅ Bon : Chaque test est indépendant
test('test 1', async ({ page }) => {
  await page.goto('/');
  // Test complet
});

// ❌ Mauvais : Tests dépendants
test('test 1', async ({ page }) => {
  await page.goto('/');
});
test('test 2', async ({ page }) => {
  // Suppose que page est déjà sur '/'
});
```

**4. Utiliser les fixtures**

```typescript
// ✅ Bon : Utiliser les fixtures
test('test admin', async ({ adminPage }) => {
  await adminPage.goto('/admin');
});

// ❌ Mauvais : Dupliquer le code d'authentification
test('test admin', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@example.com');
  // ...
});
```

---

## 🐛 Debugging des tests

### Mode Debug

```bash
# Lancer en mode debug
pnpm exec playwright test --debug

# Debug un test spécifique
pnpm exec playwright test --debug -g "nom du test"
```

**Fonctionnalités du mode debug** :
- Pause avant chaque action
- Inspecter les éléments
- Voir les logs en temps réel
- Exécuter des commandes manuellement

### Playwright Inspector

```typescript
// Ajouter un breakpoint dans le test
await page.pause();
```

### Traces

Les traces sont générées automatiquement en cas d'échec :

```bash
# Ouvrir une trace
pnpm exec playwright show-trace trace.zip
```

**Contenu des traces** :
- Timeline des actions
- Screenshots à chaque étape
- Logs réseau
- Console logs
- DOM snapshots

---

## 🔧 Tests spécifiques

### Tests de paiement Stripe

Les tests de paiement utilisent le mode Test de Stripe :

```typescript
// Carte de test Stripe
await page.fill('input[name="cardnumber"]', '4242424242424242');
await page.fill('input[name="exp-date"]', '12/34');
await page.fill('input[name="cvc"]', '123');
```

**Note** : Certains tests Stripe sont `skip` par défaut car ils nécessitent une configuration spécifique.

### Tests d'authentification

Utiliser les fixtures pour les tests nécessitant une authentification :

```typescript
test('test utilisateur authentifié', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard');
  // L'utilisateur est déjà connecté
});

test('test admin', async ({ adminPage }) => {
  await adminPage.goto('/admin');
  // L'admin est déjà connecté
});
```

### Tests responsive

Tester sur différentes tailles d'écran :

```typescript
test('devrait être responsive', async ({ page }) => {
  // Mobile
  await page.setViewportSize({ width: 375, height: 667 });
  
  // Tablette
  await page.setViewportSize({ width: 768, height: 1024 });
  
  // Desktop
  await page.setViewportSize({ width: 1920, height: 1080 });
});
```

---

## 🚦 Intégration CI/CD

### GitHub Actions

Exemple de workflow `.github/workflows/e2e-tests.yml` :

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Install Playwright
        run: pnpm exec playwright install --with-deps
      
      - name: Start dev server
        run: pnpm dev &
        
      - name: Wait for server
        run: npx wait-on http://localhost:3000
      
      - name: Run E2E tests
        run: pnpm exec playwright test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Variables d'environnement

Pour les tests en CI, configurer les variables :

```bash
# .env.test
PLAYWRIGHT_BASE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxxxx
```

---

## 📈 Métriques et KPIs

### Objectifs de qualité

- ✅ **Taux de réussite** : > 95%
- ✅ **Temps d'exécution** : < 5 minutes
- ✅ **Couverture** : > 80% des parcours critiques
- ✅ **Flakiness** : < 2% (tests instables)

### Parcours critiques couverts

1. **Navigation** : Toutes les pages principales accessibles
2. **Calculateur** : Analyse PFPMA fonctionnelle
3. **Paiement** : Processus Stripe complet
4. **Dashboard** : Affichage des commandes et artefacts
5. **Admin** : Gestion des commandes et leads

---

## 🔄 Maintenance des tests

### Quand mettre à jour les tests ?

- ✅ Après chaque changement de fonctionnalité
- ✅ Après chaque modification d'UI
- ✅ Après chaque ajout de page
- ✅ Après chaque bug fix

### Gérer les tests qui échouent

1. **Vérifier si c'est un vrai bug** : Le test détecte-t-il un problème réel ?
2. **Mettre à jour le test** : Si l'UI a changé, adapter le test
3. **Skip temporairement** : Si le test est instable, le marquer `test.skip`
4. **Supprimer si obsolète** : Si la fonctionnalité n'existe plus

### Tests skip

Certains tests sont marqués `test.skip` car ils nécessitent :
- Une configuration Stripe spécifique
- Des données existantes (commandes, leads)
- Une authentification réelle

**Pour activer ces tests** :
1. Configurer l'environnement nécessaire
2. Remplacer `test.skip` par `test`
3. Adapter les données de test

---

## 🛠️ Commandes utiles

```bash
# Lancer tous les tests
pnpm exec playwright test

# Lancer avec UI
pnpm exec playwright test --ui

# Lancer en mode debug
pnpm exec playwright test --debug

# Lancer un fichier spécifique
pnpm exec playwright test 01-navigation.spec.ts

# Lancer un test spécifique
pnpm exec playwright test -g "devrait charger la page d'accueil"

# Générer un rapport
pnpm exec playwright show-report

# Ouvrir une trace
pnpm exec playwright show-trace trace.zip

# Mettre à jour les snapshots
pnpm exec playwright test --update-snapshots

# Lister tous les tests
pnpm exec playwright test --list
```

---

## 📚 Ressources supplémentaires

**Documentation Playwright** :
- [Guide officiel](https://playwright.dev/docs/intro)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging](https://playwright.dev/docs/debug)

**Exemples** :
- [Playwright Examples](https://github.com/microsoft/playwright/tree/main/examples)
- [Test Patterns](https://playwright.dev/docs/test-patterns)

**Support** :
- [GitHub Issues](https://github.com/microsoft/playwright/issues)
- [Discord Community](https://aka.ms/playwright/discord)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/playwright)

---

## ✅ Checklist de validation

Avant de passer en production, vérifier :

- [ ] Tous les tests passent en local
- [ ] Les tests passent en CI/CD
- [ ] Les tests skip sont documentés
- [ ] Les fixtures sont à jour
- [ ] Les sélecteurs sont robustes
- [ ] Les timeouts sont appropriés
- [ ] Les screenshots/vidéos sont activés
- [ ] Le rapport HTML est généré
- [ ] Les traces sont disponibles en cas d'échec
- [ ] La documentation est à jour

---

**Date de création** : Décembre 2025  
**Version** : 1.0  
**Auteur** : Sionohmair Insight Academy
