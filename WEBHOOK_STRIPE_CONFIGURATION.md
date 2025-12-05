# Guide de Configuration du Webhook Stripe
## Sionohmair Insight Academy

---

## 📋 Vue d'ensemble

Ce guide détaille la configuration complète du **webhook Stripe** pour traiter automatiquement tous les événements de paiement, d'abonnement et de gestion client.

**Durée estimée** : 15-20 minutes  
**Prérequis** : Compte Stripe activé (Test ou Production)

---

## 🎯 Objectifs

1. ✅ Créer l'endpoint webhook dans Stripe
2. ✅ Configurer tous les événements nécessaires
3. ✅ Récupérer et configurer le webhook secret
4. ✅ Tester la réception des événements
5. ✅ Vérifier le traitement automatique

---

## 🔗 Étape 1 : Création de l'endpoint webhook

### 1.1 Accéder à la configuration webhook

1. Connectez-vous à https://dashboard.stripe.com
2. Sélectionnez le mode **Test** ou **Production** (en haut à gauche)
3. Allez dans **Developers** → **Webhooks**
4. Cliquez sur **Add endpoint**

### 1.2 Configurer l'URL de l'endpoint

**URL de l'endpoint** :

```
Mode Test : https://votre-domaine-test.manus.space/api/stripe/webhook
Mode Production : https://votre-domaine-production.com/api/stripe/webhook
```

**Exemple pour ce projet** :
```
https://sionohmair-insight-academy.manus.space/api/stripe/webhook
```

⚠️ **Important** : L'URL doit être en **HTTPS** (obligatoire pour Stripe)

### 1.3 Description de l'endpoint

Ajoutez une description claire :

```
Webhook principal pour traiter les événements de paiement, 
abonnements et gestion client de Sionohmair Insight Academy
```

---

## 📡 Étape 2 : Sélection des événements à écouter

### 2.1 Événements de paiement (Checkout)

Ces événements gèrent le processus de paiement complet :

- ✅ `checkout.session.completed` - Paiement réussi (création de commande)
- ✅ `checkout.session.expired` - Session expirée sans paiement
- ✅ `checkout.session.async_payment_succeeded` - Paiement asynchrone réussi
- ✅ `checkout.session.async_payment_failed` - Paiement asynchrone échoué

**Utilisation** : Création automatique des commandes, envoi d'emails de confirmation, activation des services

### 2.2 Événements de paiement (Payment Intent)

Ces événements suivent l'état des intentions de paiement :

- ✅ `payment_intent.succeeded` - Paiement confirmé
- ✅ `payment_intent.payment_failed` - Paiement échoué
- ✅ `payment_intent.canceled` - Paiement annulé
- ✅ `payment_intent.requires_action` - Action requise (3D Secure)
- ✅ `payment_intent.processing` - Paiement en cours de traitement

**Utilisation** : Suivi détaillé des paiements, gestion des échecs, notifications

### 2.3 Événements d'abonnement

Ces événements gèrent le cycle de vie des abonnements :

- ✅ `customer.subscription.created` - Nouvel abonnement créé
- ✅ `customer.subscription.updated` - Abonnement modifié (changement de plan, pause)
- ✅ `customer.subscription.deleted` - Abonnement annulé ou expiré
- ✅ `customer.subscription.trial_will_end` - Fin d'essai gratuit dans 3 jours
- ✅ `customer.subscription.paused` - Abonnement mis en pause
- ✅ `customer.subscription.resumed` - Abonnement repris

**Utilisation** : Activation/désactivation des accès Premium, notifications de renouvellement

### 2.4 Événements de facturation

Ces événements gèrent les factures et paiements récurrents :

- ✅ `invoice.created` - Facture créée
- ✅ `invoice.finalized` - Facture finalisée (prête à être payée)
- ✅ `invoice.paid` - Facture payée avec succès
- ✅ `invoice.payment_failed` - Échec de paiement de facture
- ✅ `invoice.payment_action_required` - Action requise pour payer
- ✅ `invoice.upcoming` - Facture à venir dans 7 jours (notification)

**Utilisation** : Envoi automatique de factures, relances de paiement, gestion des impayés

### 2.5 Événements de client

Ces événements suivent les modifications de profil client :

- ✅ `customer.created` - Nouveau client créé
- ✅ `customer.updated` - Informations client modifiées
- ✅ `customer.deleted` - Client supprimé

**Utilisation** : Synchronisation des données client, mise à jour des profils

### 2.6 Événements de remboursement

Ces événements gèrent les remboursements :

