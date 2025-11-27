# 🤖 Automatisation des Emails d'Essai Gratuit

Ce document explique comment fonctionne le système automatisé d'envoi d'emails de rappel pour les essais gratuits de 30 jours.

---

## 📋 Vue d'ensemble

Le système vérifie **automatiquement chaque jour à 9h00** tous les abonnements en essai gratuit et envoie des emails de rappel selon le calendrier suivant :

- **J-7** : "Plus que 7 jours d'essai gratuit"
- **J-3** : "Plus que 3 jours avant expiration"
- **J-1** : "Dernier jour d'essai gratuit"
- **J-0** : "Votre essai gratuit expire aujourd'hui"

---

## 🏗️ Architecture

### 1. **Endpoint tRPC Sécurisé**

**URL** : `/api/trpc/cron.checkTrialExpirations`

**Méthode** : `POST`

**Authentification** : Secret key (`CRON_SECRET`)

**Payload** :
```json
{
  "secret": "YOUR_CRON_SECRET"
}
```

**Réponse** :
```json
{
  "success": true,
  "timestamp": "2025-01-27T09:00:00.000Z",
  "results": [
    {
      "userId": 123,
      "email": "user@example.com",
      "daysRemaining": 7,
      "emailSent": true,
      "emailType": "trial_reminder_7"
    }
  ]
}
```

### 2. **GitHub Actions Workflow**

**Fichier** : `.github/workflows/check-trial-expirations.yml`

**Déclenchement** :
- **Automatique** : Tous les jours à 9h00 (UTC+1)
- **Manuel** : Via l'onglet "Actions" sur GitHub

**Variables d'environnement requises** (GitHub Secrets) :
- `CRON_SECRET` : Secret partagé pour authentifier les appels
- `APP_URL` : URL de l'application (ex: `https://sionohmair.manus.space`)

### 3. **Service Backend**

**Fichier** : `server/services/trialEmailService.ts`

**Fonction principale** : `checkAndSendTrialNotifications()`

**Logique** :
1. Récupère tous les abonnements avec `status = 'trial'`
2. Pour chaque abonnement :
   - Calcule les jours restants
   - Détermine si un email doit être envoyé (J-7, J-3, J-1, J-0)
   - Envoie l'email correspondant
   - Met à jour le statut si l'essai est expiré (`trial` → `trial_expired`)
3. Retourne un rapport détaillé

---

## 🚀 Configuration

### Étape 1 : Configurer les Secrets GitHub

1. Aller sur **GitHub** → Votre repository → **Settings** → **Secrets and variables** → **Actions**
2. Ajouter les secrets suivants :

| Nom | Valeur | Description |
|-----|--------|-------------|
| `CRON_SECRET` | `votre-secret-ultra-securise` | Secret partagé pour authentifier les appels |
| `APP_URL` | `https://votre-domaine.com` | URL de votre application en production |

### Étape 2 : Configurer la Variable d'Environnement sur le Serveur

Ajouter `CRON_SECRET` dans **Settings → Secrets** de Manus :

```env
CRON_SECRET=votre-secret-ultra-securise
```

⚠️ **Important** : Le secret doit être **identique** dans GitHub et sur le serveur.

### Étape 3 : Activer le Workflow GitHub Actions

1. Aller sur **GitHub** → Votre repository → **Actions**
2. Vérifier que le workflow "Check Trial Expirations Daily" est activé
3. Tester manuellement en cliquant sur **Run workflow**

---

## 🧪 Tests

### Test Manuel de l'Endpoint

Vous pouvez tester l'endpoint manuellement avec `curl` :

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"secret":"votre-secret-ultra-securise"}' \
  https://votre-domaine.com/api/trpc/cron.checkTrialExpirations
```

**Réponse attendue** :
```json
{
  "result": {
    "data": {
      "success": true,
      "timestamp": "2025-01-27T09:00:00.000Z",
      "results": [...]
    }
  }
}
```

### Test du Workflow GitHub Actions

1. Aller sur **GitHub** → **Actions**
2. Sélectionner "Check Trial Expirations Daily"
3. Cliquer sur **Run workflow** → **Run workflow**
4. Vérifier les logs pour confirmer le succès

---

## 📊 Monitoring

### Vérifier les Logs du Serveur

Les logs du serveur affichent les détails de chaque exécution :

```
📧 Checking trial expirations...
[Trial Email] Checking 5 trial subscriptions...
[Trial Email] User 123 (user@example.com): 7 days remaining → Sending J-7 email
[Trial Email] Email sent to user@example.com (trial_reminder_7)
✅ Trial notifications sent: 1
```

### Vérifier les Logs GitHub Actions

1. Aller sur **GitHub** → **Actions**
2. Cliquer sur la dernière exécution
3. Vérifier les logs pour voir les détails

---

## 🔧 Dépannage

### Problème : Le workflow ne s'exécute pas

**Solution** :
1. Vérifier que le workflow est activé dans **Actions**
2. Vérifier que les secrets `CRON_SECRET` et `APP_URL` sont configurés
3. Vérifier la syntaxe du cron dans le fichier `.github/workflows/check-trial-expirations.yml`

### Problème : Erreur "Unauthorized: Invalid cron secret"

**Solution** :
1. Vérifier que `CRON_SECRET` est identique dans GitHub et sur le serveur
2. Vérifier qu'il n'y a pas d'espaces ou de caractères invisibles

### Problème : Les emails ne sont pas envoyés

**Solution** :
1. Vérifier que les variables SMTP sont configurées dans **Settings → Secrets** :
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_FROM`
2. Vérifier les logs du serveur pour voir les erreurs
3. Tester manuellement l'endpoint avec `curl`

---

## 🎯 Alternatives au GitHub Actions

Si vous ne souhaitez pas utiliser GitHub Actions, vous pouvez utiliser :

### 1. **Cron-job.org** (Gratuit)

1. Créer un compte sur [cron-job.org](https://cron-job.org)
2. Créer un nouveau cron job :
   - **URL** : `https://votre-domaine.com/api/trpc/cron.checkTrialExpirations`
   - **Méthode** : `POST`
   - **Body** : `{"secret":"votre-secret"}`
   - **Headers** : `Content-Type: application/json`
   - **Schedule** : `0 9 * * *` (9h00 chaque jour)

### 2. **EasyCron** (Gratuit jusqu'à 20 tâches)

1. Créer un compte sur [easycron.com](https://www.easycron.com)
2. Créer un nouveau cron job avec les mêmes paramètres

### 3. **Vercel Cron** (Si déployé sur Vercel)

Ajouter dans `vercel.json` :

```json
{
  "crons": [
    {
      "path": "/api/cron/check-trial-expirations",
      "schedule": "0 9 * * *"
    }
  ]
}
```

---

## 📝 Notes Importantes

- Le cron job s'exécute en **UTC**, donc ajustez l'heure selon votre fuseau horaire
- Les emails sont envoyés **une seule fois** par palier (J-7, J-3, J-1, J-0)
- Si un utilisateur s'abonne avant la fin de l'essai, il ne recevra plus d'emails de rappel
- Les logs sont conservés dans les logs du serveur (consultables dans le dashboard)

---

## 🤝 Support

Pour toute question ou problème, consultez :
- Les logs du serveur
- Les logs GitHub Actions
- La documentation Manus : https://docs.manus.im
