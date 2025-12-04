# 🚀 Guide de Déploiement Automatisé

**Sionohmair Insight Academy - L'Ingénierie du Génie**

---

## 📋 Vue d'Ensemble

Ce guide vous permet de déployer votre application en production en **3 commandes simples**. Tous les scripts d'automatisation sont prêts à l'emploi et orchestrent intelligemment toutes les étapes nécessaires.

### ⚡ Déploiement Express (3 Commandes)

```bash
# 1. Configuration Stripe Production (une seule fois)
./scripts/configure-stripe-production.sh

# 2. Tests automatisés complets
BASE_URL=http://localhost:3000 node scripts/run-e2e-tests.mjs

# 3. Déploiement en production
./scripts/deploy-to-production.sh
```

**C'est tout !** Les scripts gèrent automatiquement :
- ✅ Configuration Stripe complète
- ✅ Création des produits Premium
- ✅ Tests end-to-end automatisés
- ✅ Build de production
- ✅ Migrations de base de données
- ✅ Vérifications de sécurité
- ✅ Génération de rapports détaillés

---

## 🎯 Scripts Disponibles

### 1. Configuration Stripe Production

**Fichier**: `scripts/configure-stripe-production.sh`

**Ce qu'il fait automatiquement**:
1. ✅ Installe Stripe CLI si nécessaire
2. ✅ Vous connecte à votre compte Stripe
3. ✅ Crée les produits Premium (Mensuel 29€ + Annuel 290€)
4. ✅ Récupère les clés API Live
5. ✅ Génère un fichier de configuration complet

**Utilisation**:
```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/configure-stripe-production.sh
```

**Résultat**:
- Fichier `STRIPE_PRODUCTION_CONFIG.txt` avec toutes les clés
- Instructions claires pour copier les secrets dans Manus
- Configuration webhook prête à l'emploi

**⚠️ Important**: Exécutez ce script **une seule fois** avant le premier déploiement.

---

### 2. Tests End-to-End Automatisés

**Fichier**: `scripts/run-e2e-tests.mjs`

**Ce qu'il teste automatiquement**:
1. ✅ Page d'accueil et navigation
2. ✅ Page Outils (tous les 10+ outils)
3. ✅ Formulaire d'inscription
4. ✅ Page Tarifs et plans Premium
5. ✅ Design responsive (mobile, tablette, desktop)
6. ✅ Performance (temps de chargement)
7. ✅ Accessibilité (attributs alt, contrastes)
8. ✅ SEO (meta tags, Open Graph)
9. ✅ Erreurs console
10. ✅ Flux utilisateur complets

**Utilisation**:
```bash
# Tester en local
BASE_URL=http://localhost:3000 node scripts/run-e2e-tests.mjs

# Tester en production
BASE_URL=https://votre-domaine.com node scripts/run-e2e-tests.mjs
```

**Résultats**:
- Rapport détaillé: `E2E_TEST_REPORT.md`
- Screenshots: `test-screenshots/` (10+ captures)
- Taux de réussite en temps réel
- Liste des erreurs et avertissements

**Durée**: ~30-60 secondes

---

### 3. Déploiement Maître en Production

**Fichier**: `scripts/deploy-to-production.sh`

**Ce qu'il orchestre automatiquement**:

#### Étape 0: Vérifications Préalables
- ✅ Vérification de l'environnement
- ✅ Détection des changements non commités
- ✅ Vérification de la branche Git

#### Étape 1: Tests Automatisés
- ✅ Exécution des tests Vitest
- ✅ Exécution des tests E2E
- ✅ Validation de tous les flux critiques

#### Étape 2: Build de Production
- ✅ Nettoyage des builds précédents
- ✅ Build optimisé du client
- ✅ Vérification de l'intégrité

#### Étape 3: Configuration Stripe
- ✅ Vérification de la configuration
- ✅ Proposition d'exécuter le script si manquant

#### Étape 4: Variables d'Environnement
- ✅ Vérification des secrets requis
- ✅ Détection des variables manquantes
- ✅ Instructions claires pour les configurer

