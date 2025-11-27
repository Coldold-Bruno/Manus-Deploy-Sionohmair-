# 🔍 Guide de Vérification Avant Déploiement Production

Ce guide explique comment utiliser le système automatisé de vérification avant de déployer votre application en production.

---

## 📋 Vue d'ensemble

Le système de vérification automatique garantit que **tous les aspects critiques** de votre application sont correctement configurés avant le déploiement en production. Il évalue 10 catégories différentes et attribue un **score sur 100**.

### ✅ Critères de validation

- **Score minimum requis** : **90/100**
- **Durée de la vérification** : 2-3 minutes
- **Rapport détaillé** : Généré automatiquement

---

## 🚀 Utilisation rapide

### 1. Vérification complète avant déploiement

```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/pre-deploy-check.sh
```

Ce script :
- ✅ Vérifie **toutes les configurations critiques**
- ✅ Teste les **connexions** (base de données, SMTP, Stripe)
- ✅ Valide les **secrets** et la **sécurité**
- ✅ Exécute les **tests unitaires**
- ✅ Vérifie les **backups** et les **cron jobs**
- ✅ Génère un **rapport détaillé**

### 2. Validation approfondie des configurations

```bash
./scripts/validate-config.sh
```

Ce script valide en profondeur :
- 🔐 Configuration SMTP (host, port, user, password)
- 💳 Configuration Stripe (clés, mode, webhook)
- 🗄️ Base de données (connexion, migrations)
- 🔑 GitHub Secrets (CRON_SECRET, APP_URL)
- 🎫 JWT Secret
- 🔒 OAuth (APP_ID, OWNER_OPEN_ID, etc.)

### 3. Génération du rapport de validation

```bash
./scripts/generate-validation-report.sh
```

Ce script génère un rapport Markdown complet avec :
- 📊 Score global et par catégorie
- ✅ Liste des vérifications réussies
- ⚠️  Liste des avertissements
- ❌ Liste des erreurs critiques
- 🔧 Recommandations d'actions correctives
- 📚 Liens vers la documentation

---

## 📊 Catégories de vérification

### 1. Environnement (15 points)
- ✅ Node.js installé et version correcte
- ✅ pnpm installé
- ✅ Dépendances Node.js installées (node_modules)

### 2. Base de données (15 points)
- ✅ Variable DATABASE_URL configurée
- ✅ Connexion à la base de données fonctionnelle
- ✅ Migrations appliquées

### 3. Secrets & Configuration (30 points)
- ✅ CRON_SECRET configuré (≥32 caractères)
- ✅ Configuration SMTP complète (host, port, user, pass)
- ✅ Clés Stripe configurées (secret, publishable, webhook)
- ✅ JWT_SECRET configuré (≥32 caractères)

### 4. Système d'emails (10 points)
- ✅ Templates d'emails créés
- ✅ Test d'envoi d'email réussi

### 5. Tâches planifiées (10 points)
- ✅ Workflow GitHub Actions configuré
- ✅ Endpoint cron sécurisé avec CRON_SECRET

### 6. Sauvegardes (15 points)
- ✅ Script de backup configuré
- ✅ Cron de backup configuré
- ✅ Test de backup réussi

### 7. Tests (10 points)
- ✅ Configuration vitest présente
- ✅ Tous les tests unitaires passent

### 8. Sécurité (10 points)
- ✅ .env protégé par .gitignore
- ✅ Pas de secrets hardcodés dans le code
- ✅ HTTPS configuré (APP_URL)

### 9. Stripe (5 points)
- ✅ Produits Stripe configurés dans le code
- ✅ Webhook Stripe configuré

### 10. Documentation (5 points)
- ✅ Guides essentiels présents (START_HERE.md, etc.)

---

## 🎯 Interprétation des résultats

### ✅ Score ≥ 90% : Déploiement autorisé

```
✅ DÉPLOIEMENT AUTORISÉ

Le système a passé toutes les vérifications critiques.
Vous pouvez procéder au déploiement en production.

Prochaine étape : ./scripts/deploy-production.sh
```

