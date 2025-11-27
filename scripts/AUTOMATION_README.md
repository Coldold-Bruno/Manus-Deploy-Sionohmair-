# 🤖 Scripts d'Automatisation - Sionohmair Insight Academy

Ce dossier contient tous les scripts d'automatisation pour configurer le système d'abonnement en **une seule commande**.

---

## 🚀 Installation Rapide (Recommandé)

### Option 1 : Automatisation Complète (GitHub + Manus + Tests)

```bash
./scripts/setup-all.sh
```

Ce script exécute automatiquement :
1. Configuration des secrets GitHub (CRON_SECRET, APP_URL)
2. Configuration des secrets Manus (CRON_SECRET, SMTP_*)
3. Tests automatiques (emails, cron, système)

**Durée estimée** : 5-10 minutes

---

### Option 2 : Configuration par Étapes

Si vous préférez configurer étape par étape :

#### Étape 1 : GitHub Secrets

```bash
./scripts/setup-github-secrets.sh
```

Configure automatiquement :
- `CRON_SECRET` : Secret pour sécuriser le cron job
- `APP_URL` : URL de votre application Manus

**Prérequis** : GitHub CLI (gh) installé et authentifié

#### Étape 2 : Manus Secrets

```bash
./scripts/setup-manus-secrets.sh
```

Guide interactif pour configurer :
- `CRON_SECRET` : Même secret que GitHub
- `SMTP_HOST` : Serveur SMTP (Gmail, SendGrid, Brevo)
- `SMTP_PORT` : Port SMTP (587)
- `SMTP_USER` : Nom d'utilisateur SMTP
- `SMTP_PASS` : Mot de passe SMTP
- `SMTP_FROM` : Email expéditeur

**Prérequis** : Accès au panneau Manus Settings → Secrets

#### Étape 3 : Tests

```bash
# Test SMTP uniquement
node ./scripts/test-email.mjs

# Test système complet
./scripts/test-system.sh
```

---

## 📋 Liste des Scripts

### Scripts d'Installation

| Script | Description | Durée |
|--------|-------------|-------|
| `setup-all.sh` | Configuration complète automatique | 5-10 min |
| `setup-github-secrets.sh` | Configuration GitHub Secrets | 2-3 min |
| `setup-manus-secrets.sh` | Configuration Manus Secrets | 3-5 min |
| `install.sh` | Installation interactive guidée | 10 min |

### Scripts de Test

| Script | Description | Durée |
|--------|-------------|-------|
| `test-email.mjs` | Test d'envoi d'email SMTP | 5 sec |
| `test-system.sh` | Test complet du système | 30 sec |

### Scripts de Configuration

| Script | Description | Durée |
|--------|-------------|-------|
| `configure-smtp.sh` | Configuration SMTP interactive | 5 min |

---

## 🔐 Secrets Configurés

### GitHub Secrets

| Secret | Valeur | Description |
|--------|--------|-------------|
| `CRON_SECRET` | `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=` | Secret pour sécuriser le cron job |
| `APP_URL` | `https://sionohmair-insight-academy.manus.space` | URL de l'application |

### Manus Secrets

| Secret | Valeur (exemple) | Description |
|--------|------------------|-------------|
| `CRON_SECRET` | `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=` | Même secret que GitHub |
| `SMTP_HOST` | `smtp.gmail.com` | Serveur SMTP |
| `SMTP_PORT` | `587` | Port SMTP |
| `SMTP_USER` | `coldoldbruno@gmail.com` | Email Gmail |
| `SMTP_PASS` | `uiqq kpth pjdb oknb` | Mot de passe d'application |
| `SMTP_FROM` | `coldoldbruno@gmail.com` | Email expéditeur |

---

## ✅ Vérification

### 1. Dashboard de Configuration

Ouvrez le dashboard pour vérifier l'état de toutes les configurations :

```
https://sionohmair-insight-academy.manus.space/config
```

Le dashboard affiche :
- ✅ État de chaque configuration (SMTP, CRON, GitHub, Stripe)
- 📋 Variables à copier-coller
- 📝 Instructions pas à pas
- 🔗 Liens directs vers les services

### 2. Test Manuel

#### Test SMTP

