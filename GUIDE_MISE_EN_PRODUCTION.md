# 🚀 Guide de Mise en Production - Sionohmair Insight Academy

Ce guide vous accompagne étape par étape pour configurer et mettre en production votre site Sionohmair Insight Academy.

---

## 📋 Table des matières

1. [Configuration SMTP (Envoi d'emails automatiques)](#1-configuration-smtp)
2. [Promotion du compte administrateur](#2-promotion-admin)
3. [Publication d'articles de blog](#3-publication-articles)
4. [Activation de Stripe en production](#4-activation-stripe)
5. [Déploiement du site](#5-déploiement)
6. [Checklist finale](#6-checklist-finale)

---

## 1. Configuration SMTP (Envoi d'emails automatiques)

### Pourquoi configurer SMTP ?

Le site envoie automatiquement des emails dans 2 cas :
- **Confirmation de commande** après un paiement Stripe réussi
- **Email de bienvenue** avec Manuel PFPMA gratuit après inscription newsletter

### Option A : Utiliser Gmail (Recommandé pour débuter)

#### Étape 1 : Activer l'authentification à 2 facteurs sur Gmail

1. Allez sur https://myaccount.google.com/security
2. Activez "Validation en deux étapes"

#### Étape 2 : Créer un mot de passe d'application

1. Allez sur https://myaccount.google.com/apppasswords
2. Sélectionnez "Autre (nom personnalisé)"
3. Entrez "Sionohmair Website"
4. Cliquez sur "Générer"
5. **Copiez le mot de passe à 16 caractères** (format : xxxx xxxx xxxx xxxx)

#### Étape 3 : Ajouter les variables dans le Management UI

1. Ouvrez le Management UI (icône en haut à droite du Chatbox)
2. Allez dans **Settings → Secrets**
3. Cliquez sur **"Add Secret"**
4. Ajoutez ces 5 variables :

| Nom de la variable | Valeur |
|-------------------|--------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | Votre adresse Gmail complète (ex: `bruno.coldold@gmail.com`) |
| `SMTP_PASS` | Le mot de passe d'application à 16 caractères (sans espaces) |

#### Étape 4 : Redémarrer le serveur

1. Dans le Management UI, allez dans **Dashboard**
2. Cliquez sur **"Restart Server"**
3. Attendez 10 secondes

#### Étape 5 : Tester l'envoi d'emails

1. Allez sur la page d'accueil du site
2. Scrollez jusqu'au footer
3. Entrez votre email dans le formulaire newsletter
4. Cliquez sur "S'inscrire"
5. **Vérifiez votre boîte de réception** (et spam) pour l'email de bienvenue

---

### Option B : Utiliser SendGrid (Recommandé pour production)

#### Étape 1 : Créer un compte SendGrid

1. Allez sur https://signup.sendgrid.com/
2. Créez un compte gratuit (100 emails/jour)
3. Vérifiez votre email

#### Étape 2 : Créer une clé API

1. Allez dans **Settings → API Keys**
2. Cliquez sur **"Create API Key"**
3. Nom : `Sionohmair Website`
4. Permissions : **Full Access**
5. Cliquez sur **"Create & View"**
6. **Copiez la clé API** (commence par `SG.`)

#### Étape 3 : Ajouter les variables dans le Management UI

| Nom de la variable | Valeur |
|-------------------|--------|
| `SMTP_HOST` | `smtp.sendgrid.net` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | `apikey` (exactement ce texte) |
| `SMTP_PASS` | Votre clé API SendGrid |

---

## 2. Promotion du compte administrateur

### Pourquoi devenir admin ?

Le rôle **admin** vous permet d'accéder à `/admin` pour :
- Voir toutes les commandes clients
- Uploader les artefacts (rapports PDF, dashboards, NFT)
- Créer et gérer les articles de blog
- Voir les statistiques

### Étape 1 : Créer votre compte utilisateur

1. Allez sur le site
2. Cliquez sur **"Commencer"** ou **"Se connecter"**
3. Créez un compte avec votre email professionnel
4. Vérifiez votre email et connectez-vous

### Étape 2 : Promouvoir votre compte en admin

1. Ouvrez le Management UI
2. Allez dans **Database**
3. Dans l'éditeur SQL, exécutez cette requête :

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'votre.email@example.com';
```

**⚠️ Remplacez `votre.email@example.com` par votre vraie adresse email**

4. Cliquez sur **"Execute"**
5. Vous devriez voir : `1 row affected`

### Étape 3 : Vérifier l'accès admin

1. Rafraîchissez la page du site (F5)
2. Allez sur `/admin`
3. Vous devriez voir l'interface d'administration

---

## 3. Publication d'articles de blog

### Accéder à l'interface de création

1. Connectez-vous avec votre compte admin
2. Allez sur `/admin`
3. Scrollez jusqu'à la section **"Créer un nouvel article"**

### Structure d'un bon article

#### Titre
- **Accrocheur et spécifique** : "Comment TechFlow a augmenté ses conversions de 250% en 3 semaines"
- **Inclure un chiffre** : "+250%", "7 jours", "3 étapes"

#### Catégorie
- **case-study** : Études de cas clients (AVANT/APRÈS)
- **guide** : Guides pratiques PFPMA
- **insight** : Insights et analyses

#### Excerpt (Résumé)
- **2-3 phrases maximum**
- Résumer le problème, la solution, et le résultat
- Exemple : *"TechFlow avait un taux de conversion de 2%. Après le Sprint de Clarté, ils sont passés à 7% en 3 semaines. Découvrez la méthodologie complète."*

#### Contenu (Markdown)

Utilisez cette structure :

```markdown
## Le Problème

[Décrivez la situation initiale du client]

**Métriques AVANT :**
- Score de Clarté : 8/20
- Taux de conversion : 2%
- Friction Attention : 6/10

## La Solution : Sprint de Clarté

[Expliquez la méthodologie appliquée]

### Étape 1 : Diagnostic
[Détails]

### Étape 2 : Analyse PFPMA
[Détails]

### Étape 3 : Plan d'action
[Détails]

## Les Résultats

**Métriques APRÈS :**
- Score de Clarté : 18/20
- Taux de conversion : 7%
- ROI : +250%

## Témoignage Client

> "La méthodologie PFPMA a transformé notre approche..."
> 
> — Sophie Martin, CEO TechFlow

## Conclusion

[Call-to-action vers le Sprint de Clarté]
```

### Publier l'article

1. Remplissez tous les champs
2. Cochez **"Published"**
3. Cliquez sur **"Créer l'article"**
4. L'article apparaît immédiatement sur `/blog`

### Partager sur LinkedIn

1. Allez sur `/blog/votre-article`
2. Cliquez sur le bouton **LinkedIn** (en haut de l'article)
3. Ajoutez un commentaire personnel
4. Taguez le client (si autorisé)
5. Publiez !

---

## 4. Activation de Stripe en production

### Étape 1 : Réclamer le sandbox Stripe

⚠️ **IMPORTANT : Le lien expire le 2026-01-20**

1. Ouvrez ce lien : https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZFSGJENDV1UzY5TlRlLDE3NjQyODg3Njcv100fQEDeaWE
2. Créez votre compte Stripe ou connectez-vous
3. Suivez les instructions pour réclamer le sandbox

### Étape 2 : Activer le compte en production

1. Dans le dashboard Stripe, cliquez sur **"Activate your account"**
2. Remplissez les informations :
   - **Business details** : Nom, adresse, numéro SIRET
   - **Bank account** : IBAN pour recevoir les paiements
   - **Identity verification** : Pièce d'identité

3. Attendez la validation (généralement 1-2 jours)

### Étape 3 : Récupérer les clés de production

1. Dans le dashboard Stripe, **désactivez le mode Test** (toggle en haut à droite)
2. Allez dans **Developers → API keys**
3. Copiez :
   - **Publishable key** (commence par `pk_live_`)
   - **Secret key** (commence par `sk_live_`)

### Étape 4 : Remplacer les clés dans le Management UI

1. Ouvrez le Management UI → **Settings → Secrets**
2. Trouvez ces variables et **modifiez-les** :

| Variable | Ancienne valeur (test) | Nouvelle valeur (production) |
|----------|------------------------|------------------------------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | `pk_live_...` |
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` |

3. Cliquez sur **"Save"** pour chaque variable

### Étape 5 : Redémarrer le serveur

1. Dans le Management UI, allez dans **Dashboard**
2. Cliquez sur **"Restart Server"**

### Étape 6 : Tester un paiement réel

⚠️ **Vous allez être débité réellement**

1. Allez sur `/sprint-clarte`
2. Cliquez sur **"Payer maintenant (490 €)"**
3. Utilisez une **vraie carte bancaire**
4. Complétez le paiement
5. Vérifiez :
   - Email de confirmation reçu
   - Commande visible dans `/dashboard`
   - Paiement visible dans le dashboard Stripe

### Étape 7 : Configurer le webhook en production

1. Dans le dashboard Stripe, allez dans **Developers → Webhooks**
2. Cliquez sur **"Add endpoint"**
3. URL : `https://votre-domaine.manus.space/api/stripe/webhook`
4. Événements à écouter :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Cliquez sur **"Add endpoint"**
6. Copiez le **Signing secret** (commence par `whsec_`)
7. Dans le Management UI → Settings → Secrets, modifiez :
   - `STRIPE_WEBHOOK_SECRET` = le nouveau signing secret

---

## 5. Déploiement du site

### Le site est déjà en ligne !

Votre site est automatiquement déployé sur :
- **URL actuelle** : `https://sionohmair-insight-academy.manus.space`

### Personnaliser le domaine

1. Ouvrez le Management UI
2. Allez dans **Settings → Domains**
3. Vous pouvez :
   - **Modifier le préfixe** : `mon-nom.manus.space`
   - **Lier un domaine personnalisé** : `www.sionohmair.com`

### Publier une nouvelle version

1. Après chaque modification du code
2. Ouvrez le Chatbox
3. Demandez : "Créer un checkpoint"
4. Dans le Management UI, cliquez sur **"Publish"** (en haut à droite)
5. Le site est mis à jour en 30 secondes

---

## 6. Checklist finale

### Configuration technique

- [ ] SMTP configuré et testé (email de bienvenue reçu)
- [ ] Compte admin créé et promu
- [ ] Stripe activé en production (clés `pk_live_` et `sk_live_`)
- [ ] Webhook Stripe configuré avec signing secret production
- [ ] Domaine personnalisé configuré (optionnel)

### Contenu

- [ ] Au moins 1 article de blog publié
- [ ] Page À Propos complétée avec votre bio
- [ ] Coordonnées de contact à jour (email, LinkedIn)
- [ ] Logo personnalisé uploadé (Settings → General → Favicon)

### Tests

- [ ] Inscription newsletter → Email reçu
- [ ] Paiement test Stripe → Email de confirmation reçu
- [ ] Commande visible dans `/dashboard`
- [ ] Upload d'artefact dans `/admin` → Téléchargement dans `/dashboard`
- [ ] Partage social LinkedIn → Aperçu correct

### Marketing

- [ ] Publier 1 article de blog par semaine
- [ ] Partager chaque article sur LinkedIn
- [ ] Collecter les emails newsletter (objectif : 100 en 1 mois)
- [ ] Uploader les artefacts clients dans les 48h après paiement

---

## 🎯 Prochaines étapes recommandées

1. **Semaine 1** : Configurer SMTP, promouvoir admin, publier 1er article
2. **Semaine 2** : Activer Stripe production, tester paiement réel
3. **Semaine 3** : Publier 2-3 articles, partager sur LinkedIn
4. **Semaine 4** : Analyser les statistiques, optimiser les conversions

---

## 🆘 Support

Si vous rencontrez un problème :

1. **Documentation** : Relisez ce guide
2. **Logs** : Vérifiez les logs dans Management UI → Dashboard
3. **Database** : Vérifiez les données dans Management UI → Database
4. **Support Manus** : https://help.manus.im

---

**Bon lancement ! 🚀**

*Ce guide a été créé pour Sionohmair Insight Academy - L'Ingénierie du Génie*
