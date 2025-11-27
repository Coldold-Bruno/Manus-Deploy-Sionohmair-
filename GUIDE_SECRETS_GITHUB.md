# 🔐 Guide de Configuration des Secrets GitHub

Ce guide vous explique comment configurer les secrets GitHub nécessaires pour activer le cron job automatique qui vérifie les essais gratuits et envoie les emails de notification.

---

## 📋 Secrets Nécessaires

Vous devez configurer **2 secrets** dans votre dépôt GitHub :

| Secret | Valeur | Description |
|--------|--------|-------------|
| `CRON_SECRET` | `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=` | Clé secrète pour authentifier les appels au cron job |
| `APP_URL` | `https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer` | URL de votre application (sans slash final) |

> ⚠️ **Important** : `APP_URL` doit être l'URL de production de votre site une fois déployé. Pour les tests, utilisez l'URL de développement Manus.

---

## 🚀 Étapes de Configuration

### Étape 1 : Accéder aux Secrets GitHub

1. Allez sur votre dépôt GitHub
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Secrets and variables** → **Actions**
4. Cliquez sur le bouton **New repository secret**

### Étape 2 : Ajouter CRON_SECRET

1. Dans le champ **Name**, entrez : `CRON_SECRET`
2. Dans le champ **Secret**, collez : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`
3. Cliquez sur **Add secret**

### Étape 3 : Ajouter APP_URL

1. Cliquez à nouveau sur **New repository secret**
2. Dans le champ **Name**, entrez : `APP_URL`
3. Dans le champ **Secret**, collez : `https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer`
4. Cliquez sur **Add secret**

> 💡 **Astuce** : Une fois en production, mettez à jour `APP_URL` avec votre domaine personnalisé (ex: `https://sionohmair.com`)

---

## ✅ Vérification

Après avoir ajouté les secrets, vous devriez voir :

```
CRON_SECRET     ••••••••••••••••••••••••••••••••
APP_URL         ••••••••••••••••••••••••••••••••
```

---

## 🧪 Tester le Workflow

### Test Manuel

1. Allez dans l'onglet **Actions** de votre dépôt GitHub
2. Cliquez sur le workflow **Check Trial Expirations**
3. Cliquez sur **Run workflow** → **Run workflow**
4. Attendez quelques secondes et vérifiez les logs

### Test Automatique

Le workflow s'exécutera automatiquement **tous les jours à 9h00** (UTC+1, heure de Paris).

---

## 📊 Logs du Workflow

Après l'exécution, vous verrez dans les logs :

```
🔍 Vérification des essais gratuits qui expirent...
📊 Code HTTP : 200
✅ Tâche CRON exécutée avec succès
📧 Emails J-7 : 0 envoyés, 0 échoués
📧 Emails J-3 : 0 envoyés, 0 échoués
📧 Emails J-1 : 0 envoyés, 0 échoués
📧 Emails J-0 : 0 envoyés, 0 échoués
```

---

## 🚨 Dépannage

### Erreur : "APP_URL n'est pas configuré"

- Vérifiez que vous avez bien ajouté le secret `APP_URL`
- Vérifiez l'orthographe exacte (majuscules)

### Erreur : "CRON_SECRET n'est pas configuré"

- Vérifiez que vous avez bien ajouté le secret `CRON_SECRET`
- Vérifiez l'orthographe exacte (majuscules)

### Erreur : "Code HTTP : 401"

- Le `CRON_SECRET` ne correspond pas à celui configuré dans Manus
- Vérifiez que la valeur est exactement : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`

### Erreur : "Code HTTP : 404"

- L'URL de l'application est incorrecte
- Vérifiez que `APP_URL` pointe bien vers votre application
- Vérifiez qu'il n'y a pas de slash final (`/`) dans l'URL

---

## 🔄 Mise à Jour en Production

Lorsque vous déployez en production, mettez à jour `APP_URL` :

1. Allez dans **Settings** → **Secrets and variables** → **Actions**
2. Cliquez sur `APP_URL`
3. Cliquez sur **Update secret**
4. Remplacez par votre URL de production (ex: `https://sionohmair.com`)
5. Cliquez sur **Update secret**

---

## 📚 Ressources

- [Documentation GitHub Actions](https://docs.github.com/en/actions)
- [Documentation GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- Fichier du workflow : `.github/workflows/check-trial-expirations.yml`
- Endpoint REST : `server/_core/index.ts` (ligne avec `/api/cron/check-trial-expirations`)

---

## ✅ Checklist Finale

- [ ] Secret `CRON_SECRET` ajouté dans GitHub
- [ ] Secret `APP_URL` ajouté dans GitHub
- [ ] Test manuel du workflow réussi
- [ ] Logs affichent "✅ Tâche CRON exécutée avec succès"
- [ ] Aucune erreur dans les logs

🎉 **Félicitations !** Votre système de cron job automatique est maintenant opérationnel !
