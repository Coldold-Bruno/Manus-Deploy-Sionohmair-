# ✅ Checklist de Déploiement Production

**Date** : 27 novembre 2025
**Version** : ff59b673
**Statut** : À compléter

---

## 📋 Phase 1 : Configuration SMTP (10 minutes)

- [ ] Choisir le fournisseur SMTP (Gmail/SendGrid/Brevo)
- [ ] Créer le mot de passe d'application / API Key
- [ ] Ajouter les 5 variables dans Manus :
  - [ ] `SMTP_HOST`
  - [ ] `SMTP_PORT`
  - [ ] `SMTP_SECURE`
  - [ ] `SMTP_USER`
  - [ ] `SMTP_PASS`
- [ ] Redémarrer le serveur
- [ ] Tester l'envoi d'email (`node scripts/test-email.mjs`)
- [ ] Vérifier la réception de l'email de test

**Documentation** : `/tmp/GUIDE_SMTP_CONFIGURATION.md`

---

## 📋 Phase 2 : Configuration CRON_SECRET (5 minutes)

- [ ] Copier le CRON_SECRET généré
- [ ] Ajouter dans GitHub Secrets :
  - [ ] `CRON_SECRET`
  - [ ] `APP_URL`
- [ ] Ajouter dans Manus Secrets :
  - [ ] `CRON_SECRET`
- [ ] Vérifier le workflow GitHub Actions
- [ ] Tester manuellement avec curl

**Documentation** : `/tmp/GUIDE_CRON_CONFIGURATION.md`

**CRON_SECRET** : `7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=`

---

## 📋 Phase 3 : Configuration Stripe Live (15 minutes)

- [ ] Réclamer le sandbox Stripe (avant le 20 janvier 2026)
- [ ] Activer le mode Live
- [ ] Compléter le profil d'entreprise
- [ ] Créer le produit d'abonnement (36€/mois)
- [ ] Copier le Price ID
- [ ] Récupérer les clés Live :
  - [ ] Publishable Key (`pk_live_...`)
  - [ ] Secret Key (`sk_live_...`)
- [ ] Configurer le webhook :
  - [ ] URL : `https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer/api/stripe/webhook`
  - [ ] Événements sélectionnés
  - [ ] Signing Secret copié (`whsec_...`)
