# Guide de Déploiement en Production
## Système NFT de Gratitude Économique - Sionohmair Insight Academy

**Auteur** : Manus AI  
**Date** : 27 novembre 2025  
**Version** : 1.0.0

---

## Vue d'Ensemble

Ce document détaille le processus complet de déploiement du **Système NFT de Gratitude Économique** en environnement de production. Le système permet de tracker automatiquement les bénéfices générés par les ressources gratuites et de calculer les redevances dues selon le principe de gratitude économique (3-10% des bénéfices).

Le déploiement comprend trois composants principaux : l'application web (frontend + backend), la base de données MySQL, et les cron jobs automatiques pour la détection des bénéfices. Chaque composant nécessite une configuration spécifique et des vérifications de sécurité avant la mise en production.

---

## Prérequis Techniques

Avant de commencer le déploiement, assurez-vous de disposer des éléments suivants :

| Composant | Version Minimale | Recommandation |
|-----------|------------------|----------------|
| Node.js | 18.0.0 | 20.x LTS |
| pnpm | 8.0.0 | Dernière version |
| MySQL | 8.0 | 8.0+ avec SSL |
| Système d'exploitation | Ubuntu 20.04 | Ubuntu 22.04 LTS |
| Mémoire RAM | 2 GB | 4 GB+ |
| Espace disque | 10 GB | 20 GB+ |

**Services externes requis** :

- **Stripe** : Compte avec API keys (test et production)
- **SendGrid ou Mailgun** : Pour l'envoi d'emails automatiques
- **Google Analytics** : Pour tracker les conversions (optionnel)
- **Hébergement** : Vercel, Railway, ou VPS dédié

---

## Étape 1 : Préparation de l'Environnement

### 1.1 Cloner le Projet

```bash
git clone https://github.com/votre-org/sionohmair-insight-academy.git
cd sionohmair-insight-academy
```

### 1.2 Installer les Dépendances

```bash
pnpm install
```

Si `pnpm` n'est pas installé :

```bash
npm install -g pnpm
```

### 1.3 Configurer les Variables d'Environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```bash
# Base de données (OBLIGATOIRE)
DATABASE_URL="mysql://user:password@host:3306/database?ssl=true"

# JWT (OBLIGATOIRE - min 32 caractères)
JWT_SECRET="votre-secret-jwt-super-securise-min-32-caracteres"

# OAuth Manus (pré-configuré)
OAUTH_SERVER_URL="https://oauth.manus.space"
VITE_OAUTH_PORTAL_URL="https://oauth.manus.space"
OWNER_NAME="Votre Nom"
OWNER_OPEN_ID="votre-open-id"

# Stripe (OBLIGATOIRE pour les paiements)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
VITE_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Cron Jobs (OBLIGATOIRE - min 32 caractères)
CRON_SECRET="votre-secret-cron-super-securise-min-32-caracteres"

# Email (OBLIGATOIRE pour les notifications)
SENDGRID_API_KEY="SG...."
# OU
MAILGUN_API_KEY="key-..."
MAILGUN_DOMAIN="mg.votredomaine.com"

# Analytics (OPTIONNEL)
GOOGLE_ANALYTICS_API_KEY="..."
GOOGLE_SEARCH_API_KEY="..."

