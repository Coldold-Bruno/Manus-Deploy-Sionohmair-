# 🔑 Configuration des Secrets Manus - Instructions Finales

## 🔗 Lien Direct vers l'Interface Manus

**Ouvrez ce lien pour configurer les secrets** :

👉 **https://manus.im/project/settings/secrets**

Ou manuellement :
1. Allez sur https://manus.im
2. Ouvrez votre projet **sionohmair-insight-academy**
3. Cliquez sur **Settings** (icône engrenage) dans le menu de gauche
4. Cliquez sur l'onglet **Secrets**

---

## 📋 Les 6 Secrets à Copier-Coller

### ✅ SECRET 1/6 : CRON_SECRET

**Nom du secret** :
```
CRON_SECRET
```

**Valeur** :
```
7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=
```

---

### 📧 SECRETS 2-6 : Configuration SMTP

**Choisissez UNE option parmi les 3 ci-dessous** :

---

#### 🟢 OPTION A : Gmail (Recommandé - Gratuit)

**Avant de continuer** :
1. Allez sur https://myaccount.google.com/apppasswords
2. Créez un mot de passe d'application nommé "Sionohmair"
3. Copiez le mot de passe généré (format : xxxx xxxx xxxx xxxx)

**SECRET 2/6** :
- **Nom** : `SMTP_HOST`
- **Valeur** : `smtp.gmail.com`

**SECRET 3/6** :
- **Nom** : `SMTP_PORT`
- **Valeur** : `587`

**SECRET 4/6** :
- **Nom** : `SMTP_SECURE`
- **Valeur** : `false`

**SECRET 5/6** :
- **Nom** : `SMTP_USER`
- **Valeur** : `votre.email@gmail.com` *(remplacez par votre email Gmail)*