- ✅ `charge.refunded` - Paiement remboursé
- ✅ `charge.refund.updated` - Statut de remboursement mis à jour

**Utilisation** : Annulation automatique des commandes, envoi de notifications de remboursement

### 2.7 Événements de litige (Disputes)

Ces événements alertent sur les litiges bancaires :

- ✅ `charge.dispute.created` - Litige ouvert par le client
- ✅ `charge.dispute.updated` - Litige mis à jour
- ✅ `charge.dispute.closed` - Litige résolu

**Utilisation** : Alertes admin, gestion des chargebacks

---

## 🔑 Étape 3 : Récupération du Webhook Secret

### 3.1 Obtenir le secret de signature

1. Après avoir créé l'endpoint, cliquez dessus dans la liste
2. Dans la section **Signing secret**, cliquez sur **Reveal**
3. Copiez le secret qui commence par `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3.2 Configurer le secret dans l'application

**Via l'interface Manus** :

1. Ouvrez le panneau **Management UI** (à droite)
2. Allez dans **Settings** → **Secrets**
3. Trouvez la variable `STRIPE_WEBHOOK_SECRET`
4. Collez le secret copié depuis Stripe
5. Cliquez sur **Save**

**⚠️ Important** : Le webhook secret est différent entre le mode Test et Production !

---

## 🧪 Étape 4 : Test du webhook

### 4.1 Test avec l'outil Stripe CLI (Recommandé)

**Installation de Stripe CLI** :

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

**Connexion et test** :

```bash
# Se connecter à Stripe
stripe login

# Écouter les événements webhook
stripe listen --forward-to https://votre-domaine.manus.space/api/stripe/webhook

# Déclencher un événement de test
stripe trigger checkout.session.completed
```

### 4.2 Test avec l'interface Stripe Dashboard

1. Dans **Developers** → **Webhooks**, cliquez sur votre endpoint
2. Cliquez sur l'onglet **Send test webhook**
3. Sélectionnez un événement (ex: `checkout.session.completed`)
4. Cliquez sur **Send test webhook**
5. Vérifiez la réponse (statut 200 = succès)

### 4.3 Test avec un vrai paiement (Mode Test)

1. Accédez à votre site en mode test
2. Créez une commande (Sprint de Clarté, Niveau 2 ou 3)
3. Utilisez une carte de test Stripe :

```
Numéro : 4242 4242 4242 4242
Date : N'importe quelle date future
CVC : N'importe quel 3 chiffres
Code postal : N'importe lequel
```

4. Complétez le paiement
5. Vérifiez que :
   - ✅ La commande est créée dans la base de données
   - ✅ L'email de confirmation est envoyé
   - ✅ Le statut de la commande est "paid"
   - ✅ Les artefacts sont disponibles dans le dashboard

---

## 📊 Étape 5 : Vérification du traitement

### 5.1 Vérifier les logs webhook dans Stripe

1. Allez dans **Developers** → **Webhooks**
2. Cliquez sur votre endpoint
3. Consultez l'onglet **Events** pour voir tous les événements reçus
4. Vérifiez que les réponses sont **200 OK**

**Codes de réponse** :
- ✅ **200** : Événement traité avec succès
- ⚠️ **400** : Erreur de validation (signature incorrecte)
- ❌ **500** : Erreur serveur (bug dans le code)

### 5.2 Vérifier les logs de l'application

**Accéder aux logs** :

```bash
# Via l'interface Manus
Management UI → Code → Ouvrir le terminal

# Voir les logs du serveur
pnpm dev
```

**Logs attendus** :

```
[Stripe Webhook] Événement reçu : checkout.session.completed
[Stripe Webhook] Commande créée : order_xxxxx
[Stripe Webhook] Email envoyé à : client@example.com
[Stripe Webhook] Traitement terminé avec succès
```

### 5.3 Vérifier la base de données

**Via l'interface Manus** :

1. Ouvrez **Management UI** → **Database**
2. Consultez la table `orders`
3. Vérifiez que la commande est créée avec :
   - ✅ `stripeSessionId` renseigné
   - ✅ `status` = "paid"
   - ✅ `userEmail` correct
   - ✅ `amount` et `productName` corrects

---

## 🔒 Sécurité et bonnes pratiques

### 6.1 Vérification de la signature

Le code de l'application vérifie automatiquement la signature de chaque événement :

```typescript
// server/routes/stripe.ts
const signature = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  req.body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

**Protection contre** :
- ❌ Événements falsifiés
- ❌ Attaques par rejeu (replay attacks)
- ❌ Modifications malveillantes

### 6.2 Idempotence

Le webhook traite chaque événement de manière idempotente :

