/**
 * Configuration des prix d'abonnement Stripe
 */

export type SubscriptionDuration = 'monthly' | 'quarterly' | 'biannual' | 'annual';

export interface SubscriptionPrice {
  id: SubscriptionDuration;
  name: string;
  price: number; // Prix en euros
  priceId: string; // Stripe Price ID
  interval: string;
  intervalCount: number;
  savings?: number; // Économies en pourcentage
  savingsAmount?: number; // Économies en euros
  badge?: string; // Badge promotionnel
}

export const SUBSCRIPTION_PRICES: Record<SubscriptionDuration, SubscriptionPrice> = {
  monthly: {
    id: 'monthly',
    name: 'Mensuel',
    price: 36,
    priceId: 'price_1SaxPUD45uS69NTeWmWfCHAI', // Prix mensuel existant
    interval: 'mois',
    intervalCount: 1,
  },
  quarterly: {
    id: 'quarterly',
    name: 'Trimestriel',
    price: 78,
    priceId: 'price_1SaxQfD45uS69NTekZomdG4Q',
    interval: 'mois',
    intervalCount: 3,
    savings: 28, // (108-78)/108 = 28%
    savingsAmount: 30, // 108€ - 78€
    badge: 'Économisez 28%',
  },
  biannual: {
    id: 'biannual',
    name: 'Semestriel',
    price: 148,
    priceId: 'price_1SaxQgD45uS69NTeYnKL8Oza',
    interval: 'mois',
    intervalCount: 6,
    savings: 32, // (216-148)/216 = 32%
    savingsAmount: 68, // 216€ - 148€
    badge: 'Économisez 32%',
  },
  annual: {
    id: 'annual',
    name: 'Annuel',
    price: 278,
    priceId: 'price_1SaxQgD45uS69NTeaBoaMbAp',
    interval: 'an',
    intervalCount: 12,
    savings: 36, // (432-278)/432 = 36%
    savingsAmount: 154, // 432€ - 278€
    badge: 'Meilleure offre',
  },
};

/**
 * Obtenir le prix d'un abonnement par durée
 */
export function getSubscriptionPrice(duration: SubscriptionDuration): SubscriptionPrice {
  return SUBSCRIPTION_PRICES[duration];
}

/**
 * Obtenir tous les prix d'abonnement
 */
export function getAllSubscriptionPrices(): SubscriptionPrice[] {
  return Object.values(SUBSCRIPTION_PRICES);
}
