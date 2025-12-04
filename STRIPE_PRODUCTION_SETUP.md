# Guide de Configuration Stripe Production
## Sionohmair Insight Academy

---

## 📋 Vue d'ensemble

Ce guide vous accompagne dans la configuration complète de Stripe en mode **Production** pour accepter de vrais paiements sur votre plateforme.

**Durée estimée** : 30-45 minutes  
**Prérequis** : Compte Stripe créé (actuellement en mode Test)

---

## 🎯 Objectifs

1. ✅ Activer votre compte Stripe en production
2. ✅ Créer les produits et prix en production
3. ✅ Configurer le webhook endpoint
4. ✅ Mettre à jour les clés API dans l'application
5. ✅ Tester les paiements réels

---

## 📝 Étape 1 : Activation du compte Stripe Production

### 1.1 Accéder au Dashboard Stripe

1. Connectez-vous à https://dashboard.stripe.com
2. En haut à gauche, vous verrez un toggle **"Mode test"** / **"Mode production"**
3. Si vous voyez un message "Activate your account", cliquez dessus

### 1.2 Compléter les informations requises

Stripe vous demandera de fournir :

**Informations sur l'entreprise** :
- Nom légal de l'entreprise
- Adresse du siège social
- Numéro SIRET/SIREN (France) ou équivalent
- Type d'activité : "Services éducatifs en ligne" ou "Formation professionnelle"
- Site web : votre URL de production

**Informations bancaires** :
- IBAN du compte bancaire professionnel
- Nom du titulaire du compte
- Justificatif bancaire (RIB)

**Vérification d'identité** :
- Pièce d'identité du représentant légal
- Justificatif de domicile récent (< 3 mois)

**Informations fiscales** :
- Numéro de TVA intracommunautaire (si applicable)
- Statut fiscal

⏱️ **Délai de validation** : 1-3 jours ouvrés après soumission des documents

---

## 📦 Étape 2 : Création des produits et prix en Production

Une fois votre compte activé, créez les produits **en mode Production**.

### 2.1 Basculer en mode Production

1. Dans le Dashboard Stripe, cliquez sur le toggle en haut à gauche
2. Sélectionnez **"View live data"** (Mode Production)
3. ⚠️ Vérifiez que vous êtes bien en mode Production (badge "LIVE" visible)

### 2.2 Créer le produit "Abonnement Premium"

1. Allez dans **Products** → **Add product**
2. Remplissez les informations :

```
Nom du produit : Abonnement Premium Sionohmair Insight Academy
Description : Accès illimité à tous les outils d'analyse de contenu premium, 
              support prioritaire et fonctionnalités avancées
```

3. **Prix récurrent** :
   - Montant : **22.67 EUR** (ou votre prix choisi)
   - Facturation : **Mensuelle**
   - ID du prix : Notez le `price_xxxxx` généré (vous en aurez besoin)

4. **Métadonnées** (optionnel mais recommandé) :
   ```
   type: premium_subscription
   features: unlimited_analysis,priority_support,advanced_tools
   ```

5. Cliquez sur **Save product**

### 2.3 Créer les produits NFT (si applicable)

Répétez le processus pour chaque NFT :

**NFT Bronze** :
```
Nom : NFT Bronze - Sionohmair Insight Academy
Description : Certificat numérique Bronze avec avantages exclusifs
Prix : 50 EUR (paiement unique)
Type : One-time payment
```

**NFT Silver** :
```
Nom : NFT Silver - Sionohmair Insight Academy
Description : Certificat numérique Silver avec avantages premium
Prix : 100 EUR (paiement unique)
Type : One-time payment
```

**NFT Gold** :
```
Nom : NFT Gold - Sionohmair Insight Academy
Description : Certificat numérique Gold avec accès VIP
Prix : 200 EUR (paiement unique)
Type : One-time payment
```

### 2.4 Noter les Price IDs

**IMPORTANT** : Notez tous les Price IDs générés par Stripe :

