# 📚 PARCOURS UTILISATEUR - FORMATION SPRINT DE CLARTÉ

## 🎯 Vue d'ensemble

La **Formation Sprint de Clarté** est une plateforme de formation interactive permettant aux utilisateurs de maîtriser le Code PFPMA en 9 modules progressifs.

**Prix** : 790 € TTC  
**Durée d'accès** : 90 jours (3 mois)  
**Contenu** : 9 modules + 27 exercices pratiques + Badges de gamification  
**Politique** : Aucun remboursement possible (CGV strictes)

---

## 🚀 Parcours Complet

### **Étape 1 : Découverte de l'offre**

L'utilisateur arrive sur la page `/services` et découvre la **Formation Sprint de Clarté** :

- **Section dédiée** : Carte mise en avant avec badge "🎓 Formation Interactive"
- **Prix affiché** : 790 € avec mention "Accès pendant 90 jours"
- **Contenu détaillé** :
  - 9 modules interactifs (11h15 de contenu)
  - 27 exercices pratiques avec validation automatique
  - Déblocage progressif (1 module par jour minimum)
  - Badges de gamification (8 badges disponibles)
  - Certificat "Architecte de la Clarté"
  - Manuel PFPMA (PDF téléchargeable)
  - Templates de rédaction (Word/Excel)
- **Avertissements clairs** :
  - ⚠️ Accès limité à 90 jours (3 mois)
  - ⚠️ Aucun remboursement possible
  - ⚠️ Support technique inclus (48h)
  - ⚠️ Pas de support pédagogique
- **CTA** : Bouton "Acheter la formation (790 €)"
- **Lien CGV** : Bouton "Lire les CGV" (redirection vers `/cgv-formation`)

---

### **Étape 2 : Lecture des CGV (optionnel)**

L'utilisateur peut consulter les **Conditions Générales de Vente** sur `/cgv-formation` :

**13 sections détaillées** :
1. Objet
2. Description de la formation
3. Prix et modalités de paiement
4. **Durée d'accès (90 jours maximum)**
5. **Politique de remboursement (aucun remboursement)**
6. Obligations du client
7. Propriété intellectuelle
8. Protection des données personnelles (RGPD)
9. Support et assistance
10. Disponibilité de la plateforme
11. Limitation de responsabilité
12. Modification des CGV
13. Droit applicable et juridiction

**Encadré d'acceptation** :
- ✅ Avoir lu et compris les conditions d'accès (90 jours maximum)
- ✅ Renoncer à son droit de rétractation de 14 jours
- ✅ Accepter qu'aucun remboursement ne sera possible
- ✅ S'engager à respecter les droits de propriété intellectuelle

---

### **Étape 3 : Achat via Stripe**

L'utilisateur clique sur **"Acheter la formation (790 €)"** :

1. **Vérification de connexion** : Si non connecté, redirection vers la page de login OAuth
2. **Redirection Stripe Checkout** : Ouverture dans un nouvel onglet
3. **Paiement sécurisé** : L'utilisateur entre ses informations de carte bancaire
4. **Validation du paiement** : Stripe valide la transaction

**Webhook automatique** :
- Stripe envoie un événement `checkout.session.completed` au serveur
- Le serveur crée automatiquement :
  - 1 **accès formation** (90 jours)
  - 9 **modules** (module 1 débloqué, modules 2-9 verrouillés)
  - Email de confirmation envoyé

---

### **Étape 4 : Accès à la plateforme**

L'utilisateur se rend sur `/formation` :

**Dashboard principal** :

**Header** :
- Titre : "Formation Sprint de Clarté"
- Sous-titre : "Maîtrise le Code PFPMA en 9 modules interactifs"
- Bouton "← Retour"

