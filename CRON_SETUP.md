# Configuration des Cron Jobs pour le Système d'Honofication

Ce document explique comment configurer les cron jobs automatiques pour le système d'honofication des redevances NFT.

## 📋 Vue d'ensemble

Le système d'honofication utilise 3 cron jobs automatiques :

1. **Détection Quotidienne** (2h du matin UTC) : Détecte les transactions Stripe, PayPal et Google Analytics
2. **Détection Hebdomadaire** (Lundis 3h UTC) : Scraping OSINT pour détecter les mentions publiques
3. **Rappels Quotidiens** (10h du matin UTC) : Envoie les notifications, rappels et mises en demeure

## 🚀 Méthode 1 : GitHub Actions (Recommandé)

### Étape 1 : Configurer les Secrets GitHub

Allez dans **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Ajoutez les secrets suivants :

```
APP_URL=https://votre-domaine.manus.space
CRON_SECRET=votre-secret-cron-genere-aleatoirement
DATABASE_URL=mysql://user:password@host:port/database

# API Keys (optionnel selon vos intégrations)
STRIPE_SECRET_KEY=sk_live_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
GOOGLE_ANALYTICS_API_KEY=...
GOOGLE_SEARCH_API_KEY=...
GOOGLE_SEARCH_CX=...
SENDGRID_API_KEY=SG....
```

### Étape 2 : Activer GitHub Actions

Le fichier `.github/workflows/honofication-cron.yml` est déjà configuré.

GitHub Actions exécutera automatiquement les cron jobs selon le planning défini.

### Étape 3 : Tester manuellement

Allez dans **Actions** → **Honofication Cron Jobs** → **Run workflow**

Sélectionnez le type de job à exécuter et cliquez sur **Run workflow**.

---

## 🔧 Méthode 2 : Vercel Cron Jobs

Si vous déployez sur Vercel, vous pouvez utiliser Vercel Cron Jobs.

### Étape 1 : Créer `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-detection",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/weekly-detection",
      "schedule": "0 3 * * 1"
    },
    {
      "path": "/api/cron/daily-reminders",
      "schedule": "0 10 * * *"
    }
  ]
}
```

### Étape 2 : Créer les endpoints API

Créez `/api/cron/daily-detection.ts` :

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { runDailyDetection } from '@/server/services/apiIntegrationService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vérifier le secret Vercel Cron
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await runDailyDetection();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Daily detection error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

Répétez pour `weekly-detection.ts` et `daily-reminders.ts`.

---

## 🐧 Méthode 3 : Crontab Linux (VPS)

Si vous hébergez sur un VPS Linux, utilisez crontab.

### Étape 1 : Créer un script shell

Créez `/home/ubuntu/sionohmair-insight-academy/scripts/run-cron.sh` :

```bash
#!/bin/bash

# Charger les variables d'environnement
export $(cat /home/ubuntu/sionohmair-insight-academy/.env | xargs)

# Exécuter le cron job
curl -X POST "https://votre-domaine.manus.space/api/trpc/cron.$1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CRON_SECRET"
```

Rendez-le exécutable :

```bash
chmod +x /home/ubuntu/sionohmair-insight-academy/scripts/run-cron.sh
```

### Étape 2 : Configurer crontab

```bash
crontab -e
```

Ajoutez les lignes suivantes :

```cron
# Détection quotidienne (2h du matin)
0 2 * * * /home/ubuntu/sionohmair-insight-academy/scripts/run-cron.sh runDailyDetection

# Détection hebdomadaire (Lundis 3h)
0 3 * * 1 /home/ubuntu/sionohmair-insight-academy/scripts/run-cron.sh runWeeklyDetection

# Rappels quotidiens (10h du matin)
0 10 * * * /home/ubuntu/sionohmair-insight-academy/scripts/run-cron.sh runDailyReminders
```

---

## 🔐 Sécurité

### Générer un CRON_SECRET

```bash
openssl rand -base64 32
```

Ajoutez ce secret dans :
- GitHub Secrets (GitHub Actions)
- Vercel Environment Variables (Vercel Cron)
- `.env` (VPS Linux)

### Valider les requêtes

Le router `cronRouter.ts` vérifie automatiquement le secret :

```typescript
if (ctx.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
  throw new TRPCError({ code: "UNAUTHORIZED" });
}
```

---

## 📊 Monitoring

### Logs GitHub Actions

Allez dans **Actions** → **Honofication Cron Jobs** pour voir les logs.

### Logs Vercel

Allez dans **Deployments** → **Functions** → **Cron Jobs** pour voir les logs.

### Logs VPS

```bash
tail -f /var/log/syslog | grep cron
```

---

## 🧪 Tests

### Tester manuellement via tRPC

```typescript
// Dans le navigateur (console)
await fetch('/api/trpc/cron.runDailyDetection', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer VOTRE_CRON_SECRET',
  },
});
```

### Tester via GitHub Actions

Allez dans **Actions** → **Run workflow** → Sélectionnez le job → **Run workflow**.

---

## ❓ FAQ

**Q : Pourquoi mes cron jobs ne s'exécutent pas ?**

R : Vérifiez que :
1. Les secrets sont bien configurés
2. Le `CRON_SECRET` est correct
3. L'URL de l'application est accessible
4. Les API keys sont valides

**Q : Comment désactiver temporairement les cron jobs ?**

R : 
- GitHub Actions : Désactivez le workflow dans **Actions** → **Workflows** → **Disable workflow**
- Vercel : Supprimez la section `crons` de `vercel.json`
- VPS : Commentez les lignes dans `crontab -e`

**Q : Puis-je changer les horaires ?**

R : Oui, modifiez les expressions cron dans :
- `.github/workflows/honofication-cron.yml` (GitHub Actions)
- `vercel.json` (Vercel)
- `crontab -e` (VPS)

Format cron : `minute hour day month weekday`

Exemples :
- `0 2 * * *` = Tous les jours à 2h
- `0 3 * * 1` = Tous les lundis à 3h
- `*/30 * * * *` = Toutes les 30 minutes

---

## 📞 Support

Pour toute question, consultez la documentation ou contactez le support Sionohmair Insight Academy.
