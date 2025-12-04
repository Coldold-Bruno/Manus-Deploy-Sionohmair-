# 🧪 Guide de Tests End-to-End Manuels - Sionohmair Insight Academy

**Version** : 94ca7d8b  
**Date** : 4 décembre 2025  
**Durée estimée** : 2 heures

---

## 🎯 Objectif

Ce guide vous permet de tester manuellement tous les flux critiques de l'application avant la mise en production.

---

## 📋 Checklist Globale

- [ ] Flux 1 : Inscription et Découverte (15 min)
- [ ] Flux 2 : Utilisation Gratuite et Quotas (30 min)
- [ ] Flux 3 : Passage Premium (20 min)
- [ ] Flux 4 : Utilisation Premium Illimitée (30 min)
- [ ] Flux 5 : Gestion d'Abonnement (15 min)
- [ ] Flux 6 : Annulation et Réactivation (10 min)

---

## 🔐 Flux 1 : Inscription et Découverte (15 min)

### Objectif
Vérifier que les nouveaux utilisateurs peuvent créer un compte et découvrir la plateforme.

### Étapes

#### 1.1 Accès à la Page d'Accueil
- [ ] Ouvrir l'URL de l'application
- [ ] Vérifier que la page d'accueil s'affiche correctement
- [ ] Vérifier que le logo Sionohmair est visible
- [ ] Vérifier que le menu de navigation est présent

**Résultat attendu** : Page d'accueil professionnelle avec design orange/crème

#### 1.2 Création de Compte
- [ ] Cliquer sur "Connexion" ou "Essai gratuit"
- [ ] Se connecter avec un compte OAuth (Google, GitHub, etc.)
- [ ] Vérifier la redirection vers le dashboard

**Résultat attendu** : Compte créé, utilisateur connecté

#### 1.3 Modal de Bienvenue
- [ ] Vérifier que le modal de bienvenue s'affiche
- [ ] Lire les informations sur les quotas gratuits
- [ ] Fermer le modal

**Résultat attendu** : Modal informatif avec quotas affichés

#### 1.4 Navigation
- [ ] Cliquer sur "Analyseur de Contenu"
- [ ] Cliquer sur "Générateur de Copy"
- [ ] Cliquer sur "Persona Builder"
- [ ] Cliquer sur "Premium"

**Résultat attendu** : Navigation fluide entre les pages

---

## 📊 Flux 2 : Utilisation Gratuite et Quotas (30 min)

### Objectif
Vérifier que le système de quotas fonctionne correctement et bloque l'accès après épuisement.

### Étapes

#### 2.1 Vérifier les Quotas Initiaux
- [ ] Aller sur la page "Premium"
- [ ] Vérifier les quotas affichés :
  - Copy : 0/5
  - Analyses : 0/10
  - Avatars : 0/3
  - Corrections : 0/5
  - Citations : 0/5

**Résultat attendu** : Tous les quotas à 0

#### 2.2 Utiliser l'Analyseur de Contenu (10 fois)
- [ ] Aller sur "Analyseur de Contenu"
- [ ] Entrer un texte de test (ex: "Notre logiciel révolutionne votre entreprise")
- [ ] Cliquer sur "Analyser"
- [ ] Vérifier que l'analyse se lance
- [ ] Vérifier que le quota s'incrémente (1/10)
- [ ] Répéter 9 fois pour atteindre 10/10

**Résultat attendu** : 
- 10 analyses effectuées
- Quota à 10/10
- Chaque analyse affiche un score et des recommandations

#### 2.3 Tester le Blocage après Épuisement
- [ ] Essayer de lancer une 11ème analyse
- [ ] Vérifier qu'un message d'erreur s'affiche
- [ ] Vérifier que le message mentionne le passage Premium

**Résultat attendu** : 
- Message : "Quota d'analyses atteint (10/10). Passez Premium pour un accès illimité."
- Bouton "Passer Premium" visible

#### 2.4 Utiliser le Générateur de Copy (5 fois)
- [ ] Aller sur "Générateur de Copy"
- [ ] Sélectionner un framework (ex: PFPMA)
- [ ] Entrer un brief (ex: "Landing page pour logiciel SaaS")
- [ ] Cliquer sur "Générer"
- [ ] Vérifier que le copy est généré
- [ ] Vérifier que le quota s'incrémente (1/5)
- [ ] Répéter 4 fois pour atteindre 5/5

