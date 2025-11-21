/**
 * Utilitaires pour Google Analytics 4
 * 
 * Ce fichier contient des fonctions helper pour tracker les événements personnalisés
 * dans Google Analytics 4.
 */

// Déclaration TypeScript pour gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Envoyer un événement personnalisé à GA4
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

/**
 * Tracker l'inscription à la newsletter
 */
export function trackNewsletterSignup(email: string, interests?: string) {
  trackEvent('newsletter_signup', {
    email_domain: email.split('@')[1], // Ne pas envoyer l'email complet pour la confidentialité
    interests: interests || 'none',
  });
}

/**
 * Tracker l'utilisation du calculateur
 */
export function trackCalculatorUsage(result: number) {
  trackEvent('calculator_used', {
    result_value: result,
    event_category: 'engagement',
    event_label: 'ROI Calculator',
  });
}

/**
 * Tracker le téléchargement d'une ressource
 */
export function trackResourceDownload(resourceName: string) {
  trackEvent('resource_download', {
    resource_name: resourceName,
    event_category: 'engagement',
    event_label: 'Download',
  });
}

/**
 * Tracker la soumission d'un formulaire
 */
export function trackFormSubmission(formName: string) {
  trackEvent('form_submission', {
    form_name: formName,
    event_category: 'engagement',
    event_label: 'Form',
  });
}

/**
 * Tracker un achat (Sprint de Clarté)
 */
export function trackPurchase(
  transactionId: string,
  value: number,
  currency: string = 'EUR'
) {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: [
      {
        item_id: 'sprint_clarte',
        item_name: 'Sprint de Clarté',
        price: value,
        quantity: 1,
      },
    ],
  });
}

/**
 * Tracker le début d'un checkout
 */
export function trackBeginCheckout(value: number) {
  trackEvent('begin_checkout', {
    value: value,
    currency: 'EUR',
    items: [
      {
        item_id: 'sprint_clarte',
        item_name: 'Sprint de Clarté',
        price: value,
        quantity: 1,
      },
    ],
  });
}

/**
 * Tracker une vue de page personnalisée
 */
export function trackPageView(pagePath: string, pageTitle: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID_PLACEHOLDER', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
}

/**
 * Tracker un clic sur un CTA
 */
export function trackCTAClick(ctaName: string, ctaLocation: string) {
  trackEvent('cta_click', {
    cta_name: ctaName,
    cta_location: ctaLocation,
    event_category: 'engagement',
  });
}

/**
 * Tracker le temps passé sur une page
 */
export function trackTimeOnPage(pageName: string, timeInSeconds: number) {
  trackEvent('time_on_page', {
    page_name: pageName,
    time_seconds: timeInSeconds,
    event_category: 'engagement',
  });
}

/**
 * Tracker un scroll en profondeur
 */
export function trackScrollDepth(depth: number) {
  trackEvent('scroll_depth', {
    depth_percentage: depth,
    event_category: 'engagement',
  });
}
