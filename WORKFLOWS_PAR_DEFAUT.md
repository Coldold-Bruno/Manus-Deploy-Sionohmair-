# Workflows d'Emails Par Défaut

Ce document contient 3 workflows d'emails automatiques prêts à l'emploi pour maximiser l'engagement et les conversions. Créez ces workflows dans l'interface `/admin/email-workflows`.

---

## 1. Workflow Bienvenue (3 emails sur 7 jours)

**Nom :** Bienvenue - Nouveaux Subscribers  
**Déclencheur :** new_subscriber  
**Statut :** Actif

### Étape 1 - Jour 0 (immédiat)

**Délai :** 0 heures  
**Template :** Bienvenue - Nouveau Subscriber  
**Subject :** Bienvenue chez Sionohmair Insight Academy ! 🎯

**Objectif :** Accueillir le nouveau subscriber et présenter la valeur de l'académie

---

### Étape 2 - Jour 3

**Délai :** 72 heures (3 jours)  
**Template :** Ressource Gratuite - Calculateur ROI  
**Subject :** 🎁 Votre calculateur ROI personnalisé est prêt

**Objectif :** Fournir une ressource gratuite de valeur et encourager l'interaction

---

### Étape 3 - Jour 7

**Délai :** 168 heures (7 jours)  
**Template :** Newsletter Mensuelle - Insights & Actualités  
**Subject :** 📬 Vos ressources exclusives sont prêtes

**Objectif :** Partager les meilleures ressources et encourager l'exploration du site

---

## 2. Workflow Nurturing Sprint de Clarté (5 emails sur 14 jours)

**Nom :** Nurturing Sprint de Clarté  
**Déclencheur :** sprint_interest  
**Statut :** Actif

### Étape 1 - Jour 0 (immédiat)

**Délai :** 0 heures  
**Template :** Promotion Sprint de Clarté  
**Subject :** 🚀 Transformez votre vision en 5 jours avec le Sprint de Clarté

**Objectif :** Présenter le Sprint de Clarté et ses bénéfices

---

### Étape 2 - Jour 2

**Délai :** 48 heures (2 jours)  
**Template :** Ressource Gratuite - Calculateur ROI  
**Subject :** 🎁 Calculez l'impact potentiel de votre transformation

**Objectif :** Démontrer la valeur concrète avec le calculateur ROI

---

### Étape 3 - Jour 5

**Délai :** 120 heures (5 jours)  
**Template :** Newsletter Mensuelle (personnalisée)  
**Subject :** 📚 Témoignages : Comment le Sprint a transformé leur organisation

**Objectif :** Partager des témoignages et cas d'usage concrets

---

### Étape 4 - Jour 9

**Délai :** 216 heures (9 jours)  
**Template :** Promotion Sprint de Clarté  
**Subject :** ⏰ Dernière chance : Places limitées pour le Sprint de Clarté

**Objectif :** Créer l'urgence et encourager l'inscription

---

### Étape 5 - Jour 14

**Délai :** 336 heures (14 jours)  
**Template :** Relance Inactifs (personnalisée)  
**Subject :** 💡 Une question sur le Sprint de Clarté ?

**Objectif :** Offrir un dernier point de contact et répondre aux objections

---

## 3. Workflow Réactivation Inactifs (3 emails sur 10 jours)

**Nom :** Réactivation Inactifs 30j  
**Déclencheur :** inactive_30_days  
**Statut :** Actif

### Étape 1 - Jour 0 (immédiat)

**Délai :** 0 heures  
**Template :** Relance Inactifs - Réengagement  
**Subject :** On vous a manqué {{nom}} ! 💙

**Objectif :** Réengager le lead inactif avec une offre spéciale

---

### Étape 2 - Jour 5

**Délai :** 120 heures (5 jours)  
**Template :** Ressource Gratuite - Calculateur ROI  
**Subject :** 🎁 Cadeau exclusif : Votre calculateur ROI personnalisé

**Objectif :** Fournir de la valeur pour raviver l'intérêt

---

### Étape 3 - Jour 10

**Délai :** 240 heures (10 jours)  
**Template :** Newsletter Mensuelle (personnalisée)  
**Subject :** 📬 Dernières nouvelles : Vous allez adorer ce qui arrive !

**Objectif :** Partager les nouveautés et encourager le retour

---

## Instructions de création

### Dans `/admin/email-workflows` :

1. **Créer le workflow**
   - Cliquez sur "Créer un workflow"
   - Entrez le nom et sélectionnez le déclencheur
   - Activez le workflow

2. **Ajouter les étapes**
   - Pour chaque étape, cliquez sur "Ajouter une étape"
   - Entrez le délai en heures (0, 48, 72, 120, 168, 216, 240, 336)
   - Sélectionnez le template email correspondant
   - Personnalisez le subject si nécessaire

3. **Tester le workflow**
   - Utilisez le bouton "Traiter les workflows" pour tester
   - Vérifiez les emails envoyés dans la table `workflowSubscriptions`

---

## Déclencheurs disponibles

Les workflows sont automatiquement déclenchés par :

- `new_subscriber` : Nouveau subscriber newsletter
- `sprint_interest` : Visite de la page Sprint de Clarté
- `n3_interest` : Visite de la page Niveau 3
- `ia_interest` : Visite de la page Automatisation IA
- `inactive_30_days` : Aucune activité depuis 30 jours (cron quotidien 9h)

---

## Métriques de succès attendues

### Workflow Bienvenue
- Taux d'ouverture : 60-70%
- Taux de clics : 15-25%
- Engagement après 7j : +40%

### Workflow Nurturing Sprint
- Taux de conversion : 8-12%
- Taux d'ouverture : 45-55%
- ROI : 300-500%

### Workflow Réactivation
- Taux de réengagement : 15-20%
- Taux d'ouverture : 30-40%
- Récupération de leads : +25%

---

## Optimisations recommandées

1. **A/B tester les subject lines** via `/admin/ab-testing`
2. **Analyser les performances** dans `/admin/analytics`
3. **Ajuster les délais** selon les taux d'ouverture
4. **Personnaliser les contenus** selon les intérêts détectés
5. **Ajouter des étapes** si le taux de conversion est faible

Bonne automatisation ! 🚀