**Actions recommandées** :
1. Exécutez `./scripts/deploy-production.sh`
2. Activez Stripe en mode Live
3. Testez le flux complet (inscription → paiement → accès)
4. Configurez le monitoring (Sentry, Uptime Robot)
5. Annoncez le lancement ! 🎉

---

### ⚠️  Score 75-89% : Déploiement possible avec réserves

```
⚠️  DÉPLOIEMENT POSSIBLE AVEC RÉSERVES

Certaines vérifications ont échoué ou généré des avertissements.
Veuillez corriger les erreurs critiques avant de déployer.
```

**Actions recommandées** :
1. Consultez le rapport détaillé
2. Corrigez les erreurs critiques
3. Vérifiez les avertissements
4. Exécutez à nouveau la vérification
5. Procédez au déploiement une fois le score ≥ 90%

---

### ❌ Score < 75% : Déploiement non recommandé

```
❌ DÉPLOIEMENT NON RECOMMANDÉ

Le système a obtenu un score insuffisant.
Trop d'erreurs critiques ont été détectées.
```

**Actions critiques requises** :
1. Consultez le rapport détaillé
2. Corrigez **TOUTES** les erreurs critiques
3. Configurez les secrets manquants
4. Testez chaque composant individuellement
5. Exécutez à nouveau la vérification

---

## 🔧 Correction des erreurs courantes

### ❌ DATABASE_URL non configurée

**Solution** :
1. Allez dans **Manus → Settings → Secrets**
2. Ajoutez la variable `DATABASE_URL`
3. Format : `mysql://user:password@host:port/database`

### ❌ Configuration SMTP incomplète

**Solution** :
```bash
./scripts/setup-manus-secrets.sh
```

