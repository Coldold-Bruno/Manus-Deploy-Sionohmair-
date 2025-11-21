# 📊 Configuration Google Analytics 4

## Étapes de Configuration

### 1. Créer un Compte Google Analytics 4
1. Aller sur [analytics.google.com](https://analytics.google.com)
2. Créer un compte (si vous n'en avez pas)
3. Créer une propriété **Google Analytics 4** (pas Universal Analytics)
4. Nom de la propriété : "Sionohmair Insight Academy"
5. Fuseau horaire : Europe/Paris
6. Devise : EUR

### 2. Configurer le Flux de Données Web
1. Dans la propriété GA4, aller dans **Admin** → **Flux de données**
2. Cliquer sur **Ajouter un flux** → **Web**
3. URL du site web : `https://votre-domaine.manus.space`
4. Nom du flux : "Site Web Principal"
5. Cliquer sur **Créer un flux**

### 3. Récupérer l'ID de Mesure
1. Dans le flux de données créé, copier l'**ID de mesure** (format: `G-XXXXXXXXXX`)
2. Exemple : `G-ABC123DEF4`

### 4. Configurer l'ID dans le Projet
1. Ouvrir le fichier `client/index.html`
2. Remplacer **TOUS** les `GA_MEASUREMENT_ID_PLACEHOLDER` par votre ID de mesure réel
3. Il y a 2 occurrences à remplacer (ligne 31 et 36)
4. Exemple :
   ```javascript
   gtag('config', 'G-ABC123DEF4');
   ```

### 5. Configurer les Événements Personnalisés dans GA4

#### Événements Recommandés
Les événements suivants sont déjà implémentés dans le code (`client/src/lib/analytics.ts`) :

1. **newsletter_signup** : Inscription à la newsletter
   - Paramètres : `email_domain`, `interests`
   
2. **calculator_used** : Utilisation du calculateur ROI
   - Paramètres : `result_value`
   
3. **resource_download** : Téléchargement d'une ressource
   - Paramètres : `resource_name`
   
4. **form_submission** : Soumission d'un formulaire
   - Paramètres : `form_name`
   
5. **purchase** : Achat du Sprint de Clarté
   - Paramètres : `transaction_id`, `value`, `currency`, `items`
   
6. **begin_checkout** : Début du processus de paiement
   - Paramètres : `value`, `currency`, `items`
   
7. **cta_click** : Clic sur un bouton d'appel à l'action
   - Paramètres : `cta_name`, `cta_location`

#### Créer des Conversions
1. Dans GA4, aller dans **Admin** → **Événements**
2. Attendre que les événements apparaissent (peut prendre 24-48h)
3. Marquer comme conversions :
   - `newsletter_signup`
   - `purchase`
   - `begin_checkout`
   - `calculator_used`

### 6. Configurer les Objectifs

#### Objectif 1 : Inscription Newsletter
- **Événement** : `newsletter_signup`
- **Valeur** : 5€ (valeur estimée d'un lead)

#### Objectif 2 : Utilisation Calculateur
- **Événement** : `calculator_used`
- **Valeur** : 10€ (lead qualifié)

#### Objectif 3 : Achat Sprint
- **Événement** : `purchase`
- **Valeur** : Dynamique (montant réel)

### 7. Créer des Rapports Personnalisés

#### Rapport 1 : Funnel de Conversion
1. **Explorations** → **Entonnoir**
2. Étapes :
   - Visite du site
   - `newsletter_signup`
   - `calculator_used`
   - `begin_checkout`
   - `purchase`

#### Rapport 2 : Sources de Leads
1. **Explorations** → **Exploration libre**
2. Dimensions : Source/Support, Page de destination
3. Métriques : `newsletter_signup`, Taux de conversion

#### Rapport 3 : Engagement par Page
1. **Explorations** → **Exploration libre**
2. Dimensions : Titre de la page, Chemin de la page
3. Métriques : Utilisateurs, Temps d'engagement moyen, Événements

## Utilisation dans le Code

### Importer les Fonctions
```typescript
import {
  trackNewsletterSignup,
  trackCalculatorUsage,
  trackResourceDownload,
  trackPurchase,
  trackCTAClick,
} from '@/lib/analytics';
```

### Exemples d'Utilisation

#### Tracker une Inscription Newsletter
```typescript
// Dans le composant de formulaire newsletter
const handleSubmit = async (email: string, interests: string) => {
  // ... logique d'inscription
  
  // Tracker l'événement
  trackNewsletterSignup(email, interests);
};
```

#### Tracker l'Utilisation du Calculateur
```typescript
// Dans le composant calculateur
const handleCalculate = (result: number) => {
  setResult(result);
  
  // Tracker l'événement
  trackCalculatorUsage(result);
};
```

#### Tracker un Téléchargement
```typescript
// Dans le composant de téléchargement
const handleDownload = (resourceName: string) => {
  // ... logique de téléchargement
  
  // Tracker l'événement
  trackResourceDownload(resourceName);
};
```

#### Tracker un Achat
```typescript
// Dans le composant de paiement Stripe
const handlePaymentSuccess = (sessionId: string, amount: number) => {
  // Tracker l'événement
  trackPurchase(sessionId, amount, 'EUR');
};
```

#### Tracker un Clic CTA
```typescript
// Dans n'importe quel composant avec CTA
<Button
  onClick={() => {
    trackCTAClick('Accéder au Sprint', 'Homepage Hero');
    navigate('/sprint');
  }}
>
  Accéder au Sprint de Clarté
</Button>
```

## Intégrations Avancées

### Google Tag Manager (Optionnel)
Pour une gestion plus flexible des tags :
1. Créer un compte GTM
2. Remplacer le code GA4 par le code GTM
3. Configurer GA4 via GTM
4. Ajouter d'autres tags (Facebook Pixel, LinkedIn Insight, etc.)

### Enhanced Ecommerce
Déjà implémenté pour le Sprint de Clarté :
- `begin_checkout` : Début du processus
- `purchase` : Achat confirmé
- Paramètres `items` avec détails produit

### User ID Tracking (Recommandé)
Pour suivre les utilisateurs connectés :
```typescript
// Après connexion
if (window.gtag && user) {
  window.gtag('config', 'G-XXXXXXXXXX', {
    'user_id': user.id
  });
}
```

## KPIs à Suivre

### Acquisition
- **Utilisateurs** : Nombre total de visiteurs
- **Nouveaux utilisateurs** : Nouveaux visiteurs
- **Sessions** : Nombre de visites
- **Source/Support** : D'où viennent les visiteurs

### Engagement
- **Temps d'engagement moyen** : Temps passé sur le site
- **Pages vues** : Nombre de pages consultées
- **Taux de rebond** : % de visiteurs qui partent immédiatement
- **Événements par session** : Niveau d'interaction

### Conversion
- **Taux de conversion newsletter** : % visiteurs → abonnés
- **Taux de conversion achat** : % visiteurs → clients
- **Valeur de conversion** : Revenu généré
- **Coût par acquisition** : Si vous faites de la publicité

### Comportement
- **Pages les plus visitées** : Quelles pages attirent le plus
- **Parcours utilisateur** : Chemin typique sur le site
- **Événements les plus déclenchés** : Quelles actions sont populaires
- **Taux de sortie par page** : Où les visiteurs quittent

## Rapports Hebdomadaires Automatiques

### Configurer les Rapports par Email
1. Dans GA4, aller dans **Bibliothèque** → **Collections**
2. Sélectionner un rapport (ex: Vue d'ensemble)
3. Cliquer sur **Partager** → **Planifier l'envoi par e-mail**
4. Fréquence : Hebdomadaire (lundi matin)
5. Format : PDF
6. Destinataires : Votre email

### Rapports Recommandés
- **Vue d'ensemble** : Métriques générales
- **Acquisition** : Sources de trafic
- **Engagement** : Comportement des utilisateurs
- **Conversions** : Objectifs atteints

## Conformité RGPD

### Bannière de Consentement
Ajouter une bannière de cookies pour être conforme RGPD :
- **Axeptio** (français, recommandé)
- **Cookiebot**
- **OneTrust**

### Configuration du Consentement
```typescript
// Attendre le consentement avant d'initialiser GA4
window.addEventListener('consent-granted', () => {
  // Initialiser GA4
  window.gtag('consent', 'update', {
    'analytics_storage': 'granted'
  });
});
```

## Dépannage

### Les Événements n'Apparaissent Pas
- Vérifier que l'ID de mesure est correct
- Attendre 24-48h (délai de traitement GA4)
- Vérifier la console du navigateur pour les erreurs
- Tester en mode debug : `gtag('config', 'G-XXXXXXXXXX', { 'debug_mode': true })`

### Trafic Trop Faible
- Vérifier que le code est bien chargé (F12 → Network)
- Désactiver les bloqueurs de publicité pour tester
- Vérifier les filtres de vue (ne pas filtrer votre propre IP en dev)

### Données Incohérentes
- Comparer avec Umami (déjà installé)
- Vérifier les doublons de code GA4
- Exclure le trafic interne (votre IP)

## Ressources

- **Documentation GA4** : [support.google.com/analytics](https://support.google.com/analytics)
- **Académie Google Analytics** : Cours gratuits
- **Communauté** : [analyticsmania.com](https://www.analyticsmania.com)

---

**Dernière mise à jour** : Janvier 2025
