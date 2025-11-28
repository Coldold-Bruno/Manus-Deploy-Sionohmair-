# 🚀 Guide de Publication Production - Sionohmair Insight Academy

## 📋 Vue d'Ensemble

Ce guide vous accompagne **étape par étape** pour publier votre plateforme en production et la rendre accessible au public.

**Durée totale** : 15-20 minutes  
**Prérequis** : Configuration SMTP terminée (voir `CONFIGURATION_SMTP_AUTO.md`)

---

## ✅ Checklist Pré-Publication

Avant de publier, assurez-vous que :

- [ ] **Configuration SMTP** : Les 5 secrets SMTP sont configurés et testés
- [ ] **Test d'envoi d'email** : `node scripts/test-email.mjs` fonctionne
- [ ] **Cron secret** : Le secret `CRON_SECRET` est configuré
- [ ] **Stripe** : Le compte Stripe sandbox est réclamé (ou mode Live activé)
- [ ] **Tests fonctionnels** : Inscription, connexion, paiement testés en local
- [ ] **Contenu** : Textes, images, tarifs vérifiés

---

## 🎯 Étape 1 : Vérification Finale du Système

### 1.1 Tester le Flux Complet

```bash
# Terminal Manus
cd /home/ubuntu/sionohmair-insight-academy

# Test 1 : Envoi d'email
node scripts/test-email.mjs

# Test 2 : Vérifier la base de données
pnpm db:studio
# Ouvrez http://localhost:4983 et vérifiez les tables

# Test 3 : Vérifier le serveur
curl http://localhost:3000/api/health
```

### 1.2 Tester le Parcours Utilisateur

1. **Inscription** :
   - Allez sur `/signup`
   - Créez un compte test
   - Vérifiez que l'email de bienvenue arrive

2. **Connexion** :
   - Connectez-vous avec le compte test
   - Vérifiez l'accès au dashboard

3. **Paiement Test** :
   - Allez sur `/pricing`
   - Testez un paiement avec la carte test Stripe : `4242 4242 4242 4242`
   - Vérifiez que l'abonnement est activé

4. **Upload d'Artefact** :
   - Uploadez un fichier test
   - Vérifiez qu'il apparaît dans le dashboard

### 1.3 Vérifier les Logs

```bash
# Vérifier qu'il n'y a pas d'erreurs critiques
# Dans Manus → Preview → Console (F12)
# Recherchez les erreurs rouges
```

---

## 🔧 Étape 2 : Configuration des Secrets Production

### 2.1 Secrets Obligatoires (Déjà Configurés)

Ces secrets doivent déjà être dans Manus → Settings → Secrets :

```
✅ CRON_SECRET
✅ SMTP_HOST
✅ SMTP_PORT
✅ SMTP_SECURE
✅ SMTP_USER
✅ SMTP_PASS
```

### 2.2 Activer Stripe en Mode Live (Optionnel)

**⚠️ Important** : Le mode Test Stripe fonctionne en production. Passez en mode Live seulement quand vous êtes prêt à accepter de vrais paiements.

**Pour activer le mode Live** :

1. **Réclamez votre compte Stripe** :
   - Allez sur https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZFSGJENDV1UzY5TlRlLDE3NjQyODg3Njcv100fQEDeaWE
   - Complétez la vérification de votre entreprise

2. **Obtenez les clés Live** :
   - Dashboard Stripe → Developers → API Keys
   - Basculez de "Test mode" à "Live mode" (toggle en haut à droite)
   - Copiez la "Publishable key" (commence par `pk_live_`)
   - Cliquez sur "Reveal" pour la "Secret key" (commence par `sk_live_`)

3. **Configurez le Webhook Live** :
   - Dashboard Stripe → Developers → Webhooks
   - Cliquez sur "Add endpoint"
   - URL : `https://votre-domaine.manus.space/api/stripe/webhook`
   - Événements : `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copiez le "Signing secret" (commence par `whsec_`)

4. **Mettez à jour les secrets dans Manus** :
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
   STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

5. **Redémarrez le serveur** Manus

---

## 📦 Étape 3 : Créer un Checkpoint

Un checkpoint est **obligatoire** avant publication.

### 3.1 Marquer les Tâches Complétées

```bash
# Vérifiez todo.md
cat /home/ubuntu/sionohmair-insight-academy/todo.md

