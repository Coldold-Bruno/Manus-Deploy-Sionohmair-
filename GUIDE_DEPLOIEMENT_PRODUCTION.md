# 🚀 GUIDE DE DÉPLOIEMENT EN PRODUCTION

## ✅ ÉTAPE 1 : SECRETS CONFIGURÉS (TERMINÉ)

Vous avez déjà ajouté les 6 secrets :
- ✅ CRON_SECRET
- ✅ SMTP_HOST
- ✅ SMTP_PORT
- ✅ SMTP_SECURE
- ✅ SMTP_USER
- ✅ SMTP_PASS

**Serveur redémarré** : Les secrets sont maintenant actifs ! ✅

---

## 🎯 ÉTAPE 2 : TESTER LE SYSTÈME D'EMAILS (5 MIN)

### Test Rapide

Le système d'emails automatiques devrait maintenant fonctionner.

**Pour tester** :
1. Créez un compte test sur votre site
2. Vérifiez que vous recevez l'email de bienvenue
3. Attendez les emails de rappel (J-7, J-3, J-1)

**OU utilisez le script de test** :
```bash
node scripts/test-email.mjs
```

Si vous recevez un email de test, c'est que tout fonctionne ! ✅

---

## 📦 ÉTAPE 3 : CRÉER UN CHECKPOINT FINAL (2 MIN)

Avant de publier, créez un checkpoint pour sauvegarder l'état actuel.

### Sur la Plateforme Manus

1. Allez sur https://manus.im
2. Ouvrez votre projet **sionohmair-insight-academy**
3. Cliquez sur **"Save Checkpoint"** ou **"Créer un checkpoint"**
4. Ajoutez un message : **"Configuration finale - Prêt pour production"**
5. Cliquez sur **"Save"**

**Résultat** : Votre projet est sauvegardé et prêt à être publié ! ✅

---

## 🌐 ÉTAPE 4 : PUBLIER LE PROJET (3 MIN)

### Méthode 1 : Via l'Interface Manus (Recommandée)

1. Sur https://manus.im, ouvrez votre projet
2. Cliquez sur le bouton **"Publish"** (en haut à droite)
3. Choisissez un nom de domaine :
   - **Domaine gratuit Manus** : `votre-nom.manus.space`
   - **Domaine personnalisé** : `votredomaine.com` (si vous en avez un)
4. Cliquez sur **"Publish"**
5. Attendez 1-2 minutes

**Résultat** : Votre site est maintenant en ligne ! 🎉

### Méthode 2 : Via le Management UI

1. Ouvrez le lien de votre projet
2. Dans le panneau Management UI (à droite)
3. Cliquez sur **"Dashboard"**
4. Cliquez sur **"Publish"**
5. Suivez les instructions

---

## 🔗 ÉTAPE 5 : RÉCUPÉRER L'URL DE PRODUCTION

Après publication, vous recevrez une URL de production :

**Format** :
- Domaine Manus : `https://votre-nom.manus.space`
- Domaine personnalisé : `https://votredomaine.com`

**Notez cette URL** : C'est l'adresse publique de votre plateforme ! 📝

---

## ⚙️ ÉTAPE 6 : CONFIGURER STRIPE EN MODE LIVE (OPTIONNEL - 15 MIN)

Si vous voulez accepter de vrais paiements :

### 6.1 Activer Stripe Live

1. Allez sur https://dashboard.stripe.com
2. Cliquez sur **"Activer votre compte"**
3. Remplissez les informations demandées :
   - Informations personnelles
   - Informations bancaires
   - Vérification d'identité
4. Attendez la validation (quelques heures à 1-2 jours)

### 6.2 Récupérer les Clés Live

Une fois votre compte activé :
1. Allez dans **Développeurs** → **Clés API**
2. Basculez en mode **"Live"** (en haut)
3. Copiez :
   - **Clé publique** : `pk_live_...`
   - **Clé secrète** : `sk_live_...`

