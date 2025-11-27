# 🤖 Guide de Configuration GitHub Actions

Ce guide vous explique comment configurer automatiquement les GitHub Actions pour exécuter les tâches CRON quotidiennes.

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Configuration automatique (Recommandé)](#configuration-automatique-recommandé)
3. [Configuration manuelle](#configuration-manuelle)
4. [Test du workflow](#test-du-workflow)
5. [Dépannage](#dépannage)

---

## 🎯 Vue d'ensemble

### Qu'est-ce que GitHub Actions ?

GitHub Actions est un service d'automatisation intégré à GitHub qui permet d'exécuter des tâches automatiquement selon un planning (CRON) ou en réponse à des événements.

### Pourquoi en avez-vous besoin ?

Les GitHub Actions sont utilisées pour :
- ✅ Vérifier quotidiennement les essais gratuits qui expirent
- ✅ Envoyer automatiquement les emails de rappel (7 jours avant expiration)
- ✅ Mettre à jour les statuts des abonnements
- ✅ Garantir que les utilisateurs reçoivent leurs notifications à temps

### Planning d'exécution

Le workflow s'exécute **automatiquement tous les jours à 9h00 (heure de Paris)**.

---

## ⚡ Configuration automatique (Recommandé)

### Prérequis

- Un repository GitHub pour votre projet
- Accès en écriture au repository
- Le projet doit être déployé et accessible via une URL

### Étape 1 : Exécuter le script d'automatisation

```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/setup-github-actions.sh
```

### Étape 2 : Suivre les instructions

Le script va :
1. ✅ Installer GitHub CLI si nécessaire
2. ✅ Vous authentifier sur GitHub
3. ✅ Détecter automatiquement votre repository
4. ✅ Vous demander l'URL de votre application
5. ✅ Configurer automatiquement les secrets GitHub
6. ✅ Vérifier la configuration

### Étape 3 : Vérifier

Allez sur https://github.com/VOTRE_USERNAME/VOTRE_REPO/settings/secrets/actions

Vous devriez voir :
- ✅ `CRON_SECRET`
- ✅ `APP_URL`

---

## 🔧 Configuration manuelle

Si vous préférez configurer manuellement les secrets GitHub :

### Étape 1 : Accéder aux secrets GitHub

1. Allez sur votre repository GitHub
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Secrets and variables** > **Actions**
4. Cliquez sur **New repository secret**

### Étape 2 : Ajouter CRON_SECRET

1. **Name** : `CRON_SECRET`
2. **Value** : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`
3. Cliquez sur **Add secret**

### Étape 3 : Ajouter APP_URL

1. **Name** : `APP_URL`
2. **Value** : L'URL de votre application déployée
   - Exemple : `https://sionohmair-insight-academy.manus.space`
   - Ou : `https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer`
3. Cliquez sur **Add secret**

⚠️ **Important** : N'ajoutez PAS de slash `/` à la fin de l'URL.

---

## 🧪 Test du workflow

### Test manuel (Recommandé)

1. Allez sur https://github.com/VOTRE_USERNAME/VOTRE_REPO/actions
2. Cliquez sur **Check Trial Expirations** dans la liste des workflows
3. Cliquez sur **Run workflow** (bouton bleu à droite)
4. Sélectionnez la branche `main` (ou votre branche principale)
5. Cliquez sur **Run workflow**

### Vérifier les résultats

1. Attendez quelques secondes
2. Un nouveau workflow apparaîtra dans la liste
3. Cliquez dessus pour voir les détails
4. Vérifiez les logs :
   - ✅ Code HTTP : 200
   - ✅ Tâche CRON exécutée avec succès
   - ✅ Emails envoyés : X
   - ✅ Essais vérifiés : Y
   - ✅ Statuts mis à jour : Z

### Test local (Optionnel)

Vous pouvez tester l'endpoint directement :

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
        "statusUpdated": 1,
        "timestamp": "2025-11-27T08:00:00.000Z"
      }
    }
  }
}
```

---

## 🔍 Dépannage

### Problème : "Unauthorized: Invalid cron secret"

**Cause** : Le `CRON_SECRET` configuré dans GitHub ne correspond pas à celui du serveur.

**Solution** :
1. Vérifiez que `CRON_SECRET` est bien configuré dans GitHub Secrets
2. Vérifiez que la valeur est exactement : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`
3. Vérifiez que `CRON_SECRET` est configuré dans Manus Secrets (Settings → Secrets)

### Problème : "Failed to fetch"

**Cause** : L'URL de l'application est incorrecte ou l'application n'est pas accessible.

**Solution** :
1. Vérifiez que `APP_URL` est correct dans GitHub Secrets
2. Testez l'URL dans votre navigateur : `https://VOTRE_URL`
3. Assurez-vous que l'application est déployée et accessible publiquement

### Problème : Le workflow ne s'exécute pas automatiquement

**Cause** : Le workflow n'est peut-être pas activé ou le repository est privé sans GitHub Actions activé.

**Solution** :
1. Allez dans **Settings** > **Actions** > **General**
2. Vérifiez que **Allow all actions and reusable workflows** est sélectionné
3. Vérifiez que le fichier `.github/workflows/check-trial-expirations.yml` existe dans votre repository

### Problème : "Error: APP_URL n'est pas configuré"

**Cause** : Le secret `APP_URL` n'est pas configuré dans GitHub.

**Solution** :
1. Allez dans **Settings** > **Secrets and variables** > **Actions**
2. Ajoutez le secret `APP_URL` avec l'URL de votre application

---

## 📊 Monitoring

### Vérifier l'historique des exécutions

1. Allez sur https://github.com/VOTRE_USERNAME/VOTRE_REPO/actions
2. Cliquez sur **Check Trial Expirations**
3. Vous verrez l'historique de toutes les exécutions :
   - ✅ Succès (vert)
   - ❌ Échec (rouge)
   - ⏸️ En cours (jaune)

### Recevoir des notifications

Par défaut, GitHub vous envoie un email si un workflow échoue.

Pour configurer les notifications :
1. Allez dans **Settings** > **Notifications**
2. Activez **Actions** dans la section **Email**

---

## 📚 Fichiers importants

| Fichier | Description |
|---------|-------------|
| `.github/workflows/check-trial-expirations.yml` | Configuration du workflow |
| `scripts/setup-github-actions.sh` | Script d'automatisation |
| `docs/GUIDE_GITHUB_ACTIONS.md` | Ce guide |

---

## 🎯 Résumé

### Configuration automatique (5 minutes)

```bash
./scripts/setup-github-actions.sh
```

### Configuration manuelle (10 minutes)

1. Ajouter `CRON_SECRET` dans GitHub Secrets
2. Ajouter `APP_URL` dans GitHub Secrets
3. Tester le workflow manuellement

### Vérification

- ✅ Les secrets sont configurés dans GitHub
- ✅ Le workflow s'exécute manuellement sans erreur
- ✅ Le workflow s'exécutera automatiquement tous les jours à 9h00

---

## 🚀 Prochaines étapes

Une fois la configuration terminée :

1. ✅ Testez le workflow manuellement
2. ✅ Vérifiez les logs pour confirmer le succès
3. ✅ Attendez l'exécution automatique du lendemain
4. ✅ Vérifiez que les emails sont bien envoyés

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez la section [Dépannage](#dépannage)
2. Vérifiez les logs du workflow dans GitHub Actions
3. Testez l'endpoint manuellement avec `curl`

---

**Dernière mise à jour** : 27 novembre 2025  
**Version** : 1.0