# Application
VITE_APP_TITLE="Sionohmair Insight Academy"
VITE_APP_LOGO="/logo.svg"
VITE_APP_ID="sionohmair-insight-academy"
```

**⚠️ IMPORTANT** : Ne commitez **JAMAIS** le fichier `.env` dans Git. Ajoutez-le au `.gitignore`.

---

## Étape 2 : Configuration de la Base de Données

### 2.1 Créer la Base de Données MySQL

Connectez-vous à votre serveur MySQL et créez la base de données :

```sql
CREATE DATABASE sionohmair CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sionohmair_user'@'%' IDENTIFIED BY 'mot_de_passe_securise';
GRANT ALL PRIVILEGES ON sionohmair.* TO 'sionohmair_user'@'%';
FLUSH PRIVILEGES;
```

### 2.2 Activer SSL (Recommandé)

Pour une connexion sécurisée, activez SSL sur votre serveur MySQL et ajoutez `?ssl=true` à votre `DATABASE_URL`.

### 2.3 Appliquer les Migrations

```bash
pnpm db:push
```

Cette commande crée automatiquement toutes les tables nécessaires :

- `nft_sources` : NFT sources (Correcteur, Formation, Coaching)
- `nft_beneficiaries` : Bénéficiaires des NFT
- `nft_contributions` : Contributions et paiements
- `nft_inquiries` : Enquêtes de recouvrement
- `nft_royalty_tracking` : Tracking temps réel des redevances
- `nft_royalty_alerts` : Alertes de redevances
- `benefit_detections` : Détections automatiques de bénéfices
- `api_integrations` : Intégrations API (Stripe, PayPal, etc.)
- `detection_logs` : Logs de détection
- `recovery_cases` : Cas de recouvrement
- `contestations` : Contestations de redevances
- `arbitration_cases` : Cas d'arbitrage
- `voluntary_declarations` : Déclarations volontaires
- `corrections_history` : Historique des corrections

### 2.4 Initialiser les NFT Sources

Accédez à `/admin/seed-nft` et cliquez sur **"Initialiser les NFT Sources"** pour créer les 3 NFT sources de base :

1. **Correcteur Universel** (ID: 1)
2. **Formation Sprint de Clarté** (ID: 2)
3. **Coaching Stratégique** (ID: 3)

---

## Étape 3 : Déploiement de l'Application

### Option A : Déploiement sur Vercel (Recommandé)

Vercel offre un déploiement simple avec support natif des cron jobs.

#### 3.1 Installer Vercel CLI

```bash
npm install -g vercel
```

#### 3.2 Déployer

```bash
vercel --prod
```

#### 3.3 Configurer les Variables d'Environnement

Dans le dashboard Vercel :

1. Allez dans **Settings > Environment Variables**
2. Ajoutez toutes les variables du fichier `.env`
3. Sélectionnez **Production** pour chaque variable

#### 3.4 Configurer les Cron Jobs

Vercel supporte nativement les cron jobs via `vercel.json` (déjà configuré) :

```json
{
  "crons": [
    {
      "path": "/api/trpc/cron.runDailyDetection",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/trpc/cron.runDailyReminders",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/trpc/cron.runDailyOverdueCheck",
      "schedule": "0 18 * * *"
    },
    {
      "path": "/api/trpc/cron.runWeeklyDetection",
      "schedule": "0 3 * * 1"
    },
    {
      "path": "/api/trpc/cron.runMonthlyReport",
      "schedule": "0 4 1 * *"
    }
  ]
}
```

Les cron jobs seront automatiquement activés après le déploiement.

### Option B : Déploiement sur VPS (Ubuntu)

Pour un contrôle total, déployez sur un VPS dédié.

#### 3.1 Installer Node.js et pnpm

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm pm2
```

#### 3.2 Cloner et Configurer

```bash
git clone https://github.com/votre-org/sionohmair-insight-academy.git
cd sionohmair-insight-academy
pnpm install
pnpm build
```

#### 3.3 Démarrer avec PM2

```bash
pm2 start npm --name "sionohmair" -- start
pm2 save
pm2 startup
```

