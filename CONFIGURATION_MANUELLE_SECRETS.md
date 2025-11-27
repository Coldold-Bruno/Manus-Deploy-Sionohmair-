# 🔑 Configuration Manuelle des Secrets Manus

## 📋 Vue d'Ensemble

Votre système est **presque prêt** ! Il ne reste que **la dernière étape** : configurer les secrets dans l'interface Manus.

**Durée estimée** : 5-10 minutes

---

## ✅ Ce Qui Est Déjà Configuré

- ✅ Base de données opérationnelle
- ✅ Serveur de développement fonctionnel
- ✅ Système d'abonnement (essai 30j + 36€/mois)
- ✅ 7 templates d'emails automatiques
- ✅ Endpoint REST pour le cron job (`/api/cron/check-trial-expirations`)
- ✅ Workflow GitHub Actions configuré
- ✅ CRON_SECRET généré : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`

---

## 🎯 Ce Qu'Il Reste à Faire

### Étape Unique : Configurer les Secrets Manus

Vous devez copier **6 secrets** dans l'interface Manus pour activer :
- 📧 L'envoi automatique d'emails (rappels d'essai gratuit)
- 🔐 La sécurité du cron job quotidien

---

## 📝 Les 6 Secrets à Configurer

### 1. CRON_SECRET (Obligatoire)

**Valeur** :
```
7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=
```

**Description** : Secret pour sécuriser l'endpoint du cron job

---

### 2-6. Configuration SMTP (Obligatoire pour les emails)

Vous avez **3 options** pour l'envoi d'emails :

#### Option A : Gmail (Gratuit, Recommandé pour débuter) ⭐

1. Allez sur https://myaccount.google.com/apppasswords
2. Créez un mot de passe d'application nommé "Sionohmair"
3. Copiez le mot de passe généré (16 caractères)

**Secrets à configurer** :
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre.email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx (mot de passe d'application)
```

#### Option B : SendGrid (100 emails/jour gratuits)

1. Créez un compte sur https://sendgrid.com
2. Allez dans Settings → API Keys
3. Créez une clé API avec accès "Full Access"

**Secrets à configurer** :
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Option C : Brevo (300 emails/jour gratuits)

1. Créez un compte sur https://www.brevo.com
2. Allez dans SMTP & API → SMTP
3. Créez une clé SMTP

**Secrets à configurer** :
```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre.email@example.com
SMTP_PASS=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🖥️ Comment Configurer dans Manus

### Méthode 1 : Via l'Interface Web (Recommandé)

1. Ouvrez votre projet dans Manus
2. Cliquez sur **Settings** (icône engrenage) dans le menu de gauche
3. Allez dans l'onglet **Secrets**
4. Pour chaque secret :
   - Cliquez sur **Add Secret**
   - Entrez le **nom** (ex: `CRON_SECRET`)
   - Entrez la **valeur**
   - Cliquez sur **Save**

### Méthode 2 : Copier-Coller Rapide

Voici les commandes prêtes à copier (remplacez les valeurs entre `<...>`) :

**Pour Gmail** :
```bash
# Dans Manus → Settings → Secrets, ajoutez :
CRON_SECRET = 7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = <votre.email@gmail.com>
SMTP_PASS = <votre mot de passe d'application>
```

**Pour SendGrid** :
```bash
# Dans Manus → Settings → Secrets, ajoutez :
CRON_SECRET = 7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=
SMTP_HOST = smtp.sendgrid.net
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = apikey
SMTP_PASS = <votre clé API SendGrid>
```

---

## 🧪 Tester la Configuration

### 1. Redémarrer le Serveur Manus

Après avoir ajouté les secrets, redémarrez le serveur pour les appliquer :

1. Dans Manus, cliquez sur **Restart Server** (icône refresh)
2. Attendez que le serveur redémarre (~30 secondes)

### 2. Tester l'Envoi d'Email

```bash
cd /home/ubuntu/sionohmair-insight-academy
node scripts/test-email.mjs
```

**Résultat attendu** :
```
✅ Email de test envoyé avec succès !
📧 Vérifiez votre boîte de réception
```

### 3. Tester le Cron Job

```bash
curl -X POST "https://votre-url.manus.computer/api/cron/check-trial-expirations" \
  -H "Content-Type: application/json" \
  -d '{"secret":"7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="}'
