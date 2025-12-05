# 🤖 Guide d'Automatisation Complète

Ce guide explique comment utiliser les scripts d'automatisation pour configurer votre site en **un seul clic**.

---

## 🎯 Vue d'ensemble

Trois scripts d'automatisation ont été créés pour vous faire gagner du temps :

| Script | Fonction | Temps estimé |
|--------|----------|--------------|
| `auto-setup-stripe-webhook.mjs` | Configure automatiquement le webhook Stripe | ~30 secondes |
| `auto-setup-playwright.mjs` | Installe et configure les tests E2E | ~3-5 minutes |
| `auto-setup-sentry.mjs` | Configure le monitoring d'erreurs (avec fallback) | ~1 minute |
| `auto-setup-all.mjs` | **Exécute les 3 scripts en une fois** | ~5-10 minutes |

---

## ⚡ Utilisation rapide (Recommandé)

### Option 1 : Tout automatiser en une commande

```bash
cd /home/ubuntu/sionohmair-insight-academy
node scripts/auto-setup-all.mjs
```

**C'est tout !** Le script va :
- ✅ Configurer le webhook Stripe automatiquement
- ✅ Installer Playwright et créer les tests E2E
- ✅ Configurer Sentry (ou activer le fallback local)
- ✅ Générer un rapport détaillé dans `logs/automation-report.json`

---

## 🔧 Utilisation avancée (Scripts individuels)

### 1️⃣ Webhook Stripe

**Quand l'utiliser :** Après avoir activé votre compte Stripe en production

```bash
node scripts/auto-setup-stripe-webhook.mjs
```

**Ce que fait le script :**
- Détecte automatiquement l'URL de votre site
- Crée le webhook endpoint sur Stripe
- Configure les événements à écouter (paiements, abonnements)
- Sauvegarde le webhook secret dans `.env`

**Prérequis :**
- `STRIPE_SECRET_KEY` configurée dans Settings → Secrets
- Compte Stripe activé (test ou production)

**Résultat :**
```
✅ Webhook créé avec succès
📋 ID : we_1234567890
📍 URL : https://votre-site.manus.space/api/stripe/webhook
🔐 Secret : whsec_xxxxxxxxxxxxx (sauvegardé dans .env)
```

---

### 2️⃣ Tests E2E Playwright

**Quand l'utiliser :** Pour tester automatiquement votre site après chaque modification

```bash
node scripts/auto-setup-playwright.mjs
```

**Ce que fait le script :**
- Installe Playwright et les navigateurs
- Crée 4 suites de tests :
  - `home.spec.ts` : Tests de la page d'accueil
  - `navigation.spec.ts` : Tests de navigation
  - `calculator.spec.ts` : Tests du calculateur de clarté
  - `contact.spec.ts` : Tests des formulaires
- Exécute automatiquement tous les tests
- Génère un rapport HTML

**Commandes disponibles après installation :**
```bash
# Exécuter tous les tests
pnpm exec playwright test

# Interface graphique (recommandé)
pnpm exec playwright test --ui

# Voir le rapport HTML
pnpm exec playwright show-report

# Générer de nouveaux tests
pnpm exec playwright codegen
```

**Résultat :**
```
✅ Playwright installé
✅ 4 suites de tests créées
✅ 12 tests exécutés avec succès
📊 Rapport disponible : playwright-report/index.html
```

---

### 3️⃣ Monitoring Sentry

**Quand l'utiliser :** Pour détecter automatiquement les erreurs en production

```bash
node scripts/auto-setup-sentry.mjs
```

**Ce que fait le script :**

**Cas 1 : Sentry DSN configuré**
- Installe `@sentry/react` et `@sentry/node`
- Configure Sentry pour le frontend et le backend
- Crée un `ErrorBoundary` React
- Active le tracking des erreurs en temps réel

**Cas 2 : Sentry DSN non configuré (Fallback)**
- Crée un système de logging local
- Enregistre les erreurs dans `logs/errors.log`
- Crée un `ErrorBoundary` React avec fallback
- API compatible avec Sentry (migration facile)

**Prérequis (optionnel) :**
- Compte Sentry sur https://sentry.io
- `VITE_SENTRY_DSN` configuré dans Settings → Secrets

**Résultat avec Sentry :**
```
✅ Sentry installé et configuré
📡 Monitoring actif en production
🔔 Alertes automatiques par email
```

**Résultat sans Sentry (Fallback) :**
```
✅ Système de logging local activé
📝 Erreurs enregistrées dans logs/errors.log
📊 Logs consultables localement
```

