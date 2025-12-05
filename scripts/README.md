# 🛠️ Scripts de Configuration - Sionohmair Insight Academy

Ce dossier contient des scripts utiles pour configurer et tester le système d'abonnement.

---

## 📋 Liste des Scripts

### 1. `configure-smtp.sh` - Configuration SMTP Interactive

Script interactif pour configurer l'envoi d'emails avec 3 options :
- Gmail (Gratuit, Simple) ⭐ RECOMMANDÉ
- SendGrid (Professionnel, 100 emails/jour gratuits)
- Brevo (ex-Sendinblue) (300 emails/jour gratuits)

**Usage** :
```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/configure-smtp.sh
```

Le script vous guidera pas à pas et générera les variables d'environnement à copier dans Manus → Settings → Secrets.

---

### 2. `test-system.sh` - Test Automatique du Système

Script de test automatique qui vérifie :
- ✅ Cron job (emails automatiques)
- ✅ Configuration SMTP
- ✅ Configuration Stripe
- ✅ Base de données

**Usage** :
```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/test-system.sh
```

**Variables d'environnement optionnelles** :
```bash
export APP_URL="https://votre-domaine.manus.space"
export CRON_SECRET="votre-secret"
./scripts/test-system.sh
```

---

## 🚀 Workflow de Configuration

Voici l'ordre recommandé pour configurer le système :

### Étape 1 : Lire la documentation

```bash
cat CONFIGURATION_FINALE.md
```

### Étape 2 : Configurer le CRON_SECRET

1. Copiez le secret généré dans `CONFIGURATION_FINALE.md` :
   ```
   7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=
   ```

2. Ajoutez-le dans :
   - **GitHub** → Settings → Secrets → Actions → `CRON_SECRET`
   - **Manus** → Settings → Secrets → `CRON_SECRET`

### Étape 3 : Configurer SMTP

```bash
./scripts/configure-smtp.sh
```

Suivez les instructions et copiez les variables dans Manus → Settings → Secrets.

### Étape 4 : Configurer Stripe

1. Activez votre compte Stripe (voir `CONFIGURATION_FINALE.md`)
2. Créez le produit "Abonnement Sionohmair" (36€/mois)
3. Ajoutez les clés API dans Manus → Settings → Secrets

### Étape 5 : Tester le système

```bash
./scripts/test-system.sh
```

Vérifiez que tous les tests passent.

---

## 📚 Documentation Complète

- **CONFIGURATION_FINALE.md** : Guide complet de configuration (3 étapes)
- **CRON_AUTOMATION.md** : Documentation du cron job automatique
- **GUIDE_UTILISATEUR.md** : Guide utilisateur pour les abonnés

---

## 🆘 Dépannage

### Le cron job ne fonctionne pas

1. Vérifiez que `CRON_SECRET` est identique dans GitHub et Manus
2. Testez manuellement :
   ```bash
   curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"secret":"VOTRE_SECRET"}' \
     https://votre-domaine.manus.space/api/trpc/cron.checkTrialExpirations
   ```

### Les emails ne sont pas envoyés

1. Vérifiez que les variables SMTP sont configurées dans Manus → Settings → Secrets
2. Testez avec `./scripts/configure-smtp.sh`
3. Vérifiez les logs du serveur

### Le paiement Stripe ne fonctionne pas

1. Vérifiez que les clés API Stripe sont correctes
2. Vérifiez que le webhook est configuré
3. Testez avec la carte de test : `4242 4242 4242 4242`

---

## 📞 Support

Pour toute question :
- Consultez `CONFIGURATION_FINALE.md`
- Exécutez `./scripts/test-system.sh` pour diagnostiquer
- Vérifiez les logs du serveur dans Manus

---

**Bon déploiement ! 🚀**


---

## 🤖 Scripts d'Automatisation Avancée

### 3. `auto-setup-all.mjs` - Automatisation Complète (NOUVEAU)

