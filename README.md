# 🚀 Sionohmair Insight Academy

**L'Ingénierie du Génie** - Plateforme d'abonnement pour le Content Marketing & Copywriting

---

## 📋 Vue d'Ensemble

Sionohmair Insight Academy est une plateforme d'abonnement complète offrant :

- **Essai gratuit de 30 jours** sans carte bancaire
- **Abonnement mensuel à 36€** avec accès complet
- **Emails automatiques** (bienvenue, rappels J-7, J-3, J-1, expiration)
- **Paiements Stripe** sécurisés
- **Dashboard utilisateur** avec suivi de progression
- **Système de scoring** de leads automatique
- **Cron job quotidien** pour gérer les expirations

---

## 🎯 Démarrage Rapide (10 minutes)

### Option 1 : Configuration Automatique ⭐ RECOMMANDÉ

```bash
# 1. Cloner le repository
git clone https://github.com/votre-username/sionohmair-insight-academy.git
cd sionohmair-insight-academy

# 2. Installer les dépendances
pnpm install

# 3. Lancer l'automatisation complète
./scripts/setup-all.sh

# 4. Démarrer le serveur
pnpm dev
```

**C'est tout !** Le script configure automatiquement :
- GitHub Secrets (CRON_SECRET, APP_URL)
- Manus Secrets (CRON_SECRET, SMTP_*)
- Tests automatiques

### Option 2 : Configuration Manuelle

Consultez le guide détaillé : [FINALISATION.md](./FINALISATION.md)

---

## 📚 Documentation

### Guides de Configuration

| Document | Description | Durée |
|----------|-------------|-------|
| [FINALISATION.md](./FINALISATION.md) | **Guide principal** - Les 3 dernières étapes | 15 min |
| [QUICKSTART.md](./QUICKSTART.md) | Démarrage rapide (automatique ou manuel) | 10 min |
| [CONFIGURATION_FINALE.md](./CONFIGURATION_FINALE.md) | Configuration détaillée (SMTP, Cron, Stripe) | 20 min |

### Guides d'Automatisation

| Document | Description |
|----------|-------------|
| [scripts/AUTOMATION_README.md](./scripts/AUTOMATION_README.md) | Documentation complète des scripts |
| [AUTOMATION_COMPLETE.md](./AUTOMATION_COMPLETE.md) | Résumé et workflow d'automatisation |

### Guides Techniques

| Document | Description |
|----------|-------------|
| [CRON_AUTOMATION.md](./CRON_AUTOMATION.md) | Documentation du cron job quotidien |
| [GUIDE_UTILISATEUR.md](./GUIDE_UTILISATEUR.md) | Guide pour les abonnés |

---

## 🛠️ Stack Technique

### Frontend
- **React 19** avec TypeScript
- **Tailwind CSS 4** pour le design
- **shadcn/ui** pour les composants
- **Wouter** pour le routing
- **Vite** pour le build

### Backend
- **Node.js** avec Express
- **tRPC** pour l'API type-safe
- **Drizzle ORM** pour la base de données
- **PostgreSQL** (via Manus)

### Intégrations
- **Stripe** pour les paiements
- **Nodemailer** pour les emails
- **GitHub Actions** pour le cron job
- **OAuth** pour l'authentification

---

## 📦 Scripts Disponibles

### Scripts de Développement

```bash
# Démarrer le serveur de développement
pnpm dev

# Build pour la production
pnpm build

# Lancer les tests
pnpm test

# Push du schéma vers la base de données
pnpm db:push
```

### Scripts d'Automatisation

```bash
# Configuration complète (GitHub + Manus + Tests)
./scripts/setup-all.sh

# Configuration GitHub Secrets uniquement
./scripts/setup-github-secrets.sh

# Configuration Manus Secrets uniquement
./scripts/setup-manus-secrets.sh

# Vérification finale du système
./scripts/verify-final.sh

# Test du système complet
./scripts/test-system.sh

# Test SMTP uniquement
node scripts/test-email.mjs
```

---

## 🔐 Configuration des Secrets

