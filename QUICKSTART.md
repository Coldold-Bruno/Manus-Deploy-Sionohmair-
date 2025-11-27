# 🚀 Guide de Démarrage Rapide - Sionohmair Insight Academy

Ce guide vous permet de configurer le système d'abonnement en **10 minutes** chrono !

---

## ⚡ Méthode 1 : Installation Automatique (RECOMMANDÉ)

### Étape 1 : Exécutez le script d'installation

```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/install.sh
```

Le script vous guidera pas à pas pour :
- ✅ Configurer SMTP (Gmail)
- ✅ Générer et configurer CRON_SECRET
- ✅ Configurer Stripe
- ✅ Tester le système

---

## 📋 Méthode 2 : Configuration Manuelle

### Étape 1 : Configurer SMTP (5 minutes)

1. **Ouvrez Manus** → Votre projet → **Settings** → **Secrets**
2. **Cliquez sur "Add Secret"** et ajoutez ces 5 variables :

| Key | Value |
|-----|-------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `coldoldbruno@gmail.com` |
| `SMTP_PASS` | `uiqq kpth pjdb oknb` |
| `SMTP_FROM` | `coldoldbruno@gmail.com` |

3. **Redémarrez le serveur**

---

### Étape 2 : Configurer CRON_SECRET (3 minutes)

#### Dans GitHub :

1. Allez sur **GitHub** → Votre repository → **Settings** → **Secrets and variables** → **Actions**
2. Cliquez sur **"New repository secret"**
3. Ajoutez :
   - **Name** : `CRON_SECRET`
   - **Value** : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`

4. Ajoutez aussi :
   - **Name** : `APP_URL`
   - **Value** : `https://sionohmair-insight-academy.manus.space`

#### Dans Manus :

1. Allez dans **Manus** → **Settings** → **Secrets**
2. Ajoutez :
   - **Key** : `CRON_SECRET`
   - **Value** : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`

---

### Étape 3 : Configurer Stripe (2 minutes)

1. **Activez votre compte Stripe** : [Cliquez ici](https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZFSGJENDV1UzY5TlRlLDE3NjQyODg3Njcv100fQEDeaWE)

2. **Créez le produit** :
   - Allez sur **Products** → **Add product**
   - **Name** : `Abonnement Sionohmair Insight Academy`
   - **Price** : `36 EUR`
   - **Billing** : `Monthly` (Récurrent)

3. **Récupérez les clés API** :
   - Allez sur **Developers** → **API keys**
   - Copiez `Publishable key` et `Secret key`

4. **Ajoutez dans Manus** → **Settings** → **Secrets** :
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`

---

## ✅ Vérification

### Testez l'envoi d'emails :

```bash
cd /home/ubuntu/sionohmair-insight-academy
SMTP_HOST=smtp.gmail.com SMTP_PORT=587 SMTP_USER=coldoldbruno@gmail.com SMTP_PASS="uiqq kpth pjdb oknb" SMTP_FROM=coldoldbruno@gmail.com TEST_EMAIL=coldoldbruno@gmail.com node scripts/test-email.mjs
```

**Résultat attendu** : `✅ Test SMTP RÉUSSI`

### Testez tout le système :

```bash
./scripts/test-system.sh
```

---

## 🎯 Dashboard de Configuration

Pour voir l'état de toutes les configurations en temps réel :

**Ouvrez** : [https://sionohmair-insight-academy.manus.space/config](https://sionohmair-insight-academy.manus.space/config)

Le dashboard affiche :
- ✅ État de chaque configuration (SMTP, CRON, GitHub, Stripe)
- 📋 Variables à copier-coller
- 📝 Instructions pas à pas
- 🔗 Liens directs vers les services

---

## 📚 Documentation Complète

- **CONFIGURATION_FINALE.md** : Guide détaillé (3 étapes)
- **CRON_AUTOMATION.md** : Documentation du cron job
- **GUIDE_UTILISATEUR.md** : Guide pour les abonnés
- **scripts/README.md** : Documentation des scripts

---

## 🆘 Besoin d'aide ?

### Problème : Les emails ne sont pas envoyés

**Solution** :
1. Vérifiez que les 5 variables SMTP sont dans Manus → Settings → Secrets
2. Redémarrez le serveur
3. Testez avec `./scripts/test-email.mjs`

### Problème : Le cron job ne fonctionne pas

**Solution** :
1. Vérifiez que `CRON_SECRET` est identique dans GitHub et Manus
2. Testez manuellement :
   ```bash
   curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"secret":"7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="}' \
     https://sionohmair-insight-academy.manus.space/api/trpc/cron.checkTrialExpirations
   ```

### Problème : Stripe ne fonctionne pas

**Solution** :
1. Vérifiez que les clés API sont correctes
2. Vérifiez que le produit existe (36€/mois, récurrent)
3. Testez avec la carte de test : `4242 4242 4242 4242`

---

## 🎉 C'est Prêt !

Votre système d'abonnement est maintenant **100% opérationnel** !

### Ce qui fonctionne :

- ✅ Essai gratuit de 30 jours (sans carte bancaire)
- ✅ Emails automatiques (J-7, J-3, J-1, J-0)
- ✅ Paiement Stripe (36€/mois)
- ✅ Cron job quotidien (9h00)
- ✅ Dashboard utilisateur
- ✅ Portail Stripe (gestion abonnement)

**Bon lancement ! 🚀**
