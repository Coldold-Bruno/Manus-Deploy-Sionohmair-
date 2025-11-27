# 🎯 Guide de Finalisation - Sionohmair Insight Academy

Ce guide vous accompagne pour **finaliser les 3 dernières étapes** et rendre le système **100% opérationnel en production**.

---

## ✅ État Actuel

Votre système d'abonnement est **presque prêt** ! Voici ce qui est déjà en place :

| Composant | État | Description |
|-----------|------|-------------|
| 🌐 **Site web** | ✅ Opérationnel | Toutes les pages et fonctionnalités |
| 💾 **Base de données** | ✅ Configurée | Schéma complet (users, trials, subscriptions) |
| 🔐 **Authentification** | ✅ Active | Inscription, connexion, OAuth |
| 📧 **Templates emails** | ✅ Créés | 7 emails automatiques (bienvenue, J-7, J-3, etc.) |
| ⏰ **Cron job** | ✅ Configuré | GitHub Actions prêt |
| 💳 **Stripe** | ⚠️ À activer | Sandbox créé, à configurer |
| 📨 **SMTP** | ⚠️ À configurer | Variables à ajouter |
| 🔑 **Secrets** | ⚠️ À configurer | GitHub + Manus |

---

## 🚀 Les 3 Dernières Étapes

### Étape 1 : Configurer les Secrets (5 minutes)

#### Option A : Automatique (Recommandé) ⭐

```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/setup-all.sh
```

Ce script va :
1. Configurer automatiquement les secrets GitHub (CRON_SECRET, APP_URL)
2. Vous guider pour configurer les secrets Manus (CRON_SECRET, SMTP_*)
3. Tester automatiquement la configuration

**Durée** : 5-10 minutes

#### Option B : Manuel

Si vous préférez configurer manuellement, suivez le guide détaillé : [CONFIGURATION_FINALE.md](./CONFIGURATION_FINALE.md)

---

### Étape 2 : Activer Stripe (10 minutes)

#### 2.1 Activer votre compte Stripe

1. **Cliquez sur ce lien** : https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZFSGJENDV1UzY5TlRlLDE3NjQyODg3Njcv100fQEDeaWE
2. Activez votre compte (⚠️ **avant le 2026-01-20**)
3. Complétez les informations de votre entreprise

#### 2.2 Créer le produit "Abonnement Mensuel"

1. Allez sur **Stripe Dashboard** → **Products** → **Add product**
2. Remplissez :

| Champ | Valeur |
|-------|--------|
| **Name** | `Abonnement Sionohmair Insight Academy` |
| **Description** | `Accès complet à tous les outils de Content Marketing & Copywriting` |
| **Pricing** | `36 EUR` |
| **Billing period** | `Monthly` (Mensuel) |
| **Recurring** | ✅ Activé |

3. Cliquez sur **Save product**
4. **Copiez le Price ID** (commence par `price_...`)

#### 2.3 Récupérer les clés API (Mode Test)

1. Allez sur **Stripe Dashboard** → **Developers** → **API keys**
2. Copiez :
   - **Publishable key** : `pk_test_...`
   - **Secret key** : `sk_test_...`

#### 2.4 Configurer dans Manus

1. Allez dans **Manus** → **Settings** → **Secrets**
2. **Mettez à jour** (ou ajoutez si absent) :

```
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique
```

#### 2.5 Configurer le Webhook Stripe

1. Allez sur **Stripe Dashboard** → **Developers** → **Webhooks**
2. Cliquez sur **Add endpoint**
3. Remplissez :

| Champ | Valeur |
|-------|--------|
| **Endpoint URL** | `https://sionohmair-insight-academy.manus.space/api/stripe/webhook` |
| **Events to send** | Sélectionnez : |
| | ✅ `customer.subscription.created` |
| | ✅ `customer.subscription.updated` |
| | ✅ `customer.subscription.deleted` |
| | ✅ `invoice.payment_succeeded` |
| | ✅ `invoice.payment_failed` |

4. Cliquez sur **Add endpoint**
5. **Copiez le Signing secret** (commence par `whsec_...`)

#### 2.6 Ajouter le Webhook Secret dans Manus

1. Allez dans **Manus** → **Settings** → **Secrets**
2. **Mettez à jour** :

```
STRIPE_WEBHOOK_SECRET=whsec_votre_signing_secret
```

---

### Étape 3 : Tester le Système Complet (5 minutes)

#### 3.1 Test SMTP

```bash
cd /home/ubuntu/sionohmair-insight-academy
node scripts/test-email.mjs
```

**Résultat attendu** : `✅ Test SMTP RÉUSSI`

Si ça échoue, vérifiez que les 5 variables SMTP sont dans Manus → Settings → Secrets.

#### 3.2 Test Cron Job

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"secret":"7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="}' \
  https://sionohmair-insight-academy.manus.space/api/trpc/cron.checkTrialExpirations