# Toutes les tâches doivent être [x] (complétées)
```

### 3.2 Créer le Checkpoint

Dans Manus :
1. Cliquez sur le bouton **"Save Checkpoint"** (en haut à droite)
2. Description : `Production Ready - Configuration SMTP + Tests complets`
3. Cliquez sur **"Save"**

✅ Le bouton **"Publish"** devient maintenant actif.

---

## 🌐 Étape 4 : Publier le Site

### 4.1 Publier dans Manus

1. **Cliquez sur "Publish"** (en haut à droite)
2. **Attendez la publication** (30-60 secondes)
3. **Notez l'URL publique** : `https://votre-domaine.manus.space`

### 4.2 Vérifier le Déploiement

1. **Ouvrez l'URL publique** dans un navigateur privé
2. **Testez le flux complet** :
   - Page d'accueil charge correctement
   - Inscription fonctionne
   - Email de bienvenue arrive
   - Connexion fonctionne
   - Paiement test fonctionne
   - Dashboard accessible

---

## 🔗 Étape 5 : Configurer un Domaine Personnalisé (Optionnel)

### 5.1 Acheter un Domaine

Achetez un domaine sur :
- **Namecheap** : https://www.namecheap.com/
- **OVH** : https://www.ovh.com/fr/
- **Google Domains** : https://domains.google/

Exemples :
- `sionohmair-academy.com`
- `insight-academy.fr`
- `formation-genie.com`

### 5.2 Configurer le DNS

Dans Manus → Settings → Domains :

1. **Cliquez sur "Add Custom Domain"**
2. **Entrez votre domaine** : `sionohmair-academy.com`
3. **Copiez les enregistrements DNS** fournis par Manus
4. **Ajoutez-les dans votre registrar** (Namecheap/OVH/etc.)

Exemple d'enregistrements DNS :
```
Type: CNAME
Name: @
Value: votre-domaine.manus.space
TTL: 3600

Type: CNAME
Name: www
Value: votre-domaine.manus.space
TTL: 3600
```

5. **Attendez la propagation DNS** (5 minutes à 48 heures)
6. **Vérifiez** : `https://sionohmair-academy.com`

### 5.3 Activer HTTPS (Automatique)

Manus active automatiquement HTTPS avec Let's Encrypt. Aucune action requise.

---

## 📊 Étape 6 : Configurer le Cron Job Automatique

Le cron job envoie les emails de rappel d'essai gratuit (J-7, J-3, J-1, J-0).

### 6.1 Option A : Cron-Job.org (Gratuit, Recommandé)

1. **Créez un compte** sur https://cron-job.org/
2. **Créez un nouveau cron job** :
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
3. **Sauvegardez**

### 6.2 Option B : EasyCron (Gratuit)

1. **Créez un compte** sur https://www.easycron.com/
2. **Créez un nouveau cron job** :
   - Cron Expression : `0 10 * * *` (10h00 chaque jour)
   - URL : `https://votre-domaine.manus.space/api/cron/check-trial-expirations`
   - Method : `POST`
   - POST Data :
     ```json
     {"secret":"7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="}
     ```
3. **Sauvegardez**

### 6.3 Option C : GitHub Actions (Avancé)

Voir `CONFIGURATION_MANUELLE_SECRETS.md` section "Configuration GitHub Actions".

### 6.4 Tester le Cron Job

```bash
# Test manuel
curl -X POST "https://votre-domaine.manus.space/api/cron/check-trial-expirations" \
  -H "Content-Type: application/json" \
  -d '{"secret":"7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="}'

# Réponse attendue :
# {"success":true,"processed":X,"sent":Y}
```

---

## 📈 Étape 7 : Monitoring et Analytics

### 7.1 Vérifier les Analytics

Dans Manus → Dashboard :
- **Visiteurs uniques (UV)** : Nombre de visiteurs
- **Pages vues (PV)** : Nombre de pages consultées
- **Taux de conversion** : Inscriptions / Visiteurs

### 7.2 Surveiller les Emails

Vérifiez régulièrement que les emails ne tombent pas en spam :
1. Créez des comptes tests avec différents fournisseurs (Gmail, Outlook, Yahoo)
2. Vérifiez que les emails arrivent dans la boîte de réception
3. Si spam : configurez SPF/DKIM/DMARC (voir documentation SendGrid/Brevo)

### 7.3 Surveiller les Erreurs

```bash
# Vérifier les logs de production
# Dans Manus → Preview → Console (F12)
# Recherchez les erreurs rouges
```

---

## 🎯 Étape 8 : Optimisations Post-Lancement