**Description :** Script maître qui configure automatiquement les 3 systèmes avancés en une seule commande

**Utilisation :**
```bash
node scripts/auto-setup-all.mjs
```

**Durée :** ~5-10 minutes

**Ce qu'il fait :**
1. ✅ Configure le webhook Stripe automatiquement
2. ✅ Installe et configure les tests E2E Playwright
3. ✅ Active le monitoring Sentry (ou fallback local)
4. 📊 Génère un rapport dans `logs/automation-report.json`

**Résultat :**
```
✅ Webhook Stripe configuré
✅ Tests E2E Playwright prêts
✅ Monitoring d'erreurs actif
⏱️  Temps gagné : ~4-6 heures !
```

---

### 4. `auto-setup-stripe-webhook.mjs` - Webhook Stripe

**Description :** Configure automatiquement le webhook Stripe pour les paiements

**Utilisation :**
```bash
node scripts/auto-setup-stripe-webhook.mjs
```

**Prérequis :**
- Variable `STRIPE_SECRET_KEY` configurée dans Settings → Secrets

**Ce qu'il fait :**
1. Se connecte à votre compte Stripe
2. Crée (ou met à jour) le webhook endpoint
3. Configure les événements à écouter
4. Sauvegarde le webhook secret dans `.env`

---

### 5. `auto-setup-playwright.mjs` - Tests E2E

**Description :** Installe et configure les tests E2E automatisés

**Utilisation :**
```bash
node scripts/auto-setup-playwright.mjs
```

**Ce qu'il fait :**
1. Installe Playwright et les navigateurs
2. Crée 4 suites de tests (accueil, navigation, calculateur, formulaires)
3. Exécute automatiquement tous les tests
4. Génère un rapport HTML

**Commandes après installation :**
```bash
# Exécuter les tests
pnpm exec playwright test

# Interface graphique
pnpm exec playwright test --ui

# Voir le rapport
pnpm exec playwright show-report
```

---

### 6. `auto-setup-sentry.mjs` - Monitoring d'erreurs

**Description :** Configure le monitoring d'erreurs (Sentry ou fallback local)

**Utilisation :**
```bash
node scripts/auto-setup-sentry.mjs
```

**Mode automatique :**
- **Si `VITE_SENTRY_DSN` est configuré** → Installe et configure Sentry
- **Si `VITE_SENTRY_DSN` n'est pas configuré** → Active le système de fallback local

**Fallback local (sans Sentry) :**
- ✅ Logging des erreurs dans `logs/errors.log`
- ✅ Logging des accès dans `logs/access.log`
- ✅ ErrorBoundary React pour capturer les erreurs
- ✅ API compatible avec Sentry (migration facile)

---

## 📚 Documentation d'Automatisation

Pour plus de détails sur l'automatisation, consultez :
- `docs/GUIDE_AUTOMATISATION.md` - Guide complet d'automatisation
- `logs/automation-report.json` - Rapport d'exécution

---

## ✅ Checklist d'Automatisation

Après avoir exécuté `auto-setup-all.mjs`, vérifiez :

- [ ] Webhook Stripe visible dans le dashboard Stripe
- [ ] Tests Playwright exécutables : `pnpm exec playwright test`
- [ ] Logs d'erreurs enregistrés (Sentry ou `logs/errors.log`)
- [ ] Rapport d'automatisation généré : `logs/automation-report.json`

---

## 🎯 Workflow Complet de Configuration

### Configuration Manuelle (Ancienne méthode)
1. Configurer SMTP : `./scripts/configure-smtp.sh`
2. Configurer Stripe manuellement
3. Tester : `./scripts/test-system.sh`

### Configuration Automatique (Nouvelle méthode) ⭐ RECOMMANDÉ
```bash
# Une seule commande pour tout automatiser !
node scripts/auto-setup-all.mjs
```

**Temps gagné : ~4-6 heures de configuration manuelle !** 🚀