### GitHub Secrets (2)

Configurés via `./scripts/setup-github-secrets.sh` ou manuellement :

| Secret | Valeur |
|--------|--------|
| `CRON_SECRET` | `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=` |
| `APP_URL` | `https://sionohmair-insight-academy.manus.space` |

### Manus Secrets (8)

Configurés via `./scripts/setup-manus-secrets.sh` ou manuellement dans **Manus → Settings → Secrets** :

| Secret | Description |
|--------|-------------|
| `CRON_SECRET` | Secret pour sécuriser le cron job |
| `SMTP_HOST` | Serveur SMTP (ex: smtp.gmail.com) |
| `SMTP_PORT` | Port SMTP (généralement 587) |
| `SMTP_USER` | Email SMTP |
| `SMTP_PASS` | Mot de passe d'application |
| `SMTP_FROM` | Email expéditeur |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook Stripe |

---

## 📊 Dashboard de Configuration

**URL** : https://sionohmair-insight-academy.manus.space/config

Le dashboard affiche en temps réel :
- ✅ État de chaque configuration (SMTP, CRON, GitHub, Stripe)
- 📋 Variables à copier-coller
- 📝 Instructions détaillées
- 🔗 Liens directs vers les services

---

## ✅ Checklist de Déploiement

Avant de passer en production :

- [ ] **GitHub Secrets** : CRON_SECRET et APP_URL configurés
- [ ] **Manus Secrets** : CRON_SECRET et 5 variables SMTP configurées
- [ ] **Stripe** : Compte activé, produit créé, clés API configurées
- [ ] **Webhook Stripe** : Configuré avec les bons événements
- [ ] **Test SMTP** : Email de test reçu avec succès
- [ ] **Test Cron** : Endpoint répond avec `success:true`
- [ ] **Test Paiement** : Paiement test réussi avec carte `4242 4242 4242 4242`
- [ ] **Dashboard** : Toutes les configurations affichent ✅

---

## 🧪 Tests

### Test SMTP

```bash
node scripts/test-email.mjs
```

**Résultat attendu** : `✅ Test SMTP RÉUSSI`

### Test Cron Job

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"secret":"7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="}' \
  https://sionohmair-insight-academy.manus.space/api/trpc/cron.checkTrialExpirations
