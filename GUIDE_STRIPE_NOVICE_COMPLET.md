# 🎓 GUIDE STRIPE POUR NOVICE COMPLET - PAS À PAS

## 📋 Table des Matières

1. [Retourner au Dashboard Stripe](#étape-1--retourner-au-dashboard-stripe)
2. [Créer Votre Premier Produit (Abonnement Premium)](#étape-2--créer-votre-premier-produit)
3. [Créer les 3 NFT (Bronze, Silver, Gold)](#étape-3--créer-les-3-nft)
4. [Récupérer Vos Clés API](#étape-4--récupérer-vos-clés-api)
5. [Configurer le Webhook](#étape-5--configurer-le-webhook)
6. [Ajouter les Clés dans Manus](#étape-6--ajouter-les-clés-dans-manus)
7. [Tester Votre Configuration](#étape-7--tester-votre-configuration)
8. [Passer en Mode Production (Live)](#étape-8--passer-en-mode-production)

---

## 🎯 Vue d'Ensemble : Ce Que Vous Allez Faire

Vous allez configurer Stripe pour accepter des paiements sur votre site. Voici les 8 étapes :

1. ✅ Retourner au tableau de bord Stripe
2. ✅ Créer 4 produits (1 abonnement + 3 NFT)
3. ✅ Récupérer vos clés API (comme des mots de passe)
4. ✅ Configurer un webhook (pour recevoir les notifications de paiement)
5. ✅ Ajouter les clés dans votre site Manus
6. ✅ Tester que tout fonctionne
7. ✅ Activer le mode Production
8. ✅ Publier votre site !

**Temps estimé : 30-45 minutes**

---

## Étape 1 : 🏠 Retourner au Dashboard Stripe

### 📱 Sur Mobile

1. **Cliquez sur la flèche ← en haut à gauche** de votre écran
2. Vous devriez voir le menu principal de Stripe

### 💻 Sur Ordinateur

1. Ouvrez votre navigateur
2. Allez sur : https://dashboard.stripe.com
3. Connectez-vous avec vos identifiants Stripe

### ✅ Vérification

Vous devriez voir :
- En haut à gauche : "Environnement de test" (avec un badge bleu)
- Un menu avec : Accueil, Paiements, Clients, Produits, etc.

---

## Étape 2 : 🎁 Créer Votre Premier Produit

### 2.1 Aller dans la Section Produits

1. **Cliquez sur "Produits"** dans le menu de gauche
2. **Cliquez sur le bouton "+ Ajouter un produit"** (en haut à droite)

### 2.2 Remplir les Informations du Produit

Vous allez voir un formulaire. Remplissez-le comme ceci :

#### **Nom (obligatoire)**
```
Abonnement Premium Mensuel
```

#### **Description**
```
Accès illimité aux outils de copywriting IA : Analyseur de Contenu (SEO, Conversion, Engagement), Générateur de Copy (6 frameworks : PFPMA, APTEA, AIDA, PAS, PASTOR, BAB), Persona Builder, Correcteur, Citations, Analyseur de Scripts, Éditeur en Temps Réel, Chat IA personnalisé. Facteur Alpha α = 22.67. Essai gratuit 30 jours, puis 29€/mois. Annulez à tout moment.
```

#### **Image**
- **Cliquez sur "Charger"** si vous avez une image
- **Ou laissez vide** pour l'instant (vous pourrez ajouter une image plus tard)

#### **Code de taxe produit**
- **Laissez par défaut** (Stripe gérera automatiquement)

### 2.3 Configurer le Prix

Après avoir cliqué sur "Ajouter le produit", vous allez voir une page pour configurer le prix :

1. **Modèle de tarification** : Sélectionnez "Standard"
2. **Prix** : Tapez `29`
3. **Devise** : Sélectionnez `EUR €`
4. **Fréquence de facturation** : Sélectionnez "Mensuel"
5. **Essai gratuit** : Cochez "Activer l'essai gratuit" et tapez `30` jours

### 2.4 Enregistrer

1. **Cliquez sur "Ajouter le produit"** (bouton bleu en bas)
2. ✅ Votre premier produit est créé !

### 2.5 Noter le Price ID

**IMPORTANT** : Après avoir créé le produit, vous allez voir une page avec les détails.

**Cherchez une ligne qui dit "Price ID" ou "ID de prix"**

Elle ressemble à : `price_1ABC2DEF3GHI4JKL5MNO`

**Copiez ce Price ID** et notez-le quelque part (bloc-notes, email à vous-même, etc.)

**Exemple de note** :
```
Abonnement Premium Mensuel : price_1ABC2DEF3GHI4JKL5MNO
```

---

## Étape 3 : 💎 Créer les 3 NFT

Vous allez répéter la même procédure 3 fois pour créer les 3 NFT.

### 3.1 NFT Bronze

1. **Cliquez sur "Produits"** dans le menu de gauche
2. **Cliquez sur "+ Ajouter un produit"**

**Nom** :
```
NFT Bronze - Licence Perpétuelle
```

**Description** :
```
Licence NFT Bronze pour accès à vie aux outils de copywriting IA Sionohmair. Inclut tous les outils Premium + support prioritaire. Paiement unique de 290€, aucun abonnement. Transférable et revendable.
```

**Prix** :
- Modèle : Standard
- Prix : `290`
- Devise : EUR €
- Fréquence : **"Paiement unique"** (pas d'abonnement !)

**Cliquez sur "Ajouter le produit"**

**Notez le Price ID** :
```
NFT Bronze : price_XXXXXXXXXXXXXXXXX
```

---

### 3.2 NFT Silver

Répétez la même procédure :

**Nom** :
```
NFT Silver - Licence Perpétuelle
```

**Description** :
```
Licence NFT Silver pour accès à vie aux outils de copywriting IA Sionohmair. Inclut tous les outils Premium + support prioritaire + accès aux nouvelles fonctionnalités en avant-première. Paiement unique de 990€, aucun abonnement. Transférable et revendable.
```

**Prix** :
- Prix : `990`
- Devise : EUR €
- Fréquence : **"Paiement unique"**

**Notez le Price ID** :
```
NFT Silver : price_XXXXXXXXXXXXXXXXX
```

---

### 3.3 NFT Gold

Répétez une dernière fois :

**Nom** :
```
NFT Gold - Licence Perpétuelle
```

**Description** :
```
Licence NFT Gold pour accès à vie aux outils de copywriting IA Sionohmair. Inclut tous les outils Premium + support prioritaire + accès VIP + coaching mensuel personnalisé. Paiement unique de 2900€, aucun abonnement. Transférable et revendable.
```

**Prix** :
- Prix : `2900`
- Devise : EUR €
- Fréquence : **"Paiement unique"**

**Notez le Price ID** :
```
NFT Gold : price_XXXXXXXXXXXXXXXXX
```

---

### ✅ Récapitulatif des 4 Produits Créés

Vous devriez maintenant avoir **4 produits** dans votre liste :

1. ✅ Abonnement Premium Mensuel (29€/mois)
2. ✅ NFT Bronze (290€ paiement unique)
3. ✅ NFT Silver (990€ paiement unique)
4. ✅ NFT Gold (2900€ paiement unique)

**Et vous avez noté les 4 Price IDs** quelque part !

---

## Étape 4 : 🔑 Récupérer Vos Clés API

Les clés API sont comme des mots de passe qui permettent à votre site de communiquer avec Stripe.

### 4.1 Aller dans la Section Développeurs

1. **Cliquez sur "Développeurs"** dans le menu de gauche (tout en bas)
2. **Cliquez sur "Clés API"**

### 4.2 Identifier Vos Clés

Vous allez voir 2 types de clés :

#### **Clé Publique (Publishable key)**
- Commence par `pk_test_...` (en mode test)
- Ou `pk_live_...` (en mode production)
- **Cette clé est publique**, elle peut être vue par tout le monde

#### **Clé Secrète (Secret key)**
- Commence par `sk_test_...` (en mode test)
- Ou `sk_live_...` (en mode production)
- **Cette clé est secrète**, ne la partagez JAMAIS !

### 4.3 Copier Vos Clés

**Pour l'instant, vous êtes en mode TEST**, donc vous allez copier les clés de test :

1. **Clé publique de test** : Cliquez sur "Révéler la clé de test" et copiez-la
2. **Clé secrète de test** : Cliquez sur "Révéler la clé de test" et copiez-la

**Notez-les quelque part** :
```
VITE_STRIPE_PUBLISHABLE_KEY = pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_SECRET_KEY = sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## Étape 5 : 🔔 Configurer le Webhook

Un webhook est une URL que Stripe va appeler pour vous informer quand un paiement est effectué.

### 5.1 Aller dans la Section Webhooks

1. **Cliquez sur "Développeurs"** dans le menu de gauche
2. **Cliquez sur "Webhooks"**
3. **Cliquez sur "+ Ajouter un endpoint"** (bouton bleu)

### 5.2 Configurer l'Endpoint

Vous allez voir un formulaire :

#### **URL de l'endpoint**

**Tapez cette URL** (remplacez `votre-domaine` par votre vrai domaine Manus) :
```
https://votre-domaine.manus.space/api/stripe/webhook
```

**Exemple** :
```
https://sionohmair-insight-academy.manus.space/api/stripe/webhook
```

**Comment trouver votre domaine ?**
- Allez sur votre projet Manus
- Regardez l'URL de votre site de prévisualisation
- C'est quelque chose comme : `https://XXXXX.manus.space`

#### **Description** (optionnel)
```
Webhook pour les paiements Sionohmair Insight Academy
```

#### **Version de l'API**
- Laissez la version par défaut (la plus récente)

### 5.3 Sélectionner les Événements

**Cliquez sur "Sélectionner des événements"**

Vous allez voir une longue liste. **Cochez ces 6 événements** :

1. ✅ `customer.subscription.created` (Un abonnement est créé)
2. ✅ `customer.subscription.updated` (Un abonnement est modifié)
3. ✅ `customer.subscription.deleted` (Un abonnement est annulé)
4. ✅ `invoice.payment_succeeded` (Un paiement réussit)
5. ✅ `invoice.payment_failed` (Un paiement échoue)
6. ✅ `checkout.session.completed` (Une session de paiement est terminée)

**Comment trouver ces événements ?**
- Utilisez la barre de recherche en haut de la liste
- Tapez "customer.subscription" pour trouver les 3 premiers
- Tapez "invoice.payment" pour trouver les 2 suivants
- Tapez "checkout.session" pour trouver le dernier

### 5.4 Enregistrer

1. **Cliquez sur "Ajouter des événements"** (en bas)
2. **Cliquez sur "Ajouter un endpoint"** (bouton bleu)

### 5.5 Récupérer le Secret du Webhook

Après avoir créé le webhook, vous allez voir une page avec les détails.

**Cherchez "Secret de signature" ou "Signing secret"**

Il ressemble à : `whsec_XXXXXXXXXXXXXXXXXXXXXXXXXX`

**Cliquez sur "Révéler"** et copiez-le.

**Notez-le** :
```
STRIPE_WEBHOOK_SECRET = whsec_XXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## Étape 6 : 🔐 Ajouter les Clés dans Manus

Maintenant, vous allez ajouter toutes ces clés dans votre projet Manus.

### 6.1 Aller dans Manus

1. Ouvrez votre projet Manus
2. **Cliquez sur "Settings"** (Paramètres) dans le menu de gauche
3. **Cliquez sur "Secrets"**

### 6.2 Ajouter les Clés Stripe

Vous allez ajouter **7 secrets** au total :

#### **1. STRIPE_SECRET_KEY**
- **Nom** : `STRIPE_SECRET_KEY`
- **Valeur** : Collez votre clé secrète (sk_test_...)
- Cliquez sur "Add Secret"

#### **2. VITE_STRIPE_PUBLISHABLE_KEY**
- **Nom** : `VITE_STRIPE_PUBLISHABLE_KEY`
- **Valeur** : Collez votre clé publique (pk_test_...)
- Cliquez sur "Add Secret"

#### **3. STRIPE_WEBHOOK_SECRET**
- **Nom** : `STRIPE_WEBHOOK_SECRET`
- **Valeur** : Collez votre secret de webhook (whsec_...)
- Cliquez sur "Add Secret"

#### **4. VITE_PREMIUM_SUBSCRIPTION_PRICE_ID**
- **Nom** : `VITE_PREMIUM_SUBSCRIPTION_PRICE_ID`
- **Valeur** : Collez le Price ID de l'Abonnement Premium (price_...)
- Cliquez sur "Add Secret"

#### **5. VITE_NFT_BRONZE_PRICE_ID**
- **Nom** : `VITE_NFT_BRONZE_PRICE_ID`
- **Valeur** : Collez le Price ID du NFT Bronze (price_...)
- Cliquez sur "Add Secret"

#### **6. VITE_NFT_SILVER_PRICE_ID**
- **Nom** : `VITE_NFT_SILVER_PRICE_ID`
- **Valeur** : Collez le Price ID du NFT Silver (price_...)
- Cliquez sur "Add Secret"

#### **7. VITE_NFT_GOLD_PRICE_ID**
- **Nom** : `VITE_NFT_GOLD_PRICE_ID`
- **Valeur** : Collez le Price ID du NFT Gold (price_...)
- Cliquez sur "Add Secret"

### 6.3 Redémarrer Votre Serveur

**Important** : Après avoir ajouté les secrets, vous devez redémarrer votre serveur pour qu'ils soient pris en compte.

1. Dans Manus, allez dans l'onglet "Preview"
2. Cliquez sur le bouton "Restart Server" (ou rafraîchissez la page)

---

## Étape 7 : ✅ Tester Votre Configuration

Maintenant, vous allez tester que tout fonctionne !

### 7.1 Tester un Paiement Test

1. **Ouvrez votre site** (cliquez sur "Preview" dans Manus)
2. **Allez sur la page "Premium"** ou "Tarifs"
3. **Cliquez sur "S'abonner"** ou "Acheter"

### 7.2 Utiliser une Carte de Test

Stripe va ouvrir une page de paiement. **Utilisez ces informations de test** :

**Numéro de carte** : `4242 4242 4242 4242`
**Date d'expiration** : N'importe quelle date future (ex: 12/25)
**CVC** : N'importe quel nombre à 3 chiffres (ex: 123)
**Code postal** : N'importe quel code postal (ex: 75001)

### 7.3 Vérifier le Paiement

1. **Complétez le paiement**
2. Vous devriez être redirigé vers une page de confirmation
3. **Allez dans votre Dashboard Stripe**
4. **Cliquez sur "Paiements"**
5. Vous devriez voir votre paiement test !

### 7.4 Vérifier le Webhook

1. Dans Stripe, allez dans **Développeurs** → **Webhooks**
2. Cliquez sur votre webhook
3. Vous devriez voir des événements récents (avec des coches vertes ✅)

**Si vous voyez des croix rouges ❌**, c'est qu'il y a un problème avec l'URL du webhook.

---

## Étape 8 : 🚀 Passer en Mode Production (Live)

**Attention** : Ne faites cette étape que quand vous êtes prêt à accepter de vrais paiements !

### 8.1 Activer Votre Compte Stripe

Avant de passer en production, vous devez **activer votre compte Stripe** :

1. Dans le Dashboard Stripe, vous devriez voir un bandeau en haut qui dit "Activez votre compte"
2. **Cliquez dessus**
3. Remplissez les informations demandées :
   - Informations personnelles (nom, prénom, date de naissance)
   - Informations d'entreprise (si vous êtes auto-entrepreneur)
   - Informations bancaires (IBAN pour recevoir les paiements)
   - Pièce d'identité (carte d'identité ou passeport)

**Temps de validation** : 24-48 heures en général

### 8.2 Basculer en Mode Live

Une fois votre compte activé :

1. En haut à droite du Dashboard Stripe, vous voyez "Mode test" (avec un toggle)
2. **Cliquez sur le toggle** pour passer en "Mode production"

### 8.3 Recréer Vos Produits en Mode Live

**Important** : Les produits créés en mode test ne sont pas disponibles en mode production !

Vous devez **recréer les 4 produits** en mode production :

1. Allez dans **Produits**
2. Recréez les 4 produits (Abonnement Premium, NFT Bronze, Silver, Gold)
3. **Notez les nouveaux Price IDs** (ils commencent par `price_` mais sont différents)

### 8.4 Récupérer les Clés API de Production

1. Allez dans **Développeurs** → **Clés API**
2. Vous voyez maintenant les clés de **production** (pk_live_... et sk_live_...)
3. **Copiez-les**

### 8.5 Recréer le Webhook en Mode Live

1. Allez dans **Développeurs** → **Webhooks**
2. **Cliquez sur "+ Ajouter un endpoint"**
3. Utilisez la même URL : `https://votre-domaine.manus.space/api/stripe/webhook`
4. Sélectionnez les mêmes 6 événements
5. **Copiez le nouveau Secret de signature** (whsec_...)

### 8.6 Mettre à Jour les Secrets dans Manus

Dans Manus, **mettez à jour** les 7 secrets avec les valeurs de production :

1. `STRIPE_SECRET_KEY` → Nouvelle clé sk_live_...
2. `VITE_STRIPE_PUBLISHABLE_KEY` → Nouvelle clé pk_live_...
3. `STRIPE_WEBHOOK_SECRET` → Nouveau secret whsec_...
4. `VITE_PREMIUM_SUBSCRIPTION_PRICE_ID` → Nouveau Price ID
5. `VITE_NFT_BRONZE_PRICE_ID` → Nouveau Price ID
6. `VITE_NFT_SILVER_PRICE_ID` → Nouveau Price ID
7. `VITE_NFT_GOLD_PRICE_ID` → Nouveau Price ID

**Redémarrez votre serveur** après avoir mis à jour les secrets.

### 8.7 Tester avec une Vraie Carte

**Attention** : Cette fois, vous allez faire un vrai paiement !

1. Testez avec une petite somme (ex: l'abonnement à 29€)
2. Utilisez votre vraie carte bancaire
3. Vérifiez que le paiement apparaît dans Stripe
4. Vérifiez que vous recevez bien l'email de confirmation
5. **Annulez l'abonnement** si c'était juste un test

### 8.8 Publier Votre Site

Une fois que tout fonctionne :

1. Dans Manus, **cliquez sur "Publish"**
2. Votre site est maintenant en ligne et prêt à accepter des paiements ! 🎉

---

## 📝 Checklist Finale

Avant de publier, vérifiez que vous avez bien fait tout ça :

### Mode Test
- ✅ Créé les 4 produits en mode test
- ✅ Récupéré les 4 Price IDs
- ✅ Récupéré les clés API de test
- ✅ Configuré le webhook en mode test
- ✅ Ajouté les 7 secrets dans Manus
- ✅ Testé un paiement avec la carte 4242 4242 4242 4242
- ✅ Vérifié que le webhook fonctionne

### Mode Production
- ✅ Activé votre compte Stripe
- ✅ Basculé en mode production
- ✅ Recréé les 4 produits en mode production
- ✅ Récupéré les nouveaux Price IDs
- ✅ Récupéré les clés API de production
- ✅ Reconfiguré le webhook en mode production
- ✅ Mis à jour les 7 secrets dans Manus
- ✅ Testé avec une vraie carte
- ✅ Publié votre site

---

## 🆘 Aide et Dépannage

### Problème : Le paiement ne fonctionne pas

**Solutions** :
1. Vérifiez que vous avez bien ajouté les 7 secrets dans Manus
2. Vérifiez que les Price IDs sont corrects
3. Redémarrez votre serveur Manus
4. Vérifiez dans la console du navigateur (F12) s'il y a des erreurs

### Problème : Le webhook ne fonctionne pas

**Solutions** :
1. Vérifiez que l'URL du webhook est correcte
2. Vérifiez que vous avez bien sélectionné les 6 événements
3. Vérifiez que le secret du webhook est correct dans Manus
4. Dans Stripe, allez dans **Développeurs** → **Webhooks** → Cliquez sur votre webhook → Regardez les logs

### Problème : Je ne reçois pas les paiements

**Solutions** :
1. Vérifiez que votre compte Stripe est activé
2. Vérifiez que vous avez bien ajouté votre IBAN
3. Les paiements sont versés automatiquement tous les 7 jours (par défaut)
4. Vous pouvez changer la fréquence dans **Paramètres** → **Paiements**

### Problème : Je veux annuler un abonnement test

**Solutions** :
1. Allez dans **Clients** dans Stripe
2. Cliquez sur le client
3. Cliquez sur l'abonnement
4. Cliquez sur "Annuler l'abonnement"

---

## 📞 Support

Si vous avez des questions ou des problèmes :

1. **Documentation Stripe** : https://stripe.com/docs
2. **Support Stripe** : https://support.stripe.com
3. **Support Manus** : https://help.manus.im

---

## 🎉 Félicitations !

Vous avez maintenant configuré Stripe de A à Z ! Votre site est prêt à accepter des paiements ! 🚀

**Prochaines étapes** :
1. Faites la promotion de votre site
2. Surveillez vos premiers paiements dans le Dashboard Stripe
3. Répondez aux questions de vos clients
4. Améliorez votre site en fonction des retours

**Bon courage pour votre aventure entrepreneuriale ! 💪**