**Colonne principale (2/3 de l'écran)** :
- **Carte de progression globale** :
  - Icône ⚡ "Ta progression"
  - Barre de progression (0-100%)
  - Statistiques :
    - Modules complétés : 0 / 9
    - Exercices réussis : 0
    - Score global : 0 / 100
    - Jours restants : 90

- **Liste des 9 modules** :
  - Module 1 : ✅ Débloqué (bouton "Commencer")
  - Modules 2-9 : 🔒 Verrouillés (badge "Verrouillé")
  - Chaque module affiche :
    - Icône de statut (✅ complété, 🔵 en cours, 🔒 verrouillé)
    - Titre du module
    - Progression : X / 3 exercices
    - Score : X / 100
    - Barre de progression

**Sidebar (1/3 de l'écran)** :
- **Temps restant** :
  - Gros chiffre : 90 jours
  - Date d'expiration : JJ/MM/AAAA
- **Badges gagnés** :
  - Liste des badges avec icône + description
  - Message si aucun badge : "Complète des modules pour débloquer des badges !"
- **Ressources** :
  - Bouton "📚 Manuel PFPMA (PDF)"
  - Bouton "📜 Lire les CGV"
- **Aide** :
  - Bouton "Contacter le support"

---

### **Étape 5 : Démarrage d'un module**

L'utilisateur clique sur **"Commencer"** (Module 1) :

**Redirection vers** `/formation/module/1` :

**Header** :
- Bouton retour (← vers `/formation`)
- Titre : "Module 1 : Le Code PFPMA (Fondations)"
- Sous-titre : "Exercice 1 / 3"
- Badge : "1 / 3 exercices"
- Barre de progression (0-33-66-100%)

**Carte exercice** :
- **Titre** : "Identifier les 5 parties du Code PFPMA"
- **Instructions** : Texte détaillé avec exemple
- **Zone de réponse** : Textarea (8 lignes)
- **Compteur de caractères** : X caractères (min: 100, max: 500)
- **Bouton "Voir les indices"** (optionnel) :
  - Affiche une alerte avec 3 indices
- **Boutons d'action** :
  - "Exercice précédent" (désactivé si exercice 1)
  - "Soumettre" (désactivé si réponse vide)
  - "Exercice suivant" (visible si exercice déjà validé)

---

### **Étape 6 : Soumission d'un exercice**

L'utilisateur rédige sa réponse et clique sur **"Soumettre"** :

**Validation automatique** :
1. Vérification de la longueur (min/max)
2. Vérification des mots-clés attendus
3. Calcul du score (/100)
4. Génération du feedback personnalisé

**Résultat affiché** :

**Si ✅ réussi (score ≥ 70)** :
- Toast de succès : "✅ Exercice 1 réussi ! Score : 85/100"
- Alerte verte avec feedback : "🎉 Excellent ! Tu as parfaitement compris le concept."
- Passage automatique à l'exercice suivant après 2 secondes

**Si ❌ échoué (score < 70)** :
- Toast d'erreur : "❌ Exercice 1 échoué. Score : 45/100. Réessaie !"
- Alerte rouge avec feedback détaillé : "❌ Réponse trop courte (45 caractères). Minimum requis : 100. Développe davantage."
- Possibilité de réessayer immédiatement

**Historique des tentatives** :
- Affichage des 3 dernières tentatives
- Pour chaque tentative :
  - Icône ✅ ou ❌
  - Numéro de tentative
  - Score /100
  - Feedback

---

### **Étape 7 : Complétion d'un module**

Après avoir validé les **3 exercices** du module :

**Événements automatiques** :
1. **Toast de succès** : "🎉 Module complété ! Le module suivant est maintenant débloqué."
2. **Confettis** : Animation de confettis (100 particules, couleurs : or, bleu, bleu clair)
3. **Déblocage du module suivant** : Module 2 devient accessible
4. **Attribution de badges** :
   - Badge "Premier Pas 🚀" (si module 1)
   - Badge "Premier Coup 🎯" (si réussi du premier coup)
   - Badge "Score Parfait ⭐" (si score 100/100)
5. **Mise à jour de la progression** :
   - Modules complétés : 1 / 9
   - Exercices réussis : 3
   - Score global : mise à jour

**Redirection automatique** :
- Retour au dashboard `/formation` après 2 secondes

---

### **Étape 8 : Progression dans les modules**

L'utilisateur continue les modules 2, 3, 4, etc. :

**Déblocage progressif** :
- Module 2 débloqué après complétion du module 1
- Module 3 débloqué après complétion du module 2
- Etc.

**Badges gagnés** :
1. **Premier Pas 🚀** : Compléter le module 1
2. **À Mi-Chemin 🏃** : Compléter 5 modules
3. **Architecte de la Clarté 🏛️** : Compléter les 9 modules
4. **Score Parfait ⭐** : Obtenir 100/100 sur un exercice
5. **Persévérant 💪** : Faire 10+ tentatives avant de réussir
6. **Premier Coup 🎯** : Réussir du premier coup
7. **Marathonien 🏃‍♂️** : Terminer en moins de 7 jours
8. **Perfectionniste 🎨** : Score global > 90/100

---

### **Étape 9 : Certification finale**

Après avoir complété les **9 modules** :

**Module 9 : Certification Finale** :
- 3 exercices de synthèse
- Rédaction d'un message PFPMA complet (Partie 1, 2, 3)
- Auto-évaluation avec checklist

**Certificat délivré** :
- Badge "Architecte de la Clarté 🏛️"
- Certificat téléchargeable (PDF) (à implémenter)
- Mention sur le profil utilisateur

**Accès maintenu** :
- L'utilisateur peut continuer à accéder à la formation pendant les 90 jours
- Possibilité de revoir les modules et refaire les exercices
- Accès révoqué automatiquement après 90 jours

---

## 🔒 Gestion de l'accès

### **Vérification de l'accès**

À chaque visite sur `/formation` :
1. Vérification de l'existence d'un accès actif
2. Vérification de la date d'expiration (90 jours)
3. Calcul des jours restants

**Si accès expiré** :
- Message : "Votre accès à la formation a expiré (90 jours dépassés)."
- Boutons : "Voir les offres" | "Retour à l'accueil"

**Si pas d'accès** :
- Message : "Vous n'avez pas encore acheté la formation."
- Boutons : "Voir les offres" | "Retour à l'accueil"

---

## 📊 Système de scoring

### **Validation des exercices**

**Critères de validation** :
1. **Longueur** (30 points) :
   - Min : 30 caractères
   - Max : 500 caractères
2. **Structure** (20 points) :
   - Présence de paragraphes (retours à la ligne)
   - Ou phrases multiples (points)
3. **Mots-clés** (30 points) :
   - Vérification des mots-clés attendus par module
   - Exemples : "problème", "formule", "preuve", "méthode", "appel"
4. **Bonus module** (20 points) :
   - Validation spécifique par module (regex)

**Seuil de validation** : 70/100

**Feedback personnalisé** :
- Score ≥ 90 : "🎉 Excellent ! Tu as parfaitement compris le concept."
- Score ≥ 70 : "✅ Bien joué ! Tu as validé cet exercice."
- Score ≥ 50 : "💡 Presque ! Il manque : [mots-clés]. Réessaie."
- Score < 50 : "❌ Pas encore. Mots-clés manquants : [liste]. Relis les instructions."

---

## 🎮 Gamification

### **8 badges disponibles**

1. **Premier Pas 🚀** : Compléter le module 1
2. **À Mi-Chemin 🏃** : Compléter 5 modules
3. **Architecte de la Clarté 🏛️** : Compléter les 9 modules
4. **Score Parfait ⭐** : Obtenir 100/100 sur un exercice
5. **Persévérant 💪** : Faire 10+ tentatives avant de réussir
6. **Premier Coup 🎯** : Réussir du premier coup
7. **Marathonien 🏃‍♂️** : Terminer en moins de 7 jours (à implémenter)
8. **Perfectionniste 🎨** : Score global > 90/100 (à implémenter)

### **Affichage des badges**

- Sidebar du dashboard `/formation`
- Icône + nom + description + date d'obtention
- Message si aucun badge : "Complète des modules pour débloquer des badges !"

---

## 📱 Responsive Design

### **Mobile (< 768px)**

**Dashboard `/formation`** :
- Ordre d'affichage :
  1. Progression globale
  2. Liste des modules
  3. Sidebar (temps restant, badges, ressources, aide)
- Padding réduit (py-4 au lieu de py-8)

**Module `/formation/module/:id`** :
- Padding réduit (py-4 md:py-8)
- Textarea pleine largeur
- Boutons empilés verticalement

### **Desktop (≥ 768px)**

**Dashboard `/formation`** :
- Grid 3 colonnes (2/3 + 1/3)
- Sidebar fixe à droite

**Module `/formation/module/:id`** :
- Largeur max : 4xl (896px)
- Boutons en ligne

---

## 🎨 Animations

### **Confettis**

**Déclenchement** :
- Complétion d'un module (3 exercices validés)

**Configuration** :
- Nombre de particules : 100
- Spread : 70
- Origine : y = 0.6 (centre de l'écran)
- Couleurs : ['#F59E0B', '#0A1929', '#3B82F6'] (or, bleu foncé, bleu clair)

**Bibliothèque** : `canvas-confetti`

---

## 🔧 Support Technique

### **Support inclus**

- **Type** : Support technique uniquement (pas de support pédagogique)
- **Canal** : Email (contact@sionohmair.com)
- **Délai de réponse** : 48h ouvrées maximum
- **Problèmes couverts** :
  - Accès à la plateforme
  - Bugs techniques
  - Problèmes de paiement
  - Questions sur les CGV

### **Support NON inclus**

- Aide sur les exercices (pas de correction manuelle)
- Coaching personnalisé
- Demandes de prolongation d'accès
- Remboursements

---

## 📄 Ressources téléchargeables

### **Manuel PFPMA (PDF)**

- Accessible via `/ressources`
- Lien dans la sidebar du dashboard `/formation`
- Contenu : Méthodologie complète PFPMA

### **Templates de rédaction**

- Accessible via `/ressources`
- Formats : Word, Excel
- Contenu : Templates pour appliquer le Code PFPMA

---

## 🚨 Cas d'usage spécifiques

### **Cas 1 : Utilisateur achète mais n'utilise pas**

- Accès créé : 90 jours
- Pas de connexion pendant 90 jours
- Accès révoqué automatiquement après 90 jours
- **Aucun remboursement possible**

### **Cas 2 : Utilisateur termine en 10 jours**

- Accès créé : 90 jours
- Termine les 9 modules en 10 jours
- Certificat délivré
- Accès maintenu jusqu'à la fin des 90 jours (possibilité de revoir)
- **Aucun remboursement possible**

### **Cas 3 : Utilisateur bloqué sur un exercice**

- Tentatives illimitées
- Feedback personnalisé après chaque tentative
- Indices disponibles (bouton "Voir les indices")
- Historique des 3 dernières tentatives affiché
- **Pas de support pédagogique** (pas de correction manuelle)

### **Cas 4 : Utilisateur demande une prolongation**

- Accès expiré après 90 jours
- Message : "Votre accès a expiré"
- **Aucune prolongation possible** (sauf force majeure dûment justifiée)

### **Cas 5 : Utilisateur demande un remboursement**

- **Aucun remboursement possible** (CGV strictes)
- Conformément à l'article L221-28 du Code de la consommation
- L'utilisateur a renoncé à son droit de rétractation de 14 jours

---

## 🔐 Sécurité et RGPD

### **Données collectées**

- Nom, email (via OAuth)
- Progression dans la formation (modules, exercices, scores)
- Tentatives d'exercices (réponses, scores, feedback)
- Badges gagnés
- Dates d'accès

### **Finalités du traitement**

- Gestion de l'accès à la formation
- Suivi de la progression pédagogique
- Délivrance du certificat de fin de formation
- Support technique et pédagogique

### **Durée de conservation**

- Pendant la durée d'accès (90 jours)
- + 3 ans pour les obligations légales

### **Droits du client**

- Droit d'accès
- Droit de rectification
- Droit d'effacement
- Droit de portabilité

**Contact** : contact@sionohmair.com

---

## 📈 Métriques et KPIs

### **Métriques utilisateur**

- Modules complétés : X / 9
- Exercices réussis : X / 27
- Score global : X / 100
- Jours restants : X / 90
- Badges gagnés : X / 8

### **Métriques admin (à implémenter)**

- Taux de complétion : % d'utilisateurs ayant terminé les 9 modules
- Temps moyen de complétion : X jours
- Taux d'abandon : % d'utilisateurs n'ayant pas terminé
- Module le plus difficile : Module avec le plus de tentatives
- Score moyen par module : X / 100

---

## 🛠️ Améliorations futures

### **Fonctionnalités à ajouter**

1. **Certificat PDF téléchargeable** : Générer automatiquement un certificat après complétion
2. **Validation IA** : Utiliser GPT-4 pour valider les réponses de manière plus intelligente
3. **Badges supplémentaires** : Marathonien, Perfectionniste
4. **Leaderboard** : Classement des meilleurs scores
5. **Forum communautaire** : Échange entre apprenants
6. **Vidéos explicatives** : Ajouter des vidéos pour chaque module
7. **Quiz interactifs** : Ajouter des quiz en plus des exercices
8. **Notifications par email** : Rappels de progression, expiration imminente
9. **Mode sombre** : Thème sombre pour la plateforme
10. **Export de progression** : Télécharger un rapport de progression (PDF)

---

## 📞 Contact

**Sionohmair Insight Academy**  
Email : contact@sionohmair.com  
Site web : https://sionohmair-insight-academy.manus.space

---

**Dernière mise à jour** : 26 novembre 2025