#### Étape 5: Migrations Base de Données
- ✅ Exécution des migrations Drizzle
- ✅ Synchronisation du schéma
- ✅ Vérification de l'intégrité

#### Étape 6: Checkpoint Manus
- ✅ Instructions pour créer un checkpoint
- ✅ Confirmation avant de continuer

#### Étape 7: Publication
- ✅ Instructions pour publier via Manus UI
- ✅ Configuration du domaine
- ✅ Confirmation du déploiement

**Utilisation**:
```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/deploy-to-production.sh
```

**Résultat**:
- Log complet: `deployment-YYYYMMDD-HHMMSS.log`
- Résumé détaillé de chaque étape
- Instructions pour les étapes manuelles
- Checklist de post-déploiement

**Durée**: ~5-10 minutes (selon les confirmations)

---

## 📊 Rapports Générés

### 1. Configuration Stripe

**Fichier**: `STRIPE_PRODUCTION_CONFIG.txt`

Contient:
- 📋 IDs des produits créés (Mensuel + Annuel)
- 🔑 Clés API Live (Publishable + Secret)
- 📝 Instructions de configuration webhook
- ✅ Checklist de mise en production

### 2. Tests E2E

**Fichier**: `E2E_TEST_REPORT.md`

Contient:
- ✅ Liste des tests réussis
- ❌ Liste des tests échoués (avec détails)
- ⚠️ Avertissements et recommandations
- 📸 Références aux screenshots
- 🎯 Taux de réussite global
- 📝 Prochaines étapes

**Dossier**: `test-screenshots/`

Contient:
- `01-homepage.png` - Page d'accueil
- `02-navigation.png` - Menu de navigation
- `03-tools-page.png` - Page Outils
- `04-signup-form.png` - Formulaire d'inscription
- `05-pricing-page.png` - Page Tarifs
- `06-responsive-mobile.png` - Vue mobile
- `06-responsive-tablet.png` - Vue tablette
- `06-responsive-desktop.png` - Vue desktop

### 3. Déploiement

**Fichier**: `deployment-YYYYMMDD-HHMMSS.log`

Contient:
- 📋 Sortie complète de toutes les commandes
- ✅ Statut de chaque étape
- ❌ Erreurs détaillées si échec
- ⏱️ Timestamps de chaque action

---

## 🔧 Configuration Requise

### Variables d'Environnement Obligatoires

Configurez ces variables dans **Manus Settings → Secrets**:

```env
# Application
VITE_APP_TITLE=Sionohmair Insight Academy
VITE_APP_LOGO=/logo.svg

# Base de données
DATABASE_URL=postgresql://...

# Authentification
JWT_SECRET=votre-secret-jwt-securise

# Stripe Production (après exécution du script)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Dépendances Système

Les scripts installent automatiquement:
- ✅ Stripe CLI (si manquant)
- ✅ Playwright (pour tests E2E)
- ✅ Toutes les dépendances npm

---

## 🎯 Workflow Recommandé

### Première Mise en Production

```bash
# 1. Configuration Stripe (une seule fois)
./scripts/configure-stripe-production.sh

# 2. Copier les secrets dans Manus Settings → Secrets
# (suivez les instructions dans STRIPE_PRODUCTION_CONFIG.txt)

# 3. Configurer le webhook Stripe
# URL: https://votre-domaine.com/api/stripe/webhook
# Événements: customer.subscription.*, invoice.payment_*

# 4. Lancer les tests
BASE_URL=http://localhost:3000 node scripts/run-e2e-tests.mjs

# 5. Vérifier le rapport de tests
cat E2E_TEST_REPORT.md

# 6. Si tous les tests passent, déployer
./scripts/deploy-to-production.sh

# 7. Suivre les instructions pour:
#    - Créer un checkpoint Manus
#    - Publier via le bouton Publish
#    - Tester en production
```

### Déploiements Suivants

```bash
# 1. Tests rapides
pnpm test
BASE_URL=http://localhost:3000 node scripts/run-e2e-tests.mjs