### 6.3 Mettre à Jour les Secrets Manus

1. Retournez sur https://manus.im
2. Ouvrez votre projet → Settings → Secrets
3. Mettez à jour :
   - `VITE_STRIPE_PUBLISHABLE_KEY` → `pk_live_...`
   - `STRIPE_SECRET_KEY` → `sk_live_...`
4. Redémarrez le serveur

### 6.4 Configurer le Webhook Live

1. Sur Stripe, allez dans **Développeurs** → **Webhooks**
2. Cliquez sur **"Ajouter un endpoint"**
3. URL du endpoint : `https://votre-nom.manus.space/api/stripe/webhook`
4. Événements à écouter :
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copiez le **Secret de signature** : `whsec_...`
6. Ajoutez-le dans Manus Secrets : `STRIPE_WEBHOOK_SECRET`

**Résultat** : Stripe est maintenant en mode Live ! 💳✅

---

## 📊 ÉTAPE 7 : VÉRIFIER LE DÉPLOIEMENT (5 MIN)

### Checklist de Vérification

✅ **Site accessible** : Ouvrez `https://votre-nom.manus.space`  
✅ **Navigation fonctionne** : Testez tous les menus  
✅ **Inscription fonctionne** : Créez un compte test  
✅ **Email de bienvenue reçu** : Vérifiez votre boîte mail  
✅ **Paiement fonctionne** : Testez un abonnement (mode test)  
✅ **Dashboard accessible** : Connectez-vous et accédez au dashboard  

### Tests Recommandés

1. **Test d'inscription** :
   - Créez un compte avec un email test
   - Vérifiez l'email de bienvenue
   - Connectez-vous au dashboard

2. **Test d'abonnement** :
   - Cliquez sur "S'abonner"
   - Utilisez une carte test : `4242 4242 4242 4242`
   - Vérifiez l'email de confirmation

3. **Test des outils** :
   - Analyseur de contenu
   - Générateur de copy
   - Persona builder
   - Chat IA

---

## 🎉 ÉTAPE 8 : VOTRE PROJET EST EN LIGNE !

### Ce Qui Fonctionne Maintenant

✅ **Site web complet** : 10+ outils de content marketing  
✅ **Système d'abonnement** : Essai 30j + 36€/mois  
✅ **Emails automatiques** : 7 templates (bienvenue, rappels, etc.)  
✅ **Cron job quotidien** : Vérification automatique des essais  
✅ **Paiements Stripe** : Mode test (ou live si configuré)  
✅ **CRM complet** : Lead scoring, notes, tâches  
✅ **Newsletter automatique** : 3 séquences d'onboarding  
✅ **Analytics** : Tracking complet des utilisateurs  

---

## 📈 PROCHAINES ÉTAPES RECOMMANDÉES

### 1. Marketing et Acquisition (Semaine 1)

- [ ] Créer une page LinkedIn pour annoncer le lancement
- [ ] Publier un article de blog sur la méthodologie PFPMA
- [ ] Partager sur les réseaux sociaux
- [ ] Contacter 10 prospects potentiels
- [ ] Créer une vidéo de démonstration (5 min)

### 2. Optimisation (Semaine 2-4)

- [ ] Analyser les premiers utilisateurs (Google Analytics)
- [ ] Identifier les points de friction (où les gens abandonnent)
- [ ] Améliorer les pages avec le plus de trafic
- [ ] Tester différents messages marketing (A/B testing)
- [ ] Optimiser le taux de conversion essai → abonnement

### 3. Contenu et SEO (Mois 1-3)

- [ ] Publier 2 articles de blog par semaine
- [ ] Créer des études de cas clients
- [ ] Optimiser le SEO (mots-clés, meta descriptions)
- [ ] Créer des templates gratuits (lead magnets)
- [ ] Lancer une chaîne YouTube avec tutoriels

### 4. Croissance (Mois 3-6)