**Résultat attendu** : 
- 5 copies générées
- Quota à 5/5
- Chaque copy suit le framework sélectionné

#### 2.5 Tester le Blocage du Générateur
- [ ] Essayer de générer une 6ème copy
- [ ] Vérifier le message d'erreur

**Résultat attendu** : Blocage avec message Premium

#### 2.6 Vérifier le Dashboard Quotas
- [ ] Retourner sur la page "Premium"
- [ ] Vérifier les quotas mis à jour :
  - Copy : 5/5 ✅
  - Analyses : 10/10 ✅
  - Avatars : 0/3
  - Corrections : 0/5
  - Citations : 0/5

**Résultat attendu** : Quotas corrects avec barres de progression pleines

---

## 💳 Flux 3 : Passage Premium (20 min)

### Objectif
Vérifier que le processus de paiement Stripe fonctionne et active correctement le statut Premium.

### Étapes

#### 3.1 Cliquer sur "Passer Premium"
- [ ] Sur la page "Premium", cliquer sur "Passer Premium"
- [ ] Vérifier la redirection vers Stripe Checkout

**Résultat attendu** : Page Stripe avec formulaire de paiement

#### 3.2 Remplir le Formulaire Stripe (Mode Test)
- [ ] Entrer l'email de test
- [ ] Entrer la carte de test : `4242 4242 4242 4242`
- [ ] Date d'expiration : n'importe quelle date future
- [ ] CVC : n'importe quel 3 chiffres
- [ ] Cliquer sur "S'abonner"

**Résultat attendu** : Paiement accepté

#### 3.3 Redirection après Paiement
- [ ] Vérifier la redirection vers l'application
- [ ] Vérifier qu'un message de succès s'affiche

**Résultat attendu** : Message "Bienvenue Premium !" ou similaire

#### 3.4 Vérifier le Statut Premium
- [ ] Aller sur la page "Premium"
- [ ] Vérifier que le badge "Premium" est affiché
- [ ] Vérifier que les quotas affichent "Illimité"

**Résultat attendu** : 
- Badge "Premium Actif" visible
- Tous les quotas affichent "∞ Illimité"

---

## 🚀 Flux 4 : Utilisation Premium Illimitée (30 min)

### Objectif
Vérifier que les utilisateurs Premium ont un accès illimité à tous les outils.

### Étapes

#### 4.1 Tester l'Analyseur (15 fois)
- [ ] Aller sur "Analyseur de Contenu"
- [ ] Lancer 15 analyses consécutives
- [ ] Vérifier qu'aucune ne bloque

**Résultat attendu** : Toutes les analyses passent sans blocage

#### 4.2 Tester le Générateur (10 fois)
- [ ] Aller sur "Générateur de Copy"
- [ ] Générer 10 copies avec différents frameworks
- [ ] Vérifier qu'aucune ne bloque

**Résultat attendu** : Toutes les générations passent

#### 4.3 Tester le Persona Builder (5 fois)
- [ ] Aller sur "Persona Builder"
- [ ] Créer 5 avatars différents
- [ ] Vérifier qu'aucun ne bloque

**Résultat attendu** : Tous les avatars créés

#### 4.4 Tester le Correcteur (10 fois)
- [ ] Aller sur "Correcteur"
- [ ] Corriger 10 textes
- [ ] Vérifier qu'aucun ne bloque

**Résultat attendu** : Toutes les corrections passent

#### 4.5 Tester le Générateur de Citations (10 fois)
- [ ] Aller sur "Générateur de Citations"
- [ ] Générer 10 citations
- [ ] Vérifier qu'aucune ne bloque

**Résultat attendu** : Toutes les citations générées

#### 4.6 Vérifier le Dashboard
- [ ] Retourner sur "Premium"
- [ ] Vérifier que les quotas affichent toujours "Illimité"
- [ ] Vérifier qu'aucun compteur n'apparaît

**Résultat attendu** : Pas de compteur, accès illimité confirmé

---

## ⚙️ Flux 5 : Gestion d'Abonnement (15 min)