**SECRET 6/6** :
- **Nom** : `SMTP_PASS`
- **Valeur** : `xxxx xxxx xxxx xxxx` *(remplacez par votre mot de passe d'application)*

---

#### 🟡 OPTION B : SendGrid (100 emails/jour gratuits)

**Avant de continuer** :
1. Créez un compte sur https://sendgrid.com
2. Allez dans **Settings → API Keys**
3. Créez une clé API avec accès "Full Access"
4. Copiez la clé (format : SG.xxxxxxxxxx...)

**SECRET 2/6** :
- **Nom** : `SMTP_HOST`
- **Valeur** : `smtp.sendgrid.net`

**SECRET 3/6** :
- **Nom** : `SMTP_PORT`
- **Valeur** : `587`

**SECRET 4/6** :
- **Nom** : `SMTP_SECURE`
- **Valeur** : `false`

**SECRET 5/6** :
- **Nom** : `SMTP_USER`
- **Valeur** : `apikey`

**SECRET 6/6** :
- **Nom** : `SMTP_PASS`
- **Valeur** : `SG.xxxxxxxxxx...` *(remplacez par votre clé API SendGrid)*

---

#### 🔵 OPTION C : Brevo (300 emails/jour gratuits)

**Avant de continuer** :
1. Créez un compte sur https://www.brevo.com
2. Allez dans **SMTP & API → SMTP**
3. Créez une clé SMTP
4. Copiez la clé

**SECRET 2/6** :
- **Nom** : `SMTP_HOST`
- **Valeur** : `smtp-relay.brevo.com`

**SECRET 3/6** :
- **Nom** : `SMTP_PORT`
- **Valeur** : `587`

**SECRET 4/6** :
- **Nom** : `SMTP_SECURE`
- **Valeur** : `false`

**SECRET 5/6** :
- **Nom** : `SMTP_USER`
- **Valeur** : `votre.email@example.com` *(remplacez par votre email)*

**SECRET 6/6** :
- **Nom** : `SMTP_PASS`
- **Valeur** : `votre-cle-smtp-brevo` *(remplacez par votre clé SMTP Brevo)*

---

## 🎯 Procédure Complète (5-10 minutes)

### Étape 1 : Ouvrir l'Interface Manus

👉 **https://manus.im/project/settings/secrets**

### Étape 2 : Ajouter les 6 Secrets

Pour chaque secret :
1. Cliquez sur **"Add Secret"**
2. Dans le champ **"Name"**, copiez le **Nom** du secret (ex: `CRON_SECRET`)
3. Dans le champ **"Value"**, copiez la **Valeur** du secret
4. Cliquez sur **"Save"**

**Ordre recommandé** :
1. `CRON_SECRET`
2. `SMTP_HOST`
3. `SMTP_PORT`
4. `SMTP_SECURE`
5. `SMTP_USER`
6. `SMTP_PASS`

### Étape 3 : Redémarrer le Serveur

1. Dans Manus, cliquez sur l'icône **"Restart Server"** (🔄)
2. Attendez 30 secondes que le serveur redémarre

### Étape 4 : Tester la Configuration

Exécutez cette commande dans le terminal :

```bash
cd /home/ubuntu/sionohmair-insight-academy
node scripts/test-email.mjs
```

**Résultat attendu** :
```
✅ Email de test envoyé avec succès !
📧 Vérifiez votre boîte de réception
```

---

## ✅ Checklist

- [ ] Ouvert https://manus.im/project/settings/secrets
- [ ] Ajouté `CRON_SECRET` (secret 1/6)
- [ ] Ajouté `SMTP_HOST` (secret 2/6)
- [ ] Ajouté `SMTP_PORT` (secret 3/6)
- [ ] Ajouté `SMTP_SECURE` (secret 4/6)
- [ ] Ajouté `SMTP_USER` (secret 5/6)
- [ ] Ajouté `SMTP_PASS` (secret 6/6)
- [ ] Redémarré le serveur Manus
- [ ] Testé avec `node scripts/test-email.mjs`
- [ ] Email de test reçu ✅

---

## 🎉 Félicitations !

Une fois les 6 secrets configurés et testés, votre plateforme **Sionohmair Insight Academy** sera **100% opérationnelle** !

**Fonctionnalités actives** :
- ✅ Système d'abonnement (essai 30j + 36€/mois)
- ✅ Emails automatiques (7 templates)
- ✅ Cron job quotidien (vérification des essais)
- ✅ Dashboard admin complet
- ✅ CRM et Lead Scoring
- ✅ Newsletter automatique
- ✅ Content Marketing & Copywriting
- ✅ Système NFT de Gratitude

---

## 🚀 Prochaines Étapes (Optionnelles)

### 1. Configurer GitHub Actions (Cron Job Automatique)

Pour que le cron job s'exécute automatiquement chaque jour à 9h00 :

1. Allez sur https://github.com/votre-username/sionohmair-insight-academy/settings/secrets/actions
2. Ajoutez 2 secrets :
   - **Nom** : `CRON_SECRET`
   - **Valeur** : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`
   
   - **Nom** : `APP_URL`
   - **Valeur** : `https://votre-url.manus.computer` *(remplacez par votre URL Manus)*

### 2. Activer Stripe en Mode Live

1. Allez sur https://dashboard.stripe.com
2. Activez votre compte (vérification d'identité)
3. Récupérez votre clé Live dans **Developers → API keys**
4. Mettez à jour dans Manus → Settings → Secrets :
   - **Nom** : `STRIPE_SECRET_KEY`
   - **Valeur** : `sk_live_...`

### 3. Publier le Site

1. Dans Manus, cliquez sur **"Publish"** (icône fusée 🚀)
2. Votre site sera accessible publiquement
3. Partagez l'URL avec vos premiers utilisateurs !

---

## 🆘 Besoin d'Aide ?

### Problème : Email non reçu

1. Vérifiez que les 5 secrets SMTP sont corrects
2. Vérifiez les logs du serveur dans Manus
3. Essayez avec un autre fournisseur SMTP

### Problème : "Cannot find module"

1. Redémarrez le serveur Manus
2. Attendez 30 secondes
3. Réessayez

### Problème : Mot de passe d'application Gmail

1. Activez la validation en 2 étapes sur votre compte Google
2. Allez sur https://myaccount.google.com/apppasswords
3. Créez un nouveau mot de passe d'application

---

## 📚 Documentation Complète

- `CONFIGURATION_MANUELLE_SECRETS.md` : Guide détaillé
- `SECRETS_MANUS_COPIER_COLLER.txt` : Format texte brut
- `README_AUTOMATISATION.md` : Guide d'automatisation
- `CRON_AUTOMATION.md` : Documentation du cron job

---

## ⚡ Résumé Ultra-Rapide

```
1. Ouvrir : https://manus.im/project/settings/secrets
2. Ajouter 6 secrets (voir ci-dessus)
3. Redémarrer le serveur Manus
4. Tester : node scripts/test-email.mjs
5. Publier ! 🚀
```

**Durée totale** : 5-10 minutes