- [ ] Lancer un programme d'affiliation
- [ ] Créer des partenariats avec d'autres plateformes
- [ ] Organiser des webinaires gratuits
- [ ] Développer une communauté (Discord, Slack)
- [ ] Ajouter de nouveaux outils basés sur les retours utilisateurs

---

## 🆘 SUPPORT ET DÉPANNAGE

### Problème : Le Site ne S'Affiche Pas

**Solution** :
1. Vérifiez que le checkpoint a bien été créé
2. Attendez 2-3 minutes après publication
3. Videz le cache de votre navigateur (Ctrl+Shift+R)
4. Essayez en navigation privée

### Problème : Les Emails ne Partent Pas

**Solution** :
1. Vérifiez les secrets SMTP dans Manus
2. Testez avec `node scripts/test-email.mjs`
3. Vérifiez les logs du serveur
4. Assurez-vous que Gmail autorise les "applications moins sécurisées"

### Problème : Stripe ne Fonctionne Pas

**Solution** :
1. Vérifiez les clés Stripe (mode test vs live)
2. Vérifiez le webhook (URL correcte)
3. Testez avec une carte test : `4242 4242 4242 4242`
4. Consultez les logs Stripe Dashboard

### Problème : Le Cron Job ne S'Exécute Pas

**Solution** :
1. Vérifiez que CRON_SECRET est configuré
2. Vérifiez les GitHub Actions (onglet Actions)
3. Testez manuellement : `curl -X POST "https://votre-url/api/cron/check-trial-expirations" -H "Content-Type: application/json" -d '{"secret":"VOTRE_SECRET"}'`

---

## 📞 BESOIN D'AIDE ?

Si vous rencontrez un problème :

1. **Consultez les guides** :
   - QUICKSTART.md
   - CONFIGURATION_FINALE.md
   - AUTOMATION_README.md
   - GUIDE_UTILISATEUR.md

2. **Vérifiez les logs** :
   - Console du navigateur (F12)
   - Logs du serveur (Management UI → Code → Logs)
   - Logs Stripe (Dashboard → Développeurs → Logs)

3. **Contactez le support Manus** :
   - https://help.manus.im

---

## 🎊 FÉLICITATIONS !

Votre plateforme **Sionohmair Insight Academy** est maintenant en ligne et opérationnelle !

**URL de production** : `https://votre-nom.manus.space`

**Fonctionnalités actives** :
- ✅ 10+ outils de content marketing
- ✅ Système d'abonnement automatisé
- ✅ Emails automatiques
- ✅ Paiements Stripe
- ✅ CRM et lead scoring
- ✅ Analytics complet

**Prêt à acquérir vos premiers clients ! 🚀**

---

## 📊 MÉTRIQUES DE SUCCÈS À SUIVRE

### Semaine 1
- Visiteurs uniques : Objectif 100
- Inscriptions : Objectif 10
- Essais gratuits : Objectif 5

### Mois 1
- Visiteurs uniques : Objectif 1000
- Inscriptions : Objectif 50
- Conversions (essai → payant) : Objectif 5
- Revenu : Objectif 180€ (5 × 36€)

### Mois 3
- Visiteurs uniques : Objectif 5000
- Inscriptions : Objectif 200
- Conversions : Objectif 30
- Revenu : Objectif 1080€ (30 × 36€)

### Mois 6
- Visiteurs uniques : Objectif 10000
- Inscriptions : Objectif 500
- Conversions : Objectif 100
- Revenu : Objectif 3600€ (100 × 36€)

**Suivez ces métriques dans Google Analytics et votre dashboard admin !**

---

## 🎯 RÉSUMÉ DES ÉTAPES

1. ✅ Secrets configurés
2. ✅ Serveur redémarré
3. ⏳ Tester les emails
4. ⏳ Créer un checkpoint
5. ⏳ Publier le projet
6. ⏳ Configurer Stripe Live (optionnel)
7. ⏳ Vérifier le déploiement

**Prochaine action** : Créer un checkpoint et publier ! 🚀