```bash
cd /home/ubuntu/sionohmair-insight-academy
SMTP_HOST=smtp.gmail.com \
SMTP_PORT=587 \
SMTP_USER=coldoldbruno@gmail.com \
SMTP_PASS="uiqq kpth pjdb oknb" \
SMTP_FROM=coldoldbruno@gmail.com \
TEST_EMAIL=coldoldbruno@gmail.com \
node scripts/test-email.mjs
```

**Résultat attendu** : `✅ Test SMTP RÉUSSI`

#### Test Cron Job

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"secret":"7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="}' \
  https://sionohmair-insight-academy.manus.space/api/trpc/cron.checkTrialExpirations
```

**Résultat attendu** : `{"result":{"data":{"success":true,...}}}`

#### Test Système Complet

```bash
./scripts/test-system.sh
```

**Résultat attendu** :
```
✅ SMTP configuré
✅ Cron job configuré
✅ Base de données OK
⚠️  Stripe à configurer
```

---

## 🆘 Dépannage

### Problème : GitHub CLI non installé

**Solution** :

```bash
# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh -y

# macOS
brew install gh

# Authentification
gh auth login
```

### Problème : Les emails ne sont pas envoyés

**Solution** :

1. Vérifiez que les 5 variables SMTP sont dans Manus → Settings → Secrets
2. Vérifiez que le mot de passe d'application Gmail est correct
3. Redémarrez le serveur Manus
4. Testez avec `node scripts/test-email.mjs`

### Problème : Le cron job ne fonctionne pas

**Solution** :

1. Vérifiez que `CRON_SECRET` est identique dans GitHub et Manus
2. Vérifiez que `APP_URL` est correct dans GitHub Secrets
3. Testez manuellement avec curl (voir ci-dessus)
4. Vérifiez les logs GitHub Actions

### Problème : Permission denied

**Solution** :

```bash
chmod +x scripts/*.sh
```

---

## 📚 Documentation Complète

- **CONFIGURATION_FINALE.md** : Guide de configuration détaillé (3 étapes)
- **CRON_AUTOMATION.md** : Documentation du cron job
- **GUIDE_UTILISATEUR.md** : Guide pour les abonnés
- **QUICKSTART.md** : Guide de démarrage rapide (10 minutes)

---

## 🎯 Workflow Recommandé

### Pour un nouveau projet

```bash
# 1. Cloner le repository
git clone https://github.com/votre-username/sionohmair-insight-academy.git
cd sionohmair-insight-academy

# 2. Installer les dépendances
pnpm install

# 3. Lancer l'automatisation complète
./scripts/setup-all.sh

# 4. Vérifier le dashboard
# Ouvrir https://sionohmair-insight-academy.manus.space/config

# 5. Tester le système
./scripts/test-system.sh
```

### Pour un projet existant

```bash
# 1. Mettre à jour les secrets GitHub
./scripts/setup-github-secrets.sh

# 2. Mettre à jour les secrets Manus
./scripts/setup-manus-secrets.sh

# 3. Tester
./scripts/test-system.sh
```

---

## 🚀 Prochaines Étapes

Une fois la configuration terminée :

1. **Configurer Stripe** (si pas encore fait) :
   - Activer le compte : https://dashboard.stripe.com/claim_sandbox/...
   - Créer le produit (36€/mois, récurrent)
   - Ajouter les clés API dans Manus Secrets

2. **Tester le flux complet** :
   - Créer un utilisateur test
   - Démarrer un essai gratuit
   - Vérifier l'email de bienvenue
   - Attendre l'email J-7 (ou tester manuellement)
   - Tester le paiement avec carte test : `4242 4242 4242 4242`

3. **Déployer en production** :
   - Passer Stripe en mode Live
   - Configurer un domaine personnalisé
   - Activer le monitoring

---

## 💡 Conseils

- **Utilisez Gmail** pour commencer (gratuit, simple, fiable)
- **Testez d'abord en mode test** avant de passer en production
- **Vérifiez le dashboard** régulièrement pour surveiller l'état
- **Gardez les secrets en sécurité** (ne les commitez jamais dans Git)
- **Documentez vos modifications** dans todo.md

---

## 📞 Support

Pour toute question ou problème :

1. Consultez le **dashboard de configuration** : `/config`
2. Lisez la **documentation complète** : `CONFIGURATION_FINALE.md`
3. Testez avec les **scripts de test** : `test-system.sh`
4. Vérifiez les **logs GitHub Actions**

---

**Bon lancement ! 🎉**
