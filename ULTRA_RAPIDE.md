# ⚡ ULTRA RAPIDE - Une Seule Commande !

## 🚀 DÉMARREZ EN 1 COMMANDE

```bash
cd /home/ubuntu/sionohmair-insight-academy && ./scripts/automate-everything.sh
```

**C'est tout !** Ce script fait TOUT automatiquement.

---

## ✅ Ce que le script fait automatiquement

### 1. GitHub Secrets (Automatique)
- ✅ Installe GitHub CLI si nécessaire
- ✅ Configure CRON_SECRET
- ✅ Configure APP_URL

### 2. Manus Secrets (Copier-Coller)
- ✅ Affiche tous les secrets à copier
- ✅ Valeurs par défaut (Gmail de Bruno)
- ✅ Instructions claires

### 3. Tests Automatiques
- ✅ Test SMTP
- ✅ Test système complet
- ✅ Vérification finale

---

## 📋 Secrets Affichés (Copier dans Manus)

Le script affiche automatiquement :

```
CRON_SECRET=7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=coldoldbruno@gmail.com
SMTP_PASS=uiqq kpth pjdb oknb
SMTP_FROM=coldoldbruno@gmail.com
```

**Où les copier** : https://manus.im → Settings → Secrets

---

## 🎯 Après le Script (5 minutes)

### Étape Finale : Activer Stripe

1. **Activer le compte** : https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU1ZFSGJENDV1UzY5TlRlLDE3NjQyODg3Njcv100fQEDeaWE

2. **Créer le produit** :
   - Name : `Abonnement Sionohmair Insight Academy`
   - Price : `36 EUR`
   - Billing : `Monthly`

3. **Récupérer les clés** :
   - Stripe Dashboard → Developers → API keys
   - Copier `pk_test_...` et `sk_test_...`

4. **Ajouter dans Manus** :
   ```
   STRIPE_SECRET_KEY=sk_test_votre_cle
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle
   ```

5. **Configurer le webhook** :
   - URL : `https://sionohmair-insight-academy.manus.space/api/stripe/webhook`
   - Events : subscription.*, invoice.*
   - Copier le signing secret : `whsec_...`
   - Ajouter dans Manus : `STRIPE_WEBHOOK_SECRET=whsec_...`

---

## 🧪 Test Final

```bash
# Tester le paiement
# Aller sur /subscription
# Carte : 4242 4242 4242 4242
# Date : N'importe quelle date future
# CVC : N'importe quel 3 chiffres
```

---

## ✅ Checklist

- [ ] Exécuté `./scripts/automate-everything.sh`
- [ ] Copié les secrets dans Manus
- [ ] Activé Stripe
- [ ] Créé le produit (36€/mois)
- [ ] Ajouté les clés Stripe
- [ ] Configuré le webhook
- [ ] Testé le paiement

---

## 🎉 C'EST TERMINÉ !

**Temps total** : 15-20 minutes

**Votre système est 100% opérationnel !** 🚀

---

## 📚 Documentation Complète

Si besoin de plus de détails :
- **FINALISATION_ULTIME.md** : Résumé complet
- **START_HERE.md** : Guide détaillé
- **COMMANDES.md** : Toutes les commandes

---

**Une seule commande pour tout automatiser ! ⚡**
