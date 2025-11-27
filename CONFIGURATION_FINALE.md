# 🔧 Configuration Finale - Sionohmair Insight Academy

Ce guide vous aide à configurer les **3 dernières étapes** pour activer le système d'abonnement en production.

---

## 1️⃣ Configuration du Cron Job Automatique (GitHub Actions)

### Secret Généré pour Vous

Votre `CRON_SECRET` unique et sécurisé :

```
7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=
```

⚠️ **Important** : Ce secret doit être configuré à **2 endroits** (GitHub + Manus).

---

### Étape 1 : Configurer GitHub Secrets

1. Allez sur **GitHub** → Votre repository → **Settings** → **Secrets and variables** → **Actions**
2. Cliquez sur **New repository secret**
3. Ajoutez les 2 secrets suivants :

#### Secret 1 : CRON_SECRET

- **Name** : `CRON_SECRET`
- **Value** : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`

#### Secret 2 : APP_URL

- **Name** : `APP_URL`
- **Value** : `https://sionohmair-insight-academy.manus.space`

*(Remplacez par votre vrai domaine Manus)*

---

### Étape 2 : Configurer le Secret sur le Serveur Manus

1. Allez dans **Manus** → Votre projet → **Settings** → **Secrets**
2. Cliquez sur **Add Secret**
3. Ajoutez :

- **Key** : `CRON_SECRET`
- **Value** : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`

---

### Étape 3 : Tester le Cron Job

1. Allez sur **GitHub** → **Actions**
2. Sélectionnez "Check Trial Expirations Daily"
3. Cliquez sur **Run workflow** → **Run workflow**
4. Vérifiez les logs pour confirmer le succès

**Résultat attendu** :
```
✅ Trial expirations checked successfully
```

---

## 2️⃣ Configuration SMTP (Envoi d'Emails)

Choisissez l'une des 3 options ci-dessous :

---

### Option A : Gmail (Gratuit, Simple) ⭐ RECOMMANDÉ

#### Étape 1 : Créer un compte Gmail dédié

1. Créez un nouveau compte Gmail : https://accounts.google.com/signup
2. Exemple : `noreply.sionohmair@gmail.com`

#### Étape 2 : Activer l'authentification à 2 facteurs

1. Allez sur https://myaccount.google.com/security
2. Activez **"Validation en deux étapes"**

#### Étape 3 : Générer un mot de passe d'application

1. Allez sur https://myaccount.google.com/apppasswords
2. Sélectionnez **"Autre (nom personnalisé)"**
3. Entrez : `Sionohmair Insight Academy`
4. Cliquez sur **Générer**
5. **Copiez le mot de passe** (16 caractères, ex: `abcd efgh ijkl mnop`)

#### Étape 4 : Configurer dans Manus

Allez dans **Manus** → **Settings** → **Secrets** et ajoutez :

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply.sionohmair@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM=noreply.sionohmair@gmail.com
```

*(Remplacez par vos vraies valeurs)*

---

### Option B : SendGrid (Professionnel, 100 emails/jour gratuits)

#### Étape 1 : Créer un compte SendGrid

1. Allez sur https://sendgrid.com
2. Créez un compte gratuit

#### Étape 2 : Créer une clé API

1. Allez sur **Settings** → **API Keys**
2. Cliquez sur **Create API Key**
3. Nom : `Sionohmair Insight Academy`
4. Permissions : **Full Access**
5. Cliquez sur **Create & View**
6. **Copiez la clé API** (commence par `SG.`)

#### Étape 3 : Configurer dans Manus

Allez dans **Manus** → **Settings** → **Secrets** et ajoutez :

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.votre-cle-api-sendgrid
SMTP_FROM=noreply@votre-domaine.com
```

---

### Option C : Brevo (ex-Sendinblue) (300 emails/jour gratuits)

#### Étape 1 : Créer un compte Brevo

1. Allez sur https://brevo.com
2. Créez un compte gratuit

#### Étape 2 : Créer une clé SMTP

1. Allez sur **Settings** → **SMTP & API**
2. Cliquez sur **Generate a new SMTP key**
3. Nom : `Sionohmair Insight Academy`
4. **Copiez la clé SMTP**

#### Étape 3 : Configurer dans Manus

Allez dans **Manus** → **Settings** → **Secrets** et ajoutez :

```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=votre-email-brevo@example.com
SMTP_PASS=votre-cle-smtp-brevo
SMTP_FROM=noreply@votre-domaine.com
```

---

## 3️⃣ Configuration Stripe (Paiements)

### Étape 1 : Activer votre compte Stripe

Vous avez un sandbox Stripe créé automatiquement. Pour l'activer :

1. **Cliquez sur ce lien** : https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZFSGJENDV1UzY5TlRlLDE3NjQyODg3Njcv100fQEDeaWE
2. Activez votre compte (⚠️ avant le **2026-01-20**)
3. Complétez les informations de votre entreprise

---

### Étape 2 : Créer le produit "Abonnement Sionohmair"

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

---

### Étape 3 : Récupérer les clés API

#### Mode Test (pour tester d'abord)

1. Allez sur **Stripe Dashboard** → **Developers** → **API keys**
2. Copiez :
   - **Publishable key** : `pk_test_...`
   - **Secret key** : `sk_test_...`

#### Mode Production (quand vous êtes prêt)

1. Activez le **mode Live** (en haut à droite)
2. Copiez :
   - **Publishable key** : `pk_live_...`
   - **Secret key** : `sk_live_...`

---

### Étape 4 : Configurer dans Manus

Allez dans **Manus** → **Settings** → **Secrets** et **mettez à jour** :

#### Mode Test

```
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique
```

#### Mode Production

```
STRIPE_SECRET_KEY=sk_live_votre_cle_secrete
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_publique
```

---

### Étape 5 : Configurer le Webhook Stripe

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

---

### Étape 6 : Ajouter le Webhook Secret dans Manus

Allez dans **Manus** → **Settings** → **Secrets** et **mettez à jour** :

```
STRIPE_WEBHOOK_SECRET=whsec_votre_signing_secret
```

---

## ✅ Vérification Finale

Une fois les 3 étapes configurées, testez :

### 1. Tester le Cron Job

```bash
# Appeler manuellement l'endpoint
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"secret":"7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="}' \
  https://sionohmair-insight-academy.manus.space/api/trpc/cron.checkTrialExpirations
```

**Résultat attendu** : `{"result":{"data":{"success":true,...}}}`

---

### 2. Tester l'envoi d'emails

1. Créez un utilisateur test
2. Créez un essai gratuit avec une date d'expiration dans 7 jours
3. Exécutez le cron job manuellement (voir ci-dessus)
4. Vérifiez que vous recevez bien l'email J-7

---

### 3. Tester le paiement Stripe

1. Allez sur `/subscription`
2. Cliquez sur **"S'abonner maintenant (36€/mois)"**
3. Utilisez la carte de test Stripe :
   - **Numéro** : `4242 4242 4242 4242`
   - **Date** : N'importe quelle date future
   - **CVC** : N'importe quel 3 chiffres
4. Validez le paiement
5. Vérifiez que votre statut passe à "Actif"

---

## 🎉 Félicitations !

Votre système d'abonnement est maintenant **100% opérationnel** !

- ✅ Cron job automatique (emails J-7, J-3, J-1, J-0)
- ✅ Envoi d'emails configuré
- ✅ Paiements Stripe activés
- ✅ Webhooks synchronisés

**Votre plateforme est prête pour la production ! 🚀**