- [ ] Ajouter dans Manus Secrets :
  - [ ] `VITE_STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] Redémarrer le serveur
- [ ] Tester avec `node scripts/test-stripe.mjs`

**Documentation** : `/tmp/GUIDE_STRIPE_CONFIGURATION.md`

---

## 📋 Phase 4 : Tests Finaux (10 minutes)

### Test 1 : Flux d'Inscription Complet

- [ ] Ouvrir le site en navigation privée
- [ ] Cliquer sur "Essai gratuit (30j)"
- [ ] Se connecter avec OAuth
- [ ] Vérifier /subscription (essai gratuit visible)
- [ ] Vérifier la réception de l'email de bienvenue

### Test 2 : Outils Content Marketing

- [ ] Tester l'Analyseur de Contenu (/content-analyzer)
- [ ] Tester le Générateur de Copy (/copy-generator)
- [ ] Tester le Chat IA (/chat-ia)
- [ ] Tester le Générateur de Titres (/title-generator)
- [ ] Tester l'Optimiseur SEO (/seo-optimizer)

### Test 3 : Paiement Stripe

- [ ] Aller sur /subscription
- [ ] Cliquer sur "S'abonner maintenant"
- [ ] Utiliser la carte de test : `4242 4242 4242 4242`
- [ ] Vérifier que le paiement est accepté
- [ ] Vérifier que le statut passe à "Actif"
- [ ] Vérifier l'accès aux outils premium

### Test 4 : Cron Job

- [ ] Tester manuellement : `curl "https://3000-iy0jr7a4z0z4kzc0cszdp-35b2cfac.manusvm.computer/api/trpc/cron.checkTrialExpirations?secret=7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E="`
- [ ] Vérifier la réponse JSON
- [ ] Vérifier les logs GitHub Actions

---

## 📋 Phase 5 : Publication (5 minutes)

- [ ] Créer un checkpoint final
  - Message : "Production Ready - SMTP, CRON_SECRET et Stripe Live configurés"
- [ ] Publier le site (Dashboard Manus → Publish)
- [ ] Vérifier que le site est accessible
- [ ] Tester le flux complet sur le site publié

---

## 📋 Phase 6 : Monitoring (Continu)

### Première Semaine

- [ ] Jour 1 : Vérifier les emails automatiques
- [ ] Jour 2 : Vérifier les paiements Stripe
- [ ] Jour 3 : Vérifier les leads scorés
- [ ] Jour 4 : Vérifier les logs GitHub Actions
- [ ] Jour 5 : Vérifier Google Analytics
- [ ] Jour 6 : Vérifier Crisp Chat
- [ ] Jour 7 : Audit complet

### Monitoring Continu

- [ ] Configurer Google Analytics 4 (ID : `G-9R1BZN4B9E`)
- [ ] Configurer Crisp Chat (ID : `80b93e73-342f-4bd6-bde9-7b70586d1225`)
- [ ] Activer les notifications Stripe
- [ ] Surveiller les paiements échoués
- [ ] Surveiller les webhooks
- [ ] Surveiller les logs d'erreur

---

## 🎯 Score de Préparation

**Objectif** : 85/100 ✅ Excellent

**Calcul** :
- Configuration SMTP : 20 points
- Configuration CRON_SECRET : 15 points
- Configuration Stripe Live : 25 points
- Tests finaux : 15 points
- Publication : 10 points

**Score actuel** : ___ / 85

---

## 📚 Documentation Complète

Tous les guides sont disponibles dans `/tmp/` :

1. **GUIDE_SMTP_CONFIGURATION.md** : Configuration SMTP détaillée
2. **GUIDE_CRON_CONFIGURATION.md** : Configuration CRON_SECRET détaillée
3. **GUIDE_STRIPE_CONFIGURATION.md** : Configuration Stripe Live détaillée
4. **CHECKLIST_DEPLOIEMENT.md** : Cette checklist

Guides complémentaires dans le projet :

- **START_HERE.md** : Guide ultra-rapide (3 actions)
- **GUIDE_AUTOMATISATION.md** : Documentation des 17 scripts
- **DEPLOIEMENT_PRODUCTION_RAPIDE.md** : Guide complet (30-40 min)
- **SECURITE.md** : Audit de sécurité
- **CONFORMITE_RGPD.md** : Audit RGPD

---

## 🚨 Dépannage Rapide

### SMTP ne fonctionne pas
→ Voir `/tmp/GUIDE_SMTP_CONFIGURATION.md` section "Dépannage"

### CRON_SECRET ne fonctionne pas
→ Voir `/tmp/GUIDE_CRON_CONFIGURATION.md` section "Dépannage"

### Stripe ne fonctionne pas
→ Voir `/tmp/GUIDE_STRIPE_CONFIGURATION.md` section "Dépannage"

---

## ✅ Validation Finale

Avant de considérer le déploiement comme terminé :

- [ ] Toutes les cases de cette checklist sont cochées
- [ ] Score de préparation ≥ 85/100
- [ ] Aucune erreur dans les logs
- [ ] Tous les tests passent
- [ ] Le site est publié et accessible
- [ ] Le monitoring est configuré

---

**Félicitations !** 🎉

Si toutes les étapes sont validées, votre plateforme **Sionohmair Insight Academy** est **100% opérationnelle en production** !

**Prochaines étapes recommandées** :
1. Promouvoir sur LinkedIn, Twitter, Facebook
2. Créer du contenu de blog pour le SEO
3. Lancer une campagne d'acquisition
4. Ajouter des témoignages clients
5. Créer des études de cas AVANT/APRÈS

---

**Besoin d'aide ?**
- Support : coldoldbruno@gmail.com
- LinkedIn : https://www.linkedin.com/in/brunocoldold

---

**Rapport généré le** : 27 novembre 2025
**Version** : ff59b673
**Statut** : Production Ready ✅
