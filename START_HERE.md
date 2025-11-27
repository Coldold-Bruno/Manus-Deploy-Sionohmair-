# 🚀 COMMENCEZ ICI - Sionohmair Insight Academy

## ⚡ Démarrage Ultra-Rapide (5 minutes)

Votre système d'abonnement est **presque prêt** ! Il ne reste que **3 actions** à faire.

---

## ✅ Étape 1 : Configuration Automatique (5 minutes)

### Ouvrez un terminal et exécutez :

```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/setup-all.sh
```

**Ce script va automatiquement :**
1. ✅ Configurer GitHub Secrets (CRON_SECRET, APP_URL)
2. ✅ Vous guider pour configurer Manus Secrets (SMTP)
3. ✅ Tester votre configuration

**Durée** : 5-10 minutes

---

## ✅ Étape 2 : Activer Stripe (10 minutes)

### 2.1 Activer votre compte

**Cliquez sur ce lien** : https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZFSGJENDV1UzY5TlRlLDE3NjQyODg3Njcv100fQEDeaWE

⚠️ **Important** : À faire avant le **20 janvier 2026**

### 2.2 Créer le produit d'abonnement

1. Allez sur **Stripe Dashboard** → **Products** → **Add product**
2. Remplissez :
   - **Name** : `Abonnement Sionohmair Insight Academy`
   - **Price** : `36 EUR`
   - **Billing** : `Monthly` (Mensuel)
   - **Recurring** : ✅ Activé

3. Cliquez sur **Save**

### 2.3 Récupérer les clés API

1. **Stripe Dashboard** → **Developers** → **API keys**
2. Copiez :
   - `pk_test_...` (Publishable key)
   - `sk_test_...` (Secret key)

### 2.4 Ajouter dans Manus

1. **Manus** → **Settings** → **Secrets** → **Add Secret**
2. Ajoutez (ou mettez à jour) :

```
STRIPE_SECRET_KEY=sk_test_votre_cle
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle
```

### 2.5 Configurer le Webhook

1. **Stripe Dashboard** → **Developers** → **Webhooks** → **Add endpoint**
2. **URL** : `https://sionohmair-insight-academy.manus.space/api/stripe/webhook`
3. **Events** : Sélectionnez :
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

4. Copiez le **Signing secret** (commence par `whsec_...`)
5. Ajoutez dans **Manus → Settings → Secrets** :

```
STRIPE_WEBHOOK_SECRET=whsec_votre_secret
```

---

## ✅ Étape 3 : Vérification Finale (2 minutes)

### Exécutez le script de vérification :

```bash
./scripts/verify-final.sh
```

**Ce script vérifie :**
- ✅ Tous les fichiers essentiels
- ✅ Base de données
- ✅ Variables d'environnement
- ✅ Serveur web
- ✅ Endpoints API
- ✅ Configuration GitHub

**Résultat attendu** : Progression à 100%

---

## 🧪 Tests Recommandés

### Test 1 : Email SMTP

```bash
node scripts/test-email.mjs
```

**Résultat attendu** : `✅ Test SMTP RÉUSSI`

### Test 2 : Système Complet

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

### Test 3 : Paiement Stripe

1. Allez sur `/subscription`
2. Cliquez sur **"S'abonner (36€/mois)"**
3. Carte de test : `4242 4242 4242 4242`
4. Date : N'importe quelle date future
5. CVC : N'importe quel 3 chiffres

**Résultat attendu** : Paiement réussi, statut "Actif"

---

## 📊 Dashboard de Configuration

**URL** : https://sionohmair-insight-academy.manus.space/config

Ce dashboard affiche en temps réel :
- ✅ État de chaque configuration
- 📋 Variables à copier-coller
- 📝 Instructions détaillées
- 🔗 Liens directs

---

## 🎯 Checklist Rapide

Cochez au fur et à mesure :

- [ ] Exécuté `./scripts/setup-all.sh`
- [ ] Activé le compte Stripe
- [ ] Créé le produit d'abonnement (36€/mois)
- [ ] Ajouté les clés Stripe dans Manus Secrets
- [ ] Configuré le webhook Stripe
- [ ] Exécuté `./scripts/verify-final.sh` (100%)
- [ ] Testé l'envoi d'email (✅ réussi)
- [ ] Testé le paiement Stripe (✅ réussi)

---

## 🚀 Une Fois Terminé

Votre système est **100% opérationnel** avec :

- ✅ Essai gratuit de 30 jours
- ✅ Abonnement mensuel à 36€
- ✅ Emails automatiques (7 types)
- ✅ Cron job quotidien (9h00)
- ✅ Dashboard admin complet
- ✅ Scoring de leads automatique
- ✅ Paiements Stripe sécurisés

---

## 🆘 Besoin d'Aide ?

### Documentation Complète

- **FINALISATION.md** : Guide détaillé des 3 étapes
- **README.md** : Documentation principale
- **QUICKSTART.md** : Guide de démarrage rapide
- **CONFIGURATION_FINALE.md** : Configuration détaillée

### Scripts Disponibles

```bash
# Configuration complète
./scripts/setup-all.sh

# Vérification finale
./scripts/verify-final.sh

# Tests
./scripts/test-system.sh
node scripts/test-email.mjs
```

### Dashboard

- **Configuration** : `/config`
- **Admin** : `/admin`
- **Dashboard** : `/dashboard`

---

## 💡 Passage en Production

Une fois tous les tests validés en mode test, suivez le guide dans **FINALISATION.md** section "Passage en Production" pour :

1. Passer Stripe en mode Live
2. Configurer un domaine personnalisé (optionnel)
3. Activer le monitoring

---

## 🎉 Félicitations !

Vous êtes à **3 actions** de lancer votre système d'abonnement !

**Temps estimé total** : 15-20 minutes

**Commencez maintenant** : `./scripts/setup-all.sh` 🚀
