# ⏰ Guide de Configuration CRON_SECRET

**Durée** : 5 minutes
**Prérequis** : Repository GitHub

---

## Secret Généré

```
CRON_SECRET=7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=
```

Ce secret permet au cron job GitHub Actions d'appeler l'API de manière sécurisée.

---

## Configuration GitHub Secrets

### Option A : Avec GitHub CLI (Automatique)

1. **Installez GitHub CLI** (si pas déjà fait)
   ```bash
   curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
   sudo apt update
   sudo apt install gh -y
   ```

2. **Authentifiez-vous**
   ```bash
   gh auth login
   ```

3. **Ajoutez les secrets automatiquement**
   ```bash
   cd /home/ubuntu/sionohmair-insight-academy
   echo "7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=" | gh secret set CRON_SECRET
   echo "https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer" | gh secret set APP_URL
   ```

4. **Vérifiez**
   ```bash
   gh secret list
   ```

   Vous devriez voir :
   ```
   CRON_SECRET  Updated YYYY-MM-DD
   APP_URL      Updated YYYY-MM-DD
   ```

### Option B : Manuellement (Interface Web)

1. **Ouvrez votre repository GitHub**
   - URL : https://github.com/VOTRE_USERNAME/sionohmair-insight-academy

2. **Accédez aux Secrets**
   - Cliquez sur "Settings" (onglet du repository)
   - Dans le menu de gauche : "Secrets and variables" → "Actions"

3. **Ajoutez CRON_SECRET**
   - Cliquez sur "New repository secret"
   - Name : `CRON_SECRET`
   - Value : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`
   - Cliquez sur "Add secret"

4. **Ajoutez APP_URL**
   - Cliquez sur "New repository secret"
   - Name : `APP_URL`
   - Value : `https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer`
   - Cliquez sur "Add secret"

---

## Configuration Manus Secrets

1. **Ouvrez le dashboard Manus**
   - Cliquez sur l'icône Settings (engrenage) en haut à droite
   - Sélectionnez "Secrets"

2. **Ajoutez CRON_SECRET**
   - Cliquez sur "Add Secret"
   - Name : `CRON_SECRET`
   - Value : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`
   - Cliquez sur "Save"

---

## Vérification

### 1. Vérifiez que le workflow existe

```bash
cat .github/workflows/check-trial-expirations.yml
```

Vous devriez voir :
```yaml
name: Check Trial Expirations
on:
  schedule:
    - cron: '0 8 * * *'  # Tous les jours à 9h00 (UTC+1)
```

### 2. Testez manuellement

```bash
curl "https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer/api/trpc/cron.checkTrialExpirations?secret=7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="
```

Vous devriez voir :
```json
{"result":{"data":{"success":true,"message":"Vérification des essais terminée"}}}
```

### 3. Vérifiez les logs GitHub Actions

1. Allez sur GitHub → Actions
2. Vous devriez voir le workflow "Check Trial Expirations"
3. Le prochain run sera demain à 9h00 (UTC+1)

---

## Fonctionnement du Cron Job

Le cron job s'exécute **tous les jours à 9h00 (UTC+1)** et :

1. **Vérifie les essais qui expirent dans 7 jours**
   - Envoie un email "Il vous reste 7 jours"

2. **Vérifie les essais qui expirent dans 3 jours**
   - Envoie un email "Il vous reste 3 jours"

3. **Vérifie les essais qui expirent dans 1 jour**
   - Envoie un email "Dernier jour d'essai gratuit"

4. **Vérifie les essais expirés**
   - Désactive l'accès aux outils premium
   - Envoie un email "Votre essai a expiré"

---

## Dépannage

### Problème : Le cron job ne s'exécute pas

**Solution** :
1. Vérifiez que `CRON_SECRET` est bien configuré dans GitHub Secrets
2. Vérifiez que `APP_URL` est bien configuré dans GitHub Secrets
3. Vérifiez les logs dans GitHub → Actions
4. Testez manuellement avec curl (voir ci-dessus)

### Problème : Erreur "Invalid secret"

**Solution** :
1. Vérifiez que le secret dans GitHub Secrets est exactement : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`
2. Vérifiez que le secret dans Manus Secrets est exactement : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`
3. Redémarrez le serveur (Dashboard Manus → Restart)

---

**Prochaine étape** : Configuration Stripe Live (voir GUIDE_STRIPE_CONFIGURATION.md)