# 2. Déploiement
./scripts/deploy-to-production.sh
```

---

## 🐛 Dépannage

### Erreur: "Stripe CLI not found"

**Solution**:
```bash
# Le script l'installe automatiquement, mais si problème:
# Linux
curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update && sudo apt install stripe

# macOS
brew install stripe/stripe-cli/stripe
```

### Erreur: "Tests E2E échoués"

**Solution**:
1. Consultez `E2E_TEST_REPORT.md` pour les détails
2. Vérifiez les screenshots dans `test-screenshots/`
3. Corrigez les erreurs identifiées
4. Relancez les tests

### Erreur: "Variables d'environnement manquantes"

**Solution**:
1. Ouvrez Manus Settings → Secrets
2. Ajoutez les variables manquantes
3. Redémarrez le serveur
4. Relancez le déploiement

### Erreur: "Migration de base de données échouée"

**Solution**:
```bash
# Vérifier la connexion DB
pnpm drizzle-kit studio

# Forcer la migration
pnpm db:push --force

# En cas de problème, rollback
# (utilisez Manus Rollback vers un checkpoint précédent)
```

---

## 📈 Optimisations Post-Déploiement

### 1. Monitoring

Ajoutez ces services (optionnel):
- **Sentry** - Suivi des erreurs
- **Google Analytics** - Analytics utilisateur
- **Stripe Dashboard** - Monitoring des paiements

### 2. Performance

Vérifiez:
- ✅ Lighthouse Score (viser 90+)
- ✅ Core Web Vitals
- ✅ Temps de chargement < 3s

### 3. SEO

Optimisez:
- ✅ Meta descriptions uniques par page
- ✅ Open Graph images
- ✅ Sitemap.xml
- ✅ Robots.txt

### 4. Sécurité

Configurez:
- ✅ HTTPS (automatique avec Manus)
- ✅ CSP Headers
- ✅ Rate Limiting
- ✅ CORS approprié

---

## 🎓 Ressources Supplémentaires

### Documentation Stripe

- [Stripe Dashboard](https://dashboard.stripe.com)
- [Webhooks Stripe](https://dashboard.stripe.com/webhooks)
- [Test Cards](https://stripe.com/docs/testing)

### Documentation Manus

- [Manus Dashboard](https://manus.im)
- [Settings → Secrets](https://manus.im/settings/secrets)
- [Support](https://help.manus.im)

### Tests

- [Playwright Docs](https://playwright.dev)
- [Vitest Docs](https://vitest.dev)

---

## ✅ Checklist de Déploiement

Avant de déployer, vérifiez:

- [ ] ✅ Tous les tests Vitest passent
- [ ] ✅ Tous les tests E2E passent (>90%)
- [ ] ✅ Configuration Stripe Production complète
- [ ] ✅ Tous les secrets configurés dans Manus
- [ ] ✅ Webhook Stripe configuré
- [ ] ✅ Migrations DB appliquées
- [ ] ✅ Build de production réussi
- [ ] ✅ Checkpoint Manus créé
- [ ] ✅ Application publiée
- [ ] ✅ Tests en production OK
- [ ] ✅ Paiement test réel effectué

---

## 🎉 Félicitations !

Votre application **Sionohmair Insight Academy** est maintenant en production avec:

- ✅ **10+ outils de copywriting IA** prêts à l'emploi
- ✅ **Système de paiement Stripe** entièrement fonctionnel
- ✅ **Authentification sécurisée** avec gestion des utilisateurs
- ✅ **Design moderne et responsive** sur tous les appareils
- ✅ **Performance optimisée** pour une expérience fluide
- ✅ **Tests automatisés** pour garantir la qualité
- ✅ **Monitoring et analytics** pour suivre la croissance

**Prochaine étape**: Partagez votre application avec vos premiers utilisateurs et commencez à générer des revenus ! 🚀

---

*Guide généré automatiquement - Sionohmair Insight Academy*  
*Dernière mise à jour: Décembre 2025*
