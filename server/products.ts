/**
 * Sionohmair Insight Academy - Produits et Prix Stripe
 * 
 * Définition centralisée des 3 niveaux de services :
 * - Niveau 1 : Sprint de Clarté (490 €)
 * - Niveau 2 : Architecture de l'Insight (10 000 €)
 * - Niveau 3 : Partenariat Stratégique (50 000 €)
 */

export const PRODUCTS = {
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
