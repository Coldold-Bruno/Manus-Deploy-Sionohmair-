# ⚡ Automatisation Rapide - Sionohmair Insight Academy

## 🎯 Objectif

Ce guide vous permet de **configurer et publier** votre plateforme en **15 minutes chrono**.

---

## 📋 Checklist Ultra-Rapide

### ✅ Étape 1 : Configuration SMTP (5 minutes)

**Option Recommandée : Gmail**

1. **Créez un mot de passe d'application** :
   - Allez sur https://myaccount.google.com/apppasswords
   - Créez un mot de passe pour "Sionohmair"
   - Copiez le mot de passe (16 caractères)

2. **Configurez dans Manus** :
   - Ouvrez Manus → Settings → Secrets
   - Copiez-collez les 5 secrets suivants :

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre.email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
```

3. **Redémarrez** :
   - Cliquez sur "Restart Server" dans Manus
   - Attendez 30 secondes

---

### ✅ Étape 2 : Vérification Automatique (2 minutes)

**Testez tout le système en une commande** :

```bash
cd /home/ubuntu/sionohmair-insight-academy
node scripts/verification-complete.mjs
```

**Résultat attendu** :
```
✅ Configuration SMTP
✅ Base de données
✅ Secrets Manus
✅ Serveur API
✅ Configuration Stripe
✅ Cron Job

🎉 SYSTÈME 100% OPÉRATIONNEL !
```

**Si des erreurs** :
- Consultez `CONFIGURATION_SMTP_AUTO.md`
- Consultez `SECRETS_MANUS_COPIER_COLLER.txt`

---

### ✅ Étape 3 : Créer un Checkpoint (1 minute)

1. **Vérifiez todo.md** :
   ```bash
   cat /home/ubuntu/sionohmair-insight-academy/todo.md
   ```
   Toutes les tâches doivent être `[x]`

2. **Créez le checkpoint** :
   - Manus → "Save Checkpoint"
   - Description : `Production Ready - Configuration complète`
   - Cliquez sur "Save"

---

### ✅ Étape 4 : Publier (2 minutes)

1. **Publiez** :
   - Manus → "Publish"
   - Attendez 30-60 secondes

2. **Testez** :
   - Ouvrez l'URL publique dans un navigateur privé
   - Testez inscription + email de bienvenue

---

### ✅ Étape 5 : Configurer le Cron Job (5 minutes)

**Option Recommandée : Cron-Job.org**

1. **Créez un compte** sur https://cron-job.org/

2. **Créez un cron job** :
   - Title : `Sionohmair Trial Reminders`
   - URL : `https://votre-domaine.manus.space/api/cron/check-trial-expirations`
   - Method : `POST`
   - Headers :
     ```
     Content-Type: application/json
     ```
   - Body :
     ```json
     {"secret":"7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="}
     ```
   - Schedule : `Every day at 10:00 AM`

3. **Testez** :
   ```bash
   curl -X POST "https://votre-domaine.manus.space/api/cron/check-trial-expirations" \
     -H "Content-Type: application/json" \
     -d '{"secret":"7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="}'
   ```

---

## 🚀 Commandes Utiles

### Tester l'envoi d'email
```bash
cd /home/ubuntu/sionohmair-insight-academy
node scripts/test-email.mjs
```

### Vérifier le système complet
```bash
cd /home/ubuntu/sionohmair-insight-academy
node scripts/verification-complete.mjs
```

### Vérifier la base de données
```bash
cd /home/ubuntu/sionohmair-insight-academy
pnpm db:studio
# Ouvrez http://localhost:4983
```

### Vérifier les logs
```bash
# Dans Manus → Preview → Console (F12)
# Recherchez les erreurs rouges
```

---

## 📊 Tableau de Bord de Production

### Monitoring

| Métrique | Outil | URL |
|----------|-------|-----|
| Analytics | Manus Dashboard | Manus → Dashboard |
| Emails | SMTP Logs | Vérifiez votre boîte de réception |
| Paiements | Stripe Dashboard | https://dashboard.stripe.com/ |
| Cron Jobs | Cron-Job.org | https://cron-job.org/ |
| Erreurs | Browser Console | F12 → Console |

### Endpoints Importants

| Endpoint | Description | Test |
|----------|-------------|------|
| `/api/health` | Santé du serveur | `curl https://votre-domaine/api/health` |
| `/api/cron/check-trial-expirations` | Cron job emails | Voir section Cron Job |
| `/api/stripe/webhook` | Webhook Stripe | Configuré dans Stripe Dashboard |

---

## 🎯 Checklist Finale

- [ ] **SMTP configuré** : 5 secrets dans Manus
- [ ] **Vérification réussie** : `node scripts/verification-complete.mjs` → 100%
- [ ] **Checkpoint créé** : Description claire
- [ ] **Site publié** : URL accessible
- [ ] **Cron job configuré** : Test manuel réussi
- [ ] **Tests fonctionnels** : Inscription + email + paiement
- [ ] **Monitoring actif** : Analytics visibles

---

## 🚨 Dépannage Express

### Email ne part pas
```bash
# 1. Vérifiez les secrets
# Manus → Settings → Secrets

# 2. Testez la connexion
node scripts/verification-complete.mjs

# 3. Redémarrez le serveur
# Manus → Restart Server
```

### Site ne charge pas
```bash
# 1. Vérifiez la publication
# Manus → Dashboard → Status

# 2. Videz le cache
# Ctrl+Shift+R dans le navigateur

# 3. Vérifiez les DNS (si domaine personnalisé)
# https://dnschecker.org/
```

### Paiement ne fonctionne pas
```bash
# 1. Vérifiez le webhook Stripe
# Dashboard Stripe → Developers → Webhooks

# 2. Testez avec la carte test
# 4242 4242 4242 4242

# 3. Vérifiez les logs
# Dashboard Stripe → Developers → Logs
```

---

## 📚 Documentation Complète

| Document | Description |
|----------|-------------|
| `CONFIGURATION_SMTP_AUTO.md` | Guide détaillé SMTP (Gmail/SendGrid/Brevo) |
| `SECRETS_MANUS_COPIER_COLLER.txt` | Secrets prêts à copier-coller |
| `GUIDE_PUBLICATION_PRODUCTION.md` | Guide complet de publication |
| `CONFIGURATION_MANUELLE_SECRETS.md` | Configuration avancée (GitHub Actions, etc.) |
| `scripts/verification-complete.mjs` | Script de vérification automatique |
| `scripts/test-email.mjs` | Script de test d'email |

---

## 🎉 Félicitations !

Si vous avez suivi toutes les étapes, votre plateforme est maintenant **100% opérationnelle en production** ! 🚀

### Prochaines Étapes

1. **Partagez votre URL** sur les réseaux sociaux
2. **Ajoutez du contenu** (formations, artefacts)
3. **Analysez les metrics** (UV, PV, conversions)
4. **Collectez les retours** utilisateurs

---

**Besoin d'aide ?**
- Documentation : `/docs/`
- Support Manus : https://help.manus.im

---

**Dernière mise à jour** : 2025-01-28  
**Version** : 1.0.0  
**Temps total** : 15 minutes chrono ⚡