### 8.1 SEO (Référencement)

1. **Vérifiez les meta tags** :
   - Titre : "Sionohmair Insight Academy - L'Ingénierie du Génie"
   - Description : "Plateforme de formation en ingénierie..."
   - Open Graph (Facebook/LinkedIn)
   - Twitter Cards

2. **Créez un sitemap** :
   - Ajoutez `/sitemap.xml`
   - Soumettez à Google Search Console

3. **Créez robots.txt** :
   ```
   User-agent: *
   Allow: /
   Sitemap: https://votre-domaine.com/sitemap.xml
   ```

### 8.2 Performance

1. **Testez la vitesse** :
   - Google PageSpeed Insights : https://pagespeed.web.dev/
   - GTmetrix : https://gtmetrix.com/

2. **Optimisez les images** :
   - Compressez avec TinyPNG : https://tinypng.com/
   - Utilisez WebP au lieu de PNG/JPG

3. **Activez le cache** :
   - Déjà configuré dans Manus (automatique)

### 8.3 Sécurité

1. **Activez HTTPS** : ✅ Automatique avec Manus
2. **Configurez CSP** : Content Security Policy (optionnel)
3. **Rate limiting** : ✅ Déjà configuré (10 requêtes/minute)

---

## 🚨 Dépannage Production

### Problème : Site ne charge pas

**Solutions** :
1. Vérifiez que la publication est terminée (Manus → Dashboard)
2. Vérifiez les DNS (si domaine personnalisé)
3. Videz le cache du navigateur (Ctrl+Shift+R)

### Problème : Emails ne partent pas

**Solutions** :
1. Vérifiez les secrets SMTP dans Manus → Settings → Secrets
2. Testez avec `node scripts/test-email.mjs` en local
3. Vérifiez les logs du serveur (Manus → Preview → Console)
4. Vérifiez que le serveur a été redémarré après config SMTP

### Problème : Paiements Stripe ne fonctionnent pas

**Solutions** :
1. Vérifiez que le webhook Stripe est configuré
2. Vérifiez l'URL du webhook : `https://votre-domaine/api/stripe/webhook`
3. Testez avec la carte test : `4242 4242 4242 4242`
4. Vérifiez les logs Stripe : Dashboard → Developers → Logs

### Problème : Cron job ne s'exécute pas

**Solutions** :
1. Vérifiez que le secret `CRON_SECRET` est correct
2. Testez manuellement avec curl (voir section 6.4)
3. Vérifiez les logs du service cron (Cron-Job.org → Logs)

---

## ✅ Checklist Finale de Production

- [ ] **Tests complets** : Inscription, connexion, paiement, upload
- [ ] **Emails fonctionnels** : Test d'envoi réussi
- [ ] **Checkpoint créé** : Description claire
- [ ] **Site publié** : URL accessible publiquement
- [ ] **Domaine configuré** : DNS propagé (si applicable)
- [ ] **HTTPS actif** : Cadenas vert dans le navigateur
- [ ] **Cron job configuré** : Test manuel réussi
- [ ] **Analytics activées** : UV/PV visibles dans Dashboard
- [ ] **Stripe configuré** : Paiement test réussi
- [ ] **SEO optimisé** : Meta tags, sitemap, robots.txt
- [ ] **Performance testée** : PageSpeed > 80
- [ ] **Monitoring actif** : Vérification quotidienne des emails/logs

---

## 🎉 Félicitations !

Votre plateforme **Sionohmair Insight Academy** est maintenant **100% opérationnelle en production** ! 🚀

### Prochaines Étapes

1. **Marketing** :
   - Partagez l'URL sur les réseaux sociaux
   - Créez une landing page de lancement
   - Contactez vos premiers utilisateurs

2. **Contenu** :
   - Ajoutez des formations
   - Créez des artefacts de démonstration
   - Rédigez des articles de blog

3. **Amélioration Continue** :
   - Collectez les retours utilisateurs
   - Analysez les analytics
   - Ajoutez de nouvelles fonctionnalités

---

## 📞 Support

**Besoin d'aide ?**

- **Documentation complète** : `/docs/`
- **Configuration SMTP** : `CONFIGURATION_SMTP_AUTO.md`
- **Secrets manuels** : `CONFIGURATION_MANUELLE_SECRETS.md`
- **Support Manus** : https://help.manus.im

---

**Dernière mise à jour** : 2025-01-28  
**Version** : 1.0.0  
**Auteur** : Sionohmair Insight Academy