Ce script vous guidera pour configurer :
- `SMTP_HOST` (ex: smtp.gmail.com)
- `SMTP_PORT` (ex: 587)
- `SMTP_USER` (votre email)
- `SMTP_PASS` (mot de passe d'application)

### ❌ CRON_SECRET non configuré

**Solution** :
```bash
./scripts/setup-github-secrets.sh
```

Ce script génère automatiquement un `CRON_SECRET` sécurisé et vous guide pour l'ajouter dans GitHub Secrets.

### ❌ Clés Stripe non configurées

**Solution** :
1. Allez sur [Stripe Dashboard](https://dashboard.stripe.com)
2. Mode **Test** : `Developers → API keys`
3. Copiez les clés :
   - `pk_test_...` → `VITE_STRIPE_PUBLISHABLE_KEY`
   - `sk_test_...` → `STRIPE_SECRET_KEY`
4. Créez un webhook : `Developers → Webhooks`
   - URL : `https://votre-app.manus.space/api/stripe/webhook`
   - Events : `customer.subscription.*`, `invoice.payment_*`
   - Copiez le secret : `whsec_...` → `STRIPE_WEBHOOK_SECRET`
5. Ajoutez les 3 variables dans **Manus → Settings → Secrets**

### ❌ Script de backup non configuré

**Solution** :
```bash
./scripts/setup-backups.sh
```

Ce script configure automatiquement :
- Le script de backup `/home/ubuntu/backups/backup-db.sh`
- Le cron job quotidien (3h du matin)
- Le système de rotation (7 jours)

### ❌ Tests échouent

**Solution** :
```bash
# Exécuter les tests en mode verbose
pnpm test

# Identifier les tests qui échouent
# Corriger les erreurs dans le code
# Exécuter à nouveau les tests
```

### ❌ Secrets hardcodés détectés

**Solution** :
1. Recherchez les secrets dans le code :
   ```bash
   grep -r "sk_live_" --include="*.ts" --include="*.tsx" .
   ```
2. Remplacez les secrets hardcodés par des variables d'environnement :
   ```typescript
   // ❌ Mauvais
   const stripeKey = "sk_live_abc123";
   
   // ✅ Bon
   const stripeKey = process.env.STRIPE_SECRET_KEY;
   ```
3. Ajoutez les variables dans **Manus → Settings → Secrets**

---

## 📄 Rapports générés

### 1. Rapport de pré-vérification

**Nom** : `pre-deploy-report-YYYYMMDD-HHMMSS.md`

**Contenu** :
- Score global et pourcentage
- Résultat (autorisé / réserves / non recommandé)
- Vérifications réussies
- Avertissements
- Erreurs critiques
- Actions correctives recommandées
- Checklist finale

### 2. Rapport de validation détaillé

**Nom** : `VALIDATION_REPORT_YYYYMMDD_HHMMSS.md`

**Contenu** :
- Badge de statut visuel
- Score global et par catégorie
- Tableau récapitulatif
- Détails par catégorie
- Ressources et documentation
- Checklist finale avant déploiement

---

## 🔄 Workflow complet de déploiement

### Étape 1 : Préparation

```bash
# 1. Installer les dépendances
pnpm install

# 2. Configurer les secrets
./scripts/setup-manus-secrets.sh
./scripts/setup-github-secrets.sh

# 3. Configurer les backups
./scripts/setup-backups.sh

# 4. Tester les emails
node scripts/test-email.mjs
```

### Étape 2 : Vérification

```bash
# 1. Validation des configurations
./scripts/validate-config.sh

# 2. Vérification complète
./scripts/pre-deploy-check.sh

# 3. Génération du rapport détaillé
./scripts/generate-validation-report.sh
```

### Étape 3 : Correction (si nécessaire)

```bash
# Consultez les rapports générés
cat pre-deploy-report-*.md
cat VALIDATION_REPORT_*.md

# Corrigez les erreurs identifiées
# Exécutez à nouveau la vérification
./scripts/pre-deploy-check.sh
```

### Étape 4 : Déploiement

```bash
# Une fois le score ≥ 90%
./scripts/deploy-production.sh
```

---

## 🎯 Checklist manuelle finale

Avant d'exécuter `deploy-production.sh`, vérifiez manuellement :

### Configuration Manus
- [ ] Tous les secrets configurés dans **Settings → Secrets**
- [ ] Base de données accessible
- [ ] SMTP fonctionnel (test d'email réussi)
- [ ] Stripe configuré (clés + webhook)

### Configuration GitHub
- [ ] Repository créé
- [ ] Secrets GitHub configurés (CRON_SECRET, APP_URL, DATABASE_URL)
- [ ] Workflow GitHub Actions activé

### Tests
- [ ] Tests unitaires passent (`pnpm test`)
- [ ] Email de test reçu
- [ ] Paiement test réussi (mode test Stripe)
- [ ] Cron job testé manuellement

### Backups
- [ ] Script de backup configuré
- [ ] Cron de backup configuré
- [ ] Backup de test réussi
- [ ] Vérification de la restauration

### Sécurité
- [ ] Pas de secrets hardcodés dans le code
- [ ] .env dans .gitignore
- [ ] HTTPS configuré
- [ ] JWT_SECRET sécurisé (≥32 caractères)

---

## 📚 Documentation complémentaire

- **[START_HERE.md](./START_HERE.md)** : Guide de démarrage rapide
- **[DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md)** : Démarrage en 5 minutes
- **[GUIDE_AUTOMATISATION.md](./GUIDE_AUTOMATISATION.md)** : Automatisation complète
- **[CERTIFICATION_FINALE.md](./CERTIFICATION_FINALE.md)** : Certification de production

---

## 🆘 Support

Si vous rencontrez des difficultés :

1. **Consultez les rapports générés** pour identifier les problèmes
2. **Exécutez les scripts de configuration** pour automatiser la mise en place
3. **Vérifiez les logs** pour identifier les erreurs spécifiques
4. **Testez chaque composant** individuellement avant le déploiement global

---

## 🎉 Félicitations !

Une fois que votre système obtient un score ≥ 90%, vous êtes prêt à déployer en production ! 🚀

Le système de vérification automatique vous garantit que tous les aspects critiques sont correctement configurés, minimisant ainsi les risques de problèmes en production.

**Bonne chance avec votre déploiement ! 🎊**
