# 💳 Guide de Configuration Stripe Live

**Durée** : 15 minutes
**Prérequis** : Compte Stripe

---

## ⚠️ IMPORTANT

Vous devez réclamer votre sandbox Stripe **avant le 20 janvier 2026** :

**URL de réclamation** : https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZFSGJENDV1UzY5TlRlLDE3NjQyODg3Njcv100fQEDeaWE

---

## Étape 1 : Réclamer le Sandbox

1. **Ouvrez l'URL de réclamation**
   - https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZFSGJENDV1UzY5TlRlLDE3NjQyODg3Njcv100fQEDeaWE

2. **Connectez-vous ou créez un compte**
   - Si vous avez déjà un compte Stripe, connectez-vous
   - Sinon, créez un nouveau compte

3. **Réclamez le sandbox**
   - Cliquez sur "Claim sandbox"
   - Le sandbox sera ajouté à votre compte

---

## Étape 2 : Activer le Mode Live

1. **Dans le dashboard Stripe**
   - En haut à droite, vous voyez un toggle "Test mode"
   - Cliquez dessus pour passer en "Live mode"

2. **Complétez votre profil d'entreprise**
   - Stripe vous demandera de compléter votre profil
   - Remplissez les informations demandées :
     * Nom de l'entreprise : "Sionohmair Insight Academy"
     * Type d'entreprise : "Éducation en ligne"
     * Pays : France
     * Adresse
     * Numéro SIRET (si applicable)

3. **Activez les paiements**
   - Stripe vous demandera de vérifier votre identité
   - Suivez les instructions

---

## Étape 3 : Créer le Produit d'Abonnement

1. **Accédez aux Produits**
   - Dans le menu de gauche : "Products"
   - Cliquez sur "Add product"

2. **Configurez le produit**
   - **Name** : `Abonnement Mensuel Sionohmair Insight Academy`
   - **Description** : `Accès complet à tous les outils de Content Marketing & Copywriting`
   - **Pricing model** : `Recurring`
   - **Price** : `36.00`
   - **Currency** : `EUR`
   - **Billing period** : `Monthly`
   - Cliquez sur "Add product"

3. **Copiez l'ID du prix**
   - Dans la liste des produits, cliquez sur votre produit
   - Vous verrez une section "Pricing"
   - Copiez le "Price ID" (commence par `price_...`)
   - Exemple : `price_1QRmEqE4uS69NTe8KGHdqWXY`

---

## Étape 4 : Récupérer les Clés Live

1. **Accédez aux API Keys**
   - Dans le menu de gauche : "Developers" → "API keys"
   - Assurez-vous d'être en mode "Live"

2. **Copiez la Publishable Key**
   - Vous verrez "Publishable key" (commence par `pk_live_...`)
   - Cliquez sur "Reveal test key" pour la voir
   - Copiez-la

3. **Copiez la Secret Key**
   - Vous verrez "Secret key" (commence par `sk_live_...`)
   - Cliquez sur "Reveal live key" pour la voir
   - Copiez-la
   - ⚠️ **ATTENTION** : Ne partagez JAMAIS cette clé !

---

## Étape 5 : Configurer le Webhook

1. **Accédez aux Webhooks**
   - Dans le menu de gauche : "Developers" → "Webhooks"
   - Cliquez sur "Add endpoint"

2. **Configurez l'endpoint**
   - **Endpoint URL** : `https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer/api/stripe/webhook`
   - **Description** : `Webhook production Sionohmair`
   - **Events to send** : Cliquez sur "Select events"

3. **Sélectionnez les événements**
   - Cochez ces événements :
     * `customer.subscription.created`
     * `customer.subscription.updated`
     * `customer.subscription.deleted`
     * `invoice.payment_succeeded`
     * `invoice.payment_failed`
   - Cliquez sur "Add events"

4. **Finalisez**
   - Cliquez sur "Add endpoint"

5. **Copiez le Signing Secret**
   - Cliquez sur le webhook que vous venez de créer
   - Vous verrez "Signing secret" (commence par `whsec_...`)
   - Cliquez sur "Reveal" pour le voir
   - Copiez-le

---

## Étape 6 : Ajouter les Clés dans Manus

1. **Ouvrez le dashboard Manus**
   - Settings → Secrets

2. **Modifiez VITE_STRIPE_PUBLISHABLE_KEY**
   - Trouvez `VITE_STRIPE_PUBLISHABLE_KEY` dans la liste
   - Cliquez sur "Edit"
   - Remplacez par votre Publishable Key Live (`pk_live_...`)
   - Cliquez sur "Save"