#### 3.4 Configurer Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name votredomaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 3.5 Activer SSL avec Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votredomaine.com
```

#### 3.6 Configurer les Cron Jobs

```bash
./deploy-cron.sh
```

Choisissez l'option **3) Crontab Linux** et suivez les instructions.

---

## Étape 4 : Configuration des Intégrations API

### 4.1 Accéder à l'Interface Admin

Connectez-vous à `/admin/api-keys` avec un compte administrateur.

### 4.2 Ajouter les Intégrations

Pour chaque plateforme, cliquez sur **"Ajouter une intégration"** et remplissez :

| Plateforme | Nom | API Key | API Secret | Validation |
|------------|-----|---------|------------|------------|
| Stripe | Production Stripe | `sk_live_...` | - | Automatique |
| PayPal | Production PayPal | Client ID | Client Secret | Automatique |
| Google Analytics | GA4 Property | Measurement ID | - | Automatique |
| SendGrid | Email Notifications | `SG.xxxx` | - | Automatique |

Le système valide automatiquement chaque clé API avant de l'enregistrer.

### 4.3 Vérifier le Statut

Accédez à `/admin/monitoring` pour vérifier que toutes les intégrations sont **actives** et fonctionnelles.

---

## Étape 5 : Tests de Production

### 5.1 Checklist de Vérification

Avant de mettre en production, vérifiez :

- [ ] Toutes les variables d'environnement sont configurées
- [ ] La base de données est accessible et les migrations sont appliquées
- [ ] Les NFT Sources sont initialisés (3 sources)
- [ ] Les intégrations API sont actives et validées
- [ ] Les cron jobs sont configurés et s'exécutent
- [ ] Le monitoring affiche des données en temps réel
- [ ] SSL/HTTPS est activé
- [ ] Les emails de notification fonctionnent

### 5.2 Tests Fonctionnels

Suivez le guide `TESTING_GUIDE.md` pour exécuter les 15 tests end-to-end :

```bash
# Test 1 : Créer une correction
# Test 2 : Marquer comme utilisée
# Test 3 : Vérifier la redevabilité
# ... (voir TESTING_GUIDE.md)
```

### 5.3 Tests de Charge (Optionnel)

Pour vérifier la scalabilité :

```bash
npm install -g artillery
artillery quick --count 100 --num 10 https://votredomaine.com
```

---

## Étape 6 : Monitoring et Maintenance

### 6.1 Dashboard de Monitoring

Accédez quotidiennement à `/admin/monitoring` pour superviser :

- **Intégrations actives** : Nombre d'intégrations API fonctionnelles
- **Détections récentes** : Bénéfices détectés automatiquement
- **Redevances totales** : Montant total des redevances dues
- **Alertes** : Problèmes nécessitant votre attention

### 6.2 Logs et Alertes

Les logs sont accessibles via :

- **Vercel** : Dashboard > Functions > Logs
- **VPS** : `pm2 logs sionohmair`

Configurez des alertes email pour :

- Échec de cron jobs
- Erreurs de détection
- Redevances en retard (> 30 jours)

### 6.3 Sauvegardes Automatiques

Configurez des sauvegardes quotidiennes de la base de données :

```bash
# Ajouter au crontab
0 3 * * * mysqldump -u user -p database > /backups/db-$(date +\%Y\%m\%d).sql
```

Conservez les sauvegardes pendant au moins 30 jours.

---

## Sécurité et Conformité

### 7.1 Checklist de Sécurité

- [ ] Tous les secrets ont au moins 32 caractères
- [ ] Les secrets sont stockés dans des variables d'environnement (pas dans le code)
- [ ] SSL/HTTPS est activé partout
- [ ] Les connexions MySQL utilisent SSL
- [ ] Le `CRON_SECRET` est unique et sécurisé
- [ ] Les webhooks Stripe sont signés et vérifiés
- [ ] Les endpoints admin nécessitent une authentification
- [ ] Les logs ne contiennent pas de données sensibles

### 7.2 Conformité RGPD

Le système stocke des données personnelles (emails, montants de transactions). Assurez-vous de :

- Obtenir le consentement explicite des utilisateurs
- Permettre l'export et la suppression des données
- Chiffrer les données sensibles en base de données
- Documenter la politique de confidentialité

### 7.3 Rotation des Secrets

Changez tous les secrets tous les 3 mois :

- `JWT_SECRET`
- `CRON_SECRET`
- API keys (Stripe, SendGrid, etc.)

---

## Dépannage

### Problème : Les cron jobs ne s'exécutent pas

**Solution** :

1. Vérifiez que le `CRON_SECRET` est correctement configuré
2. Testez manuellement : `curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://votredomaine.com/api/trpc/cron.runDailyDetection`
3. Vérifiez les logs pour les erreurs

### Problème : Les détections ne fonctionnent pas

**Solution** :

1. Vérifiez que les intégrations API sont **actives** dans `/admin/api-keys`
2. Testez la validation des API keys (bouton "Tester" dans l'interface)
3. Vérifiez les logs de détection dans `/admin/honofication`

### Problème : Erreur de connexion à la base de données

**Solution** :

1. Vérifiez que `DATABASE_URL` est correctement formatée
2. Testez la connexion : `mysql -h host -u user -p database`
3. Vérifiez que le serveur MySQL autorise les connexions distantes
4. Activez SSL si requis par votre hébergeur

---

## Support et Ressources

### Documentation

- **Guide de test** : `TESTING_GUIDE.md`
- **Configuration cron** : `CRON_SETUP.md`
- **Contrat NFT** : `CONTRAT_NFT_GRATITUDE_ECONOMIQUE.md`
- **Lois d'honofication** : `LOIS_HONOFICATION_REDEVANCES.md`

### Scripts Utiles

- **Initialisation** : `./init-system.sh`
- **Déploiement cron** : `./deploy-cron.sh`

### Contact

Pour toute question ou problème, contactez le support technique à l'adresse indiquée dans votre contrat de service.

---

**Dernière mise à jour** : 27 novembre 2025  
**Version du document** : 1.0.0  
**Auteur** : Manus AI