```

**Résultat attendu** :
```json
{
  "success": true,
  "timestamp": "2025-11-27T...",
  "results": {
    "j7": { "sent": 0, "failed": 0 },
    "j3": { "sent": 0, "failed": 0 },
    ...
  }
}
```

---

## 🚀 Après la Configuration

Une fois les secrets configurés et testés :

### 1. Configurer GitHub Actions (Optionnel)

Pour activer le cron job quotidien automatique :

1. Allez sur https://github.com/votre-username/sionohmair-insight-academy/settings/secrets/actions
2. Ajoutez 2 secrets :
   - `CRON_SECRET` : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`
   - `APP_URL` : `https://votre-url.manus.computer`

Le workflow s'exécutera automatiquement chaque jour à 9h00 (UTC+1).

### 2. Activer Stripe en Mode Live

1. Allez sur https://dashboard.stripe.com
2. Activez votre compte (vérification d'identité)
3. Récupérez vos clés Live :
   - Allez dans **Developers → API keys**
   - Copiez la **Secret key** (commence par `sk_live_...`)
4. Mettez à jour dans Manus → Settings → Secrets :
   - `STRIPE_SECRET_KEY` : `sk_live_...`
5. Configurez le webhook Live :
   - URL : `https://votre-url.manus.computer/api/stripe/webhook`
   - Événements : `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`

### 3. Publier le Site

1. Dans Manus, cliquez sur **Publish** (icône fusée)
2. Votre site sera accessible publiquement
3. Partagez l'URL avec vos premiers utilisateurs !

---

## ✅ Checklist Finale

- [ ] 6 secrets configurés dans Manus
- [ ] Serveur Manus redémarré
- [ ] Test d'email réussi
- [ ] Test du cron job réussi
- [ ] (Optionnel) GitHub Actions configuré
- [ ] (Optionnel) Stripe activé en mode Live
- [ ] Site publié

---

## 🎉 Félicitations !

Votre plateforme **Sionohmair Insight Academy** est maintenant **100% opérationnelle** !

**Fonctionnalités actives** :
- ✅ Système d'abonnement (essai 30j + 36€/mois)
- ✅ Emails automatiques (7 templates)
- ✅ Cron job quotidien (vérification des essais)
- ✅ Dashboard admin complet
- ✅ CRM et Lead Scoring
- ✅ Newsletter automatique
- ✅ Content Marketing & Copywriting (6 frameworks)
- ✅ Système NFT de Gratitude
- ✅ Sécurité et Conformité RGPD

---

## 🆘 Besoin d'Aide ?

### Problème : Email non reçu

1. Vérifiez les secrets SMTP dans Manus
2. Vérifiez les logs du serveur (Manus → Logs)
3. Essayez avec un autre fournisseur SMTP

### Problème : Cron job échoue

1. Vérifiez que `CRON_SECRET` est correct
2. Vérifiez que l'URL est correcte
3. Vérifiez que le serveur est démarré

### Problème : Secrets non pris en compte

1. Redémarrez le serveur Manus
2. Attendez 30 secondes
3. Réessayez le test

---

## 📚 Documentation Complète

- `README_AUTOMATISATION.md` : Guide d'automatisation
- `GUIDE_UTILISATEUR.md` : Guide complet
- `CRON_AUTOMATION.md` : Documentation du cron job
- `DEPLOIEMENT_ULTRA_RAPIDE.md` : Guide de déploiement

---

## ⚡ Résumé Ultra-Rapide

```bash
# 1. Configurez les 6 secrets dans Manus → Settings → Secrets
# 2. Redémarrez le serveur
# 3. Testez :
node scripts/test-email.mjs
# 4. Publiez !
```

**C'est tout !** 🚀