```

**Résultat attendu** : `{"result":{"data":{"success":true,...}}}`

#### 3.3 Test Paiement Stripe

1. Allez sur `/subscription`
2. Cliquez sur **"S'abonner maintenant (36€/mois)"**
3. Utilisez la carte de test Stripe :
   - **Numéro** : `4242 4242 4242 4242`
   - **Date** : N'importe quelle date future
   - **CVC** : N'importe quel 3 chiffres
4. Validez le paiement
5. Vérifiez que votre statut passe à "Actif"

#### 3.4 Test Système Complet

```bash
./scripts/test-system.sh
```

**Résultat attendu** :
```
✅ SMTP configuré
✅ Cron job configuré
✅ Base de données OK
✅ Stripe configuré
```

---

## 📊 Dashboard de Configuration

**URL** : https://sionohmair-insight-academy.manus.space/config

Ce dashboard affiche en temps réel :
- ✅ État de chaque configuration (SMTP, CRON, GitHub, Stripe)
- 📋 Variables à copier-coller
- 📝 Instructions détaillées
- 🔗 Liens directs vers les services

---

## 🎯 Checklist Finale

Avant de passer en production, vérifiez que :

- [ ] **GitHub Secrets** : CRON_SECRET et APP_URL configurés
- [ ] **Manus Secrets** : CRON_SECRET et 5 variables SMTP configurées
- [ ] **Stripe** : Compte activé, produit créé, clés API configurées, webhook configuré
- [ ] **Test SMTP** : Email de test reçu avec succès
- [ ] **Test Cron** : Endpoint répond avec `success:true`
- [ ] **Test Paiement** : Paiement test réussi avec carte `4242 4242 4242 4242`
- [ ] **Dashboard** : Toutes les configurations affichent ✅

---

## 🚀 Passage en Production

Une fois tous les tests validés en mode test :

### 1. Passer Stripe en mode Live

1. Allez sur **Stripe Dashboard**
2. Activez le **mode Live** (en haut à droite)
3. Récupérez les nouvelles clés API :
   - **Publishable key** : `pk_live_...`
   - **Secret key** : `sk_live_...`
4. Mettez à jour dans Manus → Settings → Secrets :

```
STRIPE_SECRET_KEY=sk_live_votre_cle_secrete
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_publique
```

5. Créez un nouveau webhook en mode Live (même configuration)
6. Mettez à jour le webhook secret :

```
STRIPE_WEBHOOK_SECRET=whsec_votre_nouveau_signing_secret_live
```

### 2. Configurer un domaine personnalisé (Optionnel)

1. Allez dans **Manus** → **Settings** → **Domains**
2. Ajoutez votre domaine personnalisé (ex: `app.sionohmair.com`)
3. Configurez les DNS selon les instructions
4. Mettez à jour `APP_URL` dans GitHub Secrets

### 3. Activer le monitoring

1. Surveillez le dashboard : `/config`
2. Vérifiez les logs GitHub Actions : **GitHub** → **Actions**
3. Surveillez les emails envoyés dans Stripe Dashboard
4. Vérifiez les paiements dans Stripe Dashboard

---

## 🆘 Dépannage

### Problème : Les emails ne sont pas envoyés

**Solution** :

1. Vérifiez que les 5 variables SMTP sont dans Manus → Settings → Secrets
2. Testez avec `node scripts/test-email.mjs`
3. Vérifiez que le mot de passe d'application Gmail est correct
4. Redémarrez le serveur Manus

### Problème : Le cron job ne fonctionne pas

**Solution** :

1. Vérifiez que `CRON_SECRET` est identique dans GitHub et Manus
2. Vérifiez que `APP_URL` est correct dans GitHub Secrets
3. Testez manuellement avec curl (voir ci-dessus)
4. Vérifiez les logs GitHub Actions

### Problème : Le paiement Stripe échoue

**Solution** :

1. Vérifiez que les 3 clés Stripe sont dans Manus Secrets
2. Vérifiez que le webhook est configuré avec les bons événements
3. Testez avec la carte de test : `4242 4242 4242 4242`
4. Vérifiez les logs dans Stripe Dashboard → Developers → Logs

---

## 📚 Documentation Complète

- **AUTOMATION_README.md** : Guide complet des scripts d'automatisation
- **CONFIGURATION_FINALE.md** : Guide de configuration détaillé (3 étapes)
- **QUICKSTART.md** : Guide de démarrage rapide (10 minutes)
- **CRON_AUTOMATION.md** : Documentation du cron job
- **GUIDE_UTILISATEUR.md** : Guide pour les abonnés

---

## 🎉 Félicitations !

Une fois ces 3 étapes terminées, votre système d'abonnement sera **100% opérationnel** !

- ✅ Cron job automatique (emails J-7, J-3, J-1, J-0)
- ✅ Envoi d'emails configuré
- ✅ Paiements Stripe activés
- ✅ Webhooks synchronisés
- ✅ Dashboard de monitoring

**Votre plateforme est prête pour la production ! 🚀**

---

## 💡 Prochaines Améliorations

Une fois en production, vous pouvez ajouter :

1. **Analytics avancés** : Google Analytics, Mixpanel, Plausible
2. **Chat en direct** : Intercom, Crisp, Tawk.to
3. **Notifications push** : OneSignal, Pusher
4. **A/B Testing** : Optimizely, VWO
5. **Monitoring** : Sentry, LogRocket, Datadog
6. **SEO avancé** : Sitemap dynamique, Schema.org markup
7. **Blog** : Système de publication d'articles
8. **Témoignages vidéo** : Intégration YouTube/Vimeo
9. **Programme de parrainage** : Système de référencement
10. **API publique** : Pour intégrations tierces

---

**Besoin d'aide ?** Consultez le dashboard de configuration : `/config`
