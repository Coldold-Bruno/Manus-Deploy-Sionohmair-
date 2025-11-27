# ⚡ GitHub Actions - Démarrage Ultra-Rapide

## 🎯 Une Seule Commande pour Tout Configurer

```bash
cd /home/ubuntu/sionohmair-insight-academy && ./scripts/setup-github-actions.sh
```

**Durée** : 5 minutes  
**Résultat** : Tâches CRON automatiques configurées ✅

---

## 📋 Ce Qui Sera Configuré

| Secret GitHub | Valeur | Description |
|--------------|--------|-------------|
| **CRON_SECRET** | `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=` | Clé de sécurité pour l'endpoint CRON |
| **APP_URL** | Votre URL déployée | URL de votre application en production |

---

## 🚀 Étapes

### 1. Exécuter le script (5 min)

```bash
./scripts/setup-github-actions.sh
```

Le script va :
- ✅ Installer GitHub CLI si nécessaire
- ✅ Vous authentifier sur GitHub
- ✅ Détecter votre repository automatiquement
- ✅ Configurer les secrets GitHub
- ✅ Vérifier la configuration

### 2. Tester le workflow (2 min)

1. Allez sur https://github.com/VOTRE_USERNAME/VOTRE_REPO/actions
2. Cliquez sur **Check Trial Expirations**
3. Cliquez sur **Run workflow**
4. Vérifiez les logs (doit afficher ✅)

### 3. C'est terminé ! 🎉

Le workflow s'exécutera automatiquement **tous les jours à 9h00** pour :
- ✅ Vérifier les essais gratuits qui expirent
- ✅ Envoyer les emails de rappel (7 jours avant)
- ✅ Mettre à jour les statuts des abonnements

---

## 🔧 Configuration Manuelle (Alternative)

Si vous préférez configurer manuellement :

### Ajouter les secrets GitHub

1. Allez sur https://github.com/VOTRE_USERNAME/VOTRE_REPO/settings/secrets/actions
2. Cliquez sur **New repository secret**

**Secret 1 : CRON_SECRET**
```
Name: CRON_SECRET
Value: 7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=
```

**Secret 2 : APP_URL**
```
Name: APP_URL
Value: https://VOTRE_URL_DEPLOYEE
```

⚠️ **Important** : Pas de slash `/` à la fin de l'URL.

---

## 🧪 Test Rapide

### Méthode 1 : Via GitHub Actions (Recommandé)

1. https://github.com/VOTRE_USERNAME/VOTRE_REPO/actions
2. **Check Trial Expirations** → **Run workflow**
3. Vérifier les logs

### Méthode 2 : Via curl

```bash
curl "https://VOTRE_URL/api/trpc/cron.checkTrialExpirations?secret=7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="
```

Réponse attendue :
```json
{
  "result": {
    "data": {
      "json": {
        "success": true,
        "emailsSent": 2,
        "trialsChecked": 5,
        "statusUpdated": 1
      }
    }
  }
}
```

---

## 🔍 Vérification

### ✅ Checklist

- [ ] GitHub CLI installé et authentifié
- [ ] Secrets `CRON_SECRET` et `APP_URL` configurés dans GitHub
- [ ] Workflow testé manuellement avec succès
- [ ] Logs affichent "✅ Tâche CRON exécutée avec succès"

### 📊 Monitoring

Vérifiez l'historique des exécutions :
- https://github.com/VOTRE_USERNAME/VOTRE_REPO/actions

---

## 🚨 Dépannage Rapide

| Problème | Solution |
|----------|----------|
| "Unauthorized: Invalid cron secret" | Vérifiez que `CRON_SECRET` est bien configuré dans GitHub |
| "Failed to fetch" | Vérifiez que `APP_URL` est correct et accessible |
| Workflow ne s'exécute pas | Vérifiez que GitHub Actions est activé dans Settings |

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- **Guide complet** : `docs/GUIDE_GITHUB_ACTIONS.md`
- **Workflow** : `.github/workflows/check-trial-expirations.yml`
- **Script** : `scripts/setup-github-actions.sh`

---

## 🎯 Résumé

**1 commande = Configuration complète**

```bash
./scripts/setup-github-actions.sh
```

**Résultat** :
- ✅ Tâches CRON automatiques tous les jours à 9h00
- ✅ Emails de rappel envoyés automatiquement
- ✅ Statuts des abonnements mis à jour automatiquement

---

**Temps total** : 5-10 minutes  
**Difficulté** : Facile ⭐  
**Automatisation** : 100% ✅
