# 📱 Guide Ultra-Simple : Configuration Webhook Stripe (Mobile)

## 🎯 Objectif
Configurer le webhook Stripe pour recevoir les notifications de paiement.

---

## ⚡ ÉTAPE 1 : Ouvrir l'URL de Création

**Copiez-collez cette URL dans votre navigateur mobile :**

```
https://dashboard.stripe.com/test/webhooks/create
```

✅ Vous arriverez **directement** sur le formulaire de création de webhook.

---

## 📝 ÉTAPE 2 : Remplir l'URL du Endpoint

Dans le champ **"Endpoint URL"**, copiez-collez cette URL :

```
https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer/api/stripe/webhook
```

---

## 🎯 ÉTAPE 3 : Sélectionner les 3 Événements

### 3.1 Chercher "Checkout"
1. Dans la barre de recherche, tapez : **checkout**
2. Trouvez **"Checkout"** dans la liste
3. Cochez : ✅ **checkout.session.completed**

### 3.2 Chercher "Payment Intent - Succeeded"
1. Effacez la recherche
2. Tapez : **payment intent**
3. Trouvez **"Payment Intent"** dans la liste
4. Cochez : ✅ **payment_intent.succeeded**

### 3.3 Chercher "Payment Intent - Failed"
1. Dans la même section **"Payment Intent"**
2. Cochez : ✅ **payment_intent.payment_failed**

---

## 💾 ÉTAPE 4 : Enregistrer

1. Cliquez sur le bouton **"Add endpoint"** (ou "Ajouter l'endpoint")
2. Attendez la confirmation

---

## 🔑 ÉTAPE 5 : Récupérer le Secret

Après avoir créé le webhook, vous verrez une page avec :

- **Signing secret** (ou "Secret de signature")
- Il commence par **`whsec_...`**

### Comment le révéler :
1. Cliquez sur **"Click to reveal"** (ou "Cliquer pour révéler")
2. **Copiez** le secret complet (il est long !)
3. **Envoyez-le moi** dans le chat

---

## ✅ Récapitulatif

| Étape | Action | Valeur |
|-------|--------|--------|
| 1 | URL de création | `https://dashboard.stripe.com/test/webhooks/create` |
| 2 | Endpoint URL | `https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer/api/stripe/webhook` |
| 3 | Événement 1 | ✅ `checkout.session.completed` |
| 3 | Événement 2 | ✅ `payment_intent.succeeded` |
| 3 | Événement 3 | ✅ `payment_intent.payment_failed` |
| 4 | Enregistrer | Cliquer sur "Add endpoint" |
| 5 | Copier le secret | Commence par `whsec_...` |

---

## 🚀 Après Configuration

Une fois que vous m'aurez envoyé le **secret `whsec_...`**, je configurerai automatiquement votre application et tout sera prêt !

---

## ❓ Besoin d'Aide ?

Si vous êtes bloqué à une étape, faites une **capture d'écran** et envoyez-la moi. Je vous guiderai !

---

**Bonne chance ! Vous allez y arriver ! 💪**
