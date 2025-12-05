/**
 * Sionohmair Insight Academy - Produits et Prix Stripe
 * 
 * Définition centralisée des produits avec leurs Price IDs Stripe
 * Mode Test : Tous les Price IDs commencent par price_test_
 */

export const PRODUCTS = {
  ABONNEMENT_PREMIUM: {
    id: 'abonnement_premium',
    name: 'Abonnement Premium Mensuel',
    description: 'Accès complet à tous les outils de Content Marketing & Copywriting avec essai gratuit de 30 jours',
    price: 2900, // 29 € en centimes
    currency: 'eur',
    stripePriceId: 'price_1SaugaPmmJvmniPrGuKdUawN', // Price ID Stripe récupéré
    features: [
      'Essai gratuit de 30 jours',
      'Accès illimité à tous les outils IA',
      'Analyseur de Contenu (5 dimensions)',
      'Générateur de Copy (6 frameworks)',
      'Persona Builder complet',
      'Chat IA personnalisé',
      'Éditeur en temps réel',
      'Support prioritaire'
    ]
  },
  NFT_BRONZE: {
    id: 'nft_bronze',
    name: 'NFT Bronze - Licence Perpétuelle',
    description: 'Licence perpétuelle avec accès à vie aux outils de base + NFT de propriété transférable',
    price: 29000, // 290 € en centimes
    currency: 'eur',
    stripePriceId: 'price_1SaugaPmmJvmniPrZeJYNCSa', // Price ID Stripe récupéré
    features: [
      'Licence perpétuelle (accès à vie)',
      'NFT de propriété transférable',
      'Analyseur de Contenu',
      'Générateur de Copy (3 frameworks)',
      'Persona Builder',
      'Mises à jour gratuites',
      'Pas d\'abonnement mensuel',
      'Revente possible du NFT'
    ]
  },
  NFT_SILVER: {
    id: 'nft_silver',
    name: 'NFT Silver - Licence Perpétuelle',
    description: 'Licence perpétuelle avec accès complet + NFT de propriété + support prioritaire',
    price: 90000, // 900 € en centimes
    currency: 'eur',
    stripePriceId: 'price_1SaurDPmmJvmniPrDeFGQ6NZ', // Price ID Stripe récupéré
    features: [
      'Licence perpétuelle (accès à vie)',
      'NFT de propriété transférable',
      'Accès complet à tous les outils',
      'Générateur de Copy (6 frameworks)',
      'Chat IA illimité',
      'Support prioritaire',
      'Mises à jour gratuites',
      'Revente possible du NFT'
    ]
  },
  NFT_GOLD: {
    id: 'nft_gold',
    name: 'NFT Gold - Licence Perpétuelle',
    description: 'Licence perpétuelle premium avec accès VIP + NFT de propriété + coaching personnalisé',
    price: 290000, // 2900 € en centimes
    currency: 'eur',
    stripePriceId: 'price_1SauhaPmmJvmniPr8eHDQDTE', // Price ID Stripe récupéré
    features: [
      'Licence perpétuelle (accès à vie)',
      'NFT de propriété transférable',
      'Accès VIP à tous les outils',
      'Coaching personnalisé (2h/mois)',
      'Analyse de contenu illimitée',
      'Support VIP 24/7',
      'Mises à jour gratuites à vie',
      'Revente possible du NFT',
      'Accès anticipé aux nouvelles fonctionnalités'
    ]
  },
  // Anciens produits conservés pour compatibilité
  SPRINT_CLARTE: {
    id: 'sprint_clarte',
    name: 'Sprint de Clarté',
    description: 'Diagnostic complet en 7 jours avec Score de Clarté /20, analyse des 3 frictions, et plan d\'action sur 30 jours',
    price: 49000, // 490 € en centimes
    currency: 'eur',
    features: [
      'Analyse PFPMA complète de votre message',
      'Identification des 3 types de frictions',
      'Score de Clarté sur 20 points',
      'Rapport de 10 pages',
      'Plan d\'action sur 30 jours',
      'Garantie de résultats mesurables'
    ]
  },
  ARCHITECTURE_INSIGHT: {
    id: 'architecture_insight',
    name: 'Architecture de l\'Insight (Niveau 2)',
    description: 'Transformation complète de votre communication avec 5 Artefacts de Clarté, Carte PFPMA, et Roadmap d\'implémentation',
    price: 1000000, // 10 000 € en centimes
    currency: 'eur',
    features: [
      'Message AVANT/APRÈS optimisé',
      '5 Artefacts de Clarté personnalisés',
      'Carte PFPMA de votre système',
      'Roadmap d\'implémentation',
      'Bibliothèque de templates',
      'Bloc Recommandation IA',
      'Support prioritaire pendant 3 mois'
    ]
  },
  PARTENARIAT_STRATEGIQUE: {
    id: 'partenariat_strategique',
    name: 'Partenariat Stratégique (Niveau 3)',
    description: 'Accompagnement stratégique sur 12 mois avec Roadmap complète, Playbook de Clarté, NFT Architecte, et Dashboards récurrents',
    price: 5000000, // 50 000 € en centimes
    currency: 'eur',
    features: [
      'Roadmap 12 mois (T1 → T4)',
      'Playbook de Clarté personnalisé',
      'NFT "Architecte de la Clarté"',
      'Dashboards de performance récurrents',
      'Formation équipe (20 personnes)',
      'Processus de validation interne',
      'KPIs de Clarté personnalisés',
      'Support illimité pendant 12 mois'
    ]
  },
  FORMATION_SPRINT_CLARTE: {
    id: 'formation_sprint_clarte',
    name: 'Formation Sprint de Clarté',
    description: 'Formation interactive en 9 modules (11h15) pour maîtriser le Code PFPMA et transformer vos messages en machines à conversion',
    price: 79000, // 790 € en centimes
    currency: 'eur',
    features: [
      '9 modules interactifs (11h15 de contenu)',
      '27 exercices pratiques avec validation automatique',
      'Déblocage progressif (1 module par jour minimum)',
      'Badges de gamification (8 badges disponibles)',
      'Accès pendant 90 jours (3 mois)',
      'Certificat "Architecte de la Clarté" à la fin',
      'Manuel PFPMA (PDF téléchargeable)',
      'Templates de rédaction (Word/Excel)'
    ]
  }
} as const;

export type ProductId = keyof typeof PRODUCTS;

/**
 * Récupère les détails d'un produit par son ID
 */
export function getProduct(productId: ProductId) {
  return PRODUCTS[productId];
}

/**
 * Récupère tous les produits
 */
export function getAllProducts() {
  return Object.values(PRODUCTS);
}

/**
 * Récupère uniquement les produits avec Price IDs Stripe (nouveaux produits)
 */
export function getStripeProducts() {
  return Object.values(PRODUCTS).filter(product => 'stripePriceId' in product);
}

/**
 * Formate le prix en euros pour l'affichage
 */
export function formatPrice(priceInCents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(priceInCents / 100);
}