3. **Modifiez STRIPE_SECRET_KEY**
   - Trouvez `STRIPE_SECRET_KEY` dans la liste
   - Cliquez sur "Edit"
   - Remplacez par votre Secret Key Live (`sk_live_...`)
   - Cliquez sur "Save"

4. **Modifiez STRIPE_WEBHOOK_SECRET**
   - Trouvez `STRIPE_WEBHOOK_SECRET` dans la liste
   - Cliquez sur "Edit"
   - Remplacez par votre Signing Secret (`whsec_...`)
   - Cliquez sur "Save"

---

## Étape 7 : Redémarrer le Serveur

1. **Dans le dashboard Manus**
   - Cliquez sur l'icône "Restart" en haut à droite
   - Attendez 30 secondes

---

## Vérification

### Test 1 : Vérifier les Clés

```bash
cd /home/ubuntu/sionohmair-insight-academy
node scripts/test-stripe.mjs
```

Vous devriez voir :
```
✅ Connexion Stripe réussie
✅ Mode: live
✅ Clés configurées correctement
```

### Test 2 : Tester le Flux d'Abonnement

1. **Ouvrez votre site**
   - https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer

2. **Connectez-vous**
   - Cliquez sur "Essai gratuit (30j)"
   - Connectez-vous avec OAuth

3. **Allez sur /subscription**
   - Vous devriez voir "Essai gratuit"
   - Barre de progression avec jours restants
   - Bouton "S'abonner maintenant (36€/mois)"

4. **Testez le paiement** (avec carte de test)
   - Cliquez sur "S'abonner maintenant"
   - Utilisez cette carte de test :
     * Numéro : `4242 4242 4242 4242`
     * Date : N'importe quelle date future
     * CVC : N'importe quel 3 chiffres
   - Cliquez sur "Payer"

5. **Vérifiez le statut**
   - Vous devriez voir "Abonnement actif"
   - La barre de progression disparaît
   - Vous avez accès à tous les outils

### Test 3 : Vérifier le Webhook

1. **Dans le dashboard Stripe**
   - Developers → Webhooks
   - Cliquez sur votre webhook

2. **Vérifiez les événements**
   - Vous devriez voir des événements récents
   - Statut : "Succeeded" (vert)

3. **Si vous voyez des erreurs**
   - Vérifiez que l'URL du webhook est correcte
   - Vérifiez que le `STRIPE_WEBHOOK_SECRET` est correct dans Manus
   - Redémarrez le serveur

---

## Dépannage

### Problème : "Invalid API Key"

**Solution** :
1. Vérifiez que vous êtes bien en mode Live (pas Test)
2. Vérifiez que vous avez copié la bonne clé (pk_live_... ou sk_live_...)
3. Vérifiez qu'il n'y a pas d'espaces avant/après la clé
4. Redémarrez le serveur

### Problème : "Webhook signature verification failed"

**Solution** :
1. Vérifiez que le `STRIPE_WEBHOOK_SECRET` est correct
2. Vérifiez que l'URL du webhook est exacte
3. Vérifiez que vous avez bien sélectionné les bons événements
4. Redémarrez le serveur

### Problème : "Payment failed"

**Solution** :
1. Vérifiez que vous utilisez une vraie carte (pas de test en mode Live)
2. Ou utilisez la carte de test : `4242 4242 4242 4242`
3. Vérifiez que votre compte Stripe est bien activé
4. Vérifiez les logs dans le dashboard Stripe

---

## Recommandations

### Sécurité

- ✅ Ne partagez JAMAIS votre Secret Key (`sk_live_...`)
- ✅ Ne commitez JAMAIS les clés dans Git
- ✅ Utilisez toujours les variables d'environnement
- ✅ Activez l'authentification à 2 facteurs sur Stripe

### Monitoring

- ✅ Activez les notifications email dans Stripe (Settings → Notifications)
- ✅ Surveillez les paiements échoués
- ✅ Surveillez les webhooks (Developers → Webhooks)

### Conformité

- ✅ Ajoutez vos CGV (Conditions Générales de Vente)
- ✅ Ajoutez votre politique de remboursement
- ✅ Respectez le RGPD (voir CONFORMITE_RGPD.md)

---

**Prochaine étape** : Tests finaux et publication (voir CHECKLIST_DEPLOIEMENT.md)
