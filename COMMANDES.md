# 📋 Commandes Prêtes à Copier-Coller

Toutes les commandes dont vous avez besoin, prêtes à l'emploi.

---

## 🚀 Configuration Automatique

### Tout en une commande (RECOMMANDÉ)

```bash
cd /home/ubuntu/sionohmair-insight-academy && ./scripts/setup-all.sh
```

### Par étapes

```bash
# Étape 1 : GitHub Secrets
cd /home/ubuntu/sionohmair-insight-academy
./scripts/setup-github-secrets.sh

# Étape 2 : Manus Secrets
./scripts/setup-manus-secrets.sh

# Étape 3 : Tests
./scripts/test-system.sh
```

---

## 🧪 Tests

### Test SMTP

```bash
cd /home/ubuntu/sionohmair-insight-academy
node scripts/test-email.mjs
```

### Test Cron Job

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"secret":"7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="}' \
  https://sionohmair-insight-academy.manus.space/api/trpc/cron.checkTrialExpirations
```

### Test Système Complet

```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/test-system.sh
```

### Vérification Finale

```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/verify-final.sh
```

---

## 🔐 Secrets à Configurer

### GitHub Secrets

Allez sur : **GitHub → Settings → Secrets → Actions → New repository secret**

#### Secret 1 : CRON_SECRET

```
Name: CRON_SECRET
Value: 7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=
```

#### Secret 2 : APP_URL

```
Name: APP_URL
Value: https://sionohmair-insight-academy.manus.space
```

### Manus Secrets

Allez sur : **Manus → Settings → Secrets → Add Secret**

#### CRON_SECRET

```
Key: CRON_SECRET
Value: 7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=
```

#### SMTP (Gmail)

```
Key: SMTP_HOST
Value: smtp.gmail.com

Key: SMTP_PORT
Value: 587

Key: SMTP_USER
Value: coldoldbruno@gmail.com

Key: SMTP_PASS
Value: uiqq kpth pjdb oknb

Key: SMTP_FROM
Value: coldoldbruno@gmail.com
```

#### Stripe (Mode Test)

```
Key: STRIPE_SECRET_KEY
Value: sk_test_votre_cle_secrete

Key: VITE_STRIPE_PUBLISHABLE_KEY
Value: pk_test_votre_cle_publique

Key: STRIPE_WEBHOOK_SECRET
Value: whsec_votre_signing_secret
```

---

## 💳 Configuration Stripe

### Webhook URL

```
https://sionohmair-insight-academy.manus.space/api/stripe/webhook
```

### Événements à Sélectionner

```
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.payment_succeeded
invoice.payment_failed
```

---

## 🗄️ Base de Données

### Push du schéma

```bash
cd /home/ubuntu/sionohmair-insight-academy
pnpm db:push
```

### Générer les migrations

```bash
cd /home/ubuntu/sionohmair-insight-academy
pnpm drizzle-kit generate
```

---

## 🛠️ Développement

### Démarrer le serveur

```bash
cd /home/ubuntu/sionohmair-insight-academy
pnpm dev
```

### Build pour la production

```bash
cd /home/ubuntu/sionohmair-insight-academy
pnpm build
```

### Installer les dépendances

```bash
cd /home/ubuntu/sionohmair-insight-academy
pnpm install
```

---

## 📊 URLs Importantes

### Application

```
Production: https://sionohmair-insight-academy.manus.space
Dashboard Config: https://sionohmair-insight-academy.manus.space/config
Admin: https://sionohmair-insight-academy.manus.space/admin
Dashboard User: https://sionohmair-insight-academy.manus.space/dashboard
```

### Services Externes

```
GitHub Actions: https://github.com/votre-username/sionohmair-insight-academy/actions
Stripe Dashboard: https://dashboard.stripe.com
Stripe Sandbox: https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZFSGJENDV1UzY5TlRlLDE3NjQyODg3Njcv100fQEDeaWE
Manus Settings: https://manus.im (Settings → Secrets)
```

---

## 🔍 Vérifications

### Vérifier que le serveur répond

```bash
curl -I https://sionohmair-insight-academy.manus.space
```

### Vérifier le dashboard de config

```bash
curl https://sionohmair-insight-academy.manus.space/config
```

### Vérifier l'API tRPC

```bash
curl https://sionohmair-insight-academy.manus.space/api/trpc
```

---

## 🧹 Nettoyage

### Supprimer node_modules

```bash
cd /home/ubuntu/sionohmair-insight-academy
rm -rf node_modules
pnpm install
```

### Nettoyer le cache

```bash
cd /home/ubuntu/sionohmair-insight-academy
rm -rf .vite
rm -rf dist
pnpm build
```

---

## 📝 Git

### Initialiser le repository

```bash
cd /home/ubuntu/sionohmair-insight-academy
git init
git add .
git commit -m "Initial commit - Sionohmair Insight Academy"
```

### Ajouter la remote GitHub

```bash
git remote add origin https://github.com/votre-username/sionohmair-insight-academy.git
git branch -M main
git push -u origin main
```

---

## 🎯 Workflow Complet

### Configuration Initiale (une seule fois)

```bash
# 1. Configuration automatique
cd /home/ubuntu/sionohmair-insight-academy
./scripts/setup-all.sh

# 2. Vérification
./scripts/verify-final.sh

# 3. Tests
./scripts/test-system.sh
node scripts/test-email.mjs
```

### Développement Quotidien

```bash
# 1. Démarrer le serveur
cd /home/ubuntu/sionohmair-insight-academy
pnpm dev

# 2. Faire vos modifications

# 3. Tester
pnpm test

# 4. Commit
git add .
git commit -m "Description des changements"
git push
```

---

## 💡 Astuces

### Voir les logs en temps réel

```bash
# Logs du serveur
tail -f /home/ubuntu/sionohmair-insight-academy/server.log

# Logs des emails
tail -f /home/ubuntu/sionohmair-insight-academy/email.log
```

### Redémarrer le serveur

```bash
cd /home/ubuntu/sionohmair-insight-academy
pnpm dev
```

### Vérifier les variables d'environnement

```bash
cd /home/ubuntu/sionohmair-insight-academy
env | grep SMTP
env | grep STRIPE
env | grep CRON
```

---

**Toutes les commandes sont prêtes à copier-coller ! 🚀**