### Objectif
Vérifier que les utilisateurs peuvent gérer leur abonnement via le portail Stripe.

### Étapes

#### 5.1 Accéder au Portail Client
- [ ] Sur la page "Premium", cliquer sur "Gérer mon abonnement"
- [ ] Vérifier la redirection vers le portail Stripe

**Résultat attendu** : Portail Stripe ouvert

#### 5.2 Consulter les Informations
- [ ] Vérifier que l'abonnement actif est affiché
- [ ] Vérifier le prix (29€/mois)
- [ ] Vérifier la date de prochain paiement

**Résultat attendu** : Informations correctes

#### 5.3 Mettre à Jour le Moyen de Paiement
- [ ] Cliquer sur "Mettre à jour le moyen de paiement"
- [ ] Entrer une nouvelle carte de test
- [ ] Sauvegarder

**Résultat attendu** : Carte mise à jour

#### 5.4 Consulter l'Historique
- [ ] Consulter l'historique des paiements
- [ ] Vérifier que le premier paiement apparaît

**Résultat attendu** : Paiement visible dans l'historique

---

## ❌ Flux 6 : Annulation et Réactivation (10 min)

### Objectif
Vérifier que les utilisateurs peuvent annuler et réactiver leur abonnement.

### Étapes

#### 6.1 Annuler l'Abonnement
- [ ] Dans le portail Stripe, cliquer sur "Annuler l'abonnement"
- [ ] Confirmer l'annulation
- [ ] Vérifier le message de confirmation

**Résultat attendu** : Abonnement annulé à la fin de la période

#### 6.2 Vérifier le Statut dans l'Application
- [ ] Retourner sur l'application
- [ ] Aller sur "Premium"
- [ ] Vérifier que le statut indique "Annulé à la fin de la période"

**Résultat attendu** : Message clair sur l'annulation

#### 6.3 Vérifier l'Accès Pendant la Période
- [ ] Tester un outil IA
- [ ] Vérifier que l'accès illimité fonctionne encore

**Résultat attendu** : Accès Premium maintenu jusqu'à la fin

#### 6.4 Réactiver l'Abonnement
- [ ] Retourner dans le portail Stripe
- [ ] Cliquer sur "Réactiver l'abonnement"
- [ ] Confirmer

**Résultat attendu** : Abonnement réactivé

#### 6.5 Vérifier la Réactivation
- [ ] Retourner sur "Premium"
- [ ] Vérifier que le statut est "Premium Actif"

**Résultat attendu** : Statut Premium actif

---

## 📊 Résumé des Tests

### Checklist Finale

- [ ] Tous les flux testés (6/6)
- [ ] Aucune erreur critique rencontrée
- [ ] Système de quotas fonctionnel
- [ ] Paiement Stripe opérationnel
- [ ] Accès Premium illimité validé
- [ ] Gestion d'abonnement fonctionnelle
- [ ] Annulation/Réactivation OK

### Critères de Validation

**✅ Tests Réussis** si :
- Tous les flux se déroulent sans erreur
- Les quotas se comportent comme attendu
- Le paiement Stripe fonctionne
- L'accès Premium est illimité
- La gestion d'abonnement est fluide

**❌ Tests Échoués** si :
- Un flux bloque ou génère une erreur
- Les quotas ne s'incrémentent pas
- Le paiement échoue
- L'accès Premium est limité
- La gestion d'abonnement ne fonctionne pas

---

## 🐛 Rapport de Bugs

Si vous rencontrez des bugs pendant les tests, notez-les ici :

### Bug 1
- **Flux** : 
- **Étape** : 
- **Comportement attendu** : 
- **Comportement observé** : 
- **Capture d'écran** : 

### Bug 2
- **Flux** : 
- **Étape** : 
- **Comportement attendu** : 
- **Comportement observé** : 
- **Capture d'écran** : 

---

## 📞 Support

Si vous avez besoin d'aide pour les tests, consultez :
- `DOCUMENTATION.md` : Documentation complète
- `GUIDE_UTILISATEUR_PREMIUM.md` : Guide utilisateur
- `CONFIGURATION_STRIPE.md` : Configuration Stripe

---

**Bonne chance pour vos tests !** 🚀