---

## 📊 Rapport d'automatisation

Après l'exécution de `auto-setup-all.mjs`, un rapport JSON est généré :

**Emplacement :** `logs/automation-report.json`

**Contenu :**
```json
{
  "timestamp": "2025-01-05T20:30:00.000Z",
  "duration": "347s",
  "results": [
    {
      "name": "Webhook Stripe",
      "success": true,
      "code": 0
    },
    {
      "name": "Tests E2E Playwright",
      "success": true,
      "code": 0
    },
    {
      "name": "Monitoring Sentry",
      "success": true,
      "code": 0
    }
  ],
  "summary": {
    "total": 3,
    "success": 3,
    "failed": 0
  }
}
```

---

## 🐛 Dépannage

### Erreur : "STRIPE_SECRET_KEY non trouvée"

**Solution :**
1. Allez dans Settings → Secrets
2. Ajoutez `STRIPE_SECRET_KEY` avec votre clé Stripe
3. Relancez le script

---

### Erreur : "Playwright installation failed"

**Solution :**
```bash
# Installation manuelle
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```

---

### Erreur : "Permission denied"

**Solution :**
```bash
# Rendre les scripts exécutables
chmod +x scripts/*.mjs
```

---

### Les tests Playwright échouent

**Solution :**
1. Vérifiez que le serveur de développement est lancé : `pnpm dev`
2. Vérifiez l'URL dans `playwright.config.ts`
3. Exécutez les tests en mode UI pour voir ce qui se passe :
   ```bash
   pnpm exec playwright test --ui
   ```

---

### Sentry ne capture pas les erreurs

**Solution :**

**Si vous avez configuré Sentry :**
1. Vérifiez que `VITE_SENTRY_DSN` est correct
2. Redémarrez le serveur : `pnpm dev`
3. Testez avec une erreur volontaire

**Si vous utilisez le fallback :**
1. Les erreurs sont dans `logs/errors.log`
2. Vérifiez que le dossier `logs/` existe
3. Les erreurs frontend sont envoyées à `/api/log-error`

---

## 🔄 Mise à jour des scripts

Les scripts sont conçus pour être **idempotents** (réexécutables sans danger).

**Pour mettre à jour une configuration :**
```bash
# Relancer le script individuel
node scripts/auto-setup-stripe-webhook.mjs

# Ou tout relancer
node scripts/auto-setup-all.mjs
```

---

## 📚 Ressources complémentaires

| Guide | Description |
|-------|-------------|
| `GUIDE_STRIPE_PRODUCTION.md` | Activation de Stripe en production |
| `GUIDE_ADMIN_PROMOTION.md` | Promotion d'un utilisateur admin |
| `GUIDE_BLOG_PUBLICATION.md` | Publication d'articles de blog |
| `GUIDE_DEPLOYMENT.md` | Déploiement complet du site |

---

## ✅ Checklist de vérification

Après l'automatisation, vérifiez que tout fonctionne :

### Webhook Stripe
- [ ] Variable `STRIPE_WEBHOOK_SECRET` présente dans `.env`
- [ ] Webhook visible dans le dashboard Stripe
- [ ] Test de paiement avec carte `4242 4242 4242 4242`
- [ ] Email de confirmation reçu
- [ ] Commande créée dans la base de données

### Tests E2E
- [ ] Playwright installé : `pnpm exec playwright --version`
- [ ] Tests exécutables : `pnpm exec playwright test`
- [ ] Rapport HTML généré
- [ ] Tous les tests passent (ou identifier les échecs)

### Monitoring Sentry
- [ ] Fichiers `client/src/lib/sentry.ts` et `server/lib/sentry.ts` créés
- [ ] `ErrorBoundary` créé dans `client/src/components/`
- [ ] Logs d'erreurs enregistrés (Sentry ou `logs/errors.log`)
- [ ] Erreurs capturées correctement

---

## 🎉 Conclusion

Avec ces scripts d'automatisation, vous pouvez configurer votre site en **moins de 10 minutes** au lieu de plusieurs heures de configuration manuelle.

**Commande magique :**
```bash
node scripts/auto-setup-all.mjs
```

**Résultat :**
- ✅ Paiements Stripe automatiques
- ✅ Tests E2E automatisés
- ✅ Monitoring d'erreurs actif
- ✅ Rapport d'automatisation généré

**Temps gagné : ~4-6 heures de configuration manuelle !** 🚀