```

**Résultat attendu** : `{"result":{"data":{"success":true,...}}}`

### Test Système Complet

```bash
./scripts/test-system.sh
```

**Résultat attendu** :
```
✅ SMTP configuré
✅ Cron job configuré
✅ Base de données OK
✅ Stripe configuré
```

### Vérification Finale

```bash
./scripts/verify-final.sh
```

Affiche un rapport détaillé de toutes les configurations.

---

## 🚀 Passage en Production

### 1. Passer Stripe en mode Live

1. Allez sur **Stripe Dashboard**
2. Activez le **mode Live** (en haut à droite)
3. Récupérez les nouvelles clés API (pk_live_..., sk_live_...)
4. Mettez à jour dans Manus → Settings → Secrets
5. Créez un nouveau webhook en mode Live
6. Mettez à jour le webhook secret

### 2. Configurer un domaine personnalisé (Optionnel)

1. Allez dans **Manus** → **Settings** → **Domains**
2. Ajoutez votre domaine personnalisé (ex: `app.sionohmair.com`)
3. Configurez les DNS selon les instructions
4. Mettez à jour `APP_URL` dans GitHub Secrets

### 3. Activer le monitoring

- Surveillez le dashboard : `/config`
- Vérifiez les logs GitHub Actions
- Surveillez les emails dans Stripe Dashboard
- Vérifiez les paiements dans Stripe Dashboard

---

## 🆘 Dépannage

### Les emails ne sont pas envoyés

1. Vérifiez que les 5 variables SMTP sont dans Manus → Settings → Secrets
2. Testez avec `node scripts/test-email.mjs`
3. Vérifiez le mot de passe d'application Gmail
4. Redémarrez le serveur Manus

### Le cron job ne fonctionne pas

1. Vérifiez que `CRON_SECRET` est identique dans GitHub et Manus
2. Vérifiez que `APP_URL` est correct dans GitHub Secrets
3. Testez manuellement avec curl
4. Vérifiez les logs GitHub Actions

### Le paiement Stripe échoue

1. Vérifiez que les 3 clés Stripe sont dans Manus Secrets
2. Vérifiez que le webhook est configuré
3. Testez avec la carte de test : `4242 4242 4242 4242`
4. Vérifiez les logs dans Stripe Dashboard

---

## 📁 Structure du Projet

```
sionohmair-insight-academy/
├── client/                    # Frontend React
│   ├── public/               # Assets statiques
│   └── src/
│       ├── pages/            # Pages de l'application
│       ├── components/       # Composants réutilisables
│       ├── contexts/         # Contextes React
│       └── hooks/            # Hooks personnalisés
├── server/                   # Backend Node.js
│   ├── db/                   # Base de données
│   │   └── schema.ts         # Schéma Drizzle
│   ├── routers/              # Routers tRPC
│   └── services/             # Services métier
├── shared/                   # Code partagé
│   └── const.ts              # Constantes
├── scripts/                  # Scripts d'automatisation
│   ├── setup-all.sh          # Script maître
│   ├── setup-github-secrets.sh
│   ├── setup-manus-secrets.sh
│   ├── verify-final.sh
│   ├── test-system.sh
│   └── test-email.mjs
├── .github/workflows/        # GitHub Actions
│   └── check-trial-expirations.yml
├── FINALISATION.md           # Guide principal
├── QUICKSTART.md             # Démarrage rapide
├── CONFIGURATION_FINALE.md   # Configuration détaillée
└── README.md                 # Ce fichier
```

---

## 🎯 Fonctionnalités

### Pour les Utilisateurs

- ✅ Inscription / Connexion (email + OAuth)
- ✅ Essai gratuit de 30 jours sans carte bancaire
- ✅ Abonnement mensuel à 36€
- ✅ Dashboard personnel avec progression
- ✅ Accès aux outils et ressources
- ✅ Calculateur de Score de Clarté
- ✅ Témoignages et études de cas

### Pour les Administrateurs

- ✅ Dashboard admin complet
- ✅ Gestion des utilisateurs et abonnements
- ✅ Upload d'artefacts pour les clients
- ✅ Système de scoring de leads automatique
- ✅ Profils de leads détaillés avec timeline
- ✅ Notes et commentaires sur les leads
- ✅ Statistiques et analytics

### Automatisations

- ✅ Email de bienvenue automatique
- ✅ Emails de rappel (J-7, J-3, J-1)
- ✅ Email d'expiration de l'essai
- ✅ Email de confirmation de paiement
- ✅ Cron job quotidien (9h00 UTC+1)
- ✅ Scoring de leads en temps réel
- ✅ Notifications pour leads chauds (score ≥80)

---

## 💡 Prochaines Améliorations

- [ ] Analytics avancés (Google Analytics, Mixpanel)
- [ ] Chat en direct (Intercom, Crisp)
- [ ] Notifications push (OneSignal)
- [ ] A/B Testing (Optimizely)
- [ ] Monitoring (Sentry, LogRocket)
- [ ] SEO avancé (Schema.org markup)
- [ ] Blog avec système de publication
- [ ] Programme de parrainage
- [ ] API publique

---

## 📞 Support

- **Dashboard de configuration** : `/config`
- **Documentation complète** : `FINALISATION.md`
- **Scripts de test** : `./scripts/test-system.sh`
- **Logs GitHub Actions** : GitHub → Actions

---

## 📄 Licence

Propriétaire - Bruno Coldold © 2025

---

## 🎉 Remerciements

Construit avec ❤️ par Bruno Coldold pour Sionohmair Insight Academy.

**L'Ingénierie du Génie** - Transformez vos messages en insights puissants.

---

**Prêt à démarrer ?** Lancez `./scripts/setup-all.sh` ! 🚀