```typescript
// Vérifier si la commande existe déjà
const existingOrder = await db.query.orders.findFirst({
  where: eq(orders.stripeSessionId, session.id)
});

if (existingOrder) {
  console.log('Commande déjà traitée, ignorer');
  return res.status(200).json({ received: true });
}
```

**Avantages** :
- ✅ Pas de doublon de commande
- ✅ Pas d'email en double
- ✅ Gestion des retries Stripe

### 6.3 Gestion des erreurs

Le webhook gère les erreurs de manière robuste :

```typescript
try {
  // Traitement de l'événement
} catch (error) {
  console.error('Erreur webhook:', error);
  return res.status(500).json({ error: 'Webhook handler failed' });
}
```

**Comportement Stripe** :
- Si le webhook retourne une erreur (4xx ou 5xx), Stripe réessaie automatiquement
- Réessais : après 1h, 2h, 4h, 8h, 16h, 24h (jusqu'à 3 jours)
- Après 3 jours d'échecs, Stripe désactive l'endpoint

---

## 🚨 Dépannage

### Problème : Webhook ne reçoit pas les événements

**Solutions** :

1. ✅ Vérifier que l'URL est correcte et en HTTPS
2. ✅ Vérifier que le serveur est démarré et accessible
3. ✅ Vérifier que les événements sont bien cochés dans Stripe
4. ✅ Vérifier les logs Stripe pour voir les erreurs

### Problème : Erreur 400 "Invalid signature"

**Solutions** :

1. ✅ Vérifier que `STRIPE_WEBHOOK_SECRET` est correct
2. ✅ Vérifier que le secret correspond au mode (Test vs Production)
3. ✅ Régénérer le webhook secret si nécessaire

### Problème : Commande non créée après paiement

**Solutions** :

1. ✅ Vérifier les logs du webhook dans Stripe (onglet Events)
2. ✅ Vérifier les logs de l'application (erreurs de base de données)
3. ✅ Vérifier que la base de données est accessible
4. ✅ Tester manuellement avec `stripe trigger checkout.session.completed`

### Problème : Email non envoyé

**Solutions** :

1. ✅ Vérifier que les variables SMTP sont configurées (voir `SMTP_SETUP.md`)
2. ✅ Vérifier les logs de nodemailer
3. ✅ Tester l'envoi d'email manuellement depuis l'admin

---

## 📈 Monitoring et maintenance

### 7.1 Surveillance des webhooks

**Indicateurs à surveiller** :

- **Taux de succès** : > 99% (objectif)
- **Temps de réponse** : < 5 secondes
- **Événements en échec** : 0 (idéalement)

**Alertes à configurer** :

- 🔔 Webhook désactivé par Stripe (trop d'échecs)
- 🔔 Taux d'échec > 5%
- 🔔 Temps de réponse > 10 secondes

### 7.2 Logs et audit

**Logs à conserver** :

- Tous les événements webhook reçus
- Toutes les commandes créées
- Tous les emails envoyés
- Toutes les erreurs de traitement

**Durée de conservation** : 1 an minimum (conformité)

### 7.3 Mises à jour

**Vérifier régulièrement** :

- Nouveaux événements Stripe disponibles
- Changements dans l'API Stripe
- Mises à jour de sécurité

---

## ✅ Checklist de validation

Avant de passer en production, vérifiez :

- [ ] Endpoint webhook créé dans Stripe (Test et Production)
- [ ] Tous les événements nécessaires cochés (voir liste complète)
- [ ] Webhook secret configuré dans l'application
- [ ] Test avec Stripe CLI réussi
- [ ] Test avec paiement réel (mode Test) réussi
- [ ] Commande créée automatiquement
- [ ] Email de confirmation envoyé
- [ ] Artefacts disponibles dans le dashboard
- [ ] Logs webhook sans erreur
- [ ] Signature vérifiée correctement
- [ ] Idempotence testée (pas de doublon)
- [ ] Gestion des erreurs validée
- [ ] Documentation à jour

---

## 📚 Ressources supplémentaires

**Documentation Stripe** :
- [Guide des webhooks](https://stripe.com/docs/webhooks)
- [Événements disponibles](https://stripe.com/docs/api/events/types)
- [Sécurité des webhooks](https://stripe.com/docs/webhooks/signatures)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

**Support** :
- Dashboard Stripe : https://dashboard.stripe.com
- Support Stripe : https://support.stripe.com
- Documentation du projet : Voir `README.md`

---

**Date de création** : Décembre 2025  
**Version** : 1.0  
**Auteur** : Sionohmair Insight Academy