```
PREMIUM_SUBSCRIPTION_PRICE_ID = price_xxxxxxxxxxxxx
NFT_BRONZE_PRICE_ID = price_xxxxxxxxxxxxx
NFT_SILVER_PRICE_ID = price_xxxxxxxxxxxxx
NFT_GOLD_PRICE_ID = price_xxxxxxxxxxxxx
```

Vous en aurez besoin pour la configuration de l'application.

---

## 🔗 Étape 3 : Configuration du Webhook Production

### 3.1 Créer l'endpoint webhook

1. Dans le Dashboard Stripe (mode Production), allez dans **Developers** → **Webhooks**
2. Cliquez sur **Add endpoint**
3. Renseignez l'URL de votre endpoint :

```
https://votre-domaine-production.com/api/stripe/webhook
```

**Exemple** : `https://sionohmair-insight-academy.manus.space/api/stripe/webhook`

### 3.2 Sélectionner les événements à écouter

Cochez les événements suivants :

**Événements d'abonnement** :
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `customer.subscription.trial_will_end`

**Événements de paiement** :
- ✅ `checkout.session.completed`
- ✅ `checkout.session.expired`
- ✅ `invoice.paid`
- ✅ `invoice.payment_failed`
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`

**Événements de client** :
- ✅ `customer.created`
- ✅ `customer.updated`
- ✅ `customer.deleted`

### 3.3 Récupérer le Webhook Secret

1. Après création, cliquez sur le webhook créé
2. Dans la section **Signing secret**, cliquez sur **Reveal**
3. Copiez le secret qui commence par `whsec_xxxxx`

**IMPORTANT** : Ce secret est différent de celui du mode Test !

---

## 🔑 Étape 4 : Récupération des clés API Production

### 4.1 Clés API Stripe

1. Allez dans **Developers** → **API keys** (en mode Production)
2. Vous verrez deux clés :

**Publishable key** (clé publique) :
```
pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Secret key** (clé secrète) :
```
sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. Cliquez sur **Reveal live key** pour voir la clé secrète
4. ⚠️ **Sécurité** : Ne partagez JAMAIS la clé secrète publiquement

### 4.2 Mettre à jour les variables d'environnement

Vous devrez mettre à jour ces variables dans votre application :

```bash
# Clés Stripe Production
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Price IDs Production
VITE_PREMIUM_SUBSCRIPTION_PRICE_ID=price_xxxxxxxxxxxxx
VITE_NFT_BRONZE_PRICE_ID=price_xxxxxxxxxxxxx
VITE_NFT_SILVER_PRICE_ID=price_xxxxxxxxxxxxx
VITE_NFT_GOLD_PRICE_ID=price_xxxxxxxxxxxxx
```

**Comment mettre à jour** :

1. Dans l'interface Manus, ouvrez le panneau **Management UI** (à droite)
2. Allez dans **Settings** → **Secrets**
3. Modifiez chaque variable avec les nouvelles valeurs de production
4. Cliquez sur **Save** pour chaque modification

---

## 🧪 Étape 5 : Tests de paiement réel

### 5.1 Test d'abonnement Premium

1. Accédez à votre site en production
2. Créez un nouveau compte utilisateur (avec un vrai email)
3. Cliquez sur **Commencer l'essai gratuit** (30 jours)
4. Remplissez le formulaire Stripe Checkout avec :
   - **Carte bancaire réelle** (vous ne serez pas débité pendant l'essai)
   - Ou utilisez une carte test si vous voulez juste vérifier le flux

**Cartes de test Stripe** (même en production, pour tester le flux) :
```
Numéro : 4242 4242 4242 4242
Date : N'importe quelle date future
CVC : N'importe quel 3 chiffres
Code postal : N'importe lequel
```

5. Vérifiez que :
   - ✅ Le paiement est accepté
   - ✅ L'utilisateur est redirigé vers le dashboard
   - ✅ Le statut Premium est activé
   - ✅ L'essai gratuit de 30 jours est visible

### 5.2 Test d'achat NFT

1. Connectez-vous avec un compte utilisateur
2. Allez dans la section **NFT Marketplace**
3. Sélectionnez un NFT (Bronze, Silver ou Gold)
4. Cliquez sur **Acheter maintenant**
5. Complétez le paiement avec une vraie carte (ou carte test)

6. Vérifiez que :
   - ✅ Le paiement est traité
   - ✅ Le NFT apparaît dans "Mes NFT"
   - ✅ Le certificat est généré avec l'ID unique
   - ✅ Les avantages du NFT sont activés

### 5.3 Vérification dans le Dashboard Stripe

1. Retournez dans le Dashboard Stripe (mode Production)
2. Allez dans **Payments** → Vous devriez voir les transactions
3. Allez dans **Customers** → Vérifiez que les clients sont créés
4. Allez dans **Subscriptions** → Vérifiez les abonnements actifs
5. Allez dans **Webhooks** → Vérifiez que les événements sont reçus (onglet "Events")

---

## 🔒 Étape 6 : Sécurité et conformité

### 6.1 Vérifications de sécurité

✅ **Clés API** :
- Les clés secrètes ne sont JAMAIS exposées côté client
- Les variables d'environnement sont correctement configurées
- Les clés de test et production sont séparées

✅ **Webhook** :
- La signature du webhook est vérifiée (protection contre les attaques)
- L'endpoint est en HTTPS (obligatoire)
- Les événements sont traités de manière idempotente

✅ **Données de paiement** :
- Aucune donnée de carte bancaire n'est stockée sur vos serveurs
- Stripe Checkout gère toute la collecte des données sensibles
- Conformité PCI-DSS automatique via Stripe

### 6.2 Conformité RGPD

✅ **Données personnelles** :
- Les emails des clients sont stockés de manière sécurisée
- Politique de confidentialité accessible
- Droit à l'effacement implémenté (suppression de compte)

✅ **Facturation** :
- Les factures sont générées automatiquement par Stripe
- Les clients peuvent télécharger leurs factures depuis leur compte
- Conservation des données de facturation conforme (10 ans)

### 6.3 Mentions légales obligatoires

Assurez-vous que votre site affiche :

1. **Mentions légales** :
   - Raison sociale et SIRET
   - Adresse du siège social
   - Numéro de TVA
   - Hébergeur du site

2. **CGV (Conditions Générales de Vente)** :
   - Prix TTC
   - Modalités de paiement
   - Droit de rétractation (14 jours pour les services en ligne)
   - Politique de remboursement

3. **Politique de confidentialité** :
   - Données collectées
   - Utilisation des données
   - Droits des utilisateurs (accès, rectification, suppression)
   - Cookies et traceurs

---

## 📊 Étape 7 : Monitoring et suivi

### 7.1 Dashboard Stripe

Consultez régulièrement :

- **Payments** : Suivi des transactions en temps réel
- **Subscriptions** : Gestion des abonnements actifs/annulés
- **Customers** : Base de données clients
- **Revenue** : Chiffre d'affaires et analytics
- **Disputes** : Gestion des litiges et chargebacks

### 7.2 Alertes et notifications

Configurez des alertes pour :

- ❌ Paiements échoués
- ⚠️ Abonnements annulés
- 💰 Seuils de revenus atteints
- 🔔 Nouveaux clients premium

**Configuration** :
1. Dashboard Stripe → **Settings** → **Notifications**
2. Configurez les emails de notification
3. Activez les webhooks pour les événements critiques

### 7.3 Analytics intégrés

Votre application dispose d'analytics intégrés :

- **Dashboard Admin** : `/admin` (réservé au propriétaire)
- Statistiques en temps réel :
  - Nombre d'utilisateurs actifs
  - Taux de conversion essai → premium
  - Revenus mensuels récurrents (MRR)
  - Taux de churn
  - NFT vendus par catégorie

---

## 🚀 Étape 8 : Passage en production

### 8.1 Checklist finale avant publication

- [ ] Compte Stripe activé et vérifié
- [ ] Produits et prix créés en mode Production
- [ ] Webhook configuré et testé
- [ ] Clés API Production configurées dans l'application
- [ ] Tests de paiement réels effectués avec succès
- [ ] Mentions légales et CGV publiées
- [ ] Politique de confidentialité accessible
- [ ] Emails de confirmation configurés
- [ ] Support client opérationnel
- [ ] Monitoring et alertes activés

### 8.2 Déploiement

Une fois toutes les vérifications effectuées :

1. **Créer un checkpoint** dans Manus (bouton "Save checkpoint")
2. **Publier le site** via le bouton "Publish" dans l'interface Manus
3. **Configurer le nom de domaine** (si domaine personnalisé)
4. **Tester en conditions réelles** avec un petit groupe d'utilisateurs

### 8.3 Communication du lancement

Préparez votre communication :

- 📧 Email d'annonce aux early adopters
- 📱 Posts sur les réseaux sociaux
- 🎁 Offre de lancement (ex: -20% les 30 premiers jours)
- 🎯 Campagne publicitaire ciblée

---

## 🆘 Support et dépannage

### Problèmes courants

**❌ "Webhook signature verification failed"**
- Vérifiez que le `STRIPE_WEBHOOK_SECRET` est correct
- Assurez-vous d'utiliser le secret de Production (pas Test)
- Vérifiez que l'URL du webhook est en HTTPS

**❌ "Payment failed"**
- Vérifiez que la carte a suffisamment de fonds
- Consultez le Dashboard Stripe → Payments → Détails de l'erreur
- Vérifiez les paramètres de sécurité (3D Secure)

**❌ "Subscription not activated"**
- Vérifiez que le webhook `customer.subscription.created` est bien reçu
- Consultez les logs du webhook dans Stripe
- Vérifiez la base de données (table `subscriptions`)

### Ressources utiles

- 📚 **Documentation Stripe** : https://stripe.com/docs
- 💬 **Support Stripe** : https://support.stripe.com
- 🎓 **Stripe University** : https://stripe.com/university
- 🛠️ **Stripe CLI** : https://stripe.com/docs/stripe-cli

### Contact

Pour toute question technique sur l'application :
- 📧 Email : support@sionohmair-insight-academy.com
- 💬 Chat en direct : Disponible dans le dashboard

---

## 📈 Optimisations futures

### Fonctionnalités avancées à considérer

1. **Coupons et promotions** :
   - Codes promo pour réductions
   - Offres limitées dans le temps
   - Programme de parrainage

2. **Facturation avancée** :
   - Facturation à l'usage (pay-as-you-go)
   - Plans annuels avec réduction
   - Facturation par équipe

3. **Gestion des taxes** :
   - Stripe Tax pour calcul automatique de la TVA
   - Conformité fiscale internationale
   - Reverse charge pour B2B

4. **Prévention de la fraude** :
   - Stripe Radar pour détection automatique
   - Règles personnalisées de blocage
   - 3D Secure obligatoire

5. **Optimisation de la conversion** :
   - A/B testing des pages de pricing
   - Checkout optimisé (Link, Apple Pay, Google Pay)
   - Récupération des paniers abandonnés

---

## ✅ Conclusion

Félicitations ! Vous avez maintenant toutes les informations pour configurer Stripe en Production.

**Prochaines étapes** :

1. ✅ Activez votre compte Stripe
2. ✅ Créez vos produits en Production
3. ✅ Configurez le webhook
4. ✅ Mettez à jour les clés API
5. ✅ Testez les paiements
6. ✅ Publiez votre site

**Temps estimé total** : 1-2 heures (hors délai de validation Stripe)

---

**Bonne chance pour votre lancement ! 🚀**

*Document créé le 4 décembre 2024*  
*Version 1.0 - Sionohmair Insight Academy*
